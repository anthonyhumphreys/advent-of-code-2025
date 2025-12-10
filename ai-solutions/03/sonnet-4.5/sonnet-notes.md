# Day 3: Lobby - Battery Joltage Optimization

## Problem Summary
Given banks of batteries with joltage ratings (digits 1-9), find the maximum joltage by selecting specific numbers of batteries from each bank while maintaining their order.

## Solution Approach
The key insight is to use a greedy algorithm to select digits that form the largest possible number:

1. **Greedy Selection**: At each step, choose the largest available digit from a valid window
2. **Valid Window**: When selecting k digits from n total, at position i we can only choose from indices that leave enough digits remaining
3. **Window Calculation**: For selecting k digits, at step i we can search from current position up to `n - (k - i) + 1`

## Example
For `987654321111111` selecting 12 digits:
- First digit: choose 9 from indices 0-3 (need 11 more digits from remaining)
- Second digit: choose 8 from indices 1-4 (need 10 more digits)
- Continue this pattern to get `987654321111`

## Complexity
- Time: O(n × k) for each line, where n is line length and k is number of digits to select
- Space: O(k) for storing selected digits
