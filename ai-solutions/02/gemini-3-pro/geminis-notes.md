# Day 2 Notes

## Solutions
- Part 1: 31839939622
- Part 2: 41662374059

## Approach
The problem asks us to find "invalid" IDs within specific numerical ranges.
- **Part 1 Invalid:** An ID is a sequence of digits repeated exactly twice (e.g., "1212").
- **Part 2 Invalid:** An ID is a sequence of digits repeated at least twice (e.g., "1212", "121212").

Since the number of values to check is relatively small (around 7 million based on the sum of range lengths), a brute-force approach iterating through each number in the ranges works efficiently.

### Algorithm
1. Parse the input string into a list of (start, end) ranges.
2. For each number in each range:
   - Convert to string.
   - **Part 1:** Check if string length is even and the first half equals the second half.
   - **Part 2:** Iterate through possible pattern lengths $L$ (divisors of string length). If the string is formed by repeating the prefix of length $L$, it is invalid.
3. Sum the valid numbers separately for Part 1 and Part 2.

## Implementation Details
- **Python:** Straightforward string manipulation.
- **Rust:** Uses `String` conversion and slices.
- **JavaScript:** Uses string manipulation. `Number` precision is sufficient ($2^{53}$) for the result ($\approx 4 \times 10^{10}$).
