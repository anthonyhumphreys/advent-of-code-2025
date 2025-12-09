use std::fs;
use std::path::Path;

fn main() {
    let paths = ["inputs/02.txt", "../../../../inputs/02.txt"];
    let mut content = String::new();
    let mut found = false;
    
    for p in paths {
        if Path::new(p).exists() {
            content = fs::read_to_string(p).expect("Failed to read file");
            found = true;
            break;
        }
    }
    
    if !found {
        eprintln!("Could not find input file in {:?}", paths);
        std::process::exit(1);
    }

    let mut ranges = Vec::new();
    // Remove newlines and split by comma
    let cleaned_content = content.replace('\n', "");
    for part in cleaned_content.split(',') {
        if part.contains('-') {
            let bounds: Vec<&str> = part.split('-').collect();
            if bounds.len() == 2 {
                if let (Ok(start), Ok(end)) = (bounds[0].parse::<u64>(), bounds[1].parse::<u64>()) {
                    ranges.push((start, end));
                }
            }
        }
    }

    let mut total_part1: u64 = 0;
    let mut total_part2: u64 = 0;

    for (start, end) in ranges {
        for num in start..=end {
            let s = num.to_string();
            let len = s.len();

            // Part 1
            if len % 2 == 0 {
                let half = len / 2;
                if &s[..half] == &s[half..] {
                    total_part1 += num;
                }
            }

            // Part 2
            let mut is_p2 = false;
            for k in 1..=(len / 2) {
                if len % k == 0 {
                    let pattern = &s[..k];
                    let repeats = len / k;
                    // Check if pattern repeated equals s
                    // Efficient way: iterate and check slices
                    // Or construct string
                    if pattern.repeat(repeats) == s {
                        is_p2 = true;
                        break;
                    }
                }
            }

            if is_p2 {
                total_part2 += num;
            }
        }
    }

    println!("{}", total_part1);
    println!("{}", total_part2);
}
