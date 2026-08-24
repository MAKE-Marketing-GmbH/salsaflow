// Welche Bandhoehe braucht es MINDESTENS, damit beide Koepfe komplett im Band liegen?
// Kopf-Spanne in der Quelle (2100x900), an der Vollansicht abgelesen:
//   Mann  Haaransatz  y ~ 105
//   Frau  Kinn        y ~ 500
// Plus Luft, damit nichts die Kante beruehrt.
const W = 2100;
const H = 900;
const VIEW = 1440;

const headTop = 105;
const chinBottom = 500;
const span = chinBottom - headTop;

console.log(`Quelle ${W}x${H}`);
console.log(`Kopf-Spanne in der Quelle: y ${headTop}..${chinBottom} = ${span}px = ${((span / H) * 100).toFixed(1)}% der Quellhoehe`);
console.log('');

// object-cover auf 1440 Breite: scale = 1440/2100 (solange Band < 900*scale)
const scale = VIEW / W;
console.log(`scale bei 1440 Breite = ${scale.toFixed(4)}  -> volle Quellhoehe waere ${(H * scale).toFixed(0)}px`);
console.log('');

const needed = span * scale;
console.log(`Kopf-Spanne gerendert = ${needed.toFixed(0)}px`);
console.log(`=> Band muss >= ${Math.ceil(needed)}px sein, sonst passen die Koepfe NIE hinein.`);
console.log('');

for (const band of [224, 240, 256, 272, 288, 320, 352, 416]) {
  const visiblePct = ((band / scale) / H) * 100;
  const fits = band >= needed;
  // bestes posY, das die Spanne zentriert
  const overflow = H * scale - band;
  const idealOffset = headTop * scale - (band - needed) / 2;
  const posY = overflow > 0 ? (idealOffset / overflow) * 100 : 0;
  console.log(
    `band ${String(band).padStart(3)}px  zeigt ${visiblePct.toFixed(1)}% der Quelle  ` +
      `Koepfe passen: ${fits ? 'JA' : 'NEIN'}  ` +
      (fits ? `ideales object-position-y = ${posY.toFixed(1)}%` : ''),
  );
}
