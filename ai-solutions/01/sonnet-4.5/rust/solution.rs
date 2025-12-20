use std::fs;

fn count_clicks_on_zero(start: i32, signed_steps: i32) -> i32 {
    if signed_steps == 0 {
        return 0;
    }
    
    let start_norm = ((start % 100) + 100) % 100;
    
    if signed_steps > 0 {
        let num_clicks = signed_steps;
        let first_zero_click = if start_norm == 0 { 100 } else { 100 - start_norm };
        
        if first_zero_click > num_clicks {
            return 0;
        }
        
        return 1 + (num_clicks - first_zero_click) / 100;
    } else {
        let num_clicks = -signed_steps;
        let first_zero_click = if start_norm == 0 { 100 } else { start_norm };
        
        if first_zero_click > num_clicks {
            return 0;
        }
        
        return 1 + (num_clicks - first_zero_click) / 100;
    }
}

fn main() {
    let input = fs::read_to_string("../../../../inputs/01.txt")
        .expect("Failed to read input file");
    
    let mut position = 50;
    let mut part1_count = 0;
    let mut part2_count = 0;
    
    for line in input.trim().lines() {
        let direction = line.chars().next().unwrap();
        let distance: i32 = line[1..].parse().unwrap();
        let signed_steps = if direction == 'R' { distance } else { -distance };
        
        // Count zeros passed during rotation (Part 2)
        part2_count += count_clicks_on_zero(position, signed_steps);
        
        // Update position
        position = (position + signed_steps) % 100;
        position = (position + 100) % 100;
        
        // Check if we ended at 0 (Part 1)
        if position == 0 {
            part1_count += 1;
        }
    }
    
    println!("{}", part1_count);
    println!("{}", part2_count);
}

