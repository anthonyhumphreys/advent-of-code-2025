with open("../../../inputs/03.txt", "r") as file:
  input = file.read().strip()

rows = input.split('\n')

def getBiggestLeftToRight(row, numDigits):
  result = []
  startIndex = 0

  for pos in range(numDigits):
    digitsRemaining = numDigits - pos - 1
    endIndex = len(row) - digitsRemaining
    
    maxDigit = -1
    maxIndex = -1

    for i in range(startIndex, endIndex):
      digit = int(row[i])
      if digit > maxDigit:
        maxDigit = digit
        maxIndex = i

    result.append(str(maxDigit))
    startIndex = maxIndex + 1

  return int(''.join(result))

sum = 0
sum2 = 0

for row in rows:
  sum += getBiggestLeftToRight(row, 2)
  sum2 += getBiggestLeftToRight(row, 12)

print(sum)
print(sum2)