import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseInput(filepath) {
  const content = fs.readFileSync(filepath, 'utf8').trim();
  const [rangesRaw, idsRaw] = content.split('\n\n');

  const ranges = rangesRaw.split('\n').map(line => {
    const [start, end] = line.split('-').map(Number);
    return { start, end };
  });

  const ids = idsRaw.split('\n').map(Number);

  return { ranges, ids };
}

function solvePart1(ranges, ids) {
  let freshCount = 0;
  for (const id of ids) {
    let isFresh = false;
    for (const range of ranges) {
      if (id >= range.start && id <= range.end) {
        isFresh = true;
        break;
      }
    }
    if (isFresh) {
      freshCount++;
    }
  }
  return freshCount;
}

function solvePart2(ranges) {
  if (ranges.length === 0) return 0;

  // Sort by start
  const sortedRanges = [...ranges].sort((a, b) => a.start - b.start);

  const mergedRanges = [];
  let currentStart = sortedRanges[0].start;
  let currentEnd = sortedRanges[0].end;

  for (let i = 1; i < sortedRanges.length; i++) {
    const nextStart = sortedRanges[i].start;
    const nextEnd = sortedRanges[i].end;

    if (nextStart <= currentEnd + 1) {
      // Overlap or adjacent
      currentEnd = Math.max(currentEnd, nextEnd);
    } else {
      mergedRanges.push({ start: currentStart, end: currentEnd });
      currentStart = nextStart;
      currentEnd = nextEnd;
    }
  }
  mergedRanges.push({ start: currentStart, end: currentEnd });

  let totalFresh = 0;
  for (const range of mergedRanges) {
    totalFresh += (range.end - range.start + 1);
  }

  return totalFresh;
}

function main() {
  const inputPath = path.resolve(__dirname, '../../../../inputs/05.txt');
  
  try {
    const { ranges, ids } = parseInput(inputPath);
    console.log(`Part 1: ${solvePart1(ranges, ids)}`);
    console.log(`Part 2: ${solvePart2(ranges)}`);
  } catch (err) {
    console.error("Error reading or processing input:", err);
  }
}

main();
