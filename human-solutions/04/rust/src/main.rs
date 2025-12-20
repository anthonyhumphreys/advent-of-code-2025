use std::fs;

fn main() {
    let input = fs::read_to_string("../../../inputs/04.txt").unwrap();
    let grid: Vec<Vec<char>> = input
        .trim()
        .lines()
        .map(|line| line.chars().collect())
        .collect();

    let accessible_count = find_accessible_rolls(&grid);
    println!("{}", accessible_count);

    let total_removable = count_total_removable(&grid);
    println!("{}", total_removable);
}

fn find_accessible_rolls(grid: &Vec<Vec<char>>) -> usize {
    let row_count = grid.len();
    let col_count = grid[0].len();

    let neighbour_offsets = [
        (-1, -1), (-1, 0), (-1, 1),
        (0, -1),           (0, 1),
        (1, -1),  (1, 0),  (1, 1),
    ];

    let mut accessible_count = 0;

    for row in 0..row_count {
        for col in 0..col_count {
            if grid[row][col] != '@' {
                continue;
            }

            let mut neighbour_rolls = 0;

            for (dr, dc) in neighbour_offsets {
                let nr = row as isize + dr;
                let nc = col as isize + dc;

                if nr >= 0 && nr < row_count as isize && nc >= 0 && nc < col_count as isize {
                    if grid[nr as usize][nc as usize] == '@' {
                        neighbour_rolls += 1;
                    }
                }
            }

            if neighbour_rolls < 4 {
                accessible_count += 1;
            }
        }
    }

    accessible_count
}

fn count_total_removable(grid: &Vec<Vec<char>>) -> usize {
    let row_count = grid.len();
    let col_count = grid[0].len();

    let mut warehouse = grid.clone();

    let neighbour_offsets = [
        (-1, -1), (-1, 0), (-1, 1),
        (0, -1),           (0, 1),
        (1, -1),  (1, 0),  (1, 1),
    ];

    let mut total_removed = 0;

    loop {
        let mut to_remove = Vec::new();

        for row in 0..row_count {
            for col in 0..col_count {
                if warehouse[row][col] != '@' {
                    continue;
                }

                let mut neighbour_rolls = 0;

                for (dr, dc) in neighbour_offsets {
                    let nr = row as isize + dr;
                    let nc = col as isize + dc;

                    if nr >= 0 && nr < row_count as isize && nc >= 0 && nc < col_count as isize {
                        if warehouse[nr as usize][nc as usize] == '@' {
                            neighbour_rolls += 1;
                        }
                    }
                }

                if neighbour_rolls < 4 {
                    to_remove.push((row, col));
                }
            }
        }

        if to_remove.is_empty() {
            break;
        }

        for (row, col) in &to_remove {
            warehouse[*row][*col] = 'x';
        }

        total_removed += to_remove.len();
    }

    total_removed
}
