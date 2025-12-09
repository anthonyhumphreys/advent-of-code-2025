import os

def solve():
    input_path = os.path.join(os.path.dirname(__file__), "../../../../inputs/02.txt")
    with open(input_path, 'r') as f:
        data = f.read().strip()

    ranges = []
    parts = data.split(',')
    for part in parts:
        start, end = map(int, part.split('-'))
        ranges.append((start, end))

    total_p1 = 0
    total_p2 = 0

    for start, end in ranges:
        for n in range(start, end + 1):
            s = str(n)
            length = len(s)
            
            # Part 1 Check
            is_p1 = False
            if length % 2 == 0:
                half = length // 2
                if s[:half] == s[half:]:
                    is_p1 = True
                    total_p1 += n
            
            # Part 2 Check
            # Check if composed of repeated pattern of length L
            # L must verify: length % L == 0 and length // L >= 2
            is_p2 = False
            for L in range(1, length // 2 + 1):
                if length % L == 0:
                    pattern = s[:L]
                    times = length // L
                    if pattern * times == s:
                        is_p2 = True
                        total_p2 += n
                        break
    
    print(total_p1)
    print(total_p2)

if __name__ == "__main__":
    solve()
