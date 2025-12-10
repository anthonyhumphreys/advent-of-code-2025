
const fs = require('fs');
const path = require('path');

function solveLine(line, k) {
    const digits = line.trim().split('').map(Number);
    const n = digits.length;
    let result = [];
    let start = 0;

    for (let i = 0; i < k; i++) {
        // We need to pick one digit.
        // Remaining needed: k - 1 - i
        // End index (exclusive) for search: n - (k - 1 - i) = n - k + i + 1
        let end = n - k + i + 1;
        
        let maxD = -1;
        let maxIdxInWindow = -1;

        // Search window from start to end
        for (let j = start; j < end; j++) {
            if (digits[j] > maxD) {
                maxD = digits[j];
                maxIdxInWindow = j;
            }
            if (maxD === 9) break; // Optimization
        }

        result.push(maxD);
        start = maxIdxInWindow + 1;
    }

    return result.join('');
}

function main() {
    const inputPath = path.join(__dirname, '../../../../inputs/03.txt');
    try {
        const data = fs.readFileSync(inputPath, 'utf8');
        const lines = data.split('\n').filter(line => line.trim() !== '');

        let totalP1 = 0;
        let totalP2 = 0n; // BigInt for part 2

        for (const line of lines) {
            const res1 = solveLine(line, 2);
            totalP1 += parseInt(res1, 10);
            
            const res2 = solveLine(line, 12);
            totalP2 += BigInt(res2);
        }

        console.log(totalP1);
        console.log(totalP2.toString());

    } catch (err) {
        console.error("Error reading file:", err);
    }
}

main();
