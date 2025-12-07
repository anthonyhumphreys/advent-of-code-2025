use std::collections::HashSet;
use std::fs;

fn is_exact_double(s: &str) -> bool {
    let len = s.len();
    if len % 2 != 0 {
        return false;
    }
    let mid = len / 2;
    &s[..mid] == &s[mid..]
}

fn is_repeated_block(s: &str) -> bool {
    let len = s.len();

    for k in 1..=len / 2 {
        if len % k != 0 {
            continue;
        }

        let block = &s[..k];
        if block.repeat(len / k) == s {
            return true;
        }
    }

    false
}

fn main() {
    let input = fs::read_to_string("../../../inputs/02.txt")
        .expect("Failed to read input file")
        .trim()
        .to_string();

    let ranges: Vec<(i64, i64)> = input
        .split(',')
        .map(|pair| {
            let mut parts = pair.split('-');
            let start = parts.next().unwrap().trim().parse::<i64>().unwrap();
            let end = parts.next().unwrap().trim().parse::<i64>().unwrap();
            (start, end)
        })
        .collect();

    let mut invalid1 = HashSet::new();
    let mut invalid2 = HashSet::new();

    for (start, end) in ranges {
        for i in start..=end {
            let s = i.to_string();

            if is_exact_double(&s) {
                invalid1.insert(i);
            }

            if is_repeated_block(&s) {
                invalid2.insert(i);
            }
        }
    }

    let sum1: i64 = invalid1.iter().sum();
    let sum2: i64 = invalid2.iter().sum();

    println!("{}", sum1);
    println!("{}", sum2);
}
