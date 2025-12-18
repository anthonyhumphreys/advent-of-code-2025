import Link from "next/link";
import { loadDataset } from "@/lib/load-dataset";

function formatMs(ms: number) {
  if (!Number.isFinite(ms)) return "—";
  if (ms < 1) return `${ms.toFixed(2)}ms`;
  if (ms < 1000) return `${ms.toFixed(1)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export default async function Home() {
  const dataset = await loadDataset();

  if (!dataset) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              Benchviz
            </div>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-white">
              Human vs AI — benchmark dataset missing
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-white/70">
              Expected <code className="rounded bg-white/10 px-1.5 py-0.5">site/public/data/latest.json</code>.
              Run <code className="rounded bg-white/10 px-1.5 py-0.5">bun scripts/run-solutions.ts</code> (or let
              GitHub Actions generate it) and refresh.
            </p>
          </header>
        </div>
      </div>
    );
  }

  const runs = dataset.runs;
  const tasks = dataset.tasks;
  const models = uniq(runs.filter((r) => r.source !== "human").map((r) => r.source)).sort();
  const successRuns = runs.filter((r) => r.success);
  const successRate = runs.length ? (successRuns.length / runs.length) * 100 : 0;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            Benchviz
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span className="font-mono text-white/60">{dataset.meta.gitSha?.slice(0, 7) ?? "no-sha"}</span>
            <span className="text-white/40">·</span>
            <span className="text-white/60">{new Date(dataset.meta.generatedAt).toLocaleString()}</span>
          </div>
          <h1 className="mt-5 text-balance text-5xl font-semibold tracking-tight text-white">
            Human vs AI, but make it measurable.
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-white/70">
            A tiny, opinionated dataset + visualizer for comparing solutions across models and languages. Built for
            developer vibes: fast, dense, and honest.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Tasks" value={String(tasks.length)} hint="inputs/*.txt" />
          <Stat label="Solutions" value={String(dataset.solutions.length)} hint="discovered" />
          <Stat label="Runs" value={String(runs.length)} hint="executed" />
          <Stat label="Success rate" value={`${successRate.toFixed(1)}%`} hint={`${successRuns.length} ok`} />
        </section>

        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Tasks</h2>
              <p className="text-sm text-white/60">Click a task to explore per-solution metrics and outputs.</p>
            </div>
            <div className="text-sm text-white/60">
              Models: <span className="font-mono text-white/80">{models.join(", ") || "—"}</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((t) => {
              const taskRuns = runs.filter((r) => r.taskId === t.taskId);
              const ok = taskRuns.filter((r) => r.success);
              const best = ok.reduce<number | null>((min, r) => (min === null ? r.executionTimeMs : Math.min(min, r.executionTimeMs)), null);
              const bestLabel = best === null ? "—" : formatMs(best);
              return (
                <Link
                  key={t.taskId}
                  href={`/tasks/${t.taskId}`}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/7"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-white/60">Task</div>
                      <div className="mt-1 font-mono text-2xl font-semibold text-white">{t.taskId}</div>
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70">
                      best <span className="font-mono text-white/90">{bestLabel}</span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-white/60">
                    <div className="rounded-lg bg-black/20 px-2 py-2">
                      <div className="text-white/50">runs</div>
                      <div className="mt-1 font-mono text-white/80">{taskRuns.length}</div>
                    </div>
                    <div className="rounded-lg bg-black/20 px-2 py-2">
                      <div className="text-white/50">ok</div>
                      <div className="mt-1 font-mono text-white/80">{ok.length}</div>
                    </div>
                    <div className="rounded-lg bg-black/20 px-2 py-2">
                      <div className="text-white/50">fail</div>
                      <div className="mt-1 font-mono text-white/80">{taskRuns.length - ok.length}</div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-white/70">
                    <span className="underline decoration-white/20 underline-offset-4 group-hover:decoration-white/40">
                      Open task →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat(props: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-xs text-white/60">{props.label}</div>
      <div className="mt-2 font-mono text-3xl font-semibold tracking-tight text-white">{props.value}</div>
      {props.hint ? <div className="mt-1 text-xs text-white/45">{props.hint}</div> : null}
    </div>
  );
}
