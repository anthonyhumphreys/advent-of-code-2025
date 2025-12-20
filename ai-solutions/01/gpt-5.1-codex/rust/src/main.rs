use std::env;
use std::fs;
use std::path::Path;

const MODULO: i64 = 100;

fn parse_moves(input: &str) -> Vec<(char, i64)> {
    input
        .lines()
        .filter_map(|line| {
            let trimmed = line.trim();
            if trimmed.is_empty() {
                return None;
            }
            let mut chars = trimmed.chars();
            let dir = chars.next().unwrap_or('R');
            let distance = chars.as_str().parse::<i64>().ok()?;
            Some((dir, distance))
        })
        .collect()
}

fn count_zero_hits(position: i64, distance: i64, direction: char) -> i64 {
    if distance <= 0 {
        return 0;
    }

    let mut first = if direction == 'R' {
        (MODULO - position).rem_euclid(MODULO)
    } else {
        position.rem_euclid(MODULO)
    };

    if first == 0 {
        first = MODULO;
    }

    if distance < first {
        0
    } else {
        1 + (distance - first) / MODULO
    }
}

fn solve(moves: &[(char, i64)]) -> (i64, i64) {
    let mut position = 50_i64;
    let mut part1 = 0_i64;
    let mut part2 = 0_i64;

    for &(direction, distance) in moves {
        part2 += count_zero_hits(position, distance, direction);

        if direction == 'R' {
            position = (position + distance).rem_euclid(MODULO);
        } else {
            position = (position - distance).rem_euclid(MODULO);
        }

        if position == 0 {
            part1 += 1;
        }
    }

    (part1, part2)
}

fn run() -> Result<(), String> {
    let mut args = env::args().skip(1);
    let input_path = args
        .next()
        .ok_or_else(|| "Usage: cargo run -- <input_file>".to_string())?;

    let absolute = Path::new(&input_path);
    if !absolute.exists() {
        return Err(format!("Input file not found: {}", absolute.display()));
    }

    let content = fs::read_to_string(absolute)
        .map_err(|err| format!("Failed to read {}: {}", absolute.display(), err))?;

    let moves = parse_moves(&content);
    let (part1, part2) = solve(&moves);
    println!("{}", part1);
    println!("{}", part2);
    Ok(())
}

fn main() {
    if let Err(err) = run() {
        eprintln!("{}", err);
        std::process::exit(1);
    }
}






