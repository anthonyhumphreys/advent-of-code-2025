import sys

with open(sys.argv[1], 'r') as f:
    input_data = f.read().strip()

grid = [list(line) for line in input_data.split('\n')]
rows = len(grid)
cols = len(grid[0])

# Directions for 8 neighbors
directions = [
    (-1, -1), (-1, 0), (-1, 1),
    (0, -1),           (0, 1),
    (1, -1),  (1, 0),  (1, 1)
]

def count_adjacent_rolls(r, c):
    count = 0
    for dr, dc in directions:
        nr, nc = r + dr, c + dc
        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '@':
            count += 1
    return count

# Part 1: Count accessible rolls
part1 = 0
for r in range(rows):
    for c in range(cols):
        if grid[r][c] == '@' and count_adjacent_rolls(r, c) < 4:
            part1 += 1

# Part 2: Iteratively remove accessible rolls
grid2 = [row[:] for row in grid]
total_removed = 0

while True:
    to_remove = []
    for r in range(rows):
        for c in range(cols):
            if grid2[r][c] == '@':
                adjacent_count = 0
                for dr, dc in directions:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols and grid2[nr][nc] == '@':
                        adjacent_count += 1
                if adjacent_count < 4:
                    to_remove.append((r, c))
    
    if not to_remove:
        break
    
    for r, c in to_remove:
        grid2[r][c] = '.'
    total_removed += len(to_remove)

print(part1)
print(total_removed)

