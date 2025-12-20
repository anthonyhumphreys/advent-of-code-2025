import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function solve() {
    let inputPath = path.join(__dirname, '../../../../inputs/04.txt');
    if (process.argv.length > 2) {
        inputPath = process.argv[2];
    }

    let input;
    try {
        input = fs.readFileSync(inputPath, 'utf-8');
    } catch (e) {
        console.error(`Error: Input file not found at ${inputPath}`);
        return;
    }

    const grid = input.trim().split('\n').map(line => line.trim().split(''));
    const rows = grid.length;
    const cols = grid[0].length;

    function countNeighbors(r, c, currentGrid) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    if (currentGrid[nr][nc] === '@') {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    // Part 1
    let p1Count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '@') {
                if (countNeighbors(r, c, grid) < 4) {
                    p1Count++;
                }
            }
        }
    }
    console.log(p1Count);

    // Part 2
    // Clone grid
    const currentGrid = grid.map(row => [...row]);
    let totalRemoved = 0;

    while (true) {
        const toRemove = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (currentGrid[r][c] === '@') {
                    if (countNeighbors(r, c, currentGrid) < 4) {
                        toRemove.push([r, c]);
                    }
                }
            }
        }

        if (toRemove.length === 0) {
            break;
        }

        totalRemoved += toRemove.length;
        for (const [r, c] of toRemove) {
            currentGrid[r][c] = '.';
        }
    }

    console.log(totalRemoved);
}

solve();
