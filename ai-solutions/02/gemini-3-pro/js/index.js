import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function solve() {
    const inputPath = path.join(__dirname, '../../../../inputs/02.txt');
    const data = fs.readFileSync(inputPath, 'utf8').trim();

    const ranges = data.split(',').map(part => {
        const [start, end] = part.split('-').map(Number);
        return { start, end };
    });

    let totalP1 = 0;
    let totalP2 = 0;

    for (const { start, end } of ranges) {
        for (let n = start; n <= end; n++) {
            const s = n.toString();
            const len = s.length;

            // Part 1
            if (len % 2 === 0) {
                const half = len / 2;
                if (s.slice(0, half) === s.slice(half)) {
                    totalP1 += n;
                }
            }

            // Part 2
            for (let l = 1; l <= Math.floor(len / 2); l++) {
                if (len % l === 0) {
                    const pattern = s.slice(0, l);
                    const times = len / l;
                    if (pattern.repeat(times) === s) {
                        totalP2 += n;
                        break;
                    }
                }
            }
        }
    }

    console.log(totalP1);
    console.log(totalP2);
}

solve();



