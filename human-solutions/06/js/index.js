import { readFileSync } from "node:fs";

const input = readFileSync("../../../inputs/06.txt", "utf8").trimEnd();

function solvePart1(input) {
  const rows = input
    .split("\n")
    .map(line => line.trim().split(/\s+/));

  const numberRows = rows.slice(0, -1).map(row => row.map(Number));
  const operators = rows.at(-1);

  const columns = operators.map((_, colIndex) =>
    numberRows.map(row => row[colIndex])
  );

  function applyOp(values, op) {
    return values.reduce((acc, val) => {
      if (op === "+") return acc + val;
      if (op === "*") return acc * val;
      throw new Error(`Unknown operator: ${op}`);
    });
  }

  const columnResults = columns.map((values, i) =>
    applyOp(values, operators[i])
  );

  return columnResults.reduce((a, b) => a + b, 0);
}

function solvePart2(input) {
  const lines = input.split("\n");
  const operatorRow = lines.pop();
  const digitRows = lines;

  const height = digitRows.length;
  const width = Math.max(
    operatorRow.length,
    ...digitRows.map(r => r.length)
  );

  let total = 0;
  let currentNumbers = [];
  let currentOp = null;

  function flushProblem() {
    if (!currentNumbers.length || !currentOp) return;

    const value =
      currentOp === "+"
        ? currentNumbers.reduce((a, b) => a + b, 0)
        : currentNumbers.reduce((a, b) => a * b, 1);

    total += value;
    currentNumbers = [];
    currentOp = null;
  }

  for (let col = width - 1; col >= 0; col--) {
    const digits = [];

    for (let row = 0; row < height; row++) {
      const ch = digitRows[row][col];
      if (ch && ch !== " ") digits.push(ch);
    }

    const op = operatorRow[col];

    const isBlank =
      digits.length === 0 &&
      (op === undefined || op === " ");

    if (isBlank) {
      flushProblem();
      continue;
    }

    if (op === "+" || op === "*") {
      currentOp = op;
    }

    if (digits.length) {
      const number = Number(digits.join(""));
      currentNumbers.push(number);
    }
  }

  // Flush leftmost problem
  flushProblem();

  return total;
}


console.log("Part 1:", solvePart1(input));
console.log("Part 2:", solvePart2(input));
