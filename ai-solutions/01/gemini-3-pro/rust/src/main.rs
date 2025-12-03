use std::env;
use std::fs;
use std::process;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: {} <input_file>", args[0]);
        process::exit(1);
    }

    let input_file = &args[1];
    let content = match fs::read_to_string(input_file) {
        Ok(c) => c,
        Err(e) => {
            eprintln!("Error reading file '{}': {}", input_file, e);
            process::exit(1);
        }
    };

    let mut pos = 50;
    let mut p1_count = 0;
    let mut p2_count = 0;

    for line in content.lines() {
        if line.trim().is_empty() {
            continue;
        }

        let direction = line.chars().next().unwrap();
        let amount: i32 = line[1..].parse().unwrap();

        for _ in 0..amount {
            if direction == 'R' {
                pos = (pos + 1) % 100;
            } else {
                pos = (pos - 1 + 100) % 100;
            }

            if pos == 0 {
                p2_count += 1;
            }
        }

        if pos == 0 {
            p1_count += 1;
        }
    }

    println!("{}", p1_count);
    println!("{}", p2_count);
}

