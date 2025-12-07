import re

# Read input file
with open('../../../../inputs/02.txt', 'r') as f:
    input_data = f.read().strip()

# Parse ranges
ranges = []
for range_str in input_data.split(','):
    start, end = map(int, range_str.split('-'))
    ranges.append((start, end))

# Check if a number is invalid for part 1 (repeated exactly twice)
def is_invalid_part1(num):
    str_num = str(num)
    length = len(str_num)
    
    # Must be even length to be repeated twice
    if length % 2 != 0:
        return False
    
    half_len = length // 2
    first_half = str_num[:half_len]
    second_half = str_num[half_len:]
    
    return first_half == second_half

# Check if a number is invalid for part 2 (repeated at least twice)
def is_invalid_part2(num):
    str_num = str(num)
    length = len(str_num)
    
    # Try all possible pattern lengths from 1 to length/2
    for pattern_len in range(1, length // 2 + 1):
        if length % pattern_len != 0:
            continue
        
        repetitions = length // pattern_len
        if repetitions < 2:
            continue
        
        pattern = str_num[:pattern_len]
        is_valid_pattern = True
        
        for i in range(1, repetitions):
            segment = str_num[i * pattern_len:(i + 1) * pattern_len]
            if segment != pattern:
                is_valid_pattern = False
                break
        
        if is_valid_pattern:
            return True
    
    return False

# Find all invalid IDs in ranges
def find_invalid_ids(ranges, is_invalid_func):
    total_sum = 0
    
    for start, end in ranges:
        for num in range(start, end + 1):
            if is_invalid_func(num):
                total_sum += num
    
    return total_sum

# Part 1
part1 = find_invalid_ids(ranges, is_invalid_part1)

# Part 2
part2 = find_invalid_ids(ranges, is_invalid_part2)

print(part1)
print(part2)
