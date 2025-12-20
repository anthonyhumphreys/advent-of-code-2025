use std::fs;

fn pick_k_digits(line: &str, k: usize) -> u64 {
    let digits: Vec<u8> = line.chars().map(|c| c as u8 - b'0').collect();
    let mut result = Vec::with_capacity(k);
    let mut start = 0;

    for remaining in (0..k).rev() {
        let end = digits.len() - remaining;
        let (idx, &digit) = digits[start..end]
            .iter()
            .enumerate()
            .max_by(|(i1, d1), (i2, d2)| d1.cmp(d2).then_with(|| i2.cmp(i1)))
            .unwrap();

        result.push(digit);
        start += idx + 1;
    }

    result.iter().fold(0, |acc, &d| acc * 10 + d as u64)
}

fn main() {
    let input_path = std::env::args()
        .nth(1)
        .unwrap_or_else(|| "../../../inputs/03.txt".to_string());

    let input = fs::read_to_string(input_path).expect("Failed to read file");

    let mut part1 = 0u64;
    let mut part2 = 0u64;

    for line in input.lines() {
        part1 += pick_k_digits(line, 2);
        part2 += pick_k_digits(line, 12);
    }

    println!("{part1}");
    println!("{part2}");
}
