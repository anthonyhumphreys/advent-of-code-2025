use std::fs;

fn find_max_k_digits(line: &str, k: usize) -> u64 {
    let digits: Vec<u8> = line
        .chars()
        .map(|c| c.to_digit(10).unwrap() as u8)
        .collect();
    
    let n = digits.len();
    let mut result = Vec::new();
    
    // Greedy: for each position, pick the largest digit available
    // while ensuring we have enough digits left for remaining positions
    let mut start_idx = 0;
    for pos in 0..k {
        // We can pick from [start_idx, n - (k - pos - 1)]
        let end_idx = n - (k - pos - 1);
        let mut max_digit = 0;
        let mut max_idx = 0;
        
        for i in start_idx..end_idx {
            if digits[i] > max_digit {
                max_digit = digits[i];
                max_idx = i;
            }
        }
        
        result.push(max_digit);
        start_idx = max_idx + 1;
    }
    
    result
        .iter()
        .fold(0u64, |acc, &d| acc * 10 + d as u64)
}

fn main() {
    let input_file = std::env::args().nth(1).unwrap_or_else(|| "inputs/03.txt".to_string());
    let input = fs::read_to_string(&input_file).expect("Failed to read input file");
    let lines: Vec<&str> = input.trim().lines().collect();
    
    let mut part1_sum: u64 = 0;
    let mut part2_sum: u64 = 0;
    
    for line in lines {
        // Part 1: Find max 2-digit number
        let max_2_digit = find_max_k_digits(line, 2);
        part1_sum += max_2_digit;
        
        // Part 2: Find max 12-digit number
        let max_12_digit = find_max_k_digits(line, 12);
        part2_sum += max_12_digit;
    }
    
    println!("{}", part1_sum);
    println!("{}", part2_sum);
}
