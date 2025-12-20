import sys
from typing import List


def max_subsequence_number(line: str, k: int) -> int:
    """
    Return the largest possible number (as int) by keeping k digits
    from the given digit string while preserving order.
    """
    line = line.strip()
    if k >= len(line):
        return int(line)

    remove = len(line) - k
    stack: List[str] = []

    for ch in line:
        while remove and stack and stack[-1] < ch:
            stack.pop()
            remove -= 1
        stack.append(ch)

    # If we still have extra digits, trim from the right.
    stack = stack[:k]
    return int("".join(stack))


def solve(lines: List[str]) -> None:
    part1 = 0
    part2 = 0

    for line in lines:
        line = line.strip()
        if not line:
            continue
        part1 += max_subsequence_number(line, 2)
        part2 += max_subsequence_number(line, 12)

    print(part1)
    print(part2)


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python solution.py <input_file>")
        sys.exit(1)

    input_path = sys.argv[1]
    with open(input_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    solve(lines)


if __name__ == "__main__":
    main()
