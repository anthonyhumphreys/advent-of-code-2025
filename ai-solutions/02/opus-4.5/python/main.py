import sys


def parse_input(filename):
    """Parse the input file and return a list of (start, end) tuples."""
    with open(filename, 'r') as f:
        content = f.read().strip()
    
    ranges = []
    for part in content.split(','):
        part = part.strip()
        if part:
            start, end = part.split('-')
            ranges.append((int(start), int(end)))
    return ranges


def is_double_repeated(n):
    """Part 1: Check if number is a pattern repeated exactly twice."""
    s = str(n)
    length = len(s)
    if length % 2 != 0:
        return False
    half = length // 2
    return s[:half] == s[half:]


def is_repeated_pattern(n):
    """Part 2: Check if number is a pattern repeated at least twice."""
    s = str(n)
    length = len(s)
    for pattern_len in range(1, length // 2 + 1):
        if length % pattern_len == 0:
            repetitions = length // pattern_len
            if repetitions >= 2:
                pattern = s[:pattern_len]
                if pattern * repetitions == s:
                    return True
    return False


def solve(ranges):
    """Find all invalid IDs and return sums for Part 1 and Part 2."""
    part1_sum = 0
    part2_sum = 0
    
    for start, end in ranges:
        for num in range(start, end + 1):
            if is_double_repeated(num):
                part1_sum += num
            if is_repeated_pattern(num):
                part2_sum += num
    
    return part1_sum, part2_sum


def main():
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'inputs/02.txt'
    ranges = parse_input(input_file)
    part1, part2 = solve(ranges)
    print(part1)
    print(part2)


if __name__ == '__main__':
    main()
