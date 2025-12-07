use std::fs;

fn main() {
    // Read input file
    let input = fs::read_to_string("../../../../inputs/02.txt")
        .expect("Failed to read input file")
        .trim()
        .to_string();

    // Parse ranges
    let ranges: Vec<(u64, u64)> = input
        .split(',')
        .map(|range_str| {
            let parts: Vec<&str> = range_str.split('-').collect();
            let start: u64 = parts[0].parse().unwrap();
            let end: u64 = parts[1].parse().unwrap();
            (start, end)
        })
        .collect();

    // Check if a number is invalid for part 1 (repeated exactly twice)
    fn is_invalid_part1(num: u64) -> bool {
        let str_num = num.to_string();
        let len = str_num.len();
        
        // Must be even length to be repeated twice
        if len % 2 != 0 {
            return false;
        }
        
        let half_len = len / 2;
        let first_half = &str_num[0..half_len];
        let second_half = &str_num[half_len..];
        
        first_half == second_half
    }

    // Check if a number is invalid for part 2 (repeated at least twice)
    fn is_invalid_part2(num: u64) -> bool {
        let str_num = num.to_string();
        let len = str_num.len();
        
        // Try all possible pattern lengths from 1 to len/2
        for pattern_len in 1..=len / 2 {
            if len % pattern_len != 0 {
                continue;
            }
            
            let repetitions = len / pattern_len;
            if repetitions < 2 {
                continue;
            }
            
            let pattern = &str_num[0..pattern_len];
            let mut is_valid_pattern = true;
            
            for i in 1..repetitions {
                let start_idx = i * pattern_len;
                let end_idx = (i + 1) * pattern_len;
                let segment = &str_num[start_idx..end_idx];
                
                if segment != pattern {
                    is_valid_pattern = false;
                    break;
                }
            }
            
            if is_valid_pattern {
                return true;
            }
        }
        
        false
    }

    // Find all invalid IDs in ranges
    fn find_invalid_ids<F>(ranges: &[(u64, u64)], is_invalid: F) -> u64
    where
        F: Fn(u64) -> bool,
    {
        let mut total_sum = 0;
        
        for &(start, end) in ranges {
            for num in start..=end {
                if is_invalid(num) {
                    total_sum += num;
                }
            }
        }
        
        total_sum
    }

    // Part 1
    let part1 = find_invalid_ids(&ranges, is_invalid_part1);

    // Part 2
    let part2 = find_invalid_ids(&ranges, is_invalid_part2);

    println!("{}", part1);
    println!("{}", part2);
}
