use std::cmp;
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Clone, Copy, Debug)]
struct Range {
    start: u64,
    end: u64,
}

fn parse_input(path: &Path) -> (Vec<Range>, Vec<u64>) {
    let content = fs::read_to_string(path).expect("failed to read input file");
    let mut sections = content.trim().split("\n\n");
    let ranges_section = sections
        .next()
        .expect("input must contain a ranges section");
    let ids_section = sections
        .next()
        .expect("input must contain an ids section");

    let ranges = ranges_section
        .lines()
        .map(|line| {
            let mut parts = line.split('-');
            let start: u64 = parts
                .next()
                .expect("missing range start")
                .parse()
                .expect("invalid range start");
            let end: u64 = parts
                .next()
                .expect("missing range end")
                .parse()
                .expect("invalid range end");
            Range { start, end }
        })
        .collect::<Vec<_>>();

    let ids = ids_section
        .lines()
        .filter(|line| !line.trim().is_empty())
        .map(|line| line.parse::<u64>().expect("invalid id"))
        .collect::<Vec<_>>();

    (ranges, ids)
}

fn merge_ranges(ranges: &[Range]) -> Vec<Range> {
    if ranges.is_empty() {
        return Vec::new();
    }

    let mut sorted = ranges.to_vec();
    sorted.sort_by_key(|r| r.start);

    let mut merged = Vec::with_capacity(sorted.len());
    let mut current = sorted[0];

    for range in sorted.into_iter().skip(1) {
        if range.start <= current.end + 1 {
            current.end = cmp::max(current.end, range.end);
        } else {
            merged.push(current);
            current = range;
        }
    }

    merged.push(current);
    merged
}

fn is_fresh(id: u64, merged: &[Range]) -> bool {
    if merged.is_empty() {
        return false;
    }

    let mut left = 0;
    let mut right = merged.len();

    while left < right {
        let mid = left + (right - left) / 2;
        let range = merged[mid];

        if id < range.start {
            right = mid;
        } else if id > range.end {
            left = mid + 1;
        } else {
            return true;
        }
    }

    false
}

fn count_fresh(ids: &[u64], merged: &[Range]) -> usize {
    ids.iter().filter(|&&id| is_fresh(id, merged)).count()
}

fn total_fresh(merged: &[Range]) -> u64 {
    merged.iter().map(|r| r.end - r.start + 1).sum()
}

fn locate_input() -> PathBuf {
    let manifest_candidate =
        Path::new(env!("CARGO_MANIFEST_DIR")).join("../../../../inputs/05.txt");
    if manifest_candidate.exists() {
        return manifest_candidate;
    }

    let cwd_candidate = Path::new("inputs/05.txt");
    if cwd_candidate.exists() {
        return cwd_candidate.to_path_buf();
    }

    panic!("Unable to locate inputs/05.txt");
}

fn main() {
    let input_path = locate_input();
    let (ranges, ids) = parse_input(&input_path);
    let merged = merge_ranges(&ranges);

    let part1 = count_fresh(&ids, &merged);
    let part2 = total_fresh(&merged);

    println!("{}", part1);
    println!("{}", part2);
}


