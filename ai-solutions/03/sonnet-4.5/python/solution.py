def find_max_number(digits, count):
    n = len(digits)
    if count > n:
        return 0
    
    # Greedy approach: select 'count' digits that form the largest number
    result = []
    start = 0
    
    for i in range(count):
        # We need to pick 'count - i' more digits from the remaining string
        # So we can search up to index n - (count - i)
        end = n - (count - i) + 1
        
        # Find the maximum digit in the valid range
        max_digit = digits[start]
        max_pos = start
        
        for j in range(start, end):
            if digits[j] > max_digit:
                max_digit = digits[j]
                max_pos = j
        
        result.append(max_digit)
        start = max_pos + 1
    
    return int(''.join(result))

def solve(input_text):
    lines = input_text.strip().split('\n')
    
    part1 = 0
    part2 = 0
    
    for line in lines:
        digits = line.strip()
        part1 += find_max_number(digits, 2)
        part2 += find_max_number(digits, 12)
    
    print(part1)
    print(part2)

with open('../../../../inputs/03.txt', 'r') as f:
    input_text = f.read()
    solve(input_text)
