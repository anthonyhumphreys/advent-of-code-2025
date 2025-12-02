#!/usr/bin/env python3
import sys

def solve():
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'inputs/01.txt'
    with open(input_file, 'r') as f:
        rotations = [line.strip() for line in f.readlines() if line.strip()]
    
    # Part 1: Count times dial points at 0 after completing a rotation
    position = 50
    part1_count = 0
    
    for rotation in rotations:
        direction = rotation[0]
        distance = int(rotation[1:])
        
        if direction == 'R':
            position = (position + distance) % 100
        else:  # direction == 'L'
            position = (position - distance) % 100
        
        if position == 0:
            part1_count += 1
    
    # Part 2: Count times dial points at 0 during any click
    position = 50
    part2_count = 0
    
    for rotation in rotations:
        direction = rotation[0]
        distance = int(rotation[1:])
        
        start_pos = position
        
        if direction == 'R':
            # Count how many times we pass through 0 during rotation
            # We pass through 0 when (start_pos + i) % 100 == 0 for i in [1, distance]
            # This happens when start_pos + i is a multiple of 100
            # i = 100 - start_pos, 200 - start_pos, ... up to distance
            for i in range(1, distance + 1):
                if (start_pos + i) % 100 == 0:
                    part2_count += 1
            
            position = (position + distance) % 100
        else:  # direction == 'L'
            # Count how many times we pass through 0 during rotation
            # We pass through 0 when (start_pos - i) % 100 == 0 for i in [1, distance]
            # This happens when start_pos - i is a multiple of 100
            # i = start_pos, start_pos + 100, ... up to distance
            for i in range(1, distance + 1):
                if (start_pos - i) % 100 == 0:
                    part2_count += 1
            
            position = (position - distance) % 100
        
    
    print(part1_count)
    print(part2_count)

if __name__ == '__main__':
    solve()

