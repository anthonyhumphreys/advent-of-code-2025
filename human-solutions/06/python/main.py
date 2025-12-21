from pathlib import Path

input_text = Path("../../../inputs/06.txt").read_text().rstrip()


def solve_part1(input_text: str) -> int:
    rows = [
        line.strip().split()
        for line in input_text.splitlines()
    ]

    number_rows = [
        list(map(int, row))
        for row in rows[:-1]
    ]
    operators = rows[-1]

    columns = [
        [row[i] for row in number_rows]
        for i in range(len(operators))
    ]

    def apply_op(values, op):
        result = values[0]
        for v in values[1:]:
            if op == "+":
                result += v
            elif op == "*":
                result *= v
            else:
                raise ValueError(f"Unknown operator: {op}")
        return result

    column_results = [
        apply_op(col, operators[i])
        for i, col in enumerate(columns)
    ]

    return sum(column_results)


def solve_part2(input_text: str) -> int:
    lines = input_text.splitlines()
    operator_row = lines.pop()
    digit_rows = lines

    height = len(digit_rows)
    width = max(
        len(operator_row),
        *(len(r) for r in digit_rows)
    )

    total = 0
    current_numbers = []
    current_op = None

    def flush_problem():
        nonlocal total, current_numbers, current_op
        if not current_numbers or current_op is None:
            return

        if current_op == "+":
            value = sum(current_numbers)
        else:
            value = 1
            for n in current_numbers:
                value *= n

        total += value
        current_numbers = []
        current_op = None

    for col in range(width - 1, -1, -1):
        digits = []

        for row in range(height):
            if col < len(digit_rows[row]):
                ch = digit_rows[row][col]
                if ch != " ":
                    digits.append(ch)

        op = operator_row[col] if col < len(operator_row) else " "

        is_blank = not digits and op == " "

        if is_blank:
            flush_problem()
            continue

        if op in "+*":
            current_op = op

        if digits:
            current_numbers.append(int("".join(digits)))

    flush_problem()
    return total


print(solve_part1(input_text))
print(solve_part2(input_text))
