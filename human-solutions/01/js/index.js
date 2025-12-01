import { readFileSync } from "node:fs";

const input = readFileSync("../../../inputs/01.txt", "utf-8").trim();

let dial = 50;

let counter = 0;

function parseLine(line) {
  const direction = line[0];
  const steps = parseInt(line.slice(1));

  if (direction === "R") {
    dial += steps;
  } else if (direction === "L") {
    dial -= steps;
  }

  dial = (dial % 100 + 100) % 100;
  if (dial === 0) {
    counter++
  }
}

const lines = input.split("\n");

for (const line of lines) {
  parseLine(line);
}

console.log(counter);