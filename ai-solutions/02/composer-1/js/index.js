const fs = require('fs');
const path = require('path');

// Read input file
const input = fs.readFileSync(path.join(__dirname, '../../../../inputs/02.txt'), 'utf-8').trim();

// Parse ranges
const ranges = input.split(',').map(range => {
  const [start, end] = range.split('-').map(Number);
  return { start, end };
});

// Check if a number is invalid for part 1 (repeated exactly twice)
function isInvalidPart1(num) {
  const str = num.toString();
  const len = str.length;
  
  // Must be even length to be repeated twice
  if (len % 2 !== 0) return false;
  
  const halfLen = len / 2;
  const firstHalf = str.substring(0, halfLen);
  const secondHalf = str.substring(halfLen);
  
  return firstHalf === secondHalf;
}

// Check if a number is invalid for part 2 (repeated at least twice)
function isInvalidPart2(num) {
  const str = num.toString();
  const len = str.length;
  
  // Try all possible pattern lengths from 1 to len/2
  for (let patternLen = 1; patternLen <= len / 2; patternLen++) {
    if (len % patternLen !== 0) continue;
    
    const repetitions = len / patternLen;
    if (repetitions < 2) continue;
    
    const pattern = str.substring(0, patternLen);
    let isValidPattern = true;
    
    for (let i = 1; i < repetitions; i++) {
      const segment = str.substring(i * patternLen, (i + 1) * patternLen);
      if (segment !== pattern) {
        isValidPattern = false;
        break;
      }
    }
    
    if (isValidPattern) return true;
  }
  
  return false;
}

// Find all invalid IDs in ranges
function findInvalidIDs(ranges, isValid) {
  let sum = 0;
  
  for (const range of ranges) {
    for (let num = range.start; num <= range.end; num++) {
      if (isValid(num)) {
        sum += num;
      }
    }
  }
  
  return sum;
}

// Part 1
const part1 = findInvalidIDs(ranges, isInvalidPart1);

// Part 2
const part2 = findInvalidIDs(ranges, isInvalidPart2);

console.log(part1);
console.log(part2);
