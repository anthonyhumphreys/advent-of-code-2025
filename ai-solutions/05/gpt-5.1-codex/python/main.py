from __future__ import annotations

from bisect import bisect_right
from pathlib import Path
from typing import Iterable, List, Sequence, Tuple


Range = Tuple[int, int]


def read_input(filepath: Path) -> Tuple[List[Range], List[int]]:
    """Parse the puzzle input into fresh ranges and ingredient ids."""
    content = filepath.read_text().strip().split("\n\n")
    if len(content) != 2:
        raise ValueError("Input file must contain ranges, a blank line, then IDs.")

    raw_ranges, raw_ids = content
    ranges: List[Range] = []
    for line in raw_ranges.strip().splitlines():
        start, end = line.split("-")
        ranges.append((int(start), int(end)))

    ids = [int(line) for line in raw_ids.strip().splitlines() if line]
    return ranges, ids


def merge_ranges(ranges: Iterable[Range]) -> List[Range]:
    """Merge overlapping or adjacent ranges to simplify later lookups."""
    sorted_ranges = sorted(ranges)
    if not sorted_ranges:
        return []

    merged: List[Range] = []
    cur_start, cur_end = sorted_ranges[0]

    for start, end in sorted_ranges[1:]:
        if start <= cur_end + 1:
            cur_end = max(cur_end, end)
        else:
            merged.append((cur_start, cur_end))
            cur_start, cur_end = start, end

    merged.append((cur_start, cur_end))
    return merged


def count_fresh(ids: Sequence[int], merged_ranges: Sequence[Range]) -> int:
    """Count how many ids fall inside any merged range using binary search."""
    if not merged_ranges:
        return 0

    starts = [r[0] for r in merged_ranges]
    fresh = 0
    for value in ids:
        idx = bisect_right(starts, value) - 1
        if idx >= 0 and value <= merged_ranges[idx][1]:
            fresh += 1
    return fresh


def total_fresh_ids(merged_ranges: Sequence[Range]) -> int:
    return sum(end - start + 1 for start, end in merged_ranges)


def locate_input() -> Path:
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir
    for _ in range(4):
        project_root = project_root.parent

    candidates = [
        project_root / "inputs" / "05.txt",
        Path("inputs/05.txt"),
    ]

    for candidate in candidates:
        if candidate.exists():
            return candidate

    raise FileNotFoundError("Unable to locate inputs/05.txt")


def main() -> None:
    input_path = locate_input()
    ranges, ids = read_input(input_path)
    merged = merge_ranges(ranges)

    part1 = count_fresh(ids, merged)
    part2 = total_fresh_ids(merged)

    print(f"Part 1: {part1}")
    print(f"Part 2: {part2}")


if __name__ == "__main__":
    main()


