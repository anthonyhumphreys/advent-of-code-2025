use std::collections::{HashMap, VecDeque};
use std::env;
use std::fs;
use std::path::PathBuf;

const DIRS: [(i32, i32); 8] = [
    (-1, -1),
    (-1, 0),
    (-1, 1),
    (0, -1),
    (0, 1),
    (1, -1),
    (1, 0),
    (1, 1),
];

fn main() {
    let input_path = env::args()
        .nth(1)
        .map(PathBuf::from)
        .unwrap_or_else(default_input_path);

    let content = fs::read_to_string(&input_path).expect("failed to read input file");
    let grid: Vec<Vec<char>> = content
        .lines()
        .map(str::trim)
        .filter(|line| !line.is_empty())
        .map(|line| line.chars().collect())
        .collect();

    let adjacency = build_adjacency(&grid);
    let part1 = adjacency.iter().filter(|neighbors| neighbors.len() < 4).count();
    let part2 = simulate_removals(&adjacency);

    println!("{}", part1);
    println!("{}", part2);
}

fn default_input_path() -> PathBuf {
    let mut path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    path.pop(); // rust
    path.pop(); // gpt-5.1-codex
    path.pop(); // 04
    path.pop(); // ai-solutions
    path.push("inputs");
    path.push("04.txt");
    path
}

fn build_adjacency(grid: &[Vec<char>]) -> Vec<Vec<usize>> {
    let mut positions = Vec::new();
    let mut index = HashMap::new();

    for (r, row) in grid.iter().enumerate() {
        for (c, &ch) in row.iter().enumerate() {
            if ch == '@' {
                let idx = positions.len();
                positions.push((r as i32, c as i32));
                index.insert((r as i32, c as i32), idx);
            }
        }
    }

    let mut adjacency = vec![Vec::new(); positions.len()];
    for (idx, &(r, c)) in positions.iter().enumerate() {
        for (dr, dc) in DIRS {
            let nr = r + dr;
            let nc = c + dc;
            if let Some(&neighbor) = index.get(&(nr, nc)) {
                adjacency[idx].push(neighbor);
            }
        }
    }

    adjacency
}

fn simulate_removals(adjacency: &[Vec<usize>]) -> usize {
    let mut degrees: Vec<i32> = adjacency.iter().map(|neighbors| neighbors.len() as i32).collect();
    let mut removed = vec![false; adjacency.len()];
    let mut queue: VecDeque<usize> = VecDeque::new();

    for (idx, &deg) in degrees.iter().enumerate() {
        if deg < 4 {
            queue.push_back(idx);
        }
    }

    let mut removed_count = 0usize;
    while let Some(node) = queue.pop_front() {
        if removed[node] {
            continue;
        }
        removed[node] = true;
        removed_count += 1;

        for &neighbor in &adjacency[node] {
            if removed[neighbor] {
                continue;
            }
            degrees[neighbor] -= 1;
            if degrees[neighbor] < 4 {
                queue.push_back(neighbor);
            }
        }
    }

    removed_count
}

