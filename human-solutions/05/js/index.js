import { readFileSync } from "node:fs";
// Build a list of "fresh" ranges
// Build a list of IDs
// For each ID, check if it falls into any "fresh" range

const input = readFileSync("../../../inputs/05.txt", "utf-8").trim();
// Split on the new line to grab ranges vs ids
const sections = input.split(/\n\s*\n/);

const ranges = sections[0]
  .split("\n")
  .map(line => line.split("-").map(Number));

const ids = sections[1]
  .split("\n")
  .map(Number);

const freshIngredients = ids.filter(id => 
  ranges.some(([min, max]) => id >= min && id <= max)
)

console.log(freshIngredients.length);

ranges.sort((a, b) => a[0] - b[0]);

const merged = [];

for (const [start, end] of ranges) {
  const last = merged[merged.length - 1];

  if (!last || start > last[1] + 1) {
    merged.push([start, end]);
  } else {
    last[1] = Math.max(last[1], end);
  }
}

const totalFreshIds = merged.reduce(
  (sum, [start, end]) => sum + (end - start + 1),
  0
);

console.log(totalFreshIds);


