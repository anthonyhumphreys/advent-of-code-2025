#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIRS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function defaultInputPath() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, "../../../inputs/04.txt");
}

function readGrid(filePath) {
  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function buildAdjacency(grid) {
  const positions = [];
  const index = new Map();

  grid.forEach((row, r) => {
    for (let c = 0; c < row.length; c += 1) {
      if (row[c] === "@") {
        const id = positions.length;
        positions.push([r, c]);
        index.set(`${r},${c}`, id);
      }
    }
  });

  const adjacency = Array.from({ length: positions.length }, () => []);
  positions.forEach(([r, c], idx) => {
    DIRS.forEach(([dr, dc]) => {
      const key = `${r + dr},${c + dc}`;
      if (index.has(key)) {
        adjacency[idx].push(index.get(key));
      }
    });
  });

  return adjacency;
}

function countAccessible(adjacency) {
  return adjacency.reduce((acc, neighbors) => acc + (neighbors.length < 4 ? 1 : 0), 0);
}

function totalRemoved(adjacency) {
  const degrees = adjacency.map((neighbors) => neighbors.length);
  const removed = new Array(adjacency.length).fill(false);
  const queue = [];

  degrees.forEach((deg, idx) => {
    if (deg < 4) queue.push(idx);
  });

  let head = 0;
  let removedCount = 0;

  while (head < queue.length) {
    const node = queue[head];
    head += 1;
    if (removed[node]) continue;
    removed[node] = true;
    removedCount += 1;

    for (const neighbor of adjacency[node]) {
      if (removed[neighbor]) continue;
      degrees[neighbor] -= 1;
      if (degrees[neighbor] < 4) queue.push(neighbor);
    }
  }

  return removedCount;
}

function main() {
  const inputPath = process.argv[2] ?? defaultInputPath();
  const grid = readGrid(inputPath);
  const adjacency = buildAdjacency(grid);

  const part1 = countAccessible(adjacency);
  const part2 = totalRemoved(adjacency);

  console.log(part1);
  console.log(part2);
}

main();

