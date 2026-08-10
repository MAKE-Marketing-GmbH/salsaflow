# Misst am gerenderten Ganzseiten-PNG, welche 20px-Zeilenbaender praktisch leer sind
# (>= 98% der Pixel gleich dem haeufigsten Ton der Zeile) und wo die rechte Haelfte leer ist.
# Aufruf: python3 scripts/aaa-r10-dead.py /tmp/aaa-r10/<tag>/dsk-full.png
import sys
from collections import Counter
from PIL import Image

path = sys.argv[1]
band = int(sys.argv[2]) if len(sys.argv) > 2 else 20
im = Image.open(path).convert('RGB')
W, H = im.size
px = im.load()

runs = []
cur = None
for y0 in range(0, H, band):
    y1 = min(H, y0 + band)
    c = Counter()
    for y in range(y0, y1, 4):
        for x in range(0, W, 4):
            c[px[x, y]] += 1
    top, n = c.most_common(1)[0]
    frac = n / sum(c.values())
    empty = frac >= 0.985
    if empty:
        if cur is None:
            cur = [y0, y1, top]
        else:
            cur[1] = y1
    else:
        if cur is not None:
            runs.append(cur)
            cur = None
if cur is not None:
    runs.append(cur)

print('page', W, 'x', H)
tot = 0
for a, b, col in runs:
    if b - a >= 60:
        tot += b - a
        print(f'  DEAD {b-a:5d}px  y={a}..{b}  bg={col}')
print(f'  total dead >=60px: {tot}px = {tot*100//H}% der Seite')
