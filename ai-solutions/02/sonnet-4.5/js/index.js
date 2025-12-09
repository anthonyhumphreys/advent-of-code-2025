const fs = require('fs');

function isRepeatedTwice(num) {
    const s = num.toString();
    const len = s.length;
    
    // Must be even length and no leading zeros
    if (len % 2 !== 0 || s[0] === '0') return false;
    
    const half = len / 2;
    return s.substring(0, half) === s.substring(half);
}

function isRepeatedAtLeastTwice(num) {
    const s = num.toString();
    const len = s.length;
    
    // No leading zeros
    if (s[0] === '0') return false;
    
    // Try all possible pattern lengths
    for (let patternLen = 1; patternLen <= len / 2; patternLen++) {
        if (len % patternLen === 0) {
            const pattern = s.substring(0, patternLen);
            const repetitions = len / patternLen;
            
            if (repetitions >= 2 && pattern.repeat(repetitions) === s) {
                return true;
            }
        }
    }
    
    return false;
}

function solve(input) {
    const ranges = input.trim().split(',').map(range => {
        const [start, end] = range.split('-').map(Number);
        return { start, end };
    });
    
    let sumPart1 = 0;
    let sumPart2 = 0;
    
    for (const { start, end } of ranges) {
        for (let num = start; num <= end; num++) {
            if (isRepeatedTwice(num)) {
                sumPart1 += num;
            }
            if (isRepeatedAtLeastTwice(num)) {
                sumPart2 += num;
            }
        }
    }
    
    return [sumPart1, sumPart2];
}

const input = fs.readFileSync('../../../../inputs/02.txt', 'utf8');
const [part1, part2] = solve(input);
console.log(part1);
console.log(part2);
