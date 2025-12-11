import { readFileSync } from "node:fs";

// Read input and split into grid lines
const input = readFileSync("../../../inputs/04.txt", "utf-8").trim();
const grid = input.split("\n");

function findAccessibleRolls(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  // 8-directional neighbour offsets
  const neighbourOffsets = [
    [-1, -1], [-1, 0], [-1, 1],
    [ 0, -1],          [ 0, 1],
    [ 1, -1], [ 1, 0], [ 1, 1],
  ];

  let accessibleCount = 0;
  const debugGrid = grid.map(row => row.split(""));

  // Check each cell in the grid
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Only process cells marked as rolls ("@")
      if (grid[r][c] !== "@") continue;

      let neighbourRolls = 0;

      // Count how many neighbours are also rolls
      for (const [dr, dc] of neighbourOffsets) {
        const nr = r + dr;
        const nc = c + dc;

        // Skip out-of-bounds neighbours
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (grid[nr][nc] === "@") neighbourRolls++;
      }

      // Accessible if less than 4 neighbours are rolls
      if (neighbourRolls < 4) {
        accessibleCount++;
        debugGrid[r][c] = "x"; // Mark accessible rolls in debug grid
      }
    }
  }

  return {
    accessibleCount,
    debugGrid: debugGrid.map(row => row.join("")),
  };
}

const { accessibleCount, debugGrid } = findAccessibleRolls(grid);

console.log(accessibleCount);
