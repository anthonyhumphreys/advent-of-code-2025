const fs = require('fs');

function countClicksOnZero(start, signedSteps) {
    if (signedSteps === 0) {
        return 0;
    }
    
    const startNorm = ((start % 100) + 100) % 100;
    
    if (signedSteps > 0) {
        const numClicks = signedSteps;
        const firstZeroClick = startNorm === 0 ? 100 : 100 - startNorm;
        
        if (firstZeroClick > numClicks) {
            return 0;
        }
        
        return 1 + Math.floor((numClicks - firstZeroClick) / 100);
    } else {
        const numClicks = -signedSteps;
        const firstZeroClick = startNorm === 0 ? 100 : startNorm;
        
        if (firstZeroClick > numClicks) {
            return 0;
        }
        
        return 1 + Math.floor((numClicks - firstZeroClick) / 100);
    }
}

function solve() {
    const input = fs.readFileSync('../../../../inputs/01.txt', 'utf8').trim();
    const lines = input.split('\n');
    
    let position = 50;
    let part1Count = 0;
    let part2Count = 0;
    
    for (const line of lines) {
        const direction = line[0];
        const distance = parseInt(line.slice(1));
        const signedSteps = direction === 'R' ? distance : -distance;
        
        // Count zeros passed during rotation (Part 2)
        part2Count += countClicksOnZero(position, signedSteps);
        
        // Update position
        position = (position + signedSteps) % 100;
        position = (position + 100) % 100;
        
        // Check if we ended at 0 (Part 1)
        if (position === 0) {
            part1Count++;
        }
    }
    
    console.log(part1Count);
    console.log(part2Count);
}

solve();

