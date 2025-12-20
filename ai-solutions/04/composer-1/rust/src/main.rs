use std::fs;

const DIRECTIONS: [(i32, i32); 8] = [
    (-1, -1), (-1, 0), (-1, 1),
    (0, -1),           (0, 1),
    (1, -1),  (1, 0),  (1, 1),
];

fn count_adjacent_rolls(grid: &Vec<Vec<char>>, r: usize, c: usize) -> usize {
    let rows = grid.len();
    let cols = grid[0].len();
    let mut count = 0;
    
    for (dr, dc) in DIRECTIONS.iter() {
        let nr = r as i32 + dr;
        let nc = c as i32 + dc;
        if nr >= 0 && nr < rows as i32 && nc >= 0 && nc < cols as i32 {
            if grid[nr as usize][nc as usize] == '@' {
                count += 1;
            }
        }
    }
    count
}

fn main() {
    let input = fs::read_to_string(std::env::args().nth(1).unwrap())
        .unwrap()
        .trim()
        .to_string();
    
    let grid: Vec<Vec<char>> = input
        .lines()
        .map(|line| line.chars().collect())
        .collect();
    
    let rows = grid.len();
    let cols = grid[0].len();
    
    // Part 1: Count accessible rolls
    let mut part1 = 0;
    for r in 0..rows {
        for c in 0..cols {
            if grid[r][c] == '@' && count_adjacent_rolls(&grid, r, c) < 4 {
                part1 += 1;
            }
        }
    }
    
    // Part 2: Iteratively remove accessible rolls
    let mut grid2 = grid.clone();
    let mut total_removed = 0;
    
    loop {
        let mut to_remove = Vec::new();
        for r in 0..rows {
            for c in 0..cols {
                if grid2[r][c] == '@' {
                    let mut adjacent_count = 0;
                    for (dr, dc) in DIRECTIONS.iter() {
                        let nr = r as i32 + dr;
                        let nc = c as i32 + dc;
                        if nr >= 0 && nr < rows as i32 && nc >= 0 && nc < cols as i32 {
                            if grid2[nr as usize][nc as usize] == '@' {
                                adjacent_count += 1;
                            }
                        }
                    }
                    if adjacent_count < 4 {
                        to_remove.push((r, c));
                    }
                }
            }
        }
        
        if to_remove.is_empty() {
            break;
        }
        
        for (r, c) in to_remove.iter() {
            grid2[*r][*c] = '.';
        }
        total_removed += to_remove.len();
    }
    
    println!("{}", part1);
    println!("{}", total_removed);
}

