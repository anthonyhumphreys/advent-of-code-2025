import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function solve() {
    // Read input file
    const inputPath = path.join(__dirname, '..', '..', '..', '..', 'inputs', '04.txt');
    const input = fs.readFileSync(inputPath, 'utf-8').trim();
    
    // Parse the grid
    const grid = input.split('\n').map(line => line.split(''));
    const rows = grid.length;
    const cols = grid[0].length;
    
    // Helper function to count neighbors of a position
    function countNeighbors(grid, r, c) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        let count = 0;
        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
                if (grid[nr][nc] === '@') {
                    count++;
                }
            }
        }
        return count;
    }
    
    // Part 1: Count initially accessible rolls
    function part1(grid) {
        let accessible = 0;
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[0].length; c++) {
                if (grid[r][c] === '@') {
                    if (countNeighbors(grid, r, c) < 4) {
                        accessible++;
                    }
                }
            }
        }
        return accessible;
    }
    
    // Part 2: Iteratively remove accessible rolls
    function part2(grid) {
        // Create a mutable copy of the grid
        const mutableGrid = grid.map(row => [...row]);
        let totalRemoved = 0;
        
        while (true) {
            // Find all accessible rolls
            const toRemove = [];
            for (let r = 0; r < mutableGrid.length; r++) {
                for (let c = 0; c < mutableGrid[0].length; c++) {
                    if (mutableGrid[r][c] === '@') {
                        if (countNeighbors(mutableGrid, r, c) < 4) {
                            toRemove.push([r, c]);
                        }
                    }
                }
            }
            
            // If no rolls can be removed, stop
            if (toRemove.length === 0) {
                break;
            }
            
            // Remove all accessible rolls
            for (const [r, c] of toRemove) {
                mutableGrid[r][c] = '.';
            }
            
            totalRemoved += toRemove.length;
        }
        
        return totalRemoved;
    }
    
    // Solve both parts
    const answer1 = part1(grid);
    const answer2 = part2(grid);
    
    console.log(answer1);
    console.log(answer2);
}

solve();

