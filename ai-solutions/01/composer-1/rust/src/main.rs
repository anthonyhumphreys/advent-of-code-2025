use std::fs;
use std::env;

fn main() {
    let input_file = env::args().nth(1).unwrap_or_else(|| "inputs/01.txt".to_string());
    let input = fs::read_to_string(&input_file).expect("Failed to read input file");
    let rotations: Vec<&str> = input.lines().filter(|line| !line.is_empty()).collect();
    
    // Part 1: Count times dial points at 0 after completing a rotation
    let mut position: i32 = 50;
    let mut part1_count = 0;
    
    for rotation in &rotations {
        let direction = rotation.chars().next().unwrap();
        let distance: i32 = rotation[1..].parse().unwrap();
        
        if direction == 'R' {
            position = (position + distance) % 100;
        } else { // direction == 'L'
            position = ((position - distance) % 100 + 100) % 100;
        }
        
        if position == 0 {
            part1_count += 1;
        }
    }
    
    // Part 2: Count times dial points at 0 during any click
    let mut position: i32 = 50;
    let mut part2_count = 0;
    
    for rotation in &rotations {
        let direction = rotation.chars().next().unwrap();
        let distance: i32 = rotation[1..].parse().unwrap();
        
        let start_pos = position;
        
        if direction == 'R' {
            // Count how many times we pass through 0 during rotation
            for i in 1..=distance {
                if (start_pos + i) % 100 == 0 {
                    part2_count += 1;
                }
            }
            
            position = (position + distance) % 100;
        } else { // direction == 'L'
            // Count how many times we pass through 0 during rotation
            for i in 1..=distance {
                if ((start_pos - i) % 100 + 100) % 100 == 0 {
                    part2_count += 1;
                }
            }
            
            position = ((position - distance) % 100 + 100) % 100;
        }
    }
    
    println!("{}", part1_count);
    println!("{}", part2_count);
}

