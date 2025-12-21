import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseInput(filepath) {
  const raw = fs.readFileSync(filepath, 'utf8').trim().split('\n\n');
  if (raw.length !== 2) {
    throw new Error('Input must contain ranges, a blank line, then IDs.');
  }

  const [rawRanges, rawIds] = raw;
  const ranges = rawRanges.split('\n').map((line) => {
    const [start, end] = line.split('-').map(Number);
    return { start, end };
  });

  const ids = rawIds.split('\n').filter(Boolean).map(Number);
  return { ranges, ids };
}

function mergeRanges(ranges) {
  if (!ranges.length) {
    return [];
  }

  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged = [];
  let currentStart = sorted[0].start;
  let currentEnd = sorted[0].end;

  for (let i = 1; i < sorted.length; i += 1) {
    const { start, end } = sorted[i];
    if (start <= currentEnd + 1) {
      currentEnd = Math.max(currentEnd, end);
    } else {
      merged.push({ start: currentStart, end: currentEnd });
      currentStart = start;
      currentEnd = end;
    }
  }

  merged.push({ start: currentStart, end: currentEnd });
  return merged;
}

function isFresh(id, merged) {
  let left = 0;
  let right = merged.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const range = merged[mid];
    if (id < range.start) {
      right = mid - 1;
    } else if (id > range.end) {
      left = mid + 1;
    } else {
      return true;
    }
  }

  return false;
}

function solvePart1(ids, mergedRanges) {
  let fresh = 0;
  for (const id of ids) {
    if (isFresh(id, mergedRanges)) {
      fresh += 1;
    }
  }
  return fresh;
}

function solvePart2(mergedRanges) {
  return mergedRanges.reduce(
    (acc, range) => acc + (range.end - range.start + 1),
    0,
  );
}

function locateInput() {
  const projectRoot = path.resolve(__dirname, '../../../..');
  const candidates = [
    path.join(projectRoot, 'inputs', '05.txt'),
    path.resolve('inputs/05.txt'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error('Unable to locate inputs/05.txt');
}

function main() {
  const inputPath = locateInput();
  const { ranges, ids } = parseInput(inputPath);
  const mergedRanges = mergeRanges(ranges);

  const part1 = solvePart1(ids, mergedRanges);
  const part2 = solvePart2(mergedRanges);

  console.log(part1);
  console.log(part2);
}

main();


