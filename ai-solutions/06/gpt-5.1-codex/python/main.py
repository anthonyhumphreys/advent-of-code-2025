from __future__ import annotations

from pathlib import Path
import sys


def read_input() -> str:
    if len(sys.argv) > 1:
        return Path(sys.argv[1]).read_text()

    here = Path(__file__).resolve().parent
    fallback = (here / "../../../inputs/06.txt").resolve()
    return fallback.read_text()


def normalize_lines(raw: str) -> list[str]:
    text = raw.replace("\r", "")
    lines = text.split("\n")
    if lines and lines[-1] == "":
        lines.pop()
    return lines


def solve_part1(raw: str) -> int:
    rows = [line.strip().split() for line in normalize_lines(raw)]
    if not rows:
        return 0

    operators = rows[-1]
    number_rows = [list(map(int, row)) for row in rows[:-1]]

    total = 0

    for col, op in enumerate(operators):
        values = [row[col] for row in number_rows if col < len(row)]
        if not values:
            continue

        if op == "+":
            result = sum(values)
        elif op == "*":
            result = 1
            for value in values:
                result *= value
        else:
            raise ValueError(f"Unknown operator: {op}")

        total += result

    return total


def solve_part2(raw: str) -> int:
    lines = normalize_lines(raw)
    if not lines:
        return 0

    operator_row = lines[-1]
    digit_rows = lines[:-1]

    width = max([len(operator_row)] + [len(row) for row in digit_rows])
    height = len(digit_rows)

    total = 0
    current_numbers: list[int] = []
    current_op: str | None = None

    def flush() -> None:
        nonlocal total, current_numbers, current_op
        if not current_numbers or current_op is None:
            return

        if current_op == "+":
            value = sum(current_numbers)
        else:
            value = 1
            for number in current_numbers:
                value *= number

        total += value
        current_numbers = []
        current_op = None

    for col in range(width - 1, -1, -1):
        digits: list[str] = []

        for row in range(height):
            line = digit_rows[row]
            if col < len(line):
                ch = line[col]
                if ch != " ":
                    digits.append(ch)

        op = operator_row[col] if col < len(operator_row) else " "
        is_blank = not digits and op == " "

        if is_blank:
            flush()
            continue

        if op in "+*":
            current_op = op

        if digits:
            current_numbers.append(int("".join(digits)))

    flush()
    return total


if __name__ == "__main__":
    puzzle_input = read_input()
    print(solve_part1(puzzle_input))
    print(solve_part2(puzzle_input))

