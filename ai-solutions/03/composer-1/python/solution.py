def find_max_k_digits(line, k):
    digits = [int(d) for d in line]
    n = len(digits)
    result = []
    
    # Greedy: for each position, pick the largest digit available
    # while ensuring we have enough digits left for remaining positions
    start_idx = 0
    for pos in range(k):
        # We can pick from [start_idx, n - (k - pos - 1)]
        end_idx = n - (k - pos - 1)
        max_digit = -1
        max_idx = -1
        
        for i in range(start_idx, end_idx):
            if digits[i] > max_digit:
                max_digit = digits[i]
                max_idx = i
        
        result.append(max_digit)
        start_idx = max_idx + 1
    
    return int(''.join(map(str, result)))

def solve():
    import sys
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'inputs/03.txt'
    with open(input_file, 'r') as f:
        lines = [line.strip() for line in f.readlines()]
    
    part1_sum = 0
    part2_sum = 0
    
    for line in lines:
        # Part 1: Find max 2-digit number
        max_2_digit = find_max_k_digits(line, 2)
        part1_sum += max_2_digit
        
        # Part 2: Find max 12-digit number
        max_12_digit = find_max_k_digits(line, 12)
        part2_sum += max_12_digit
    
    print(part1_sum)
    print(part2_sum)

if __name__ == '__main__':
    solve()
