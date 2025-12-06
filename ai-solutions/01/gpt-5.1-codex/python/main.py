#!/usr/bin/env python3
"""
Advent of Code 2025 - Day 01
GPT-5.1 Codex solution (Python)
"""

import sys
from pathlib import Path
from typing import Iterable, List, Tuple

MODULO = 100


def parse_moves(lines: Iterable[str]) -> List[Tuple[str, int]]:
    """Convert each rotation string like 'R17' into (direction, distance)."""
    moves: List[Tuple[str, int]] = []
    for raw in lines:
        line = raw.strip()
        if not line:
            continue
        direction = line[0]
        distance = int(line[1:])
        moves.append((direction, distance))
    return moves


def count_zero_hits(position: int, distance: int, direction: str) -> int:
    """
    Count how many times a rotation causes the pointer to click onto 0.
    Works by finding the first step that lands on 0, then counting every 100 clicks.
    """
    if distance <= 0:
        return 0

    if direction == "R":
        first = (MODULO - position) % MODULO
    else:
        first = position % MODULO

    if first == 0:
        first = MODULO

    if distance < first:
        return 0

    return 1 + (distance - first) // MODULO


def solve(moves: List[Tuple[str, int]]) -> Tuple[int, int]:
    """Return (part1, part2) passwords."""
    position = 50
    part1 = 0
    part2 = 0

    for direction, distance in moves:
        part2 += count_zero_hits(position, distance, direction)
        if direction == "R":
            position = (position + distance) % MODULO
        else:
            position = (position - distance) % MODULO

        if position == 0:
            part1 += 1

    return part1, part2


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python main.py <input_file>", file=sys.stderr)
        sys.exit(1)

    input_path = Path(sys.argv[1])
    if not input_path.exists():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    moves = parse_moves(input_path.read_text().splitlines())
    part1, part2 = solve(moves)

    print(part1)
    print(part2)


if __name__ == "__main__":
    main()



