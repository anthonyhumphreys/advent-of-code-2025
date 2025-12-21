def parse_worksheet(input_text):
    return input_text.strip().split('\n')

def solve_part1(lines):
    # Find columns that are not all spaces (these are problem columns)
    num_cols = len(lines[0])
    problem_cols = []
    
    for col in range(num_cols):
        has_non_space = False
        for row in range(len(lines)):
            if col < len(lines[row]) and lines[row][col] != ' ':
                has_non_space = True
                break
        if has_non_space:
            problem_cols.append(col)
    
    # Group consecutive columns into problems
    problems = []
    current_problem = []
    
    for i, col in enumerate(problem_cols):
        if not current_problem or col == problem_cols[i-1] + 1:
            current_problem.append(col)
        else:
            problems.append(current_problem)
            current_problem = [col]
    if current_problem:
        problems.append(current_problem)
    
    # Process each problem
    grand_total = 0
    
    for prob_cols in problems:
        numbers = []
        operator = None
        
        # Read each row
        for row in range(len(lines)):
            num_str = ''
            for col in prob_cols:
                if col < len(lines[row]):
                    num_str += lines[row][col]
            num_str = num_str.strip()
            
            if num_str in ['+', '*']:
                operator = num_str
            elif num_str:
                numbers.append(int(num_str))
        
        # Calculate result
        if operator and numbers:
            result = numbers[0]
            for i in range(1, len(numbers)):
                if operator == '+':
                    result += numbers[i]
                else:
                    result *= numbers[i]
            grand_total += result
    
    return grand_total

def solve_part2(lines):
    # Read problems right-to-left, building numbers from column digits
    num_cols = len(lines[0])
    
    # Find columns that are not all spaces
    problem_cols = []
    for col in range(num_cols):
        has_non_space = False
        for row in range(len(lines)):
            if col < len(lines[row]) and lines[row][col] != ' ':
                has_non_space = True
                break
        if has_non_space:
            problem_cols.append(col)
    
    # Group consecutive columns into problems
    problems = []
    current_problem = []
    
    for i, col in enumerate(problem_cols):
        if not current_problem or col == problem_cols[i-1] + 1:
            current_problem.append(col)
        else:
            problems.append(current_problem)
            current_problem = [col]
    if current_problem:
        problems.append(current_problem)
    
    grand_total = 0
    
    # Process each problem right-to-left
    for prob_cols in problems:
        numbers = []
        operator = None
        
        # First, identify the operator (it's in the last row)
        last_row = len(lines) - 1
        for col in prob_cols:
            if col < len(lines[last_row]):
                ch = lines[last_row][col]
                if ch in ['+', '*']:
                    operator = ch
                    break
        
        # Process each column from right to left
        for col in reversed(prob_cols):
            num_str = ''
            
            # Read column top to bottom (excluding the last row which has the operator)
            for row in range(len(lines) - 1):
                if col < len(lines[row]):
                    ch = lines[row][col]
                    if ch != ' ':
                        num_str += ch
            
            if num_str:
                numbers.append(int(num_str))
        
        # Calculate result
        if operator and numbers:
            result = numbers[0]
            for i in range(1, len(numbers)):
                if operator == '+':
                    result += numbers[i]
                else:
                    result *= numbers[i]
            grand_total += result
    
    return grand_total

# Read input file
with open('../../../../inputs/06.txt', 'r') as f:
    input_text = f.read()

lines = parse_worksheet(input_text)

part1 = solve_part1(lines)
part2 = solve_part2(lines)

print(part1)
print(part2)
