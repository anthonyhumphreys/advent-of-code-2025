use std::fs;

fn main() {
    let input = fs::read_to_string("../../../../inputs/01.txt")
        .expect("Failed to read input file");
    
    let mut position = 50;
    let mut part1_count = 0;
    let mut part2_count = 0;
    
    for line in input.trim().lines() {
        let direction = line.chars().next().unwrap();
        let distance: i32 = line[1..].parse().unwrap();
        
        if direction == 'R' {
            // Count zeros passed during rotation (Part 2)
            let zeros_during = (position + distance) / 100;
            part2_count += zeros_during;
            
            // Update position
            position = (position + distance) % 100;
        } else { // direction == 'L'
            // Count zeros passed during rotation (Part 2)
            let zeros_during = (distance / 100) + 
                              if distance >= position && position > 0 { 1 } else { 0 };
            part2_count += zeros_during;
            
            // Update position
            position = ((position - distance) % 100 + 100) % 100;
        }
        
        // Check if we ended at 0 (Part 1 only; Part 2 already counted it)
        if position == 0 {
            part1_count += 1;
        }
    }
    
    println!("{}", part1_count);
    println!("{}", part2_count);
}

