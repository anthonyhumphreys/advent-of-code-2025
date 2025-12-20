# Day 4: Printing Department

## Solution Summary

Successfully solved both parts of the puzzle.

**Part 1:** Count paper rolls (@) that have fewer than 4 adjacent paper rolls (in the 8 surrounding positions).
- Answer: **1445**

**Part 2:** Iteratively remove accessible paper rolls (those with < 4 neighbors) and count the total removed.
- Answer: **8317**

## Algorithm

1. Parse the grid of paper rolls (@) and empty spaces (.)
2. For each position, count neighbors in all 8 directions
3. Part 1: Count all rolls with < 4 neighbors
4. Part 2: Repeatedly find and remove accessible rolls until none remain

## Verification

Tested against the example from the problem statement:
- Part 1: 13 (matches expected)
- Part 2: 43 (matches expected)

All three implementations (JavaScript, Python, Rust) produce identical results.

