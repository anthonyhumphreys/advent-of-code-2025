use std::fs;

fn solve_part1(input: &str) -> i64 {
    let rows: Vec<Vec<&str>> = input
        .lines()
        .map(|l| l.trim().split_whitespace().collect())
        .collect();

    let number_rows: Vec<Vec<i64>> = rows[..rows.len() - 1]
        .iter()
        .map(|row| row.iter().map(|v| v.parse().unwrap()).collect())
        .collect();

    let operators = &rows[rows.len() - 1];

    let mut total = 0;

    for col in 0..operators.len() {
        let mut values: Vec<i64> = Vec::new();
        for row in &number_rows {
            values.push(row[col]);
        }

        let mut result = values[0];
        for v in values.iter().skip(1) {
            match operators[col] {
                "+" => result += v,
                "*" => result *= v,
                _ => panic!("Unknown operator"),
            }
        }

        total += result;
    }

    total
}

fn solve_part2(input: &str) -> i64 {
    let mut lines: Vec<&str> = input.lines().collect();
    let operator_row = lines.pop().unwrap();
    let digit_rows = lines;

    let height = digit_rows.len();
    let width = std::iter::once(operator_row.len())
        .chain(digit_rows.iter().map(|r| r.len()))
        .max()
        .unwrap();

    let mut total: i64 = 0;
    let mut current_numbers: Vec<i64> = Vec::new();
    let mut current_op: Option<char> = None;

    let flush_problem = |total: &mut i64,
                             nums: &mut Vec<i64>,
                             op: &mut Option<char>| {
        if nums.is_empty() || op.is_none() {
            return;
        }

        let value: i64 = match op.unwrap() {
          '+' => nums.iter().sum::<i64>(),
          '*' => nums.iter().product::<i64>(),
          _ => unreachable!(),
        };

        *total += value;
        nums.clear();
        *op = None;
    };

    for col in (0..width).rev() {
        let mut digits: Vec<char> = Vec::new();

        for row in 0..height {
            if col < digit_rows[row].len() {
                let ch = digit_rows[row].as_bytes()[col] as char;
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
    let input = fs::read_to_string("../../../inputs/06.txt").unwrap();
    let input = input.trim_end();

    println!("{}", solve_part1(input));
    println!("{}", solve_part2(input));
}
