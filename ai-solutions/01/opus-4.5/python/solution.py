#!/usr/bin/env python3
"""
Advent of Code 2025 - Day 1: Secret Entrance
Solution by Claude Opus 4.5
"""

import sys


def count_zeros_during_rotation(position: int, distance: int, direction: str) -> int:
    """
    Count how many times the dial points at 0 during a rotation.
    This includes the final position if it's 0.
    """
    if direction == 'L':
        # Left rotation: going toward lower numbers
        if position == 0:
            # Starting at 0, we only hit 0 again after full rotations
            return distance // 100
        else:
            # We hit 0 when (position - k) mod 100 = 0, i.e., k = position, position+100, ...
            if position <= distance:
                return (distance - position) // 100 + 1
            else:
                return 0
    else:
        # Right rotation: going toward higher numbers
        if position == 0:
            # Starting at 0, we hit 0 again after full rotations
            return distance // 100
        else:
            # We hit 0 when (position + k) mod 100 = 0, i.e., k = 100-position, 200-position, ...
            threshold = 100 - position
            if threshold <= distance:
                return (distance + position - 100) // 100 + 1
            else:
                return 0


def solve(input_file: str) -> tuple[int, int]:
    """Solve both parts of the puzzle."""
    with open(input_file, 'r') as f:
        lines = f.read().strip().split('\n')
    
    position = 50
    part1_count = 0
    part2_count = 0
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        direction = line[0]
        distance = int(line[1:])
        
        # Count zeros for part 2 (all clicks that land on 0)
        zeros = count_zeros_during_rotation(position, distance, direction)
        part2_count += zeros
        
        # Update position
        if direction == 'L':
            position = (position - distance) % 100
        else:
            position = (position + distance) % 100
        
        # Part 1: count if dial ends at 0
        if position == 0:
            part1_count += 1
    
    return part1_count, part2_count


def main():
    if len(sys.argv) < 2:
        print("Usage: python solution.py <input_file>", file=sys.stderr)
        sys.exit(1)
    
    input_file = sys.argv[1]
    part1, part2 = solve(input_file)
    print(part1)
    print(part2)


if __name__ == "__main__":
    main()






