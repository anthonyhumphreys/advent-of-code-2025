import sys
import os

def solve():
    # Default path relative to this script
    input_path = os.path.join(os.path.dirname(__file__), "../../../../inputs/04.txt")
    if len(sys.argv) > 1:
        input_path = sys.argv[1]
    
    try:
        with open(input_path, 'r') as f:
            grid = [list(line.strip()) for line in f if line.strip()]
    except FileNotFoundError:
        print(f"Error: Input file not found at {input_path}")
        return

    rows = len(grid)
    cols = len(grid[0])

    def count_neighbors(r, c, current_grid):
        count = 0
        for dr in [-1, 0, 1]:
            for dc in [-1, 0, 1]:
                if dr == 0 and dc == 0:
                    continue
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    if current_grid[nr][nc] == '@':
                        count += 1
        return count

    # Part 1
    p1_count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '@':
                if count_neighbors(r, c, grid) < 4:
                    p1_count += 1
    
    print(p1_count)

    # Part 2
    # Create a working copy of the grid
    current_grid = [row[:] for row in grid]
    total_removed = 0
    
    while True:
        to_remove = []
        for r in range(rows):
            for c in range(cols):
                if current_grid[r][c] == '@':
                    if count_neighbors(r, c, current_grid) < 4:
                        to_remove.append((r, c))
        
        if not to_remove:
            break
            
        total_removed += len(to_remove)
        for r, c in to_remove:
            current_grid[r][c] = '.'
            
    print(total_removed)

if __name__ == "__main__":
    solve()

