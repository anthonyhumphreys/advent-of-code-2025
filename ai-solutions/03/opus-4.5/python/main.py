import sys
from pathlib import Path


def max_subsequence_value(digits: str, keep: int) -> int:
    """
    Return the maximum-valued subsequence of `keep` digits, preserving order.
    Uses a monotonic stack to build the lexicographically largest sequence.
    """
    digits = digits.strip()
    stack: list[str] = []
    n = len(digits)

    for idx, ch in enumerate(digits):
        remaining = n - idx - 1
        while stack and len(stack) + remaining >= keep and stack[-1] < ch:
            stack.pop()
        if len(stack) < keep:
            stack.append(ch)

    return int("".join(stack))


def solve(lines: list[str]) -> tuple[int, int]:
    part1 = 0
    part2 = 0

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        part1 += max_subsequence_value(stripped, 2)
        part2 += max_subsequence_value(stripped, 12)

    return part1, part2


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python main.py <input_file>", file=sys.stderr)
        sys.exit(1)

    input_path = Path(sys.argv[1])
    if not input_path.exists():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    lines = input_path.read_text().splitlines()
    part1, part2 = solve(lines)

    print(part1)
    print(part2)


if __name__ == "__main__":
    main()
