use std::fs;

fn find_max_number(digits: &str, count: usize) -> u64 {
    let chars: Vec<char> = digits.chars().collect();
    let n = chars.len();
    
    if count > n {
        return 0;
    }
    
    // Greedy approach: select 'count' digits that form the largest number
    let mut result = String::new();
    let mut start = 0;
    
    for i in 0..count {
        // We need to pick 'count - i' more digits from the remaining string
        // So we can search up to index n - (count - i)
        let end = n - (count - i) + 1;
        
        // Find the maximum digit in the valid range
        let mut max_digit = chars[start];
        let mut max_pos = start;
        
        for j in start..end {
            if chars[j] > max_digit {
                max_digit = chars[j];
                max_pos = j;
            }
        }
        
        result.push(max_digit);
        start = max_pos + 1;
    }
    
    result.parse().unwrap()
}

fn solve(input: &str) {
    let lines: Vec<&str> = input.trim().split('\n').collect();
    
    let mut part1: u64 = 0;
    let mut part2: u64 = 0;
    
    for line in lines {
        let digits = line.trim();
        part1 += find_max_number(digits, 2);
        part2 += find_max_number(digits, 12);
    }
    
    println!("{}", part1);
    println!("{}", part2);
}

fn main() {
    let input = fs::read_to_string("../../../../inputs/03.txt")
        .expect("Failed to read input file");
    solve(&input);
}
