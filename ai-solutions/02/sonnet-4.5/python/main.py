def is_repeated_twice(num):
    s = str(num)
    length = len(s)
    
    # Must be even length and no leading zeros
    if length % 2 != 0 or s[0] == '0':
        return False
    
    half = length // 2
    return s[:half] == s[half:]

def is_repeated_at_least_twice(num):
    s = str(num)
    length = len(s)
    
    # No leading zeros
    if s[0] == '0':
        return False
    
    # Try all possible pattern lengths
    for pattern_len in range(1, length // 2 + 1):
        if length % pattern_len == 0:
            pattern = s[:pattern_len]
            repetitions = length // pattern_len
            
            if repetitions >= 2 and pattern * repetitions == s:
                return True
    
    return False

def solve(input_text):
    ranges = []
    for range_str in input_text.strip().split(','):
        start, end = map(int, range_str.split('-'))
        ranges.append((start, end))
    
    sum_part1 = 0
    sum_part2 = 0
    
    for start, end in ranges:
        for num in range(start, end + 1):
            if is_repeated_twice(num):
                sum_part1 += num
            if is_repeated_at_least_twice(num):
                sum_part2 += num
    
    return sum_part1, sum_part2

with open('../../../../inputs/02.txt', 'r') as f:
    input_text = f.read()

part1, part2 = solve(input_text)
print(part1)
print(part2)



