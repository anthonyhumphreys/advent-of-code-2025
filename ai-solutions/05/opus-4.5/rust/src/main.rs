use std::fs;
use std::path::Path;

fn solve(input: &str) -> (usize, u64) {
    let sections: Vec<&str> = input.trim().split("\n\n").collect();
    let range_lines: Vec<&str> = sections[0].lines().collect();
    let ingredient_lines: Vec<&str> = sections[1].lines().collect();

    // Parse ranges
    let ranges: Vec<(u64, u64)> = range_lines
        .iter()
        .map(|line| {
            let parts: Vec<u64> = line.split('-').map(|s| s.parse().unwrap()).collect();
            (parts[0], parts[1])
        })
        .collect();

    // Parse available ingredient IDs
    let ingredients: Vec<u64> = ingredient_lines
        .iter()
        .map(|line| line.parse().unwrap())
        .collect();

    // Part 1: Count how many ingredients fall within any range
    let part1 = ingredients
        .iter()
        .filter(|&id| ranges.iter().any(|(start, end)| *id >= *start && *id <= *end))
        .count();

    // Part 2: Merge overlapping ranges and count total fresh IDs
    // Sort ranges by start value
    let mut sorted_ranges = ranges.clone();
    sorted_ranges.sort_by_key(|r| r.0);

    // Merge overlapping ranges
    let mut merged_ranges: Vec<(u64, u64)> = Vec::new();
    for (start, end) in sorted_ranges {
        if merged_ranges.is_empty() {
            merged_ranges.push((start, end));
        } else {
            let last = merged_ranges.last_mut().unwrap();
            // Check if ranges overlap or are adjacent
            if start <= last.1 + 1 {
                // Merge by extending the end if necessary
                last.1 = last.1.max(end);
            } else {
                merged_ranges.push((start, end));
            }
        }
    }

    // Count total IDs in merged ranges
    let part2: u64 = merged_ranges.iter().map(|(start, end)| end - start + 1).sum();

    (part1, part2)
}

fn main() {
    let input_path = Path::new(file!())
        .parent()
        .unwrap()
        .join("../../../../../inputs/05.txt");
    
    let input = fs::read_to_string(&input_path)
        .unwrap_or_else(|_| fs::read_to_string("inputs/05.txt").expect("Failed to read input"));

    let (part1, part2) = solve(&input);
    println!("{}", part1);
    println!("{}", part2);
}

