import os

def parse_input(filepath):
    with open(filepath, 'r') as f:
        content = f.read().strip()
    
    parts = content.split('\n\n')
    ranges_raw = parts[0].split('\n')
    ids_raw = parts[1].split('\n')
    
    ranges = []
    for r in ranges_raw:
        start, end = map(int, r.split('-'))
        ranges.append((start, end))
        
    ids = [int(x) for x in ids_raw]
    
    return ranges, ids

def solve_part1(ranges, ids):
    fresh_count = 0
    for id_val in ids:
        is_fresh = False
        for start, end in ranges:
            if start <= id_val <= end:
                is_fresh = True
                break
        if is_fresh:
            fresh_count += 1
    return fresh_count

def solve_part2(ranges):
    # Sort ranges by start point
    sorted_ranges = sorted(ranges, key=lambda x: x[0])
    
    merged_ranges = []
    if not sorted_ranges:
        return 0
        
    current_start, current_end = sorted_ranges[0]
    
    for i in range(1, len(sorted_ranges)):
        next_start, next_end = sorted_ranges[i]
        
        if next_start <= current_end + 1: # Overlap or adjacent
            current_end = max(current_end, next_end)
        else:
            merged_ranges.append((current_start, current_end))
            current_start, current_end = next_start, next_end
            
    merged_ranges.append((current_start, current_end))
    
    total_fresh = 0
    for start, end in merged_ranges:
        total_fresh += (end - start + 1)
        
    return total_fresh

def main():
    input_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../inputs/05.txt'))
    # Adjust path if running from a different location, but absolute path construction is safer relative to this script
    # This script is in ai-solutions/05/gemini-3-pro/python/
    # input is in inputs/05.txt
    # ../../../inputs/05.txt
    
    # Just in case the script is run from root, we can try to find the file
    if not os.path.exists(input_path):
        # fallback to relative from CWD if running from root
        potential_path = 'inputs/05.txt'
        if os.path.exists(potential_path):
            input_path = potential_path
            
    ranges, ids = parse_input(input_path)
    
    print(solve_part1(ranges, ids))
    print(solve_part2(ranges))

if __name__ == "__main__":
    main()

