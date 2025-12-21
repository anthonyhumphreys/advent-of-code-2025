import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function solve() {
    // Read input file
    const inputPath = path.join(__dirname, '..', '..', '..', '..', 'inputs', '05.txt');
    const input = fs.readFileSync(inputPath, 'utf-8').trim();
    
    // Split input into ranges and available IDs
    const parts = input.split('\n\n');
    const rangesText = parts[0];
    const availableIdsText = parts[1];
    
    // Parse ranges
    const ranges = [];
    for (const line of rangesText.trim().split('\n')) {
        const [start, end] = line.split('-').map(Number);
        ranges.push([start, end]);
    }
    
    // Parse available IDs
    const availableIds = availableIdsText.trim().split('\n').map(line => parseInt(line.trim(), 10));
    
    // Part 1: Count how many available IDs are fresh
    function part1(ranges, availableIds) {
        let freshCount = 0;
        for (const ingredientId of availableIds) {
            let isFresh = false;
            for (const [start, end] of ranges) {
                if (ingredientId >= start && ingredientId <= end) {
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
    
    // Part 2: Count total unique IDs covered by ranges
    function part2(ranges) {
        if (ranges.length === 0) {
            return 0;
        }
        
        // Sort ranges by start
        const sortedRanges = [...ranges].sort((a, b) => a[0] - b[0]);
        
        // Merge overlapping ranges
        const merged = [sortedRanges[0]];
        for (let i = 1; i < sortedRanges.length; i++) {
            const [start, end] = sortedRanges[i];
            const [lastStart, lastEnd] = merged[merged.length - 1];
            
            if (start <= lastEnd + 1) {  // Overlapping or adjacent
                merged[merged.length - 1] = [lastStart, Math.max(lastEnd, end)];
            } else {
                merged.push([start, end]);
            }
        }
        
        // Count total IDs in merged ranges
        let total = 0;
        for (const [start, end] of merged) {
            total += end - start + 1;
        }
        
        return total;
    }
    
    // Solve both parts
    const answer1 = part1(ranges, availableIds);
    const answer2 = part2(ranges);
    
    console.log(answer1);
    console.log(answer2);
}

solve();

