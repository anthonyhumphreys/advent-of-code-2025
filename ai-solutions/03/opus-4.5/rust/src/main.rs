use std::env;
use std::fs;
use std::process;

fn max_subsequence_value(digits: &str, keep: usize) -> u128 {
    let bytes = digits.as_bytes();
    let n = bytes.len();
    let mut stack: Vec<u8> = Vec::with_capacity(keep);

    for (idx, &b) in bytes.iter().enumerate() {
        let remaining = n - idx - 1;
        while !stack.is_empty()
            && stack.len() + remaining >= keep
            && stack.last().copied().unwrap() < b
        {
            stack.pop();
        }
        if stack.len() < keep {
            stack.push(b);
        }
    }

    let value_str: String = stack.into_iter().map(|b| b as char).collect();
    value_str.parse::<u128>().unwrap()
}

fn solve(input: &str) -> (u128, u128) {
    let mut part1: u128 = 0;
    let mut part2: u128 = 0;

    for line in input.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }
        part1 += max_subsequence_value(trimmed, 2);
        part2 += max_subsequence_value(trimmed, 12);
    }

    (part1, part2)
}

fn main() {
    let mut args = env::args().skip(1);
    let Some(input_path) = args.next() else {
        eprintln!("Usage: cargo run -- <input_file>");
        process::exit(1);
    };

    let contents = fs::read_to_string(&input_path).unwrap_or_else(|err| {
        eprintln!("Failed to read input file {input_path}: {err}");
        process::exit(1);
    });

    let (part1, part2) = solve(&contents);
    println!("{part1}");
    println!("{part2}");
}
