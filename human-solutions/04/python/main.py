from pathlib import Path

input_text = Path("../../../inputs/04.txt").read_text().strip()
grid = input_text.splitlines()


def find_accessible_rolls(grid):
    row_count = len(grid)
    col_count = len(grid[0])

    neighbour_offsets = [
        (-1, -1), (-1, 0), (-1, 1),
        (0, -1),           (0, 1),
        (1, -1),  (1, 0),  (1, 1),
    ]

    accessible_count = 0

    for row in range(row_count):
        for col in range(col_count):
            if grid[row][col] != "@":
                continue

            neighbour_rolls = 0
            for dr, dc in neighbour_offsets:
                nr = row + dr
                nc = col + dc
                if 0 <= nr < row_count and 0 <= nc < col_count:
                    if grid[nr][nc] == "@":
                        neighbour_rolls += 1

            if neighbour_rolls < 4:
                accessible_count += 1

    return accessible_count


print(find_accessible_rolls(grid))


def count_total_removable(grid):
    row_count = len(grid)
    col_count = len(grid[0])

    warehouse = [list(row) for row in grid]

    neighbour_offsets = [
        (-1, -1), (-1, 0), (-1, 1),
        (0, -1),           (0, 1),
        (1, -1),  (1, 0),  (1, 1),
    ]

    total_removed = 0

    while True:
        to_remove = []

        for row in range(row_count):
            for col in range(col_count):
                if warehouse[row][col] != "@":
                    continue

                neighbour_rolls = 0
                for dr, dc in neighbour_offsets:
                    nr = row + dr
                    nc = col + dc
                    if 0 <= nr < row_count and 0 <= nc < col_count:
                        if warehouse[nr][nc] == "@":
                            neighbour_rolls += 1

                if neighbour_rolls < 4:
                    to_remove.append((row, col))

        if not to_remove:
            break

        for row, col in to_remove:
            warehouse[row][col] = "x"

        total_removed += len(to_remove)

    return total_removed


print(count_total_removable(grid))
