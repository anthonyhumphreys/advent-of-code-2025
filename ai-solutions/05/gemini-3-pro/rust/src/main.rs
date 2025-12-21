use std::fs;
use std::path::Path;

#[derive(Debug, Clone, Copy)]
struct Range {
    start: u64,
    end: u64,
}

fn parse_input(filepath: &str) -> (Vec<Range>, Vec<u64>) {
    let content = fs::read_to_string(filepath).expect("Failed to read input file");
    let parts: Vec<&str> = content.trim().split("\n\n").collect();

    let ranges_raw = parts[0].lines();
    let ids_raw = parts[1].lines();

    let ranges: Vec<Range> = ranges_raw
        .map(|line| {
            let parts: Vec<&str> = line.split('-').collect();
            let start = parts[0].parse().unwrap();
            let end = parts[1].parse().unwrap();
            Range { start, end }
        })
        .collect();

    let ids: Vec<u64> = ids_raw.map(|line| line.parse().unwrap()).collect();

    (ranges, ids)
}

fn solve_part1(ranges: &[Range], ids: &[u64]) -> usize {
    let mut fresh_count = 0;
    for &id in ids {
        let mut is_fresh = false;
        for range in ranges {
            if id >= range.start && id <= range.end {
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

fn solve_part2(ranges: &[Range]) -> u64 {
    if ranges.is_empty() {
        return 0;
    }

    let mut sorted_ranges = ranges.to_vec();
    sorted_ranges.sort_by_key(|r| r.start);

    let mut merged_ranges: Vec<Range> = Vec::new();
    let mut current_start = sorted_ranges[0].start;
    let mut current_end = sorted_ranges[0].end;

    for range in sorted_ranges.iter().skip(1) {
        if range.start <= current_end + 1 {
            // Overlap or adjacent
            current_end = current_end.max(range.end);
        } else {
            merged_ranges.push(Range {
                start: current_start,
                end: current_end,
            });
            current_start = range.start;
            current_end = range.end;
        }
    }
    merged_ranges.push(Range {
        start: current_start,
        end: current_end,
    });

    let mut total_fresh = 0;
    for range in merged_ranges {
        total_fresh += range.end - range.start + 1;
    }

    total_fresh
}

fn main() {
    let input_path = Path::new("../../../../inputs/05.txt");
    // Depending on where cargo run is executed, we might need to adjust.
    // Assuming cargo run from ai-solutions/05/gemini-3-pro/rust
    
    // We'll try a few paths or use CARGO_MANIFEST_DIR if needed, but relative path is usually okay if run from project root
    // But typically users run scripts from root.
    // If run from root: inputs/05.txt
    
    let path_str = if input_path.exists() {
        input_path.to_str().unwrap()
    } else if Path::new("inputs/05.txt").exists() {
        "inputs/05.txt"
    } else {
         // Try absolute path resolution relative to this file's location if possible, 
         // but rust binary doesn't know source location at runtime easily without macro.
         // Let's assume one of the above works or try a deeper relative path.
         "../../../../inputs/05.txt"
    };

    let (ranges, ids) = parse_input(path_str);

    println!("Part 1: {}", solve_part1(&ranges, &ids));
    println!("Part 2: {}", solve_part2(&ranges));
}

