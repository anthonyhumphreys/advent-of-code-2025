import { promises as fs } from "node:fs";
import path from "node:path";

export type Language = "python" | "js" | "rust";

export type CodeStats = {
  fileCount: number;
  totalLoc: number;
  dependencyCount?: number;
};

export type TaskMeta = {
  taskId: string;
  inputPath: string;
  inputBytes: number;
  inputSha256: string;
  promptPath?: string;
  promptBytes?: number;
  promptSha256?: string;
};

export type SolutionRecord = {
  id: string;
  taskId: string;
  source: string; // "human" or model name
  language: Language;
  rootDir: string;
  entryHint?: string;
  codeStats?: CodeStats;
};

export type RunResult = {
  solutionId: string;
  taskId: string;
  source: string; // "human" or model name
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

export type Dataset = {
  meta: {
    generatedAt: string;
    gitSha?: string;
    runner: { name: string; version: string };
    platform: { os: string; arch: string; cpuCount: number };
  };
  tasks: TaskMeta[];
  solutions: SolutionRecord[];
  runs: RunResult[];
};

/**
 * Loads the benchmark dataset from `public/data/latest.json`.
 * Returns `null` if the dataset doesn't exist yet.
 */
export async function loadDataset(): Promise<Dataset | null> {
  const datasetPath = path.join(process.cwd(), "public", "data", "latest.json");

  try {
    const raw = await fs.readFile(datasetPath, "utf8");
    return JSON.parse(raw) as Dataset;
  } catch {
    return null;
  }
}
