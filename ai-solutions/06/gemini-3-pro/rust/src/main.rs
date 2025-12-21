use num_bigint::BigInt;
use std::fs;
use std::path::Path;
use std::str::FromStr;

fn main() {
    let input_path = Path::new("../../../../inputs/06.txt");
    let content = fs::read_to_string(input_path).expect("Failed to read input file");
    
    let lines: Vec<&str> = content.lines().filter(|l| !l.is_empty()).collect();
    if lines.is_empty() {
        return;
    }

    let max_len = lines.iter().map(|l| l.chars().count()).max().unwrap_or(0);
    
    // Pad lines and convert to char grid
    let grid: Vec<Vec<char>> = lines
        .iter()
        .map(|l| {
            let mut chars: Vec<char> = l.chars().collect();
            while chars.len() < max_len {
                chars.push(' ');
            }
            chars
        })
        .collect();

    if grid.is_empty() {
        return;
    }

    // Find separator columns
    let mut separator_indices = vec![-1];
    for col in 0..max_len {
        let mut is_separator = true;
        for row in 0..grid.len() {
            if grid[row][col] != ' ' {
                is_separator = false;
                break;
            }
        }
        if is_separator {
            separator_indices.push(col as i32);
        }
    }
    separator_indices.push(max_len as i32);

    let mut total_part1 = BigInt::from(0);
    let mut total_part2 = BigInt::from(0);

    for i in 0..separator_indices.len() - 1 {
        let start_col = (separator_indices[i] + 1) as usize;
        let end_col = separator_indices[i+1] as usize;

        if start_col >= end_col {
            continue;
        }

        // Check operator
        let operator_row = &grid[grid.len() - 1];
        let op_slice: String = operator_row[start_col..end_col].iter().collect();
        let op_trim = op_slice.trim();

        if op_trim.is_empty() {
            continue;
        }

        let op = op_trim.chars().next().unwrap();

        // Part 1
        let mut numbers_p1: Vec<BigInt> = Vec::new();
        for row in 0..grid.len() - 1 {
            let line_slice: String = grid[row][start_col..end_col].iter().collect();
            let line_trim = line_slice.trim();
            if !line_trim.is_empty() {
                if let Ok(num) = BigInt::from_str(line_trim) {
                    numbers_p1.push(num);
                }
            }
        }

        if !numbers_p1.is_empty() {
            let mut val = numbers_p1[0].clone();
            if op == '+' {
                for k in 1..numbers_p1.len() {
                    val += &numbers_p1[k];
                }
            } else if op == '*' {
                for k in 1..numbers_p1.len() {
                    val *= &numbers_p1[k];
                }
            }
            total_part1 += val;
        }

        // Part 2
        let mut numbers_p2: Vec<BigInt> = Vec::new();
        // Right to left columns
        for c in (start_col..end_col).rev() {
            let mut num_str = String::new();
            for row in 0..grid.len() - 1 {
                let char = grid[row][c];
                if char != ' ' {
                    num_str.push(char);
                }
            }
            
            if !num_str.is_empty() {
                if let Ok(num) = BigInt::from_str(&num_str) {
                    numbers_p2.push(num);
                }
            }
        }

        if !numbers_p2.is_empty() {
            let mut val = numbers_p2[0].clone();
            if op == '+' {
                for k in 1..numbers_p2.len() {
                    val += &numbers_p2[k];
                }
            } else if op == '*' {
                for k in 1..numbers_p2.len() {
                    val *= &numbers_p2[k];
                }
            }
            total_part2 += val;
        }
    }

    println!("{}", total_part1);
    println!("{}", total_part2);
}

