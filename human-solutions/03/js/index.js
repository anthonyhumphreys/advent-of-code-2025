// Each line = a 'bank'
// Each line - find largest num that can be formed by concat
// a certain number of digits in left-to-right order (DO NOT rearrange)
// add the digits

import { readFileSync } from "node:fs";

const input = readFileSync("../../../inputs/03.txt", "utf-8").trim();

const inputAsArr = input.split('\n');

function getTwoBiggestLeftToRight(row) {
  let maxJoltage = -1;

  for (let i = 0; i < row.length; i++) {
    for (let j = i + 1; j < row.length; j++) {
      const joltage = parseInt(`${row[i]}${row[j]}`);
      if (joltage > maxJoltage) {
        maxJoltage = joltage;
      }
    }
  }

  return maxJoltage;
}

let sum = 0;

inputAsArr.forEach(row => {
  sum += getTwoBiggestLeftToRight(row);
});

console.log(sum);
