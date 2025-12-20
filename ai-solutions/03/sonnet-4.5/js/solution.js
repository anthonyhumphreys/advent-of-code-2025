const fs = require('fs');

function findMaxNumber(digits, count) {
    const n = digits.length;
    if (count > n) return 0;
    
    // Greedy approach: select 'count' digits that form the largest number
    const result = [];
    let start = 0;
    
    for (let i = 0; i < count; i++) {
        // We need to pick 'count - i' more digits from the remaining string
        // So we can search up to index n - (count - i)
        const end = n - (count - i) + 1;
        
        // Find the maximum digit in the valid range
        let maxDigit = digits[start];
        let maxPos = start;
        
        for (let j = start; j < end; j++) {
            if (digits[j] > maxDigit) {
                maxDigit = digits[j];
                maxPos = j;
            }
        }
        
        result.push(maxDigit);
        start = maxPos + 1;
    }
    
    return parseInt(result.join(''));
}

function solve(input) {
    const lines = input.trim().split('\n');
    
    let part1 = 0;
    let part2 = 0;
    
    for (const line of lines) {
        const digits = line.trim();
        part1 += findMaxNumber(digits, 2);
        part2 += findMaxNumber(digits, 12);
    }
    
    console.log(part1);
    console.log(part2);
}

const input = fs.readFileSync('../../../../inputs/03.txt', 'utf8');
solve(input);
