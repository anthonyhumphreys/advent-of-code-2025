use std::fs;
fn solve_line(line: &str, k: usize) -> u64 {
    let digits: Vec<u8> = line.chars()
        .filter_map(|c| c.to_digit(10))
        .map(|d| d as u8)
        .collect();
    
    let n = digits.len();
    let mut result = Vec::new();
    let mut start = 0;
    
    for i in 0..k {
        let end = n - k + i + 1;
        
        let mut max_d = 0;
        let mut max_idx = start;
        
        // Find max digit in range [start, end)
        for j in start..end {
            if digits[j] > max_d {
                max_d = digits[j];
                max_idx = j;
            }
            if max_d == 9 {
                break;
            }
        }
        
        result.push(max_d);
        start = max_idx + 1;
    }
    
    // Convert digits to number
    let mut num: u64 = 0;
    for d in result {
        num = num * 10 + d as u64;
    }
    num
}

fn main() {
    // Determine input path relative to the crate root
    // When running with cargo run, CWD is usually the crate root (where Cargo.toml is)
    let input_path = "../../../../inputs/03.txt";
    
    let contents = match fs::read_to_string(input_path) {
        Ok(c) => c,
        Err(e) => {
            eprintln!("Error reading file at {}: {}", input_path, e);
            return;
        }
    };
    
    let mut total_p1: u64 = 0;
    let mut total_p2: u64 = 0;
    
    for line in contents.lines() {
        if line.trim().is_empty() {
            continue;
        }
        total_p1 += solve_line(line, 2);
        total_p2 += solve_line(line, 12);
    }
    
    println!("{}", total_p1);
    println!("{}", total_p2);
}
