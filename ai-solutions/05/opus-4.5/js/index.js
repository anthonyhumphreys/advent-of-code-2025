import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function solve(input) {
    const sections = input.trim().split('\n\n');
    const rangeLines = sections[0].split('\n');
    const ingredientLines = sections[1].split('\n');

    // Parse ranges as BigInt to handle large numbers
    const ranges = rangeLines.map(line => {
        const [start, end] = line.split('-').map(BigInt);
        return { start, end };
    });

    // Parse available ingredient IDs
    const ingredients = ingredientLines.map(BigInt);

    // Part 1: Count how many ingredients fall within any range
    const part1 = ingredients.filter(id => {
        return ranges.some(range => id >= range.start && id <= range.end);
    }).length;

    // Part 2: Merge overlapping ranges and count total fresh IDs
    // Sort ranges by start value
    const sortedRanges = [...ranges].sort((a, b) => {
        if (a.start < b.start) return -1;
        if (a.start > b.start) return 1;
        return 0;
    });

    // Merge overlapping ranges
    const mergedRanges = [];
    for (const range of sortedRanges) {
        if (mergedRanges.length === 0) {
            mergedRanges.push({ start: range.start, end: range.end });
        } else {
            const last = mergedRanges[mergedRanges.length - 1];
            // Check if ranges overlap or are adjacent
            if (range.start <= last.end + 1n) {
                // Merge by extending the end if necessary
                if (range.end > last.end) {
                    last.end = range.end;
                }
            } else {
                mergedRanges.push({ start: range.start, end: range.end });
            }
        }
    }

    // Count total IDs in merged ranges
    let part2 = 0n;
    for (const range of mergedRanges) {
        part2 += range.end - range.start + 1n;
    }

    return { part1, part2: part2.toString() };
}

// Main execution
const inputPath = join(__dirname, '..', '..', '..', '..', 'inputs', '05.txt');
const input = readFileSync(inputPath, 'utf8');

const { part1, part2 } = solve(input);
console.log('Part 1:', part1);
console.log('Part 2:', part2);
