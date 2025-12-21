import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseInput(input) {
    const sections = input.trim().split('\n\n');
    const ranges = sections[0].split('\n').map(line => {
        const [start, end] = line.split('-').map(Number);
        return { start, end };
    });
    const ids = sections[1].split('\n').map(Number);
    return { ranges, ids };
}

function isInRange(id, ranges) {
    return ranges.some(range => id >= range.start && id <= range.end);
}

function part1(input) {
    const { ranges, ids } = parseInput(input);
    return ids.filter(id => isInRange(id, ranges)).length;
}

function part2(input) {
    const { ranges } = parseInput(input);
    
    // Sort ranges by start position
    const sorted = [...ranges].sort((a, b) => a.start - b.start);
    
    // Merge overlapping ranges
    const merged = [];
    let current = sorted[0];
    
    for (let i = 1; i < sorted.length; i++) {
        const next = sorted[i];
        if (next.start <= current.end + 1) {
            // Ranges overlap or are adjacent, merge them
            current = {
                start: current.start,
                end: Math.max(current.end, next.end)
            };
        } else {
            // No overlap, save current and move to next
            merged.push(current);
            current = next;
        }
    }
    merged.push(current);
    
    // Count total IDs in merged ranges
    return merged.reduce((sum, range) => sum + (range.end - range.start + 1), 0);
}

// Main execution
const inputPath = path.join(__dirname, '../../../../inputs/05.txt');
const input = fs.readFileSync(inputPath, 'utf-8');

console.log('Part 1:', part1(input));
console.log('Part 2:', part2(input));

