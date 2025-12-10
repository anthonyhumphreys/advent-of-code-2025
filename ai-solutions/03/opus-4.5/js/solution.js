const fs = require("fs");
const path = require("path");

function maxSubsequenceValue(digits, keep) {
  const stack = [];
  const n = digits.length;

  for (let i = 0; i < n; i++) {
    const ch = digits[i];
    const remaining = n - i - 1;
    while (stack.length && stack.length + remaining >= keep && stack[stack.length - 1] < ch) {
      stack.pop();
    }
    if (stack.length < keep) {
      stack.push(ch);
    }
  }

  return BigInt(stack.join(""));
}

function solve(lines) {
  let part1 = 0n;
  let part2 = 0n;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    part1 += maxSubsequenceValue(line, 2);
    part2 += maxSubsequenceValue(line, 12);
  }

  return { part1, part2 };
}

function main() {
  if (process.argv.length < 3) {
    console.error("Usage: node solution.js <input_file>");
    process.exit(1);
  }

  const inputPath = path.resolve(process.argv[2]);
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const lines = fs.readFileSync(inputPath, "utf8").trimEnd().split("\n");
  const { part1, part2 } = solve(lines);

  console.log(part1.toString());
  console.log(part2.toString());
}

main();
