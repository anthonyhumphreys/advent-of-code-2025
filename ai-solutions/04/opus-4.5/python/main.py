from pathlib import Path


def read_input():
    input_path = Path(__file__).parent.parent.parent.parent.parent / "inputs" / "04.txt"
    with open(input_path) as f:
        return [list(line.strip()) for line in f.readlines()]


# 8 directions: N, NE, E, SE, S, SW, W, NW
DIRECTIONS = [(-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0), (1, -1), (0, -1), (-1, -1)]


def count_adjacent_rolls(grid, row, col):
    """Count the number of adjacent paper rolls (@) for a given position."""
    rows, cols = len(grid), len(grid[0])
    count = 0
    for dr, dc in DIRECTIONS:
        nr, nc = row + dr, col + dc
        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == "@":
            count += 1
    return count


def find_accessible_rolls(grid):
    """Find all rolls that can be accessed (fewer than 4 adjacent rolls)."""
    rows, cols = len(grid), len(grid[0])
    accessible = []
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "@" and count_adjacent_rolls(grid, r, c) < 4:
                accessible.append((r, c))
    return accessible


def solve():
    grid = read_input()

    # Part 1: Count initially accessible rolls
    part1 = len(find_accessible_rolls(grid))

    # Part 2: Keep removing accessible rolls until none remain
    working_grid = [row[:] for row in grid]  # Deep copy
    total_removed = 0

    while True:
        accessible = find_accessible_rolls(working_grid)
        if not accessible:
            break

        # Remove all accessible rolls
        for r, c in accessible:
            working_grid[r][c] = "."
        total_removed += len(accessible)

    print(part1)
    print(total_removed)


if __name__ == "__main__":
    solve()

