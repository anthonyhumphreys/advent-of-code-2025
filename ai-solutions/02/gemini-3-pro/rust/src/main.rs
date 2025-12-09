use std::fs;
use std::path::Path;

fn main() {
    let input_path = Path::new("../../../../inputs/02.txt");
    let content = fs::read_to_string(input_path).expect("Failed to read input file");
    let content = content.trim();

    let mut ranges = Vec::new();
    for part in content.split(',') {
        if let Some((start_str, end_str)) = part.split_once('-') {
            let start: u64 = start_str.parse().expect("Invalid start number");
            let end: u64 = end_str.parse().expect("Invalid end number");
            ranges.push((start, end));
        }
    }

    let mut total_p1: u64 = 0;
    let mut total_p2: u64 = 0;

    for (start, end) in ranges {
        for n in start..=end {
            let s = n.to_string();
            let len = s.len();

            // Part 1
            if len % 2 == 0 {
                let half = len / 2;
                let (first, second) = s.split_at(half);
                if first == second {
                    total_p1 += n;
                }
            }

            // Part 2
            for l in 1..=(len / 2) {
                if len % l == 0 {
                    let pattern = &s[0..l];
                    let times = len / l;
                    if pattern.repeat(times) == s {
                        total_p2 += n;
                        break;
                    }
                }
            }
        }
    }

    println!("{}", total_p1);
    println!("{}", total_p2);
}
