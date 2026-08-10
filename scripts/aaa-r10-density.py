# Deckungsgrad je Sektion am gerenderten Ganzseiten-PNG: Anteil der Pixel, die NICHT der
# Hintergrundton der Sektion sind. Niedrige Werte = die Flaeche liest sich als leer,
# unabhaengig davon ob DOM-Boxen darin liegen.
# Aufruf: python3 scripts/aaa-r10-density.py <png> <top:h> <top:h> ...
import sys
from collections import Counter
from PIL import Image

im = Image.open(sys.argv[1]).convert('RGB')
W, H = im.size
px = im.load()

def cover(y0, y1, x0=0, x1=W):
    c = Counter()
    for y in range(y0, min(y1, H), 3):
        for x in range(x0, x1, 3):
            c[px[x, y]] += 1
    bg, n = c.most_common(1)[0]
    tot = sum(c.values())
    near = 0
    for col, k in c.items():
        if abs(col[0]-bg[0]) + abs(col[1]-bg[1]) + abs(col[2]-bg[2]) <= 12:
            near += k
    return bg, 100.0 * (tot - near) / tot

for spec in sys.argv[2:]:
    top, h = (int(v) for v in spec.split(':'))
    bg, full = cover(top, top + h)
    _, left = cover(top, top + h, 0, W // 2)
    _, right = cover(top, top + h, W // 2, W)
    print(f'y={top:6d} h={h:5d}  deckung gesamt {full:5.1f}%  links {left:5.1f}%  rechts {right:5.1f}%  bg={bg}')
