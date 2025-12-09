use std::fs;

fn is_repeated_twice(num: u64) -> bool {
    let s = num.to_string();
    let len = s.len();
    
    // Must be even length and no leading zeros
    if len % 2 != 0 || s.starts_with('0') {
        return false;
    }
    
    let half = len / 2;
    &s[..half] == &s[half..]
}

fn is_repeated_at_least_twice(num: u64) -> bool {
    let s = num.to_string();
    let len = s.len();
    
    // No leading zeros
    if s.starts_with('0') {
        return false;
    }
    
    // Try all possible pattern lengths
    for pattern_len in 1..=len / 2 {
        if len % pattern_len == 0 {
            let pattern = &s[..pattern_len];
            let repetitions = len / pattern_len;
            
            if repetitions >= 2 {
                let repeated = pattern.repeat(repetitions);
                if repeated == s {
                    return true;
                }
            }
        }
    }
    
    false
}

fn solve(input: &str) -> (u64, u64) {
    let ranges: Vec<(u64, u64)> = input
        .trim()
        .split(',')
        .map(|range| {
            let parts: Vec<&str> = range.split('-').collect();
            let start = parts[0].parse::<u64>().unwrap();
            let end = parts[1].parse::<u64>().unwrap();
            (start, end)
        })
        .collect();
    
    let mut sum_part1 = 0u64;
    let mut sum_part2 = 0u64;
    
    for (start, end) in ranges {
        for num in start..=end {
            if is_repeated_twice(num) {
                sum_part1 += num;
            }
            if is_repeated_at_least_twice(num) {
                sum_part2 += num;
            }
        }
    }
    
    (sum_part1, sum_part2)
}

fn main() {
    let input = fs::read_to_string("../../../../inputs/02.txt")
        .expect("Failed to read input file");
    
    let (part1, part2) = solve(&input);
    println!("{}", part1);
    println!("{}", part2);
}
