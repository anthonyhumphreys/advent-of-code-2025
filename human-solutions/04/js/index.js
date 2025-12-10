import { readFileSync } from "node:fs";

const input = readFileSync("../../../inputs/04.txt", "utf-8").trim();
const grid = input.split("\n");

function countAccessibleAtSymbols(grid) {
  const totalRows = grid.length;
  const totalColumns = grid[0].length;

  const neighbourOffsets = [
    [-1, -1], [-1,  0], [-1,  1],
    [ 0, -1],           [ 0,  1],
    [ 1, -1], [ 1,  0], [ 1,  1],
  ];

  let accessibleCount = 0;

  for (let row = 0; row < totalRows; row++) {
    for (let column = 0; column < totalColumns; column++) {

      const cellValue = grid[row][column];

      // Only @ cells matter
      if (cellValue !== "@") continue;

      let hasNeighbouringAt = false;

      // Check 8 neighbours
      for (const [rowOffset, columnOffset] of neighbourOffsets) {
        const neighbourRow = row + rowOffset;
        const neighbourColumn = column + columnOffset;

        // Bounds check
        if (
          neighbourRow < 0 || neighbourRow >= totalRows ||
          neighbourColumn < 0 || neighbourColumn >= totalColumns
        ) {
          continue;
        }

        const neighbourValue = grid[neighbourRow][neighbourColumn];

        // Only @ blocks access
        if (neighbourValue === "@") {
          hasNeighbouringAt = true;
          break;
        }
      }

      // Only count @ symbols with no @ neighbours
      if (!hasNeighbouringAt) {
        accessibleCount++;
      }
    }
  }

  return accessibleCount;
}

console.log(countAccessibleAtSymbols(grid));
