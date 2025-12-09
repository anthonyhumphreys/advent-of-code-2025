# This seems to have been added by an extension - typed python seems like witchcraft
from typing import Any


import re

with open("../../../inputs/02.txt", "r") as file:
  input = file.read().strip()

ranges = []
for r in input.split(","):
    start_str, end_str = r.split("-")
    ranges.append((int(start_str), int(end_str)))

pattern1 = re.compile(r'^(\d+)\1$')
pattern2 = re.compile(r'^(\d+)\1+$')

invalid_ids = set()
invalid_ids2 = set()

for start, end in ranges:
    for i in range(start, end + 1):
        s = str(i)

        if pattern1.match(s):
            invalid_ids.add(i)

        if pattern2.match(s):
            invalid_ids2.add(i)

invalid_ids_list = list(invalid_ids)
invalid_ids2_list = list(invalid_ids2)

sum_invalid = sum(invalid_ids_list)
sum_invalid2 = sum(invalid_ids2_list)

print(sum_invalid)
print(sum_invalid2)