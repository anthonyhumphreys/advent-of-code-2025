use std::env;
use std::fs;
use std::path::Path;

fn read_input() -> String {
    if let Some(path) = env::args().nth(1) {
        return fs::read_to_string(path).expect("failed to read input");
    }

    let fallback = Path::new(env!("CARGO_MANIFEST_DIR")).join("../../../../inputs/06.txt");
    fs::read_to_string(fallback).expect("failed to read fallback input")
}

fn normalize_lines(raw: &str) -> Vec<String> {
    let mut lines: Vec<String> = raw
        .split('\n')
        .map(|line| line.strip_suffix('\r').unwrap_or(line).to_string())
        .collect();

    if matches!(lines.last(), Some(last) if last.is_empty()) {
        lines.pop();
    }

    lines
}

fn solve_part1(raw: &str) -> i64 {
    let lines = normalize_lines(raw);
    if lines.is_empty() {
        return 0;
    }

    let rows: Vec<Vec<String>> = lines
        .iter()
        .map(|line| line.trim().split_whitespace().map(|chunk| chunk.to_string()).collect())
        .collect();

    if rows.is_empty() {
        return 0;
    }

    let operators = rows.last().unwrap();
    let number_rows: Vec<Vec<i64>> = rows[..rows.len() - 1]
        .iter()
        .map(|row| row.iter().map(|value| value.parse::<i64>().unwrap()).collect())
        .collect();

    let mut total = 0i64;

    for (col, op) in operators.iter().enumerate() {
        let mut values: Vec<i64> = Vec::new();
        for row in &number_rows {
            if let Some(value) = row.get(col) {
                values.push(*value);
            }
        }

        if values.is_empty() {
            continue;
        }

        let result = match op.as_str() {
            "+" => values.iter().copied().sum::<i64>(),
            "*" => values.iter().copied().product::<i64>(),
            _ => continue,
        };

        total += result;
    }

    total
}

fn flush_problem(total: &mut i64, numbers: &mut Vec<i64>, op: &mut Option<char>) {
    if numbers.is_empty() {
        return;
    }

    let symbol = match op {
        Some(c) => *c,
        None => return,
    };

    let value: i64 = match symbol {
        '+' => numbers.iter().copied().sum::<i64>(),
        '*' => numbers.iter().copied().product::<i64>(),
        _ => return,
    };

    *total += value;
    numbers.clear();
    *op = None;
}

fn solve_part2(raw: &str) -> i64 {
    let lines = normalize_lines(raw);
    if lines.is_empty() {
        return 0;
    }

    let operator_row = lines.last().unwrap();
    let digit_rows = &lines[..lines.len() - 1];

    let width = digit_rows
        .iter()
        .map(|row| row.len())
        .fold(operator_row.len(), |acc, len| acc.max(len));
    let height = digit_rows.len();

    let mut total = 0i64;
    let mut current_numbers: Vec<i64> = Vec::new();
    let mut current_op: Option<char> = None;

    for col in (0..width).rev() {
        let mut digits: Vec<char> = Vec::new();

        for row in 0..height {
            let line = &digit_rows[row];
            if col < line.len() {
                let ch = line.as_bytes()[col] as char;
                if ch != ' ' {
                    digits.push(ch);
                }
            }
        }

        let op = if col < operator_row.len() {
            operator_row.as_bytes()[col] as char
        } else {
            ' '
        };

        let is_blank = digits.is_empty() && op == ' ';

        if is_blank {
            flush_problem(&mut total, &mut current_numbers, &mut current_op);
            continue;
        }

        if op == '+' || op == '*' {
            current_op = Some(op);
        }

        if !digits.is_empty() {
            let number: i64 = digits.iter().collect::<String>().parse().unwrap();
            current_numbers.push(number);
        }
    }

    flush_problem(&mut total, &mut current_numbers, &mut current_op);
    total
}

fn main() {
    let input = read_input();
    let part1 = solve_part1(&input);
    let part2 = solve_part2(&input);

    println!("{}", part1);
    println!("{}", part2);
}

