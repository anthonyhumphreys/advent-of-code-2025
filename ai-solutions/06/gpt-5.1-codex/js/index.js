import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

function readInput() {
  const cliPath = process.argv[2];
  if (cliPath) {
    return readFileSync(cliPath, "utf8");
  }

  const here = path.dirname(fileURLToPath(import.meta.url));
  const fallback = path.resolve(here, "../../../inputs/06.txt");
  return readFileSync(fallback, "utf8");
}

function normalizeLines(raw) {
  const normalized = raw.replace(/\r/g, "");
  const lines = normalized.split("\n");
  if (lines.length && lines.at(-1) === "") lines.pop();
  return lines;
}

function solvePart1(raw) {
  const rows = normalizeLines(raw).map((line) => line.trim().split(/\s+/).filter(Boolean));
  if (rows.length === 0) return 0;

  const operators = rows.at(-1) ?? [];
  const numberRows = rows.slice(0, -1).map((row) => row.map((n) => Number(n)));

  let total = 0;

  for (let col = 0; col < operators.length; col++) {
    const op = operators[col];
    const values = numberRows
      .map((row) => row[col])
      .filter((value) => value !== undefined);

    if (values.length === 0) continue;

    const result =
      op === "+"
        ? values.reduce((sum, value) => sum + value, 0)
        : values.reduce((prod, value) => prod * value, 1);

    total += result;
  }

  return total;
}

function solvePart2(raw) {
  const lines = normalizeLines(raw);
  if (lines.length === 0) return 0;

  const operatorRow = lines.at(-1) ?? "";
  const digitRows = lines.slice(0, -1);

  const height = digitRows.length;
  const width = Math.max(operatorRow.length, ...digitRows.map((line) => line.length));

  let total = 0;
  let currentNumbers = [];
  let currentOp = null;

  const flush = () => {
    if (!currentNumbers.length || !currentOp) return;
    const value =
      currentOp === "+"
        ? currentNumbers.reduce((sum, value) => sum + value, 0)
        : currentNumbers.reduce((prod, value) => prod * value, 1);
    total += value;
    currentNumbers = [];
    currentOp = null;
  };

  for (let col = width - 1; col >= 0; col--) {
    const digits = [];

    for (let row = 0; row < height; row++) {
      const ch = digitRows[row][col];
      if (ch && ch !== " ") {
        digits.push(ch);
      }
    }

    const op = operatorRow[col] ?? " ";
    const isBlank = digits.length === 0 && op === " ";

    if (isBlank) {
      flush();
      continue;
    }

    if (op === "+" || op === "*") {
      currentOp = op;
    }

    if (digits.length) {
      currentNumbers.push(Number(digits.join("")));
    }
  }

  flush();
  return total;
}

const input = readInput();
const part1 = solvePart1(input);
const part2 = solvePart2(input);

console.log(part1);
console.log(part2);

