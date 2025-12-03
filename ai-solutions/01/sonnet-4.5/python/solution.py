#!/usr/bin/env python3

def solve():
    with open('../../../../inputs/01.txt', 'r') as f:
        lines = f.read().strip().split('\n')
    
    position = 50
    part1_count = 0
    part2_count = 0
    
    for line in lines:
        direction = line[0]
        distance = int(line[1:])
        
        if direction == 'R':
            # Count zeros passed during rotation (Part 2)
            zeros_during = (position + distance) // 100
            part2_count += zeros_during
            
            # Update position
            position = (position + distance) % 100
        else:  # direction == 'L'
            # Count zeros passed during rotation (Part 2)
            zeros_during = (distance // 100) + (1 if distance >= position and position > 0 else 0)
            part2_count += zeros_during
            
            # Update position
            position = (position - distance) % 100
        
        # Check if we ended at 0 (Part 1 only; Part 2 already counted it)
        if position == 0:
            part1_count += 1
    
    print(part1_count)
    print(part2_count)

if __name__ == '__main__':
    solve()

