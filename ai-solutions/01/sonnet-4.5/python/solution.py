#!/usr/bin/env python3

def count_clicks_on_zero(start: int, signed_steps: int) -> int:
    """
    Count how many *clicks* during this rotation cause the dial to point at 0.
    This includes the final click if the rotation ends on 0.
    If the dial starts at 0, we only count reaching 0 again after a full 100 clicks.
    """
    if signed_steps == 0:
        return 0

    start_norm = ((start % 100) + 100) % 100

    if signed_steps > 0:
        num_clicks = signed_steps
        first_zero_click = 100 if start_norm == 0 else 100 - start_norm
        if first_zero_click > num_clicks:
            return 0
        return 1 + (num_clicks - first_zero_click) // 100
    else:
        num_clicks = -signed_steps
        first_zero_click = 100 if start_norm == 0 else start_norm
        if first_zero_click > num_clicks:
            return 0
        return 1 + (num_clicks - first_zero_click) // 100

def solve():
    with open('../../../../inputs/01.txt', 'r') as f:
        lines = f.read().strip().split('\n')
    
    position = 50
    part1_count = 0
    part2_count = 0
    
    for line in lines:
        direction = line[0]
        distance = int(line[1:])

        signed_steps = distance if direction == 'R' else -distance

        part2_count += count_clicks_on_zero(position, signed_steps)
        position = (position + signed_steps) % 100
        position = (position + 100) % 100

        # Part 1: count times the dial is left at 0 after a rotation
        if position == 0:
            part1_count += 1
    
    print(part1_count)
    print(part2_count)

if __name__ == '__main__':
    solve()

