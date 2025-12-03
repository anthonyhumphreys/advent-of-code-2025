#!/usr/bin/env node
/**
 * Advent of Code 2025 - Day 1: Secret Entrance
 * Solution by Claude Opus 4.5
 */

const fs = require('fs');

/**
 * Count how many times the dial points at 0 during a rotation.
 * This includes the final position if it's 0.
 */
function countZerosDuringRotation(position, distance, direction) {
    if (direction === 'L') {
        // Left rotation: going toward lower numbers
        if (position === 0) {
            // Starting at 0, we only hit 0 again after full rotations
            return Math.floor(distance / 100);
        } else {
            // We hit 0 when (position - k) mod 100 = 0, i.e., k = position, position+100, ...
            if (position <= distance) {
                return Math.floor((distance - position) / 100) + 1;
            } else {
                return 0;
            }
        }
    } else {
        // Right rotation: going toward higher numbers
        if (position === 0) {
            // Starting at 0, we hit 0 again after full rotations
            return Math.floor(distance / 100);
        } else {
            // We hit 0 when (position + k) mod 100 = 0, i.e., k = 100-position, 200-position, ...
            const threshold = 100 - position;
            if (threshold <= distance) {
                return Math.floor((distance + position - 100) / 100) + 1;
            } else {
                return 0;
            }
        }
    }
}

/**
 * Solve both parts of the puzzle.
 */
function solve(inputFile) {
    const content = fs.readFileSync(inputFile, 'utf8');
    const lines = content.trim().split('\n');
    
    let position = 50;
    let part1Count = 0;
    let part2Count = 0;
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        const direction = trimmed[0];
        const distance = parseInt(trimmed.slice(1), 10);
        
        // Count zeros for part 2 (all clicks that land on 0)
        const zeros = countZerosDuringRotation(position, distance, direction);
        part2Count += zeros;
        
        // Update position
        if (direction === 'L') {
            position = ((position - distance) % 100 + 100) % 100;
        } else {
            position = (position + distance) % 100;
        }
        
        // Part 1: count if dial ends at 0
        if (position === 0) {
            part1Count++;
        }
    }
    
    return [part1Count, part2Count];
}

function main() {
    if (process.argv.length < 3) {
        console.error('Usage: node solution.js <input_file>');
        process.exit(1);
    }
    
    const inputFile = process.argv[2];
    const [part1, part2] = solve(inputFile);
    console.log(part1);
    console.log(part2);
}

main();

