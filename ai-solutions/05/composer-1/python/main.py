import os

def solve():
    # Read input file
    input_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..', 'inputs', '05.txt')
    input_path = os.path.normpath(input_path)
    with open(input_path, 'r') as f:
        input_text = f.read().strip()
    
    # Split input into ranges and available IDs
    parts = input_text.split('\n\n')
    ranges_text = parts[0]
    available_ids_text = parts[1]
    
    # Parse ranges
    ranges = []
    for line in ranges_text.strip().split('\n'):
        start, end = map(int, line.split('-'))
        ranges.append((start, end))
    
    # Parse available IDs
    available_ids = [int(line.strip()) for line in available_ids_text.strip().split('\n')]
    
    # Part 1: Count how many available IDs are fresh
    def part1(ranges, available_ids):
        fresh_count = 0
        for ingredient_id in available_ids:
            is_fresh = False
            for start, end in ranges:
                if start <= ingredient_id <= end:
                    is_fresh = True
                    break
            if is_fresh:
                fresh_count += 1
        return fresh_count
    
    # Part 2: Count total unique IDs covered by ranges
    def part2(ranges):
        # Merge overlapping ranges
        if not ranges:
            return 0
        
        # Sort ranges by start
        sorted_ranges = sorted(ranges, key=lambda x: x[0])
        
        # Merge overlapping ranges
        merged = [sorted_ranges[0]]
        for start, end in sorted_ranges[1:]:
            last_start, last_end = merged[-1]
            if start <= last_end + 1:  # Overlapping or adjacent
                merged[-1] = (last_start, max(last_end, end))
            else:
                merged.append((start, end))
        
        # Count total IDs in merged ranges
        total = 0
        for start, end in merged:
            total += end - start + 1
        
        return total
    
    # Solve both parts
    answer1 = part1(ranges, available_ids)
    answer2 = part2(ranges)
    
    print(answer1)
    print(answer2)

if __name__ == '__main__':
    solve()

