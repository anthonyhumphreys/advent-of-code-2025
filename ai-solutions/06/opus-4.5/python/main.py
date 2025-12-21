from pathlib import Path


def solve_part1(input_text: str) -> int:
    lines = input_text.splitlines()
    operator_line = lines[-1]
    number_lines = lines[:-1]

    # Split each line by whitespace to get the numbers
    number_rows = [list(map(int, line.split())) for line in number_lines]
    operators = operator_line.split()

    total = 0

    for col, op in enumerate(operators):
        values = [row[col] for row in number_rows]

        if op == "+":
            result = sum(values)
        elif op == "*":
            result = 1
            for v in values:
                result *= v

        total += result

    return total


def solve_part2(input_text: str) -> int:
    lines = input_text.splitlines()
    operator_row = lines[-1]
    digit_rows = lines[:-1]

    height = len(digit_rows)
    width = max(len(operator_row), max(len(r) for r in digit_rows))

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

    # Process columns from right to left
    for col in range(width - 1, -1, -1):
        digits = []

        # Collect digits from each row at this column
        for row in range(height):
            if col < len(digit_rows[row]):
                ch = digit_rows[row][col]
                if ch != " ":
                    digits.append(ch)

        op = operator_row[col] if col < len(operator_row) else " "

        # Check if this is a separator column (all spaces)
        is_blank = len(digits) == 0 and op == " "

        if is_blank:
            flush_problem()
            continue

        # Record operator if present
        if op in ("+", "*"):
            current_op = op

        # Build number from digits (top to bottom = most to least significant)
        if digits:
            number = int("".join(digits))
            current_numbers.append(number)

    # Flush the last problem
    flush_problem()

    return total


if __name__ == "__main__":
    input_text = Path("../../../../inputs/06.txt").read_text().rstrip()

    print(solve_part1(input_text))
    print(solve_part2(input_text))

