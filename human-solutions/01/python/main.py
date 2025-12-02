with open("../../../inputs/01.txt", "r") as file:
  input = file.read().strip()

dial = 50
part1_counter = 0
part2_counter = 0

def count_clicks_on_zero(start, signed_steps):
  if signed_steps == 0:
    return 0
  
  start_norm = ((start % 100) + 100) % 100
  
  if signed_steps > 0:
    num_clicks = signed_steps
    first_zero_click = 100 if start_norm == 0 else 100 - start_norm
    
    if first_zero_click > num_clicks:
      return 0
    
    return 1 + (num_clicks - first_zero_click) // 100
  else:
    num_clicks = -signed_steps
    first_zero_click = 100 if start_norm == 0 else start_norm
    
    if first_zero_click > num_clicks:
      return 0
    
    return 1 + (num_clicks - first_zero_click) // 100

def parse_line(line):
  global dial, part1_counter, part2_counter
  direction = line[0]
  steps = int(line[1:])
  signed_steps = steps if direction == "R" else -steps
  
  part2_counter += count_clicks_on_zero(dial, signed_steps)
  
  dial = (dial + signed_steps) % 100
  dial = (dial + 100) % 100
  
  if dial == 0:
    part1_counter += 1

for line in input.split("\n"):
  parse_line(line)
  
print(part1_counter)
print(part2_counter)