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
    let input = fs::read_to_string("../../../inputs/01.txt")
        .expect("Failed to read input file")
        .trim()
        .to_string();
        
    let mut dial = 50;
    let mut part1_counter = 0;
    let mut part2_counter = 0;

    for line in input.lines() {
        if line.is_empty() {
            continue;
        }
        
        let direction = line.chars().next().unwrap();
        let steps: i32 = line[1..].parse().unwrap();
        let signed_steps = if direction == 'R' { steps } else { -steps };

        part2_counter += count_clicks_on_zero(dial, signed_steps);

        dial = (dial + signed_steps) % 100;
        dial = (dial + 100) % 100;

        if dial == 0 {
            part1_counter += 1;
        }
    }

    println!("{}", part1_counter);
    println!("{}", part2_counter);
}
