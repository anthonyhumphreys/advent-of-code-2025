import sys

def solve():
    if len(sys.argv) < 2:
        print("Usage: python main.py <input_file>")
        sys.exit(1)
        
    input_file = sys.argv[1]
    try:
        with open(input_file, 'r') as f:
            lines = f.read().splitlines()
    except FileNotFoundError:
        print(f"Error: Input file '{input_file}' not found.")
        sys.exit(1)

    pos = 50
    p1_count = 0
    p2_count = 0

    for line in lines:
        if not line: continue
        direction = line[0]
        amount = int(line[1:])

        # Simulate click by click for Part 2
        for _ in range(amount):
            if direction == 'R':
                pos = (pos + 1) % 100
            else:
                pos = (pos - 1) % 100
            
            if pos == 0:
                p2_count += 1
        
        # Check end position for Part 1
        if pos == 0:
            p1_count += 1

    print(p1_count)
    print(p2_count)

if __name__ == "__main__":
    solve()

