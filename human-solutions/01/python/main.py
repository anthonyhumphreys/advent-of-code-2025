with open("../../../inputs/01.txt", "r") as file:
  input = file.read().strip()

dial = 50
counter = 0

def parse_line(line):
  global dial, counter
  direction = line[0]
  steps = int(line[1:])
  if direction == "R":
    dial += steps
  elif direction == "L":
    dial -= steps
  dial = (dial % 100 + 100) % 100
  if dial == 0:
    counter += 1

for line in input.split("\n"):
  parse_line(line)
  
print(counter)