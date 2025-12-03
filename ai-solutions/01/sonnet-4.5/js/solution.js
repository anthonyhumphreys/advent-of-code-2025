const fs = require('fs');

function solve() {
    const input = fs.readFileSync('../../../../inputs/01.txt', 'utf8').trim();
    const lines = input.split('\n');
    
    let position = 50;
    let part1Count = 0;
    let part2Count = 0;
    
    for (const line of lines) {
        const direction = line[0];
        const distance = parseInt(line.slice(1));
        
        if (direction === 'R') {
            // Count zeros passed during rotation (Part 2)
            const zerosDuring = Math.floor((position + distance) / 100);
            part2Count += zerosDuring;
            
            // Update position
            position = (position + distance) % 100;
        } else { // direction === 'L'
            // Count zeros passed during rotation (Part 2)
            const zerosDuring = Math.floor(distance / 100) + 
                               (distance >= position && position > 0 ? 1 : 0);
            part2Count += zerosDuring;
            
            // Update position
            position = ((position - distance) % 100 + 100) % 100;
        }
        
        // Check if we ended at 0 (Part 1 only; Part 2 already counted it)
        if (position === 0) {
            part1Count++;
        }
    }
    
    console.log(part1Count);
    console.log(part2Count);
}

solve();

