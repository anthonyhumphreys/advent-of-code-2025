
import os

def solve_line(line, k):
    digits = [int(c) for c in line.strip()]
    n = len(digits)
    result = []
    start = 0
    
    for i in range(k):
        # We need to pick one digit.
        # We need to leave k - 1 - i digits for the remaining steps.
        # So we can search up to n - (k - i)
        # range end is exclusive in python, so + 1
        end = n - (k - i) + 1
        
        best_digit = -1
        best_idx = -1
        
        # Search for the largest digit in the valid range
        # We prefer the earliest occurrence to leave more room (though greedy choice just needs any valid max)
        # Actually, for the greedy strategy to work, we pick the largest digit. 
        # If there are ties, picking the earliest one is always better or equal because it leaves a larger suffix.
        
        # Optimization: no need to scan efficiently if k and n are small enough, but let's be reasonably efficient.
        # slicing digits[start:end]
        
        search_window = digits[start:end]
        max_d = -1
        max_idx_in_window = -1
        
        for idx, d in enumerate(search_window):
            if d > max_d:
                max_d = d
                max_idx_in_window = idx
            if d == 9: # Optimization: 9 is max possible, take it immediately
                break
                
        result.append(max_d)
        start = start + max_idx_in_window + 1
        
    return int("".join(map(str, result)))

def main():
    input_path = os.path.join(os.path.dirname(__file__), "../../../../inputs/03.txt")
    with open(input_path, 'r') as f:
        lines = [line.strip() for line in f if line.strip()]

    total_p1 = 0
    total_p2 = 0
    
    for line in lines:
        total_p1 += solve_line(line, 2)
        total_p2 += solve_line(line, 12)
        
    print(total_p1)
    print(total_p2)

if __name__ == "__main__":
    main()
