// Sozialbeweis (Redesign 08/2026, P3): 4,9 / 104 als schmale Zeile direkt unter dem Hero.
// Ersetzt die geloeschte WallOfLove-Kartenwand. Keine Karte, kein Radius, nur eine Haarlinie
// unten. Sterne bleiben rot (Marken-DNA), zaehlen aber nicht als gefuellter Button.

import { useLang } from '@/lib/i18n';
import { GOOGLE_REVIEWS } from '@/public/site/reviews';
import { META, TEXT_MID, TEXT_HI, PAPER, HAIR_B, Wrap } from '@/public/home/kit';

export function ProofLine() {
  const { lang } = useLang();
  const r = GOOGLE_REVIEWS;
  const rating = lang === 'de' ? r.rating.toString().replace('.', ',') : r.rating.toString();

  return (
    <section className={PAPER}>
      <Wrap>
        <div className={`${HAIR_B} flex flex-wrap items-center gap-x-4 gap-y-2 py-5`}>
          <span aria-hidden className="inline-flex items-center gap-[3px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="var(--color-salsa)" aria-hidden>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </span>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${META} ${TEXT_HI} font-semibold transition-opacity hover:opacity-80`}
          >
            {rating}
          </a>
          <span className={`${META} ${TEXT_MID}`}>
            {lang === 'de'
              ? `aus ${r.count} Google-Bewertungen · seit 2018 in Basel`
              : `from ${r.count} Google reviews · in Basel since 2018`}
          </span>
        </div>
      </Wrap>
    </section>
  );
}
