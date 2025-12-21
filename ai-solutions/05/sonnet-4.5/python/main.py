def parse_input(input_text):
    sections = input_text.strip().split('\n\n')
    ranges = []
    for line in sections[0].split('\n'):
        start, end = map(int, line.split('-'))
        ranges.append((start, end))
    ids = [int(line) for line in sections[1].split('\n')]
    return ranges, ids

def is_in_range(id, ranges):
    return any(start <= id <= end for start, end in ranges)

def part1(input_text):
    ranges, ids = parse_input(input_text)
    return sum(1 for id in ids if is_in_range(id, ranges))

def part2(input_text):
    ranges, _ = parse_input(input_text)
    
    # Sort ranges by start position
    sorted_ranges = sorted(ranges, key=lambda r: r[0])
    
    # Merge overlapping ranges
    merged = []
    current_start, current_end = sorted_ranges[0]
    
    for start, end in sorted_ranges[1:]:
        if start <= current_end + 1:
            # Ranges overlap or are adjacent, merge them
            current_end = max(current_end, end)
        else:
            # No overlap, save current and move to next
            merged.append((current_start, current_end))
            current_start, current_end = start, end
    
    merged.append((current_start, current_end))
    
    # Count total IDs in merged ranges
    return sum(end - start + 1 for start, end in merged)

# Main execution
if __name__ == '__main__':
    with open('../../../../inputs/05.txt', 'r') as f:
        input_text = f.read()
    
    print('Part 1:', part1(input_text))
    print('Part 2:', part2(input_text))

