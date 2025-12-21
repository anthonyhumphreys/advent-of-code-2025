# Day 5: Cafeteria - Ingredient Freshness Checker

## Problem Summary
- **Part 1**: Count how many available ingredient IDs fall within any of the fresh ID ranges
- **Part 2**: Count the total number of unique IDs covered by all fresh ID ranges (requires merging overlapping ranges)

## Approach

### Part 1
Simple filtering: for each available ingredient ID, check if it falls within any of the ranges. This is straightforward - just iterate through the IDs and count how many are in at least one range.

### Part 2
More complex - need to merge overlapping ranges to count unique IDs:
1. Sort ranges by start position
2. Merge overlapping or adjacent ranges (ranges that touch or overlap)
3. Sum the size of all merged ranges

The key insight is that ranges like `10-14` and `12-18` should be merged into `10-18`, and adjacent ranges like `10-14` and `15-20` should also be merged into `10-20`.

## Results
- **Part 1**: 607 fresh ingredients
- **Part 2**: 342,433,357,244,012 total IDs considered fresh

## Implementation Notes
All three language implementations use the same algorithm:
- JavaScript (ES6 modules with fs)
- Python (straightforward with list comprehensions)
- Rust (with proper range struct and iterators)

The merging algorithm handles both overlapping ranges and adjacent ranges by checking if `next.start <= current.end + 1`.

