const fs = require('fs');

const input = fs.readFileSync('inputs/03.txt', 'utf-8').trim().split('\n');

// Function to find the maximum number by selecting exactly k digits from a string
function maxJoltage(bank, k) {
    const n = bank.length;
    if (k > n) return 0n;
    
    let result = '';
    let startIdx = 0;
    
    for (let i = 0; i < k; i++) {
        // For position i, we can pick from startIdx to (n - k + i) inclusive
        const endIdx = n - k + i;
        let maxDigit = '0';
        let maxPos = startIdx;
        
        for (let j = startIdx; j <= endIdx; j++) {
            if (bank[j] > maxDigit) {
                maxDigit = bank[j];
                maxPos = j;
            }
        }
        
        result += maxDigit;
        startIdx = maxPos + 1;
    }
    
    return BigInt(result);
}

// Part 1: Select 2 batteries from each bank
let part1 = 0n;
for (const bank of input) {
    part1 += maxJoltage(bank, 2);
}

// Part 2: Select 12 batteries from each bank
let part2 = 0n;
for (const bank of input) {
    part2 += maxJoltage(bank, 12);
}

console.log(part1.toString());
console.log(part2.toString());
