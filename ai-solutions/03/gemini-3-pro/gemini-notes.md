# Day 3 Solution Notes

## Problem Description
We need to find the largest number that can be formed by selecting exactly $k$ digits from a given sequence of digits (representing a battery bank), preserving their original relative order.
- Part 1: Select $k=2$ digits.
- Part 2: Select $k=12$ digits.

The final answer is the sum of these maximum numbers across all banks.

## Algorithm
This problem can be solved using a greedy approach. To form the largest $k$-digit number, we want the most significant digit (the first one picked) to be as large as possible.

Let the sequence be $S$ of length $N$. We need to pick $k$ digits.
1. **First Digit Selection**: We need to pick the first digit such that we can still pick $k-1$ more digits from the remaining string. Thus, the index of the first digit can be at most $N - k$. We search for the largest digit in the range $S[0 \dots N-k]$. Let the largest digit be $d$ at index $i$.
   - If there are multiple occurrences of the largest digit, picking the first one is always optimal (or at least as good) because it leaves the longest possible suffix for subsequent choices.
   - We append $d$ to our result.
2. **Subsequent Digits**: After picking the digit at index $i$, we need to pick $k-1$ digits from the suffix $S[i+1 \dots N-1]$. This is the same problem with reduced $k$ and a shorter string.
3. We repeat this process until we have selected $k$ digits.

## Complexity
For each of the $k$ digits, we scan a portion of the string. In the worst case, we might scan $O(N)$ characters for each digit.
Total complexity per line: $O(k \times N)$.
Given $N \approx 100$ and $k \le 12$, this is very fast.

## Implementation
Implemented in Python, JavaScript, and Rust. All solutions produce the same output.
