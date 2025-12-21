use std::fs;

fn solve_part1(input: &str) -> i64 {
    let lines: Vec<&str> = input.lines().collect();
    let operator_line = lines[lines.len() - 1];
    let number_lines = &lines[..lines.len() - 1];

    // Split each line by whitespace to get the numbers
    let number_rows: Vec<Vec<i64>> = number_lines
        .iter()
        .map(|line| {
            line.split_whitespace()
                .map(|s| s.parse().unwrap())
                .collect()
        })
        .collect();

    let operators: Vec<&str> = operator_line.split_whitespace().collect();

    let mut total: i64 = 0;

    for (col, op) in operators.iter().enumerate() {
        let values: Vec<i64> = number_rows.iter().map(|row| row[col]).collect();

        let result: i64 = match *op {
            "+" => values.iter().sum(),
            "*" => values.iter().product(),
            _ => panic!("Unknown operator"),
        };

        total += result;
    }

    total
}

fn solve_part2(input: &str) -> i64 {
    let lines: Vec<&str> = input.lines().collect();
    let operator_row = lines[lines.len() - 1];
    let digit_rows = &lines[..lines.len() - 1];

    let height = digit_rows.len();
    let width = std::iter::once(operator_row.len())
        .chain(digit_rows.iter().map(|r| r.len()))
        .max()
        .unwrap();

    let mut total: i64 = 0;
    let mut current_numbers: Vec<i64> = Vec::new();
    let mut current_op: Option<char> = None;

    let flush_problem =
        |total: &mut i64, nums: &mut Vec<i64>, op: &mut Option<char>| {
            if nums.is_empty() || op.is_none() {
                return;
            }

            let value: i64 = match op.unwrap() {
                '+' => nums.iter().sum(),
                '*' => nums.iter().product(),
                _ => unreachable!(),
            };

            *total += value;
            nums.clear();
            *op = None;
        };

    // Process columns from right to left
    for col in (0..width).rev() {
        let mut digits: Vec<char> = Vec::new();

        // Collect digits from each row at this column
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

        // Check if this is a separator column (all spaces)
        let is_blank = digits.is_empty() && op == ' ';

        if is_blank {
            flush_problem(&mut total, &mut current_numbers, &mut current_op);
            continue;
        }

        // Record operator if present
        if op == '+' || op == '*' {
            current_op = Some(op);
        }

        // Build number from digits (top to bottom = most to least significant)
        if !digits.is_empty() {
            let number: i64 = digits.iter().collect::<String>().parse().unwrap();
            current_numbers.push(number);
        }
    }

    // Flush the last problem
    flush_problem(&mut total, &mut current_numbers, &mut current_op);

    total
}

fn main() {
    let input = fs::read_to_string("../../../../inputs/06.txt").unwrap();
    let input = input.trim_end();

    println!("{}", solve_part1(input));
    println!("{}", solve_part2(input));
}

