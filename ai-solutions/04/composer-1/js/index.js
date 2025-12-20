import { readFileSync } from 'fs';

const input = readFileSync(process.argv[2], 'utf-8').trim();
const grid = input.split('\n').map(line => line.split(''));

const rows = grid.length;
const cols = grid[0].length;

// Directions for 8 neighbors
const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

function countAdjacentRolls(r, c) {
  let count = 0;
  for (const [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === '@') {
      count++;
    }
  }
  return count;
}

// Part 1: Count accessible rolls
let part1 = 0;
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (grid[r][c] === '@' && countAdjacentRolls(r, c) < 4) {
      part1++;
    }
  }
}

// Part 2: Iteratively remove accessible rolls
const grid2 = grid.map(row => [...row]);
let totalRemoved = 0;

while (true) {
  const toRemove = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid2[r][c] === '@') {
        let adjacentCount = 0;
        for (const [dr, dc] of directions) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid2[nr][nc] === '@') {
            adjacentCount++;
          }
        }
        if (adjacentCount < 4) {
          toRemove.push([r, c]);
        }
      }
    }
  }
  
  if (toRemove.length === 0) break;
  
  for (const [r, c] of toRemove) {
    grid2[r][c] = '.';
  }
  totalRemoved += toRemove.length;
}

console.log(part1);
console.log(totalRemoved);

