from pathlib import Path

input_text = Path("../../../inputs/05.txt").read_text().strip()

sections = input_text.split("\n\n")

ranges = [
    list(map(int, line.split("-")))
    for line in sections[0].splitlines()
]

ids = list(map(int, sections[1].splitlines()))

fresh_ingredients = [
    id_
    for id_ in ids
    if any(min_ <= id_ <= max_ for min_, max_ in ranges)
]

print(len(fresh_ingredients))

ranges = [(min(a, b), max(a, b)) for a, b in ranges]
ranges.sort(key=lambda r: r[0])

merged = []

for start, end in ranges:
    if not merged or start > merged[-1][1] + 1:
        merged.append([start, end])
    else:
        merged[-1][1] = max(merged[-1][1], end)

total_fresh_ids = sum(end - start + 1 for start, end in merged)

print(total_fresh_ids)
