#!/usr/bin/env python3
from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

DIRS = [
    (-1, -1),
    (-1, 0),
    (-1, 1),
    (0, -1),
    (0, 1),
    (1, -1),
    (1, 0),
    (1, 1),
]


def read_grid(path: Path) -> list[str]:
    text = path.read_text().splitlines()
    return [line.strip() for line in text if line.strip()]


def build_adjacency(grid: list[str]) -> list[list[int]]:
    positions: list[tuple[int, int]] = []
    index: dict[tuple[int, int], int] = {}

    for r, row in enumerate(grid):
        for c, ch in enumerate(row):
            if ch == "@":
                idx = len(positions)
                positions.append((r, c))
                index[(r, c)] = idx

    adjacency: list[list[int]] = [[] for _ in positions]
    for idx, (r, c) in enumerate(positions):
        for dr, dc in DIRS:
            neighbor = index.get((r + dr, c + dc))
            if neighbor is not None:
                adjacency[idx].append(neighbor)

    return adjacency


def count_accessible(adjacency: list[list[int]]) -> int:
    return sum(1 for neighbors in adjacency if len(neighbors) < 4)


def total_removed(adjacency: list[list[int]]) -> int:
    degrees = [len(neighbors) for neighbors in adjacency]
    removed = [False] * len(adjacency)
    q: deque[int] = deque(i for i, deg in enumerate(degrees) if deg < 4)

    removed_count = 0
    while q:
        node = q.popleft()
        if removed[node]:
            continue
        removed[node] = True
        removed_count += 1

        for neighbor in adjacency[node]:
            if removed[neighbor]:
                continue
            degrees[neighbor] -= 1
            if degrees[neighbor] < 4:
                q.append(neighbor)

    return removed_count


def main() -> None:
    if len(sys.argv) > 1:
        input_path = Path(sys.argv[1])
    else:
        repo_root = Path(__file__).resolve().parents[4]
        input_path = repo_root / "inputs" / "04.txt"

    grid = read_grid(input_path)
    adjacency = build_adjacency(grid)

    part1 = count_accessible(adjacency)
    part2 = total_removed(adjacency)

    print(part1)
    print(part2)


if __name__ == "__main__":
    main()

