use std::env;
use std::fs;

fn max_subsequence_number(digits: &str, k: usize) -> u128 {
    let chars: Vec<char> = digits.trim().chars().collect();
    if k >= chars.len() {
        return digits.trim().parse::<u128>().unwrap_or(0);
    }

    let mut remove = chars.len() - k;
    let mut stack: Vec<char> = Vec::with_capacity(chars.len());

    for &ch in &chars {
        while remove > 0 && !stack.is_empty() && stack.last().unwrap() < &ch {
            stack.pop();
            remove -= 1;
        }
        stack.push(ch);
    }

    stack.truncate(k);
    let number_str: String = stack.into_iter().collect();
    number_str.parse::<u128>().unwrap_or(0)
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: cargo run -- <input_file>");
        std::process::exit(1);
    }

    let input_path = &args[1];
    let content = fs::read_to_string(input_path).expect("Failed to read input file");

    let mut part1: u128 = 0;
    let mut part2: u128 = 0;

    for line in content.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }
        part1 += max_subsequence_number(trimmed, 2);
        part2 += max_subsequence_number(trimmed, 12);
    }

    println!("{}", part1);
    println!("{}", part2);
}
