import { readFileSync } from "node:fs";

const input = readFileSync("../../../inputs/01.txt", "utf-8").trim();

let dial = 50;

let part1Counter = 0;
let part2Counter = 0;

function countClicksOnZero(start, signedSteps) {
  if (signedSteps === 0) {
    return 0;
  }

  const startNorm = ((start % 100) + 100) % 100;

  if (signedSteps > 0) {
    const numClicks = signedSteps;
    const firstZeroClick = startNorm === 0 ? 100 : 100 - startNorm;

    if (firstZeroClick > numClicks) {
      return 0;
    }

    return 1 + Math.floor((numClicks - firstZeroClick) / 100);
  } else {
    const numClicks = -signedSteps;
    const firstZeroClick = startNorm === 0 ? 100 : startNorm;

    if (firstZeroClick > numClicks) {
      return 0;
    }

    return 1 + Math.floor((numClicks - firstZeroClick) / 100);
  }
}

function parseLine(line) {
  const direction = line[0];
  const steps = parseInt(line.slice(1), 10);
  const signedSteps = direction === "R" ? steps : -steps;

  part2Counter += countClicksOnZero(dial, signedSteps);

  dial = (dial + signedSteps) % 100;
  dial = (dial + 100) % 100;

  if (dial === 0) {
    part1Counter++;
  }
}

for (const line of input.split("\n")) {
  parseLine(line);
}

console.log(part1Counter);
console.log(part2Counter);
