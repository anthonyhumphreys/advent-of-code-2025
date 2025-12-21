import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function solve() {
  const inputPath = path.resolve(__dirname, '../../../../inputs/06.txt');
  const content = fs.readFileSync(inputPath, 'utf-8');
  const lines = content.split('\n').filter(line => line.length > 0);

  if (lines.length === 0) return;

  // Normalize line lengths
  const maxLength = Math.max(...lines.map(l => l.length));
  const paddedLines = lines.map(l => l.padEnd(maxLength, ' '));

  // Find separator columns (columns that are strictly all spaces)
  const separatorIndices = [-1];
  for (let col = 0; col < maxLength; col++) {
    let isSeparator = true;
    for (let row = 0; row < paddedLines.length; row++) {
      if (paddedLines[row][col] !== ' ') {
        isSeparator = false;
        break;
      }
    }
    if (isSeparator) {
      separatorIndices.push(col);
    }
  }
  separatorIndices.push(maxLength);

  let totalPart1 = 0n;
  let totalPart2 = 0n;

  // Iterate through blocks defined by separators
  for (let i = 0; i < separatorIndices.length - 1; i++) {
    const startCol = separatorIndices[i] + 1;
    const endCol = separatorIndices[i + 1];

    if (startCol >= endCol) continue;

    // Extract block content
    const operatorRow = paddedLines[paddedLines.length - 1];
    const operatorChar = operatorRow.substring(startCol, endCol).trim();
    
    if (!operatorChar) {
      continue;
    }
    
    const op = operatorChar; // Should be '+' or '*'

    // Part 1 Parsing
    let numbersP1 = [];
    for (let row = 0; row < paddedLines.length - 1; row++) {
      const lineSlice = paddedLines[row].substring(startCol, endCol).trim();
      if (lineSlice.length > 0) {
        numbersP1.push(BigInt(lineSlice));
      }
    }

    if (numbersP1.length > 0) {
      let val = numbersP1[0];
      if (op === '+') {
        for (let k = 1; k < numbersP1.length; k++) val += numbersP1[k];
      } else if (op === '*') {
        for (let k = 1; k < numbersP1.length; k++) val *= numbersP1[k];
      }
      totalPart1 += val;
    }

    // Part 2 Parsing
    let numbersP2 = [];
    
    // Iterate columns from right to left
    for (let c = endCol - 1; c >= startCol; c--) {
      let numStr = "";
      for (let row = 0; row < paddedLines.length - 1; row++) {
        const char = paddedLines[row][c];
        if (char !== ' ') {
          numStr += char;
        }
      }
      
      if (numStr.length > 0) {
        numbersP2.push(BigInt(numStr));
      }
    }

    if (numbersP2.length > 0) {
      let val = numbersP2[0];
      if (op === '+') {
        for (let k = 1; k < numbersP2.length; k++) val += numbersP2[k];
      } else if (op === '*') {
        for (let k = 1; k < numbersP2.length; k++) val *= numbersP2[k];
      }
      totalPart2 += val;
    }
  }

  console.log(totalPart1.toString());
  console.log(totalPart2.toString());
}

solve();
