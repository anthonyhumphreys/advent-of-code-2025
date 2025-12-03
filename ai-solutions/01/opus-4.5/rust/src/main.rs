//! Advent of Code 2025 - Day 1: Secret Entrance
//! Solution by Claude Opus 4.5

use std::env;
use std::fs;

/// Count how many times the dial points at 0 during a rotation.
/// This includes the final position if it's 0.
fn count_zeros_during_rotation(position: i64, distance: i64, direction: char) -> i64 {
    if direction == 'L' {
        // Left rotation: going toward lower numbers
        if position == 0 {
            // Starting at 0, we only hit 0 again after full rotations
            distance / 100
        } else {
            // We hit 0 when (position - k) mod 100 = 0, i.e., k = position, position+100, ...
            if position <= distance {
                (distance - position) / 100 + 1
            } else {
                0
            }
        }
    } else {
        // Right rotation: going toward higher numbers
        if position == 0 {
            // Starting at 0, we hit 0 again after full rotations
            distance / 100
        } else {
            // We hit 0 when (position + k) mod 100 = 0, i.e., k = 100-position, 200-position, ...
            let threshold = 100 - position;
            if threshold <= distance {
                (distance + position - 100) / 100 + 1
            } else {
                0
            }
        }
    }
}

/// Solve both parts of the puzzle.
fn solve(input_file: &str) -> (i64, i64) {
    let content = fs::read_to_string(input_file).expect("Failed to read input file");
    
    let mut position: i64 = 50;
    let mut part1_count: i64 = 0;
    let mut part2_count: i64 = 0;
    
    for line in content.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }
        
        let direction = trimmed.chars().next().unwrap();
        let distance: i64 = trimmed[1..].parse().expect("Failed to parse distance");
        
        // Count zeros for part 2 (all clicks that land on 0)
        let zeros = count_zeros_during_rotation(position, distance, direction);
        part2_count += zeros;
        
        // Update position
        if direction == 'L' {
            position = ((position - distance) % 100 + 100) % 100;
        } else {
            position = (position + distance) % 100;
        }
        
        // Part 1: count if dial ends at 0
        if position == 0 {
            part1_count += 1;
        }
    }
    
    (part1_count, part2_count)
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: {} <input_file>", args[0]);
        std::process::exit(1);
    }
    
    let input_file = &args[1];
    let (part1, part2) = solve(input_file);
    println!("{}", part1);
    println!("{}", part2);
}

