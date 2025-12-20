use std::fs;
use std::path::PathBuf;

fn count_neighbors(grid: &Vec<Vec<char>>, r: usize, c: usize) -> usize {
    let directions = [
        (-1, -1), (-1, 0), (-1, 1),
        (0, -1),           (0, 1),
        (1, -1),  (1, 0),  (1, 1),
    ];
    
    let rows = grid.len() as i32;
    let cols = grid[0].len() as i32;
    let mut count = 0;
    
    for (dr, dc) in directions.iter() {
        let nr = r as i32 + dr;
        let nc = c as i32 + dc;
        
        if nr >= 0 && nr < rows && nc >= 0 && nc < cols {
            if grid[nr as usize][nc as usize] == '@' {
                count += 1;
            }
        }
    }
    
    count
}

fn part1(grid: &Vec<Vec<char>>) -> usize {
    let mut accessible = 0;
    
    for r in 0..grid.len() {
        for c in 0..grid[0].len() {
            if grid[r][c] == '@' {
                if count_neighbors(grid, r, c) < 4 {
                    accessible += 1;
                }
            }
        }
    }
    
    accessible
}

fn part2(grid: &Vec<Vec<char>>) -> usize {
    // Create a mutable copy of the grid
    let mut mutable_grid: Vec<Vec<char>> = grid.iter()
        .map(|row| row.clone())
        .collect();
    
    let mut total_removed = 0;
    
    loop {
        // Find all accessible rolls
        let mut to_remove = Vec::new();
        
        for r in 0..mutable_grid.len() {
            for c in 0..mutable_grid[0].len() {
                if mutable_grid[r][c] == '@' {
                    if count_neighbors(&mutable_grid, r, c) < 4 {
                        to_remove.push((r, c));
                    }
                }
            }
        }
        
        // If no rolls can be removed, stop
        if to_remove.is_empty() {
            break;
        }
        
        // Remove all accessible rolls
        for (r, c) in &to_remove {
            mutable_grid[*r][*c] = '.';
        }
        
        total_removed += to_remove.len();
    }
    
    total_removed
}

fn main() {
    // Read input file
    let mut input_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    input_path.pop(); // rust
    input_path.pop(); // sonnet-4.5
    input_path.pop(); // 04
    input_path.pop(); // ai-solutions
    input_path.push("inputs");
    input_path.push("04.txt");
    
    let input = fs::read_to_string(input_path)
        .expect("Failed to read input file");
    
    // Parse the grid
    let grid: Vec<Vec<char>> = input
        .trim()
        .lines()
        .map(|line| line.chars().collect())
        .collect();
    
    // Solve both parts
    let answer1 = part1(&grid);
    let answer2 = part2(&grid);
    
    println!("{}", answer1);
    println!("{}", answer2);
}

