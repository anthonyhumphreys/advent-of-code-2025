const fs = require('fs');
const path = require('path');

function solve() {
    const inputPath = path.join(__dirname, '../../../../inputs/02.txt');
    const content = fs.readFileSync(inputPath, 'utf8').trim();

    // Parse ranges
    // Remove newlines and split by comma
    const rangesRaw = content.replace(/\n/g, '').split(',');
    const ranges = [];

    for (const r of rangesRaw) {
        if (r.includes('-')) {
            const parts = r.split('-');
            ranges.push([parseInt(parts[0], 10), parseInt(parts[1], 10)]);
        }
    }

    let totalPart1 = 0;
    let totalPart2 = 0;

    for (const [start, end] of ranges) {
        for (let num = start; num <= end; num++) {
            const s = num.toString();
            const len = s.length;

            // Part 1
            if (len % 2 === 0) {
                const half = len / 2;
                if (s.slice(0, half) === s.slice(half)) {
                    totalPart1 += num;
                }
            }

            // Part 2
            let isP2 = false;
            for (let k = 1; k <= len / 2; k++) {
                if (len % k === 0) {
                    const pattern = s.slice(0, k);
                    const repeats = len / k;
                    if (pattern.repeat(repeats) === s) {
                        isP2 = true;
                        break;
                    }
                }
            }

            if (isP2) {
                totalPart2 += num;
            }
        }
    }

    console.log(totalPart1);
    console.log(totalPart2);
}

solve();



