import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

type DatasetMeta = {
  generatedAt: string;
  gitSha?: string;
  runner?: { name: string; version: string };
  platform?: { os: string; arch: string; cpuCount?: number };
};

export type DatasetTask = {
  taskId: string;
  inputPath: string;
  inputBytes: number;
  inputSha256: string;
  promptPath?: string;
  promptBytes?: number;
  promptSha256?: string;
};

export type DatasetCodeStats = {
  fileCount?: number;
  totalLoc?: number;
  dependencyCount?: number;
};

export type DatasetSolution = {
  id: string;
  taskId: string;
  source: string;
  language: string;
  rootDir: string;
  entryHint?: string;
  codeStats?: DatasetCodeStats;
};

export type DatasetRun = {
  solutionId: string;
  taskId: string;
  source: string;
  language: string;
  rootDir: string;
  success: boolean;
  exitCode: number;
  timedOut: boolean;
  executionTimeMs: number;
  stdout?: string;
  stderr?: string;
  error?: string;
  codeStats?: DatasetCodeStats;
  baselineSolutionId?: string;
  matchesBaseline?: boolean;
};

export type Dataset = {
  meta: DatasetMeta;
  tasks: DatasetTask[];
  solutions: DatasetSolution[];
  runs: DatasetRun[];
};

async function readLatestJson(): Promise<string> {
  const filePath = path.join(process.cwd(), "public", "data", "latest.json");
  return await readFile(filePath, "utf8");
}

export const loadDataset = cache(async (): Promise<Dataset | null> => {
  try {
    const raw = await readLatestJson();
    return JSON.parse(raw) as Dataset;
  } catch {
    return null;
  }
});
