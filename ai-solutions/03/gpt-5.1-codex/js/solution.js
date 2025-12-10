const fs = require("fs");

function maxSubsequenceNumber(line, k) {
  const digits = line.trim();
  if (k >= digits.length) return BigInt(digits);

  let remove = digits.length - k;
  const stack = [];

  for (const ch of digits) {
    while (remove > 0 && stack.length > 0 && stack[stack.length - 1] < ch) {
      stack.pop();
      remove--;
    }
    stack.push(ch);
  }

  const kept = stack.slice(0, k).join("");
  return BigInt(kept);
}

function main() {
  if (process.argv.length < 3) {
    console.error("Usage: node solution.js <input_file>");
    process.exit(1);
  }

  const inputPath = process.argv[2];
  const lines = fs.readFileSync(inputPath, "utf8").trim().split("\n");

  let part1 = 0n;
  let part2 = 0n;

  for (const line of lines) {
    if (!line.trim()) continue;
    part1 += maxSubsequenceNumber(line, 2);
    part2 += maxSubsequenceNumber(line, 12);
  }

  console.log(part1.toString());
  console.log(part2.toString());
}

main();
