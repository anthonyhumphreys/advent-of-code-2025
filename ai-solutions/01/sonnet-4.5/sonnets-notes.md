# Advent of Code 2025 - Day 1: Secret Entrance
## Sonnet 4.5 Solutions

### Results
- **Part 1:** 1120
- **Part 2:** 6645

### Approach

The problem involves simulating a combination lock dial with positions 0-99 that wraps around.

**Part 1:** Count how many times the dial ends at position 0 after a rotation.

**Part 2:** Count the total number of times the dial points at 0 during any rotation (including positions passed through during the rotation).

### Key Insights

1. **Position tracking:** The dial wraps around, so we use modulo 100 arithmetic:
   - Right rotation: `(position + distance) % 100`
   - Left rotation: `(position - distance) % 100`

2. **Counting zeros during rotation:**
   - For **right rotations** (R): We cross through 0 each time we pass a multiple of 100
     - Count: `(position + distance) // 100`
   - For **left rotations** (L): We hit 0 when going backwards crosses it
     - Count: `(distance // 100) + (1 if distance >= position and position > 0 else 0)`
     - The special check for `position > 0` prevents double-counting when starting at 0

3. **No double-counting:** The formulas above already include the final position if it equals 0, so we don't add it again to Part 2.

### Implementation Notes

All three implementations (Python, JavaScript, Rust) follow the same logic:
- Track current position starting at 50
- Parse each rotation instruction (direction + distance)
- Calculate zeros crossed during rotation for Part 2
- Update position
- Check if final position is 0 for Part 1

### Verification

The solution was verified against the example provided in the problem:
- Example Part 1: 3 ✓
- Example Part 2: 6 ✓