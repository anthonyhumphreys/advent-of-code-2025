use std::env;
use std::fs;
use std::path::PathBuf;

fn main() {
    let args: Vec<String> = env::args().collect();
    
    // Default path logic is a bit tricky with compiled binaries.
    // We'll try to resolve relative to the current working directory if no arg is provided.
    // Assuming running from ai-solutions/04/gemini-3-pro/rust via 'cargo run'
    let default_path = PathBuf::from("../../../../inputs/04.txt");
    
    let input_path = if args.len() > 1 {
        PathBuf::from(&args[1])
    } else {
        default_path
    };

    let contents = fs::read_to_string(&input_path).expect(&format!("Something went wrong reading the file at {:?}", input_path));
    let grid: Vec<Vec<char>> = contents
        .lines()
        .filter(|line| !line.trim().is_empty())
        .map(|line| line.trim().chars().collect())
        .collect();

    let rows = grid.len();
    if rows == 0 {
        return;
    }
    let cols = grid[0].len();

    // Part 1
    let mut p1_count = 0;
    for r in 0..rows {
        for c in 0..cols {
            if grid[r][c] == '@' {
                if count_neighbors(&grid, r, c) < 4 {
                    p1_count += 1;
                }
            }
        }
    }
    println!("{}", p1_count);

    // Part 2
    let mut current_grid = grid.clone();
    let mut total_removed = 0;

    loop {
        let mut to_remove = Vec::new();
        for r in 0..rows {
            for c in 0..cols {
                if current_grid[r][c] == '@' {
                    if count_neighbors(&current_grid, r, c) < 4 {
                        to_remove.push((r, c));
                    }
                }
            }
        }

        if to_remove.is_empty() {
            break;
        }

        total_removed += to_remove.len();
        for (r, c) in to_remove {
            current_grid[r][c] = '.';
        }
    }
    println!("{}", total_removed);
}

fn count_neighbors(grid: &Vec<Vec<char>>, r: usize, c: usize) -> usize {
    let rows = grid.len() as isize;
    let cols = grid[0].len() as isize;
    let mut count = 0;

    for dr in -1..=1 {
        for dc in -1..=1 {
            if dr == 0 && dc == 0 {
                continue;
            }
            let nr = r as isize + dr;
            let nc = c as isize + dc;

            if nr >= 0 && nr < rows && nc >= 0 && nc < cols {
                if grid[nr as usize][nc as usize] == '@' {
                    count += 1;
                }
            }
        }
    }
    count
}

