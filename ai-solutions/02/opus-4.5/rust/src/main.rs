use std::env;
use std::fs;

fn parse_input(filename: &str) -> Vec<(u64, u64)> {
    let content = fs::read_to_string(filename).expect("Failed to read input file");
    let mut ranges = Vec::new();
    
    for part in content.trim().split(',') {
        let trimmed = part.trim();
        if !trimmed.is_empty() {
            let parts: Vec<&str> = trimmed.split('-').collect();
            let start: u64 = parts[0].parse().expect("Invalid start number");
            let end: u64 = parts[1].parse().expect("Invalid end number");
            ranges.push((start, end));
        }
    }
    ranges
}

fn is_double_repeated(n: u64) -> bool {
    // Part 1: Check if number is a pattern repeated exactly twice
    let s = n.to_string();
    let length = s.len();
    
    if length % 2 != 0 {
        return false;
    }
    
    let half = length / 2;
    s[..half] == s[half..]
}

fn is_repeated_pattern(n: u64) -> bool {
    // Part 2: Check if number is a pattern repeated at least twice
    let s = n.to_string();
    let length = s.len();
    
    for pattern_len in 1..=(length / 2) {
        if length % pattern_len == 0 {
            let repetitions = length / pattern_len;
            if repetitions >= 2 {
                let pattern = &s[..pattern_len];
                let repeated: String = pattern.repeat(repetitions);
                if repeated == s {
                    return true;
                }
            }
        }
    }
    false
}

fn solve(ranges: &[(u64, u64)]) -> (u64, u64) {
    let mut part1_sum: u64 = 0;
    let mut part2_sum: u64 = 0;
    
    for &(start, end) in ranges {
        for num in start..=end {
            if is_double_repeated(num) {
                part1_sum += num;
            }
            if is_repeated_pattern(num) {
                part2_sum += num;
            }
        }
    }
    
    (part1_sum, part2_sum)
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let input_file = if args.len() > 1 {
        &args[1]
    } else {
        "inputs/02.txt"
    };
    let ranges = parse_input(input_file);
    let (part1, part2) = solve(&ranges);
    println!("{}", part1);
    println!("{}", part2);
}
