// Each line = a 'bank'
// Each line - find  largest num that can be formed by concat
// a certain number of digits in left-to-right order (DO NOT rearrange)
// Part 1: 2 digits per row
// Part 2: 12 digits per row

import { readFileSync } from "node:fs";

const input = readFileSync("../../../inputs/03.txt", "utf-8").trim();

const inputAsArr = input.split('\n');

function getBiggestLeftToRight(row, numDigits) {
  let result = [];
  let startIndex = 0;
  
  for (let pos = 0; pos < numDigits; pos++) {
    const digitsRemaining = numDigits - pos - 1;
    
    const endIndex = row.length - digitsRemaining;
    
    let maxDigit = -1;
    let maxIndex = -1;
    
    for (let i = startIndex; i < endIndex; i++) {
      const digit = parseInt(row[i]);
      if (digit > maxDigit) {
        maxDigit = digit;
        maxIndex = i; 
      }
    }
    
    result.push(maxDigit);
    
    startIndex = maxIndex + 1;
  }
  
  return parseInt(result.join(''));
}


let sum = 0;
let sum2 = 0

inputAsArr.forEach(row => {
  sum += getBiggestLeftToRight(row, 2);
  sum2 += getBiggestLeftToRight(row, 12);
});


console.log(sum);
console.log(sum2);