import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = fs.readFileSync(path.join(__dirname, '../../../../inputs/04.txt'), 'utf8');
const lines = input.trim().split('\n');

// Parse grid into a 2D array
const grid = lines.map(line => [...line]);
const rows = grid.length;
const cols = grid[0].length;

// 8 directions: N, NE, E, SE, S, SW, W, NW
const directions = [
    [-1, 0], [-1, 1], [0, 1], [1, 1],
    [1, 0], [1, -1], [0, -1], [-1, -1]
];

// Count adjacent paper rolls for a given position
function countAdjacentRolls(grid, row, col) {
    let count = 0;
    for (const [dr, dc] of directions) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === '@') {
            count++;
        }
    }
    return count;
}

// Find all accessible rolls (those with fewer than 4 adjacent rolls)
function findAccessibleRolls(grid) {
    const accessible = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '@' && countAdjacentRolls(grid, r, c) < 4) {
                accessible.push([r, c]);
            }
        }
    }
    return accessible;
}

// Part 1: Count initially accessible rolls
const part1 = findAccessibleRolls(grid).length;

// Part 2: Keep removing accessible rolls until none remain
// Create a working copy of the grid
const workingGrid = grid.map(row => [...row]);
let totalRemoved = 0;

while (true) {
    const accessible = findAccessibleRolls(workingGrid);
    if (accessible.length === 0) break;
    
    // Remove all accessible rolls
    for (const [r, c] of accessible) {
        workingGrid[r][c] = '.';
    }
    totalRemoved += accessible.length;
}

console.log(part1);
console.log(totalRemoved);
