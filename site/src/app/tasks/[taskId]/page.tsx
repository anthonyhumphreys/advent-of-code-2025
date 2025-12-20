import Link from "next/link";
import { loadDataset } from "@/lib/load-dataset";

function formatMs(ms: number) {
  if (!Number.isFinite(ms)) return "—";
  if (ms < 1) return `${ms.toFixed(2)}ms`;
  if (ms < 1000) return `${ms.toFixed(1)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function fmtInt(n: number | undefined) {
  if (n === undefined || !Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US").format(n);
}

type SortKey = "result" | "time" | "loc" | "deps" | "source";
type SortDir = "asc" | "desc";
type ResultKey = "pass" | "wrong" | "error";
type ResultFilter = "all" | ResultKey;

function runResult(r: { success: boolean; matchesBaseline?: boolean }): ResultKey {
  if (!r.success) return "error";
  if (r.matchesBaseline === false) return "wrong";
  return "pass";
}

function pillToneForResult(result: ResultKey): "good" | "bad" | "neutral" {
  if (result === "pass") return "good";
  if (result === "wrong") return "bad";
  return "bad";
}

function buildHref(taskId: string, next: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(next)) {
    if (!v || v === "all") continue;
    params.set(k, v);
  }
  const qs = params.toString();
  return qs ? `/tasks/${taskId}?${qs}` : `/tasks/${taskId}`;
}

export default async function TaskPage(props: {
  params: Promise<{ taskId: string }>;
  searchParams: Promise<{ sort?: SortKey; dir?: SortDir; result?: ResultFilter; source?: string; lang?: string }>;
}) {
  const { taskId } = await props.params;
  const search = await props.searchParams;
  const sort: SortKey = search.sort ?? "time";
  const dir: SortDir = search.dir ?? "asc";
  const resultFilter: ResultFilter = search.result ?? "all";
  const sourceFilter = search.source ?? "all";
  const langFilter = search.lang ?? "all";

  const dataset = await loadDataset();
  if (!dataset) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-14">
        <Link href="/" className="text-sm text-white/70 hover:text-white">
          ← Home
        </Link>
        <h1 className="mt-6 text-3xl font-semibold text-white">Task {taskId}</h1>
        <p className="mt-2 text-white/70">
          Dataset missing. Expected <code className="rounded bg-white/10 px-1.5 py-0.5">public/data/latest.json</code>.
        </p>
      </div>
    );
  }

  const task = dataset.tasks.find((t) => t.taskId === taskId);
  const runs = dataset.runs.filter((r) => r.taskId === taskId);
  const solutionsById = new Map(dataset.solutions.map((s) => [s.id, s] as const));

  const baselineId = runs.find((r) => r.baselineSolutionId)?.baselineSolutionId;
  const baseline =
    (baselineId ? runs.find((r) => r.solutionId === baselineId) : undefined) ??
    runs.find((r) => r.source === "human" && r.success) ??
    runs.find((r) => r.success);

  const allSources = Array.from(new Set(runs.map((r) => r.source))).sort();
  const modelSources = allSources.filter((s) => s !== "human");
  const allLangs = Array.from(new Set(runs.map((r) => r.language))).sort();

  const filtered = runs.filter((r) => {
    if (resultFilter !== "all" && runResult(r) !== resultFilter) return false;

    if (sourceFilter !== "all") {
      if (sourceFilter === "human") {
        if (r.source !== "human") return false;
      } else if (sourceFilter === "ai") {
        if (r.source === "human") return false;
      } else if (r.source !== sourceFilter) {
        return false;
      }
    }

    if (langFilter !== "all" && r.language !== langFilter) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aLoc = a.codeStats?.totalLoc ?? Number.POSITIVE_INFINITY;
    const bLoc = b.codeStats?.totalLoc ?? Number.POSITIVE_INFINITY;
    const aDeps = a.codeStats?.dependencyCount ?? Number.POSITIVE_INFINITY;
    const bDeps = b.codeStats?.dependencyCount ?? Number.POSITIVE_INFINITY;

    let cmp = 0;
    if (sort === "time") cmp = (a.success ? a.executionTimeMs : Number.POSITIVE_INFINITY) - (b.success ? b.executionTimeMs : Number.POSITIVE_INFINITY);
    if (sort === "loc") cmp = aLoc - bLoc;
    if (sort === "deps") cmp = aDeps - bDeps;
    if (sort === "source") cmp = a.source.localeCompare(b.source) || a.language.localeCompare(b.language);
    if (sort === "result") {
      const order = (r: typeof a) => (runResult(r) === "pass" ? 0 : runResult(r) === "wrong" ? 1 : 2);
      cmp = order(a) - order(b);
    }

    return dir === "asc" ? cmp : -cmp;
  });

  const passCount = runs.filter((r) => runResult(r) === "pass").length;
  const wrongCount = runs.filter((r) => runResult(r) === "wrong").length;
  const errorCount = runs.filter((r) => runResult(r) === "error").length;

  const baselineTime = baseline?.success ? baseline.executionTimeMs : null;
  const isBaselineRow = (solutionId: string) => (baseline ? solutionId === baseline.solutionId : false);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/" className="text-sm text-white/70 hover:text-white">
            ← Home
          </Link>
          <h1 className="mt-4 font-mono text-4xl font-semibold text-white">{taskId}</h1>
          <p className="mt-2 text-sm text-white/70">
            {passCount} pass · {wrongCount} wrong · {errorCount} error · showing{" "}
            <span className="font-mono text-white/80">{filtered.length}</span>/<span className="font-mono text-white/80">{runs.length}</span>
          </p>
          {task ? (
            <p className="mt-2 text-xs text-white/50">
              input: <span className="font-mono">{task.inputPath}</span> · {fmtInt(task.inputBytes)} bytes ·{" "}
              <span className="font-mono">{task.inputSha256.slice(0, 10)}…</span>
              {task.promptPath ? (
                <>
                  {" "}
                  · prompt: <span className="font-mono">{task.promptPath}</span>
                  {task.promptBytes ? <> · {fmtInt(task.promptBytes)} bytes</> : null}
                </>
              ) : null}
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs text-white/60">Baseline</div>
          <div className="mt-2 text-sm text-white/80">
            {baseline ? (
              <>
                <span className="font-mono">{baseline.source}</span> · <span className="font-mono">{baseline.language}</span> ·{" "}
                <span className="font-mono">{baseline.success ? formatMs(baseline.executionTimeMs) : "—"}</span>
              </>
            ) : (
              "—"
            )}
          </div>
          <div className="mt-2 text-xs text-white/50">“pass” means stdout matches the baseline for this task.</div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs text-white/60">Sort</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["time", "loc", "deps", "source", "result"] as const).map((k) => {
                const active = sort === k;
                const nextDir: SortDir = active ? (dir === "asc" ? "desc" : "asc") : "asc";
                return (
                  <Link
                    key={k}
                    href={buildHref(taskId, { sort: k, dir: nextDir, result: resultFilter, source: sourceFilter, lang: langFilter })}
                    className={
                      active
                        ? "rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white"
                        : "rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70 hover:bg-white/7 hover:text-white"
                    }
                    aria-current={active ? "page" : undefined}
                  >
                    {k}
                    {active ? <span className="ml-1 text-white/70">{dir === "asc" ? "↑" : "↓"}</span> : null}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={buildHref(taskId, { sort, dir, result: undefined, source: undefined, lang: undefined })}
              className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70 hover:bg-white/7 hover:text-white"
            >
              reset
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <div>
            <div className="text-xs text-white/60">Result</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["all", "pass", "wrong", "error"] as const).map((k) => {
                const active = resultFilter === k;
                return (
                  <Link
                    key={k}
                    href={buildHref(taskId, { sort, dir, result: k === "all" ? undefined : k, source: sourceFilter, lang: langFilter })}
                    className={
                      active
                        ? "rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white"
                        : "rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70 hover:bg-white/7 hover:text-white"
                    }
                    aria-current={active ? "page" : undefined}
                  >
                    {k}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs text-white/60">Source</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["all", "human", "ai", ...modelSources] as const).map((k) => {
                const active = sourceFilter === k;
                return (
                  <Link
                    key={k}
                    href={buildHref(taskId, { sort, dir, result: resultFilter, source: k === "all" ? undefined : k, lang: langFilter })}
                    className={
                      active
                        ? "rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white"
                        : "rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70 hover:bg-white/7 hover:text-white"
                    }
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="font-mono">{k}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs text-white/60">Language</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["all", ...allLangs] as const).map((k) => {
                const active = langFilter === k;
                return (
                  <Link
                    key={k}
                    href={buildHref(taskId, { sort, dir, result: resultFilter, source: sourceFilter, lang: k === "all" ? undefined : k })}
                    className={
                      active
                        ? "rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white"
                        : "rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70 hover:bg-white/7 hover:text-white"
                    }
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="font-mono">{k}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="bg-black/25 text-xs text-white/60">
            <tr>
              <Th>source</Th>
              <Th>lang</Th>
              <Th className="text-center">result</Th>
              <Th className="text-right">time</Th>
              <Th className="text-right">Δ baseline</Th>
              <Th className="text-right">loc</Th>
              <Th className="text-right">files</Th>
              <Th className="text-right">deps</Th>
              <Th>notes</Th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.solutionId} className="border-t border-white/10">
                <Td>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white/90">{r.source}</span>
                    {r.source === "human" ? <Pill tone="good">human</Pill> : <Pill tone="neutral">ai</Pill>}
                    {isBaselineRow(r.solutionId) ? <Pill tone="neutral">baseline</Pill> : null}
                  </div>
                </Td>
                <Td>
                  <span className="rounded-md bg-black/25 px-2 py-1 font-mono text-xs text-white/80">
                    {r.language}
                  </span>
                </Td>
                <Td className="text-center">
                  {(() => {
                    const res = runResult(r);
                    return <Pill tone={pillToneForResult(res)}>{res}</Pill>;
                  })()}
                </Td>
                <Td className="text-right font-mono text-white/90">{r.success ? formatMs(r.executionTimeMs) : "—"}</Td>
                <Td className="text-right font-mono text-white/80">
                  {baselineTime && r.success ? (
                    <span className={r.executionTimeMs <= baselineTime ? "text-emerald-200" : "text-white/80"}>
                      {(r.executionTimeMs / baselineTime).toFixed(2)}×
                    </span>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td className="text-right font-mono text-white/80">{fmtInt(r.codeStats?.totalLoc)}</Td>
                <Td className="text-right font-mono text-white/80">{fmtInt(r.codeStats?.fileCount)}</Td>
                <Td className="text-right font-mono text-white/80">{fmtInt(r.codeStats?.dependencyCount)}</Td>
                <Td className="max-w-[420px]">
                  {!r.success ? (
                    <div className="text-xs text-white/55">
                      <div className="font-mono text-white/70">exit {r.exitCode}{r.timedOut ? " (timeout)" : ""}</div>
                      {r.error ? <div className="mt-1 max-h-10 overflow-hidden">{r.error}</div> : null}
                    </div>
                  ) : (
                    <div className="text-xs text-white/55">
                      <div className="font-mono text-white/60">{solutionsById.get(r.solutionId)?.rootDir ?? r.rootDir}</div>
                    </div>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {baseline ? (
        <section className="mt-10">
          <h2 className="text-sm font-semibold text-white">Baseline stdout</h2>
          <pre className="mt-3 overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-xs leading-5 text-white/80">
{baseline.stdout || "—"}
          </pre>
        </section>
      ) : null}
    </div>
  );
}

function Th(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...props} className={`px-4 py-3 font-medium ${props.className ?? ""}`} />;
}

function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={`px-4 py-3 align-top ${props.className ?? ""}`} />;
}

function Pill(props: { tone: "good" | "bad" | "neutral"; children: React.ReactNode }) {
  const cls =
    props.tone === "good"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
      : props.tone === "bad"
        ? "border-rose-400/20 bg-rose-400/10 text-rose-200"
        : "border-white/15 bg-white/5 text-white/70";
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${cls}`}>{props.children}</span>;
}

