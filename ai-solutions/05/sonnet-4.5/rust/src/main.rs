use std::fs;

#[derive(Debug, Clone, Copy)]
struct Range {
    start: i64,
    end: i64,
}

fn parse_input(input: &str) -> (Vec<Range>, Vec<i64>) {
    let sections: Vec<&str> = input.trim().split("\n\n").collect();
    
    let ranges: Vec<Range> = sections[0]
        .lines()
        .map(|line| {
            let parts: Vec<&str> = line.split('-').collect();
            Range {
                start: parts[0].parse().unwrap(),
                end: parts[1].parse().unwrap(),
            }
        })
        .collect();
    
    let ids: Vec<i64> = sections[1]
        .lines()
        .map(|line| line.parse().unwrap())
        .collect();
    
    (ranges, ids)
}

fn is_in_range(id: i64, ranges: &[Range]) -> bool {
    ranges.iter().any(|range| id >= range.start && id <= range.end)
}

fn part1(input: &str) -> usize {
    let (ranges, ids) = parse_input(input);
    ids.iter()
        .filter(|&&id| is_in_range(id, &ranges))
        .count()
}

fn part2(input: &str) -> i64 {
    let (ranges, _) = parse_input(input);
    
    // Sort ranges by start position
    let mut sorted_ranges = ranges.clone();
    sorted_ranges.sort_by_key(|r| r.start);
    
    // Merge overlapping ranges
    let mut merged: Vec<Range> = Vec::new();
    let mut current = sorted_ranges[0];
    
    for i in 1..sorted_ranges.len() {
        let next = sorted_ranges[i];
        if next.start <= current.end + 1 {
            // Ranges overlap or are adjacent, merge them
            current = Range {
                start: current.start,
                end: current.end.max(next.end),
            };
        } else {
            // No overlap, save current and move to next
            merged.push(current);
            current = next;
        }
    }
    merged.push(current);
    
    // Count total IDs in merged ranges
    merged.iter()
        .map(|range| range.end - range.start + 1)
        .sum()
}

fn main() {
    let input = fs::read_to_string("../../../../inputs/05.txt")
        .expect("Failed to read input file");
    
    println!("Part 1: {}", part1(&input));
    println!("Part 2: {}", part2(&input));
}

