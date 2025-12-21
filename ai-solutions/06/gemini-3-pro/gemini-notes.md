# Day 6 Solution Notes

## Approach

The problem involves parsing a fixed-width-like format where problems are arranged horizontally.

1.  **Parsing**:
    -   Read all lines and pad them to the maximum line length.
    -   Identify separator columns. A column is a separator if it consists entirely of spaces.
    -   Split the grid into blocks based on these separators.

2.  **Part 1**:
    -   For each block, identify the operator at the bottom.
    -   Read numbers row by row within the block (ignoring the operator row).
    -   Apply the operator to the sequence of numbers.
    -   Sum the results.

3.  **Part 2**:
    -   For each block, use the same operator.
    -   Read numbers by iterating columns from right to left.
    -   Each column forms a number by concatenating non-space digits from top to bottom.
    -   Apply the operator to the new sequence of numbers.
    -   Sum the results.

## Implementation Details

-   **Big Integers**: Since the problem involves multiplication of multiple numbers, the results can exceed standard integer limits (2^53 or 2^64). `BigInt` (JS), Python's arbitrary-precision integers, and `num-bigint` (Rust) are used.
-   **Padding**: Essential to handle variable line lengths in the input file correctly when scanning columns.

## Results

Both parts are solved and consistent across all three languages.

