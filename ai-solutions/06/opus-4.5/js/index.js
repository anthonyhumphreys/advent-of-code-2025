import { readFileSync } from "node:fs";

const input = readFileSync("../../../../inputs/06.txt", "utf8").trimEnd();

function solvePart1(input) {
  const lines = input.split("\n");
  const operatorLine = lines[lines.length - 1];
  const numberLines = lines.slice(0, -1);

  // Split each line by whitespace to get the numbers
  const numberRows = numberLines.map((line) =>
    line.trim().split(/\s+/).map(Number)
  );
  const operators = operatorLine.trim().split(/\s+/);

  let total = 0;

  for (let col = 0; col < operators.length; col++) {
    const values = numberRows.map((row) => row[col]);
    const op = operators[col];

    let result;
    if (op === "+") {
      result = values.reduce((a, b) => a + b, 0);
    } else if (op === "*") {
      result = values.reduce((a, b) => a * b, 1);
    }

    total += result;
  }

  return total;
}

function solvePart2(input) {
  const lines = input.split("\n");
  const operatorRow = lines[lines.length - 1];
  const digitRows = lines.slice(0, -1);

  const height = digitRows.length;
  const width = Math.max(operatorRow.length, ...digitRows.map((r) => r.length));

  let total = 0;
  let currentNumbers = [];
  let currentOp = null;

  function flushProblem() {
    if (currentNumbers.length === 0 || currentOp === null) return;

    let value;
    if (currentOp === "+") {
      value = currentNumbers.reduce((a, b) => a + b, 0);
    } else {
      value = currentNumbers.reduce((a, b) => a * b, 1);
    }

    total += value;
    currentNumbers = [];
    currentOp = null;
  }

  // Process columns from right to left
  for (let col = width - 1; col >= 0; col--) {
    const digits = [];

    // Collect digits from each row at this column
    for (let row = 0; row < height; row++) {
      const ch = digitRows[row][col];
      if (ch !== undefined && ch !== " ") {
        digits.push(ch);
      }
    }

    const op = operatorRow[col] || " ";

    // Check if this is a separator column (all spaces)
    const isBlank = digits.length === 0 && op === " ";

    if (isBlank) {
      flushProblem();
      continue;
    }

    // Record operator if present
    if (op === "+" || op === "*") {
      currentOp = op;
    }

    // Build number from digits (top to bottom = most to least significant)
    if (digits.length > 0) {
      const number = parseInt(digits.join(""), 10);
      currentNumbers.push(number);
    }
  }

  // Flush the last problem
  flushProblem();

  return total;
}

console.log(solvePart1(input));
console.log(solvePart2(input));

