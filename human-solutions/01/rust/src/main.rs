use std::fs;

fn main() {
    let input = fs::read_to_string("../../../inputs/01.txt")
        .expect("Failed to read input file")
        .trim()
        .to_string();
        
    let mut dial = 50;
    let mut counter = 0;

    for line in input.lines() {
        if line.is_empty() {
            continue;
        }
        
        let direction = line.chars().next().unwrap();
        let steps: i32 = line[1..].parse().unwrap();

        if direction == 'R' {
            dial += steps;
        } else if direction == 'L' {
            dial -= steps;
        }

        dial = (dial % 100 + 100) % 100;

        if dial == 0 {
            counter += 1;
        }
    }

    println!("{}", counter);
}
