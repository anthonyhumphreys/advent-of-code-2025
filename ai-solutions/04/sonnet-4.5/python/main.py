import os

def solve():
    # Read input file
    input_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..', 'inputs', '04.txt')
    input_path = os.path.normpath(input_path)
    with open(input_path, 'r') as f:
        input_text = f.read().strip()
    
    # Parse the grid
    grid = [list(line) for line in input_text.split('\n')]
    rows = len(grid)
    cols = len(grid[0])
    
    # Helper function to count neighbors of a position
    def count_neighbors(grid, r, c):
        directions = [
            (-1, -1), (-1, 0), (-1, 1),
            (0, -1),           (0, 1),
            (1, -1),  (1, 0),  (1, 1)
        ]
        
        count = 0
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]):
                if grid[nr][nc] == '@':
                    count += 1
        return count
    
    # Part 1: Count initially accessible rolls
    def part1(grid):
        accessible = 0
        for r in range(len(grid)):
            for c in range(len(grid[0])):
                if grid[r][c] == '@':
                    if count_neighbors(grid, r, c) < 4:
                        accessible += 1
        return accessible
    
    # Part 2: Iteratively remove accessible rolls
    def part2(grid):
        # Create a mutable copy of the grid
        mutable_grid = [row[:] for row in grid]
        total_removed = 0
        
        while True:
            # Find all accessible rolls
            to_remove = []
            for r in range(len(mutable_grid)):
                for c in range(len(mutable_grid[0])):
                    if mutable_grid[r][c] == '@':
                        if count_neighbors(mutable_grid, r, c) < 4:
                            to_remove.append((r, c))
            
            # If no rolls can be removed, stop
            if not to_remove:
                break
            
            # Remove all accessible rolls
            for r, c in to_remove:
                mutable_grid[r][c] = '.'
            
            total_removed += len(to_remove)
        
        return total_removed
    
    # Solve both parts
    answer1 = part1(grid)
    answer2 = part2(grid)
    
    print(answer1)
    print(answer2)

if __name__ == '__main__':
    solve()

