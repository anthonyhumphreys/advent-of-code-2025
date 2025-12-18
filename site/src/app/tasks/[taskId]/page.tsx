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

type SortKey = "time" | "loc" | "deps" | "source";

export default async function TaskPage(props: {
  params: Promise<{ taskId: string }>;
  searchParams: Promise<{ sort?: SortKey; dir?: "asc" | "desc" }>;
}) {
  const { taskId } = await props.params;
  const search = await props.searchParams;
  const sort: SortKey = search.sort ?? "time";
  const dir = search.dir ?? "asc";

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
  const baselineId = runs.find((r) => r.baselineSolutionId)?.baselineSolutionId;
  const baseline =
    (baselineId ? runs.find((r) => r.solutionId === baselineId) : undefined) ??
    runs.find((r) => r.source === "human" && r.success) ??
    runs.find((r) => r.success);

  const sorted = [...runs].sort((a, b) => {
    const aLoc = a.codeStats?.totalLoc ?? Number.POSITIVE_INFINITY;
    const bLoc = b.codeStats?.totalLoc ?? Number.POSITIVE_INFINITY;
    const aDeps = a.codeStats?.dependencyCount ?? Number.POSITIVE_INFINITY;
    const bDeps = b.codeStats?.dependencyCount ?? Number.POSITIVE_INFINITY;

    let cmp = 0;
    if (sort === "time") cmp = (a.success ? a.executionTimeMs : Number.POSITIVE_INFINITY) - (b.success ? b.executionTimeMs : Number.POSITIVE_INFINITY);
    if (sort === "loc") cmp = aLoc - bLoc;
    if (sort === "deps") cmp = aDeps - bDeps;
    if (sort === "source") cmp = a.source.localeCompare(b.source) || a.language.localeCompare(b.language);

    return dir === "asc" ? cmp : -cmp;
  });

  const ok = runs.filter((r) => r.success).length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/" className="text-sm text-white/70 hover:text-white">
            ← Home
          </Link>
          <h1 className="mt-4 font-mono text-4xl font-semibold text-white">{taskId}</h1>
          <p className="mt-2 text-sm text-white/70">
            {ok}/{runs.length} successful · sort{" "}
            <SortLink taskId={taskId} active={sort === "time"} sort="time">
              time
            </SortLink>{" "}
            <SortLink taskId={taskId} active={sort === "loc"} sort="loc">
              loc
            </SortLink>{" "}
            <SortLink taskId={taskId} active={sort === "deps"} sort="deps">
              deps
            </SortLink>{" "}
            <SortLink taskId={taskId} active={sort === "source"} sort="source">
              source
            </SortLink>
          </p>
          {task ? (
            <p className="mt-2 text-xs text-white/50">
              input: <span className="font-mono">{task.inputPath}</span> · {fmtInt(task.inputBytes)} bytes ·{" "}
              <span className="font-mono">{task.inputSha256.slice(0, 10)}…</span>
              {task.promptPath ? (
                <>
                  {" "}
                  · prompt: <span className="font-mono">{task.promptPath}</span>
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
                <span className="font-mono">{baseline.source}</span> ·{" "}
                <span className="font-mono">{baseline.language}</span> ·{" "}
                <span className="font-mono">{formatMs(baseline.executionTimeMs)}</span>
              </>
            ) : (
              "—"
            )}
          </div>
          <div className="mt-2 text-xs text-white/50">matchesBaseline is computed per task.</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="bg-black/25 text-xs text-white/60">
            <tr>
              <Th>source</Th>
              <Th>lang</Th>
              <Th className="text-right">time</Th>
              <Th className="text-center">ok</Th>
              <Th className="text-center">=</Th>
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
                    {r.source === "human" ? <Pill tone="good">you</Pill> : <Pill tone="neutral">ai</Pill>}
                  </div>
                </Td>
                <Td>
                  <span className="rounded-md bg-black/25 px-2 py-1 font-mono text-xs text-white/80">
                    {r.language}
                  </span>
                </Td>
                <Td className="text-right font-mono text-white/90">
                  {r.success ? formatMs(r.executionTimeMs) : "—"}
                </Td>
                <Td className="text-center">{r.success ? <Pill tone="good">ok</Pill> : <Pill tone="bad">fail</Pill>}</Td>
                <Td className="text-center">
                  {r.success ? (r.matchesBaseline ? <Pill tone="good">=</Pill> : <Pill tone="bad">≠</Pill>) : <span className="text-white/30">—</span>}
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
                      <div className="font-mono text-white/60">{r.rootDir}</div>
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

function SortLink(props: {
  taskId: string;
  sort: SortKey;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/tasks/${props.taskId}?sort=${props.sort}&dir=asc`}
      className={props.active ? "font-mono text-white" : "font-mono text-white/60 hover:text-white"}
    >
      {props.children}
    </Link>
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

