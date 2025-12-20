# Day 2: Gift Shop - Solution Notes

## Approach

The problem requires finding "invalid" product IDs within given ranges where invalid means the number is a repeated pattern of digits.

### Part 1: Exactly Twice Repeated
A number is invalid if it consists of a pattern repeated exactly twice:
- `55` = "5" repeated 2 times ✓
- `6464` = "64" repeated 2 times ✓
- `123123` = "123" repeated 2 times ✓

**Algorithm:** Check if the string length is even, then compare the first half with the second half.

### Part 2: At Least Twice Repeated
A number is invalid if it consists of a pattern repeated at least twice:
- `111` = "1" repeated 3 times ✓
- `1212121212` = "12" repeated 5 times ✓
- `123123123` = "123" repeated 3 times ✓

**Algorithm:** For each possible pattern length (1 to len/2), check if the string can be evenly divided and if repeating the pattern produces the original string.

## Complexity

- **Time:** O(N × D²) where N is total numbers across all ranges and D is the max digit count (~10)
- **Space:** O(D) for string representations

## Key Observations

1. No leading zeros means we don't need to worry about numbers like "0101"
2. For Part 1, only even-length numbers can be double-repeated
3. For Part 2, we try all divisible pattern lengths - the first match is sufficient
