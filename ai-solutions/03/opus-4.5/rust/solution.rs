use std::fs;

fn max_joltage(bank: &str, k: usize) -> u128 {
    let chars: Vec<char> = bank.chars().collect();
    let n = chars.len();
    
    if k > n {
        return 0;
    }
    
    let mut result = String::new();
    let mut start_idx = 0;
    
    for i in 0..k {
        // For position i, we can pick from start_idx to (n - k + i) inclusive
        let end_idx = n - k + i;
        let mut max_digit = '0';
        let mut max_pos = start_idx;
        
        for j in start_idx..=end_idx {
            if chars[j] > max_digit {
                max_digit = chars[j];
                max_pos = j;
            }
        }
        
        result.push(max_digit);
        start_idx = max_pos + 1;
    }
    
    result.parse::<u128>().unwrap_or(0)
}

fn main() {
    let input = fs::read_to_string("inputs/03.txt").expect("Failed to read input file");
    let banks: Vec<&str> = input.trim().lines().collect();
    
    // Part 1: Select 2 batteries from each bank
    let part1: u128 = banks.iter().map(|bank| max_joltage(bank, 2)).sum();
    
    // Part 2: Select 12 batteries from each bank
    let part2: u128 = banks.iter().map(|bank| max_joltage(bank, 12)).sum();
    
    println!("{}", part1);
    println!("{}", part2);
}
