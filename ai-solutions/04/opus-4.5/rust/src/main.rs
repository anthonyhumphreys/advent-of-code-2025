use std::fs;
use std::path::PathBuf;

// 8 directions: N, NE, E, SE, S, SW, W, NW
const DIRECTIONS: [(i32, i32); 8] = [
    (-1, 0), (-1, 1), (0, 1), (1, 1),
    (1, 0), (1, -1), (0, -1), (-1, -1)
];

fn count_adjacent_rolls(grid: &[Vec<char>], row: usize, col: usize) -> usize {
    let rows = grid.len() as i32;
    let cols = grid[0].len() as i32;
    let mut count = 0;
    
    for (dr, dc) in DIRECTIONS.iter() {
        let nr = row as i32 + dr;
        let nc = col as i32 + dc;
        
        if nr >= 0 && nr < rows && nc >= 0 && nc < cols {
            if grid[nr as usize][nc as usize] == '@' {
                count += 1;
            }
        }
    }
    count
}

fn find_accessible_rolls(grid: &[Vec<char>]) -> Vec<(usize, usize)> {
    let mut accessible = Vec::new();
    
    for (r, row) in grid.iter().enumerate() {
        for (c, &cell) in row.iter().enumerate() {
            if cell == '@' && count_adjacent_rolls(grid, r, c) < 4 {
                accessible.push((r, c));
            }
        }
    }
    accessible
}

fn main() {
    // Build path to input file
    let mut input_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    input_path.push("../../../../inputs/04.txt");
    
    let input = fs::read_to_string(&input_path)
        .expect("Failed to read input file");
    
    // Parse grid
    let grid: Vec<Vec<char>> = input
        .lines()
        .filter(|line| !line.is_empty())
        .map(|line| line.chars().collect())
        .collect();
    
    // Part 1: Count initially accessible rolls
    let part1 = find_accessible_rolls(&grid).len();
    
    // Part 2: Keep removing accessible rolls until none remain
    let mut working_grid = grid.clone();
    let mut total_removed = 0;
    
    loop {
        let accessible = find_accessible_rolls(&working_grid);
        if accessible.is_empty() {
            break;
        }
        
        // Remove all accessible rolls
        for (r, c) in &accessible {
            working_grid[*r][*c] = '.';
        }
        total_removed += accessible.len();
    }
    
    println!("{}", part1);
    println!("{}", total_removed);
}

