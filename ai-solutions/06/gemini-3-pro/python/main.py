import os
import sys

def solve():
    # Determine input path
    # Assuming script is in ai-solutions/06/gemini-3-pro/python/
    # Input is in inputs/06.txt (relative to project root)
    # Project root is 4 levels up
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(base_dir, '../../../../inputs/06.txt')
    
    with open(input_path, 'r') as f:
        lines = [line.strip('\n') for line in f.readlines()]
        
    if not lines:
        return

    # Filter out empty lines if any (though typically structure matters)
    # Actually, input might have trailing newline.
    lines = [l for l in lines if l]

    max_len = max(len(l) for l in lines)
    padded_lines = [l.ljust(max_len) for l in lines]

    # Find separator columns
    separator_indices = [-1]
    for col in range(max_len):
        is_separator = True
        for row in range(len(padded_lines)):
            if padded_lines[row][col] != ' ':
                is_separator = False
                break
        if is_separator:
            separator_indices.append(col)
    separator_indices.append(max_len)

    total_part1 = 0
    total_part2 = 0

    # Sort indices to ensure correct iteration (should be sorted by append order)
    separator_indices.sort()
    
    # Process blocks
    # We iterate through the separator indices. Consecutive indices might be adjacent (e.g. 5, 6)
    # meaning the block between them is empty (start=6, end=6).
    # Or 5, 8 (start=6, end=8).
    
    for i in range(len(separator_indices) - 1):
        start_col = separator_indices[i] + 1
        end_col = separator_indices[i+1]
        
        if start_col >= end_col:
            continue
            
        # Check for operator
        operator_row = padded_lines[-1]
        op_char_slice = operator_row[start_col:end_col].strip()
        
        if not op_char_slice:
            continue
            
        op = op_char_slice
        
        # Part 1
        numbers_p1 = []
        for row in range(len(padded_lines) - 1):
            line_slice = padded_lines[row][start_col:end_col].strip()
            if line_slice:
                numbers_p1.append(int(line_slice))
                
        if numbers_p1:
            val = numbers_p1[0]
            if op == '+':
                for k in range(1, len(numbers_p1)):
                    val += numbers_p1[k]
            elif op == '*':
                for k in range(1, len(numbers_p1)):
                    val *= numbers_p1[k]
            total_part1 += val
            
        # Part 2
        numbers_p2 = []
        # Right to left columns
        for c in range(end_col - 1, start_col - 1, -1):
            num_str = ""
            for row in range(len(padded_lines) - 1):
                char = padded_lines[row][c]
                if char != ' ':
                    num_str += char
            
            if num_str:
                numbers_p2.append(int(num_str))
                
        if numbers_p2:
            val = numbers_p2[0]
            if op == '+':
                for k in range(1, len(numbers_p2)):
                    val += numbers_p2[k]
            elif op == '*':
                for k in range(1, len(numbers_p2)):
                    val *= numbers_p2[k]
            total_part2 += val

    print(total_part1)
    print(total_part2)

if __name__ == "__main__":
    solve()

