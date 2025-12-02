const fs = require('fs');

function solve() {
    const inputFile = process.argv[2] || 'inputs/01.txt';
    const input = fs.readFileSync(inputFile, 'utf-8');
    const rotations = input.trim().split('\n').filter(line => line.trim() !== '');
    
    // Part 1: Count times dial points at 0 after completing a rotation
    let position = 50;
    let part1Count = 0;
    
    for (const rotation of rotations) {
        const direction = rotation[0];
        const distance = parseInt(rotation.substring(1));
        
        if (direction === 'R') {
            position = (position + distance) % 100;
        } else { // direction === 'L'
            position = ((position - distance) % 100 + 100) % 100;
        }
        
        if (position === 0) {
            part1Count++;
        }
    }
    
    // Part 2: Count times dial points at 0 during any click
    position = 50;
    let part2Count = 0;
    
    for (const rotation of rotations) {
        const direction = rotation[0];
        const distance = parseInt(rotation.substring(1));
        
        const startPos = position;
        
        if (direction === 'R') {
            // Count how many times we pass through 0 during rotation
            for (let i = 1; i <= distance; i++) {
                if ((startPos + i) % 100 === 0) {
                    part2Count++;
                }
            }
            
            position = (position + distance) % 100;
        } else { // direction === 'L'
            // Count how many times we pass through 0 during rotation
            for (let i = 1; i <= distance; i++) {
                if (((startPos - i) % 100 + 100) % 100 === 0) {
                    part2Count++;
                }
            }
            
            position = ((position - distance) % 100 + 100) % 100;
        }
    }
    
    console.log(part1Count);
    console.log(part2Count);
}

solve();

