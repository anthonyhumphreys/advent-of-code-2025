import fs from 'fs';

function parseWorksheet(input) {
    const lines = input.trim().split('\n');
    return lines;
}

function solvePart1(lines) {
    // Find columns that are not all spaces (these are problem columns)
    const numCols = lines[0].length;
    const problemCols = [];
    
    for (let col = 0; col < numCols; col++) {
        let hasNonSpace = false;
        for (let row = 0; row < lines.length; row++) {
            if (col < lines[row].length && lines[row][col] !== ' ') {
                hasNonSpace = true;
                break;
            }
        }
        if (hasNonSpace) {
            problemCols.push(col);
        }
    }
    
    // Group consecutive columns into problems
    const problems = [];
    let currentProblem = [];
    
    for (let i = 0; i < problemCols.length; i++) {
        if (currentProblem.length === 0 || problemCols[i] === problemCols[i-1] + 1) {
            currentProblem.push(problemCols[i]);
        } else {
            problems.push(currentProblem);
            currentProblem = [problemCols[i]];
        }
    }
    if (currentProblem.length > 0) {
        problems.push(currentProblem);
    }
    
    // Process each problem
    let grandTotal = 0;
    
    for (const problemCols of problems) {
        const numbers = [];
        let operator = null;
        
        // Read each row
        for (let row = 0; row < lines.length; row++) {
            let numStr = '';
            for (const col of problemCols) {
                if (col < lines[row].length) {
                    numStr += lines[row][col];
                }
            }
            numStr = numStr.trim();
            
            if (numStr === '+' || numStr === '*') {
                operator = numStr;
            } else if (numStr !== '') {
                numbers.push(parseInt(numStr));
            }
        }
        
        // Calculate result
        if (operator && numbers.length > 0) {
            let result = numbers[0];
            for (let i = 1; i < numbers.length; i++) {
                if (operator === '+') {
                    result += numbers[i];
                } else {
                    result *= numbers[i];
                }
            }
            grandTotal += result;
        }
    }
    
    return grandTotal;
}

function solvePart2(lines) {
    // Read problems right-to-left, building numbers from column digits
    const numCols = lines[0].length;
    
    // Find columns that are not all spaces
    const problemCols = [];
    for (let col = 0; col < numCols; col++) {
        let hasNonSpace = false;
        for (let row = 0; row < lines.length; row++) {
            if (col < lines[row].length && lines[row][col] !== ' ') {
                hasNonSpace = true;
                break;
            }
        }
        if (hasNonSpace) {
            problemCols.push(col);
        }
    }
    
    // Group consecutive columns into problems
    const problems = [];
    let currentProblem = [];
    
    for (let i = 0; i < problemCols.length; i++) {
        if (currentProblem.length === 0 || problemCols[i] === problemCols[i-1] + 1) {
            currentProblem.push(problemCols[i]);
        } else {
            problems.push(currentProblem);
            currentProblem = [problemCols[i]];
        }
    }
    if (currentProblem.length > 0) {
        problems.push(currentProblem);
    }
    
    let grandTotal = 0;
    
    // Process each problem right-to-left
    for (const problemCols of problems) {
        const numbers = [];
        let operator = null;
        
        // First, identify the operator (it's in the last row)
        const lastRow = lines.length - 1;
        for (const col of problemCols) {
            if (col < lines[lastRow].length) {
                const ch = lines[lastRow][col];
                if (ch === '+' || ch === '*') {
                    operator = ch;
                    break;
                }
            }
        }
        
        // Process each column from right to left
        for (let i = problemCols.length - 1; i >= 0; i--) {
            const col = problemCols[i];
            let numStr = '';
            
            // Read column top to bottom (excluding the last row which has the operator)
            for (let row = 0; row < lines.length - 1; row++) {
                if (col < lines[row].length) {
                    const ch = lines[row][col];
                    if (ch !== ' ') {
                        numStr += ch;
                    }
                }
            }
            
            if (numStr !== '') {
                numbers.push(parseInt(numStr));
            }
        }
        
        // Calculate result
        if (operator && numbers.length > 0) {
            let result = numbers[0];
            for (let i = 1; i < numbers.length; i++) {
                if (operator === '+') {
                    result += numbers[i];
                } else {
                    result *= numbers[i];
                }
            }
            grandTotal += result;
        }
    }
    
    return grandTotal;
}

// Read input file
const input = fs.readFileSync('../../../../inputs/06.txt', 'utf8');
const lines = parseWorksheet(input);

const part1 = solvePart1(lines);
const part2 = solvePart2(lines);

console.log(part1);
console.log(part2);
