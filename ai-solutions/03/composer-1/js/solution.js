const fs = require('fs');

function findMaxKDigits(line, k) {
    const digits = line.split('').map(Number);
    const n = digits.length;
    const result = [];
    
    // Greedy: for each position, pick the largest digit available
    // while ensuring we have enough digits left for remaining positions
    let startIdx = 0;
    for (let pos = 0; pos < k; pos++) {
        // We can pick from [startIdx, n - (k - pos - 1)]
        const endIdx = n - (k - pos - 1);
        let maxDigit = -1;
        let maxIdx = -1;
        
        for (let i = startIdx; i < endIdx; i++) {
            if (digits[i] > maxDigit) {
                maxDigit = digits[i];
                maxIdx = i;
            }
        }
        
        result.push(maxDigit);
        startIdx = maxIdx + 1;
    }
    
    return parseInt(result.join(''));
}

function solve() {
    const inputFile = process.argv[2] || 'inputs/03.txt';
    const input = fs.readFileSync(inputFile, 'utf-8').trim();
    const lines = input.split('\n');
    
    let part1Sum = 0;
    let part2Sum = 0;
    
    for (const line of lines) {
        // Part 1: Find max 2-digit number
        const max2Digit = findMaxKDigits(line, 2);
        part1Sum += max2Digit;
        
        // Part 2: Find max 12-digit number
        const max12Digit = findMaxKDigits(line, 12);
        part2Sum += max12Digit;
    }
    
    console.log(part1Sum);
    console.log(part2Sum);
}

solve();
