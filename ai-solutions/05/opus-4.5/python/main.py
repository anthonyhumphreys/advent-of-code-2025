from pathlib import Path


def solve(input_text: str) -> tuple[int, int]:
    sections = input_text.strip().split('\n\n')
    range_lines = sections[0].split('\n')
    ingredient_lines = sections[1].split('\n')

    # Parse ranges
    ranges = []
    for line in range_lines:
        start, end = map(int, line.split('-'))
        ranges.append((start, end))

    # Parse available ingredient IDs
    ingredients = [int(line) for line in ingredient_lines]

    # Part 1: Count how many ingredients fall within any range
    part1 = 0
    for ingredient in ingredients:
        for start, end in ranges:
            if start <= ingredient <= end:
                part1 += 1
                break

    # Part 2: Merge overlapping ranges and count total fresh IDs
    # Sort ranges by start value
    sorted_ranges = sorted(ranges, key=lambda r: r[0])

    # Merge overlapping ranges
    merged_ranges = []
    for start, end in sorted_ranges:
        if not merged_ranges:
            merged_ranges.append([start, end])
        else:
            last = merged_ranges[-1]
            # Check if ranges overlap or are adjacent
            if start <= last[1] + 1:
                # Merge by extending the end if necessary
                last[1] = max(last[1], end)
            else:
                merged_ranges.append([start, end])

    # Count total IDs in merged ranges
    part2 = sum(end - start + 1 for start, end in merged_ranges)

    return part1, part2


def main():
    input_path = Path(__file__).parent.parent.parent.parent.parent / 'inputs' / '05.txt'
    input_text = input_path.read_text()

    part1, part2 = solve(input_text)
    print(f'Part 1: {part1}')
    print(f'Part 2: {part2}')


if __name__ == '__main__':
    main()

