const fs = require('fs');

function solve() {
    if (process.argv.length < 3) {
        console.error("Usage: node index.js <input_file>");
        process.exit(1);
    }

    const inputFile = process.argv[2];
    try {
        const data = fs.readFileSync(inputFile, 'utf8');
        const lines = data.split('\n').filter(line => line.trim() !== '');

        let pos = 50;
        let p1Count = 0;
        let p2Count = 0;

        for (const line of lines) {
            const direction = line[0];
            const amount = parseInt(line.slice(1), 10);

            for (let i = 0; i < amount; i++) {
                if (direction === 'R') {
                    pos = (pos + 1) % 100;
                } else {
                    pos = (pos - 1 + 100) % 100; // Handle negative modulo
                }

                if (pos === 0) {
                    p2Count++;
                }
            }

            if (pos === 0) {
                p1Count++;
            }
        }

        console.log(p1Count);
        console.log(p2Count);

    } catch (err) {
        console.error(`Error reading file: ${err.message}`);
        process.exit(1);
    }
}

solve();

