import { readFileSync } from "node:fs";

const input = readFileSync("../../../inputs/02.txt", "utf-8").trim();

const ranges = input.split(",").map((range) => range.split("-").map(Number));

const invalidIds = new Set();
const invalidIds2 = new Set();

for (const range of ranges) {
  const [start, end] = range;
  for (let i = start; i <= end; i++) {
    if (i.toString().match(/^(\d+)\1$/)) {
      invalidIds.add(i);
    }
    if (/^(\d+)\1+$/.test(i.toString())) { 
      invalidIds2.add(i);
    }
  }
}

const invalidaIdsArr = Array.from(invalidIds);
const invalidaIds2Arr = Array.from(invalidIds2);

const sumOfInvalidIds = invalidaIdsArr.reduce((sum, id) => sum + id, 0);
const sumOfInvalidIds2 = invalidaIds2Arr.reduce((sum, id) => sum + id, 0);

console.log(sumOfInvalidIds);
console.log(sumOfInvalidIds2);