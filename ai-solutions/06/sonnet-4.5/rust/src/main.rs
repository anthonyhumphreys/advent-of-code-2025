use std::fs;

fn parse_worksheet(input: &str) -> Vec<String> {
    input.trim().lines().map(|s| s.to_string()).collect()
}

fn solve_part1(lines: &[String]) -> i64 {
    // Find columns that are not all spaces (these are problem columns)
    let num_cols = lines[0].len();
    let mut problem_cols = Vec::new();
    
    for col in 0..num_cols {
        let mut has_non_space = false;
        for line in lines {
            if col < line.len() && line.chars().nth(col).unwrap() != ' ' {
                has_non_space = true;
                break;
            }
        }
        if has_non_space {
            problem_cols.push(col);
        }
    }
    
    // Group consecutive columns into problems
    let mut problems: Vec<Vec<usize>> = Vec::new();
    let mut current_problem = Vec::new();
    
    for (i, &col) in problem_cols.iter().enumerate() {
        if current_problem.is_empty() || col == problem_cols[i-1] + 1 {
            current_problem.push(col);
        } else {
            problems.push(current_problem.clone());
            current_problem = vec![col];
        }
    }
    if !current_problem.is_empty() {
        problems.push(current_problem);
    }
    
    // Process each problem
    let mut grand_total = 0i64;
    
    for prob_cols in &problems {
        let mut numbers = Vec::new();
        let mut operator = None;
        
        // Read each row
        for line in lines {
            let mut num_str = String::new();
            for &col in prob_cols {
                if col < line.len() {
                    num_str.push(line.chars().nth(col).unwrap());
                }
            }
            let num_str = num_str.trim();
            
            if num_str == "+" || num_str == "*" {
                operator = Some(num_str.to_string());
            } else if !num_str.is_empty() {
                if let Ok(num) = num_str.parse::<i64>() {
                    numbers.push(num);
                }
            }
        }
        
        // Calculate result
        if let Some(op) = operator {
            if !numbers.is_empty() {
                let mut result = numbers[0];
                for &num in &numbers[1..] {
                    if op == "+" {
                        result += num;
                    } else {
                        result *= num;
                    }
                }
                grand_total += result;
            }
        }
    }
    
    grand_total
}

fn solve_part2(lines: &[String]) -> i64 {
    // Read problems right-to-left, building numbers from column digits
    let num_cols = lines[0].len();
    
    // Find columns that are not all spaces
    let mut problem_cols = Vec::new();
    for col in 0..num_cols {
        let mut has_non_space = false;
        for line in lines {
            if col < line.len() && line.chars().nth(col).unwrap() != ' ' {
                has_non_space = true;
                break;
            }
        }
        if has_non_space {
            problem_cols.push(col);
        }
    }
    
    // Group consecutive columns into problems
    let mut problems: Vec<Vec<usize>> = Vec::new();
    let mut current_problem = Vec::new();
    
    for (i, &col) in problem_cols.iter().enumerate() {
        if current_problem.is_empty() || col == problem_cols[i-1] + 1 {
            current_problem.push(col);
        } else {
            problems.push(current_problem.clone());
            current_problem = vec![col];
        }
    }
    if !current_problem.is_empty() {
        problems.push(current_problem);
    }
    
    let mut grand_total = 0i64;
    
    // Process each problem right-to-left
    for prob_cols in &problems {
        let mut numbers = Vec::new();
        let mut operator = None;
        
        // First, identify the operator (it's in the last row)
        let last_row = lines.len() - 1;
        for &col in prob_cols {
            if col < lines[last_row].len() {
                let ch = lines[last_row].chars().nth(col).unwrap();
                if ch == '+' || ch == '*' {
                    operator = Some(ch);
                    break;
                }
            }
        }
        
        // Process each column from right to left
        for &col in prob_cols.iter().rev() {
            let mut num_str = String::new();
            
            // Read column top to bottom (excluding the last row which has the operator)
            for row in 0..lines.len() - 1 {
                if col < lines[row].len() {
                    let ch = lines[row].chars().nth(col).unwrap();
                    if ch != ' ' {
                        num_str.push(ch);
                    }
                }
            }
            
            if !num_str.is_empty() {
                if let Ok(num) = num_str.parse::<i64>() {
                    numbers.push(num);
                }
            }
        }
        
        // Calculate result
        if let Some(op) = operator {
            if !numbers.is_empty() {
                let mut result = numbers[0];
                for &num in &numbers[1..] {
                    if op == '+' {
                        result += num;
                    } else {
                        result *= num;
                    }
                }
                grand_total += result;
            }
        }
    }
    
    grand_total
}

fn main() {
    let input = fs::read_to_string("../../../../inputs/06.txt")
        .expect("Failed to read input file");
    
    let lines = parse_worksheet(&input);
    
    let part1 = solve_part1(&lines);
    let part2 = solve_part2(&lines);
    
    println!("{}", part1);
    println!("{}", part2);
}
