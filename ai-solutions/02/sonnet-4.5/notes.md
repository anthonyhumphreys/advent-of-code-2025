# Day 2: Gift Shop

## Problem Summary

Find invalid product IDs in given ranges where IDs are made of repeating digit sequences.

**Part 1:** IDs repeated exactly twice (e.g., 11, 6464, 123123)  
**Part 2:** IDs repeated at least twice (e.g., 12341234, 123123123, 1111111)

## Algorithm

1. Parse comma-separated ranges from input
2. For each number in each range:
   - **Part 1:** Check if length is even and first half equals second half
   - **Part 2:** Try all possible pattern lengths (1 to length/2) and check if the pattern repeats to form the entire number
3. Sum all invalid IDs

## Results

- **Part 1:** 31839939622
- **Part 2:** 41662374059

## Implementation Notes

- All three implementations (JavaScript, Python, Rust) produce identical results
- The solution handles large numbers correctly (up to ~7.6 billion range in the input)
- Pattern detection is optimized by only checking divisible pattern lengths
- Leading zeros are explicitly rejected as per problem requirements
