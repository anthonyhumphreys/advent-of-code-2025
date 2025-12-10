def max_joltage(bank: str, k: int) -> int:
    """Find the maximum number by selecting exactly k digits from the bank."""
    n = len(bank)
    if k > n:
        return 0
    
    result = []
    start_idx = 0
    
    for i in range(k):
        # For position i, we can pick from start_idx to (n - k + i) inclusive
        end_idx = n - k + i
        max_digit = '0'
        max_pos = start_idx
        
        for j in range(start_idx, end_idx + 1):
            if bank[j] > max_digit:
                max_digit = bank[j]
                max_pos = j
        
        result.append(max_digit)
        start_idx = max_pos + 1
    
    return int(''.join(result))


def main():
    with open('inputs/03.txt', 'r') as f:
        banks = f.read().strip().split('\n')
    
    # Part 1: Select 2 batteries from each bank
    part1 = sum(max_joltage(bank, 2) for bank in banks)
    
    # Part 2: Select 12 batteries from each bank
    part2 = sum(max_joltage(bank, 12) for bank in banks)
    
    print(part1)
    print(part2)


if __name__ == '__main__':
    main()
