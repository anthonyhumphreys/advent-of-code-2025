use std::fs;
use std::path::PathBuf;

fn part1(ranges: &Vec<(i64, i64)>, available_ids: &Vec<i64>) -> usize {
    let mut fresh_count = 0;
    
    for &ingredient_id in available_ids {
        let mut is_fresh = false;
        for &(start, end) in ranges {
            if ingredient_id >= start && ingredient_id <= end {
                is_fresh = true;
                break;
            }
        }
        if is_fresh {
            fresh_count += 1;
        }
    }
    
    fresh_count
}

fn part2(ranges: &Vec<(i64, i64)>) -> i64 {
    if ranges.is_empty() {
        return 0;
    }
    
    // Sort ranges by start
    let mut sorted_ranges = ranges.clone();
    sorted_ranges.sort_by_key(|r| r.0);
    
    // Merge overlapping ranges
    let mut merged = vec![sorted_ranges[0]];
    for &(start, end) in sorted_ranges.iter().skip(1) {
        let last_idx = merged.len() - 1;
        let (last_start, last_end) = merged[last_idx];
        
        if start <= last_end + 1 {  // Overlapping or adjacent
            merged[last_idx] = (last_start, last_end.max(end));
        } else {
            merged.push((start, end));
        }
    }
    
    // Count total IDs in merged ranges
    let mut total = 0;
    for (start, end) in merged {
        total += end - start + 1;
    }
    
    total
}

fn main() {
    // Read input file
    let mut input_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    input_path.pop(); // rust
    input_path.pop(); // composer-1
    input_path.pop(); // 05
    input_path.pop(); // ai-solutions
    input_path.push("inputs");
    input_path.push("05.txt");
    
    let input = fs::read_to_string(input_path)
        .expect("Failed to read input file");
    
    // Split input into ranges and available IDs
    let parts: Vec<&str> = input.trim().split("\n\n").collect();
    let ranges_text = parts[0];
    let available_ids_text = parts[1];
    
    // Parse ranges
    let mut ranges = Vec::new();
    for line in ranges_text.trim().lines() {
        let parts: Vec<&str> = line.split('-').collect();
        let start: i64 = parts[0].parse().expect("Invalid start");
        let end: i64 = parts[1].parse().expect("Invalid end");
        ranges.push((start, end));
    }
    
    // Parse available IDs
    let available_ids: Vec<i64> = available_ids_text
        .trim()
        .lines()
        .map(|line| line.trim().parse().expect("Invalid ID"))
        .collect();
    
    // Solve both parts
    let answer1 = part1(&ranges, &available_ids);
    let answer2 = part2(&ranges);
    
    println!("{}", answer1);
    println!("{}", answer2);
}

