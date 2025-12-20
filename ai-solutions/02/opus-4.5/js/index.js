const fs = require('fs');
const path = require('path');

function parseInput(filename) {
    const content = fs.readFileSync(filename, 'utf8').trim();
    const ranges = [];
    
    for (const part of content.split(',')) {
        const trimmed = part.trim();
        if (trimmed) {
            const [start, end] = trimmed.split('-').map(Number);
            ranges.push([start, end]);
        }
    }
    return ranges;
}

function isDoubleRepeated(n) {
    // Part 1: Check if number is a pattern repeated exactly twice
    const s = String(n);
    const length = s.length;
    if (length % 2 !== 0) {
        return false;
    }
    const half = length / 2;
    return s.slice(0, half) === s.slice(half);
}

function isRepeatedPattern(n) {
    // Part 2: Check if number is a pattern repeated at least twice
    const s = String(n);
    const length = s.length;
    
    for (let patternLen = 1; patternLen <= Math.floor(length / 2); patternLen++) {
        if (length % patternLen === 0) {
            const repetitions = length / patternLen;
            if (repetitions >= 2) {
                const pattern = s.slice(0, patternLen);
                if (pattern.repeat(repetitions) === s) {
                    return true;
                }
            }
        }
    }
    return false;
}

function solve(ranges) {
    let part1Sum = 0n;
    let part2Sum = 0n;
    
    for (const [start, end] of ranges) {
        for (let num = start; num <= end; num++) {
            if (isDoubleRepeated(num)) {
                part1Sum += BigInt(num);
            }
            if (isRepeatedPattern(num)) {
                part2Sum += BigInt(num);
            }
        }
    }
    
    return [part1Sum, part2Sum];
}

function main() {
    const inputFile = process.argv[2] || path.join('inputs', '02.txt');
    const ranges = parseInput(inputFile);
    const [part1, part2] = solve(ranges);
    console.log(String(part1));
    console.log(String(part2));
}

main();
