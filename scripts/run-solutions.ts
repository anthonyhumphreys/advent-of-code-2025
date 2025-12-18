#!/usr/bin/env bun
/**
 * Benchmark runner (Bun/TS) for Advent of Code solutions in this repo.
 *
 * - Discovers solutions under human-solutions/ and ai-solutions/
 * - Runs each solution with a consistent input file argument (some solutions ignore it)
 * - Captures stdout/stderr/exit code/timeout/duration
 * - Computes cheap code stats (LOC/files/deps)
 * - Writes a dataset JSON for the Next visualizer
 */
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, promises as fsp } from "node:fs";
import * as path from "node:path";
import process from "node:process";
import os from "node:os";
import { fileURLToPath } from "node:url";

type Language = "python" | "js" | "rust";

type SolutionSource =
  | { kind: "human" }
  | { kind: "ai"; model: string };

type Solution = {
  id: string; // stable-ish ID for linking in the UI
  taskId: string; // "01"
  source: SolutionSource;
  language: Language;
  rootDir: string; // directory containing the solution
  entryHint?: string; // e.g. main.py, index.js, Cargo.toml
};

type CodeStats = {
  fileCount: number;
  totalLoc: number;
  dependencyCount?: number;
};

type RunResult = {
  solutionId: string;
  taskId: string;
  source: "human" | string; // model name for AI
  language: Language;
  rootDir: string;
  success: boolean;
  exitCode: number;
  timedOut: boolean;
  executionTimeMs: number;
  stdout: string;
  stderr: string;
  error?: string;
  matchesBaseline?: boolean;
  baselineSolutionId?: string;
  codeStats?: CodeStats;
};

type TaskMeta = {
  taskId: string;
  inputPath: string;
  inputBytes: number;
  inputSha256: string;
  promptPath?: string;
  promptBytes?: number;
  promptSha256?: string;
};

type Dataset = {
  meta: {
    generatedAt: string; // ISO
    gitSha?: string;
    runner: { name: "bun-runner"; version: string };
    platform: { os: string; arch: string; cpuCount: number };
  };
  tasks: TaskMeta[];
  solutions: Array<{
    id: string;
    taskId: string;
    source: "human" | string;
    language: Language;
    rootDir: string;
    entryHint?: string;
    codeStats?: CodeStats;
  }>;
  runs: RunResult[];
};

function nowIso() {
  return new Date().toISOString();
}

function normalizeStdout(text: string) {
  // Keep trailing newline differences from breaking equality, but preserve content.
  return text.replace(/\r\n/g, "\n").trimEnd();
}

function truncate(text: string, max = 20_000) {
  if (text.length <= max) return text;
  return text.slice(0, max) + `\n… (truncated, ${text.length - max} chars omitted)`;
}

async function sha256File(filePath: string) {
  const buf = await fsp.readFile(filePath);
  const hash = createHash("sha256").update(buf).digest("hex");
  return { bytes: buf.byteLength, sha256: hash };
}

async function tryGitSha(repoRoot: string) {
  try {
    const head = await fsp.readFile(path.join(repoRoot, ".git", "HEAD"), "utf8");
    const refMatch = head.trim().match(/^ref:\s+(.+)$/);
    if (!refMatch) return head.trim();
    const refPath = path.join(repoRoot, ".git", refMatch[1]);
    return (await fsp.readFile(refPath, "utf8")).trim();
  } catch {
    return undefined;
  }
}

type ExecResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  elapsedMs: number;
};

async function execCommand(opts: {
  cmd: string;
  args: string[];
  cwd: string;
  timeoutMs: number;
  env?: Record<string, string | undefined>;
}): Promise<ExecResult> {
  const started = performance.now();
  return await new Promise((resolve) => {
    const child = spawn(opts.cmd, opts.args, {
      cwd: opts.cwd,
      env: { ...process.env, ...opts.env },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill("SIGKILL");
      } catch {
        // ignore
      }
    }, opts.timeoutMs);

    child.stdout?.on("data", (d) => (stdout += d.toString()));
    child.stderr?.on("data", (d) => (stderr += d.toString()));

    child.on("close", (code) => {
      clearTimeout(timer);
      const elapsedMs = performance.now() - started;
      resolve({
        exitCode: typeof code === "number" ? code : 1,
        stdout,
        stderr,
        timedOut,
        elapsedMs,
      });
    });
  });
}

async function listDirs(p: string) {
  const entries = await fsp.readdir(p, { withFileTypes: true }).catch(() => []);
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

async function listFiles(p: string) {
  const entries = await fsp.readdir(p, { withFileTypes: true }).catch(() => []);
  return entries.filter((e) => e.isFile()).map((e) => e.name);
}

function stableSolutionId(sol: Omit<Solution, "id">) {
  const src = sol.source.kind === "human" ? "human" : `ai:${sol.source.model}`;
  const raw = `${sol.taskId}|${src}|${sol.language}|${sol.rootDir}`;
  return createHash("sha256").update(raw).digest("hex").slice(0, 16);
}

async function discoverSolutions(repoRoot: string, taskIds: string[]): Promise<Solution[]> {
  const sols: Solution[] = [];

  for (const taskId of taskIds) {
    const humanTaskDir = path.join(repoRoot, "human-solutions", taskId);
    if (existsSync(humanTaskDir)) {
      for (const langDir of await listDirs(humanTaskDir)) {
        const language = normalizeLanguageDir(langDir);
        if (!language) continue;
        const rootDir = path.join(humanTaskDir, langDir);
        const base: Omit<Solution, "id"> = {
          taskId,
          source: { kind: "human" },
          language,
          rootDir,
        };
        sols.push({ ...base, id: stableSolutionId(base) });
      }
    }

    const aiTaskDir = path.join(repoRoot, "ai-solutions", taskId);
    if (existsSync(aiTaskDir)) {
      for (const modelDirName of await listDirs(aiTaskDir)) {
        const modelDir = path.join(aiTaskDir, modelDirName);
        for (const langDir of await listDirs(modelDir)) {
          const language = normalizeLanguageDir(langDir);
          if (!language) continue;
          const rootDir = path.join(modelDir, langDir);
          const base: Omit<Solution, "id"> = {
            taskId,
            source: { kind: "ai", model: modelDirName },
            language,
            rootDir,
          };
          sols.push({ ...base, id: stableSolutionId(base) });
        }
      }
    }
  }

  return sols;
}

function normalizeLanguageDir(dirName: string): Language | null {
  if (dirName === "python") return "python";
  if (dirName === "js") return "js";
  if (dirName === "ts") return "js"; // treat TS solutions as JS runtime category
  if (dirName === "rust") return "rust";
  return null;
}

async function computeCodeStats(solutionRoot: string, language: Language): Promise<CodeStats> {
  const ignoreDirs = new Set(["node_modules", "target", ".git", "__pycache__"]);
  const exts =
    language === "python"
      ? new Set([".py"])
      : language === "js"
        ? new Set([".js", ".mjs", ".cjs", ".ts", ".tsx"])
        : new Set([".rs"]);

  let fileCount = 0;
  let totalLoc = 0;

  async function walk(dir: string) {
    const entries = await fsp.readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const e of entries) {
      if (e.isDirectory()) {
        if (ignoreDirs.has(e.name)) continue;
        await walk(path.join(dir, e.name));
        continue;
      }
      if (!e.isFile()) continue;
      const full = path.join(dir, e.name);
      if (!exts.has(path.extname(full))) continue;
      try {
        const content = await fsp.readFile(full, "utf8");
        totalLoc += content.split(/\r?\n/).length;
        fileCount += 1;
      } catch {
        // ignore
      }
    }
  }

  await walk(solutionRoot);

  let dependencyCount: number | undefined;
  if (language === "js") {
    const pkgPath = path.join(solutionRoot, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(await fsp.readFile(pkgPath, "utf8")) as any;
        const deps = Object.keys(pkg.dependencies ?? {});
        const devDeps = Object.keys(pkg.devDependencies ?? {});
        dependencyCount = deps.length + devDeps.length;
      } catch {
        // ignore
      }
    }
  }

  return { fileCount, totalLoc, dependencyCount };
}

async function detectEntryHint(solutionRoot: string, language: Language): Promise<string | undefined> {
  if (language === "python") {
    for (const f of ["main.py", "solution.py"]) {
      if (existsSync(path.join(solutionRoot, f))) return f;
    }
    const files = (await listFiles(solutionRoot)).filter((f) => f.endsWith(".py"));
    return files[0];
  }

  if (language === "js") {
    for (const f of ["index.js", "main.js", "solution.js", "index.ts", "main.ts", "solution.ts"]) {
      if (existsSync(path.join(solutionRoot, f))) return f;
    }
    const files = (await listFiles(solutionRoot)).filter((f) => /\.(cjs|mjs|js|ts|tsx)$/.test(f));
    return files[0];
  }

  // rust
  if (existsSync(path.join(solutionRoot, "Cargo.toml"))) return "Cargo.toml";
  const rs = (await listFiles(solutionRoot)).filter((f) => f.endsWith(".rs"));
  return rs[0];
}

async function ensureJsDeps(solutionRoot: string, timeoutMs: number) {
  const pkgJson = path.join(solutionRoot, "package.json");
  if (!existsSync(pkgJson)) return;
  if (existsSync(path.join(solutionRoot, "node_modules"))) return;
  const hasLock = existsSync(path.join(solutionRoot, "package-lock.json"));
  const cmd = "npm";
  const args = hasLock ? ["ci"] : ["install"];
  await execCommand({ cmd, args, cwd: solutionRoot, timeoutMs });
}

function looksLikeCommonJs(entrySource: string) {
  // Heuristic only: many AI solutions use `require(...)` but live under a repo-level `"type": "module"`,
  // so Node treats `.js` as ESM and crashes with "require is not defined".
  //
  // We only want to flip to CJS if it really looks like CJS.
  return (
    /\brequire\s*\(/.test(entrySource) ||
    /\bmodule\.exports\b/.test(entrySource) ||
    /\bexports\.[A-Za-z_$][\w$]*\b/.test(entrySource)
  );
}

async function runOneSolution(opts: {
  repoRoot: string;
  sol: Solution;
  inputPath: string;
  timeoutMs: number;
}): Promise<RunResult> {
  const source = opts.sol.source.kind === "human" ? "human" : opts.sol.source.model;
  const base: RunResult = {
    solutionId: opts.sol.id,
    taskId: opts.sol.taskId,
    source,
    language: opts.sol.language,
    rootDir: opts.sol.rootDir,
    success: false,
    exitCode: 1,
    timedOut: false,
    executionTimeMs: 0,
    stdout: "",
    stderr: "",
  };

  const codeStats = await computeCodeStats(opts.sol.rootDir, opts.sol.language);
  base.codeStats = codeStats;
  base.stdout = "";
  base.stderr = "";

  const entryHint = await detectEntryHint(opts.sol.rootDir, opts.sol.language);
  base.error = undefined;

  try {
    let exec: ExecResult | null = null;

    if (opts.sol.language === "python") {
      const entry = entryHint ? path.join(opts.sol.rootDir, entryHint) : path.join(opts.sol.rootDir, "main.py");
      exec = await execCommand({
        cmd: "python3",
        args: [entry, path.resolve(opts.inputPath)],
        cwd: opts.sol.rootDir,
        timeoutMs: opts.timeoutMs,
      });
    } else if (opts.sol.language === "js") {
      await ensureJsDeps(opts.sol.rootDir, Math.min(opts.timeoutMs, 120_000));
      const entry = entryHint ? path.join(opts.sol.rootDir, entryHint) : path.join(opts.sol.rootDir, "index.js");
      const ext = path.extname(entry).toLowerCase();

      // If this solution is TS/TSX, run it with Bun (Node won't execute it without a loader).
      if (ext === ".ts" || ext === ".tsx") {
        exec = await execCommand({
          cmd: "bun",
          args: [entry, path.resolve(opts.inputPath)],
          cwd: opts.sol.rootDir,
          timeoutMs: opts.timeoutMs,
        });
      } else if (ext === ".js") {
        // Repo is ESM (`"type":"module"`), so `.js` is ESM by default. If the entry looks like CJS,
        // run a temporary `.cjs` copy to avoid modifying the actual solution.
        let entrySource = "";
        try {
          entrySource = await fsp.readFile(entry, "utf8");
        } catch {
          entrySource = "";
        }

        if (entrySource && looksLikeCommonJs(entrySource)) {
          const tmpCjs = path.join(opts.sol.rootDir, `.tmp-bench-${opts.sol.id}.cjs`);
          try {
            await fsp.writeFile(tmpCjs, entrySource, "utf8");
            exec = await execCommand({
              cmd: "node",
              args: [tmpCjs, path.resolve(opts.inputPath)],
              cwd: opts.sol.rootDir,
              timeoutMs: opts.timeoutMs,
            });
          } finally {
            await fsp.rm(tmpCjs, { force: true }).catch(() => {});
          }
        } else {
          exec = await execCommand({
            cmd: "node",
            args: [entry, path.resolve(opts.inputPath)],
            cwd: opts.sol.rootDir,
            timeoutMs: opts.timeoutMs,
          });
        }
      } else {
        // .mjs/.cjs/etc: run with Node as-is
        exec = await execCommand({
          cmd: "node",
          args: [entry, path.resolve(opts.inputPath)],
          cwd: opts.sol.rootDir,
          timeoutMs: opts.timeoutMs,
        });
      }
    } else {
      // rust
      const cargoToml = path.join(opts.sol.rootDir, "Cargo.toml");
      if (existsSync(cargoToml)) {
        // Build first (best-effort; cached in CI)
        await execCommand({
          cmd: "cargo",
          args: ["build", "--release"],
          cwd: opts.sol.rootDir,
          timeoutMs: Math.max(opts.timeoutMs, 180_000),
        });

        const binPath = await guessCargoBinaryPath(opts.sol.rootDir);
        if (!binPath) {
          return {
            ...base,
            success: false,
            exitCode: 1,
            timedOut: false,
            executionTimeMs: 0,
            stdout: "",
            stderr: "",
            error: "Rust binary not found after cargo build",
          };
        }

        exec = await execCommand({
          cmd: binPath,
          args: [path.resolve(opts.inputPath)],
          cwd: opts.sol.rootDir,
          timeoutMs: opts.timeoutMs,
        });
      } else {
        // rustc single-file
        const rsFile = entryHint ? path.join(opts.sol.rootDir, entryHint) : undefined;
        if (!rsFile || !existsSync(rsFile)) {
          return {
            ...base,
            success: false,
            exitCode: 1,
            timedOut: false,
            executionTimeMs: 0,
            stdout: "",
            stderr: "",
            error: "No Rust source file found",
          };
        }
        const outBin = path.join(opts.sol.rootDir, `.tmp-bench-${opts.sol.id}`);
        const compile = await execCommand({
          cmd: "rustc",
          args: ["-O", "-o", outBin, rsFile],
          cwd: opts.sol.rootDir,
          timeoutMs: Math.min(opts.timeoutMs, 60_000),
        });
        if (compile.exitCode !== 0) {
          return {
            ...base,
            success: false,
            exitCode: compile.exitCode,
            timedOut: compile.timedOut,
            executionTimeMs: compile.elapsedMs,
            stdout: truncate(compile.stdout),
            stderr: truncate(compile.stderr),
            error: "rustc compilation failed",
          };
        }
        exec = await execCommand({
          cmd: outBin,
          args: [path.resolve(opts.inputPath)],
          cwd: opts.sol.rootDir,
          timeoutMs: opts.timeoutMs,
        });
        await fsp.rm(outBin, { force: true }).catch(() => {});
      }
    }

    if (!exec) throw new Error("Internal error: exec not set");

    const stdoutNorm = normalizeStdout(exec.stdout);
    const stderrNorm = exec.stderr.replace(/\r\n/g, "\n").trimEnd();

    return {
      ...base,
      success: exec.exitCode === 0 && !exec.timedOut,
      exitCode: exec.exitCode,
      timedOut: exec.timedOut,
      executionTimeMs: Math.round(exec.elapsedMs * 100) / 100,
      stdout: truncate(stdoutNorm),
      stderr: truncate(stderrNorm),
      error:
        exec.timedOut ? `Timed out after ${opts.timeoutMs}ms` : exec.exitCode === 0 ? undefined : truncate(stderrNorm || stdoutNorm || `Exit code ${exec.exitCode}`),
    };
  } catch (err: any) {
    return {
      ...base,
      success: false,
      exitCode: 1,
      timedOut: false,
      executionTimeMs: 0,
      stdout: "",
      stderr: "",
      error: err?.message ?? String(err),
    };
  }
}

async function guessCargoBinaryPath(crateDir: string): Promise<string | null> {
  const cargoToml = path.join(crateDir, "Cargo.toml");
  let packageName = path.basename(crateDir);
  try {
    const toml = await fsp.readFile(cargoToml, "utf8");
    const m = toml.match(/^\s*name\s*=\s*["']([^"']+)["']/m);
    if (m?.[1]) packageName = m[1];
  } catch {
    // ignore
  }
  const candidates = [
    path.join(crateDir, "target", "release", packageName),
    path.join(crateDir, "target", "release", path.basename(crateDir)),
    path.join(crateDir, "target", "release", "main"),
    path.join(crateDir, "target", "release", "solution"),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  return null;
}

function parseArgs(argv: string[]) {
  const out: {
    task?: string;
    only?: "human" | "ai";
    lang?: Language;
    timeoutMs: number;
    output: string;
  } = {
    timeoutMs: 60_000,
    output: path.join("site", "public", "data", "latest.json"),
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--task" && argv[i + 1]) out.task = argv[++i].padStart(2, "0");
    else if (a === "--only" && argv[i + 1]) out.only = argv[++i] as any;
    else if (a === "--lang" && argv[i + 1]) out.lang = argv[++i] as any;
    else if (a === "--timeoutMs" && argv[i + 1]) out.timeoutMs = Number(argv[++i]);
    else if (a === "--output" && argv[i + 1]) out.output = argv[++i];
    else if (a === "--help" || a === "-h") {
      printHelpAndExit();
    }
  }

  return out;
}

function printHelpAndExit(): never {
  // eslint-disable-next-line no-console
  console.log(`run-solutions (Bun/TS)

Usage:
  bun scripts/run-solutions.ts [--task 01] [--only human|ai] [--lang python|js|rust]
                              [--timeoutMs 60000] [--output site/public/data/latest.json]
`);
  process.exit(0);
}

async function main() {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const args = parseArgs(process.argv.slice(2));

  const inputDir = path.join(repoRoot, "inputs");
  const inputFiles = (await listFiles(inputDir)).filter((f) => /^\d\d\.txt$/.test(f));
  const taskIds = inputFiles.map((f) => f.slice(0, 2)).sort();
  const selectedTaskIds = args.task ? taskIds.filter((t) => t === args.task) : taskIds;

  const tasks: TaskMeta[] = [];
  for (const taskId of selectedTaskIds) {
    const inputPath = path.join(repoRoot, "inputs", `${taskId}.txt`);
    const inputInfo = await sha256File(inputPath);
    const promptPath = path.join(repoRoot, "prompts", `${taskId}.md`);
    const promptExists = existsSync(promptPath);
    const promptInfo = promptExists ? await sha256File(promptPath) : null;
    tasks.push({
      taskId,
      inputPath: path.relative(repoRoot, inputPath),
      inputBytes: inputInfo.bytes,
      inputSha256: inputInfo.sha256,
      promptPath: promptExists ? path.relative(repoRoot, promptPath) : undefined,
      promptBytes: promptInfo?.bytes,
      promptSha256: promptInfo?.sha256,
    });
  }

  let solutions = await discoverSolutions(repoRoot, selectedTaskIds);
  if (args.only) {
    solutions = solutions.filter((s) => (args.only === "human" ? s.source.kind === "human" : s.source.kind === "ai"));
  }
  if (args.lang) {
    solutions = solutions.filter((s) => s.language === args.lang);
  }

  // Compute entry hints for UI and store in solution list
  const solutionRecords: Dataset["solutions"] = [];
  for (const s of solutions) {
    const entryHint = await detectEntryHint(s.rootDir, s.language);
    const codeStats = await computeCodeStats(s.rootDir, s.language);
    solutionRecords.push({
      id: s.id,
      taskId: s.taskId,
      source: s.source.kind === "human" ? "human" : s.source.model,
      language: s.language,
      rootDir: path.relative(repoRoot, s.rootDir),
      entryHint,
      codeStats,
    });
  }

  const runs: RunResult[] = [];

  for (const taskId of selectedTaskIds) {
    const inputPath = path.join(repoRoot, "inputs", `${taskId}.txt`);
    const solsForTask = solutions.filter((s) => s.taskId === taskId);

    // Run everything for task
    for (const sol of solsForTask) {
      // eslint-disable-next-line no-console
      console.error(`[${taskId}] ${sol.source.kind === "human" ? "human" : sol.source.model}/${sol.language} …`);
      const r = await runOneSolution({ repoRoot, sol, inputPath, timeoutMs: args.timeoutMs });
      runs.push(r);
    }

    // Baseline = first successful human run (any language), else first successful run
    const taskRuns = runs.filter((r) => r.taskId === taskId);
    const baseline =
      taskRuns.find((r) => r.source === "human" && r.success) ?? taskRuns.find((r) => r.success) ?? null;
    if (baseline) {
      const baselineStdout = baseline.stdout;
      for (const r of taskRuns) {
        if (!r.success) continue;
        r.baselineSolutionId = baseline.solutionId;
        r.matchesBaseline = normalizeStdout(r.stdout) === normalizeStdout(baselineStdout);
      }
    }
  }

  const dataset: Dataset = {
    meta: {
      generatedAt: nowIso(),
      gitSha: await tryGitSha(repoRoot),
      runner: { name: "bun-runner", version: "0.1.0" },
      platform: { os: `${os.platform()} ${os.release()}`, arch: os.arch(), cpuCount: os.cpus().length },
    },
    tasks,
    solutions: solutionRecords,
    runs,
  };

  const outPath = path.isAbsolute(args.output) ? args.output : path.join(repoRoot, args.output);
  await fsp.mkdir(path.dirname(outPath), { recursive: true });
  await fsp.writeFile(outPath, JSON.stringify(dataset, null, 2) + "\n", "utf8");
  // eslint-disable-next-line no-console
  console.error(`\nWrote dataset: ${path.relative(repoRoot, outPath)} (${runs.length} runs)`);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

