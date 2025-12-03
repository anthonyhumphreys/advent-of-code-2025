#!/usr/bin/env node
/**
 * Advent of Code 2025 - Day 01
 * GPT-5.1 Codex solution (JavaScript)
 */

const fs = require("fs");
const path = require("path");

const MODULO = 100;

function parseMoves(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({
      dir: line[0],
      dist: Number(line.slice(1)),
    }));
}

function countZeroHits(position, distance, direction) {
  if (distance <= 0) return 0;

  let first;
  if (direction === "R") {
    first = (MODULO - position) % MODULO;
  } else {
    first = position % MODULO;
  }

  if (first === 0) {
    first = MODULO;
  }

  if (distance < first) {
    return 0;
  }

  return 1 + Math.floor((distance - first) / MODULO);
}

function solve(moves) {
  let position = 50;
  let part1 = 0;
  let part2 = 0;

  for (const move of moves) {
    part2 += countZeroHits(position, move.dist, move.dir);

    if (move.dir === "R") {
      position = (position + move.dist) % MODULO;
    } else {
      position = (position - (move.dist % MODULO) + MODULO) % MODULO;
    }

    if (position === 0) {
      part1 += 1;
    }
  }

  return { part1, part2 };
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("Usage: node index.js <input_file>");
    process.exit(1);
  }

  const absolute = path.resolve(inputPath);
  if (!fs.existsSync(absolute)) {
    console.error(`Input file not found: ${absolute}`);
    process.exit(1);
  }

  const moves = parseMoves(fs.readFileSync(absolute, "utf8"));
  const { part1, part2 } = solve(moves);

  console.log(part1);
  console.log(part2);
}

main();

