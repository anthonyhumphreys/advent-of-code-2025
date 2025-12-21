use std::fs;

fn main() {
    let input = fs::read_to_string("../../../inputs/05.txt")
        .expect("read error")
        .trim()
        .to_string();

    let sections: Vec<&str> = input.split("\n\n").collect();

    let mut ranges: Vec<(i64, i64)> = sections[0]
        .lines()
        .map(|line| {
            let mut it = line.split('-').map(|n| n.parse::<i64>().unwrap());
            let a = it.next().unwrap();
            let b = it.next().unwrap();
            (a.min(b), a.max(b))
        })
        .collect();

    let ids: Vec<i64> = sections[1]
        .lines()
        .map(|line| line.parse::<i64>().unwrap())
        .collect();

    let fresh_ingredients: Vec<i64> = ids
        .iter()
        .copied()
        .filter(|id| ranges.iter().any(|&(min, max)| *id >= min && *id <= max))
        .collect();

    println!("{}", fresh_ingredients.len());

    ranges.sort_by_key(|(start, _)| *start);

    let mut merged: Vec<(i64, i64)> = Vec::new();

    for (start, end) in ranges {
        match merged.last_mut() {
            None => merged.push((start, end)),
            Some((_, last_end)) => {
                if start > *last_end + 1 {
                    merged.push((start, end));
                } else {
                    *last_end = (*last_end).max(end);
                }
            }
        }
    }

    let total_fresh_ids: i64 = merged
        .iter()
        .map(|(start, end)| end - start + 1)
        .sum();

    println!("{}", total_fresh_ids);
}
