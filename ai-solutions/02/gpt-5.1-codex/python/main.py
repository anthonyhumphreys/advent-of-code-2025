import os

def solve():
    # Construct path to input file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(script_dir, '../../../../inputs/02.txt')
    
    with open(input_path, 'r') as f:
        content = f.read().strip()
    
    # Parse ranges
    # Input format: 11-22,95-115,...
    # Can contain newlines based on prompt description, so remove them first or split by comma directly handling whitespace
    ranges = []
    # Replace newlines with nothing just in case, or split by comma and strip
    parts = content.replace('\n', '').split(',')
    
    for p in parts:
        if '-' in p:
            start, end = map(int, p.split('-'))
            ranges.append((start, end))

    total_part1 = 0
    total_part2 = 0

    for start, end in ranges:
        for num in range(start, end + 1):
            s = str(num)
            length = len(s)
            
            # Part 1 check
            is_p1 = False
            if length % 2 == 0:
                half = length // 2
                if s[:half] == s[half:]:
                    is_p1 = True
                    total_part1 += num
            
            # Part 2 check
            # repeated at least twice
            # This means s is composed of a substring p repeating 2 or more times.
            # s = p * k where k >= 2.
            # We iterate possible lengths of p.
            is_p2 = False
            for chunk_len in range(1, length // 2 + 1):
                if length % chunk_len == 0:
                    pattern = s[:chunk_len]
                    repeats = length // chunk_len
                    if pattern * repeats == s:
                        is_p2 = True
                        break
            
            if is_p2:
                total_part2 += num

    print(total_part1)
    print(total_part2)

if __name__ == '__main__':
    solve()
