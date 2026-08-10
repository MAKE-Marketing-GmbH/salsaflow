// S13 Standort-Band / Closer (Geil-Pass v2 2026-07-07): jetzt HELL. Nur der Footer bleibt dunkel
// (v2-Direktive Raphael "nur der Footer dunkel"). War vorher der dunkle Fullbleed-Closer, der in
// den Footer lief. Neu: warmer Editorial-Closer als Foto-Kontakt-Karte. Links echtes Kurs-Foto,
// rechts Eyebrow + Headline + Body + EIN roter CTA + WhatsApp/Telefon-Zeile + Standort-Meta
// (Bahnhof Basel SBB, Elisabethenanlage). Bewusst KEIN Hero-Klon (Foto in ruhiger Karte statt
// schwebender Zwei-Foto-Komposition). 1400px-Shell. Calm Motion: ruhiger Reveal-Fade-up-Takt,
// reduced-motion nur Fade. Adress-Platzhalter bleibt elegante Copy, kein roher [PLATZHALTER].

import { MapPin, Phone } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { HOME_V3, TRIAL_HREF } from '@/public/home/content-v3';
import { CONTACT } from '@/public/site/SiteFooter';
import { Eyebrow, Shell, CtaPill, WhatsAppGlyph } from '@/public/site/primitives';
import { MEASURE_L, SECTION_Y_HOME } from '@/public/home/kit';
import { cn } from '@/lib/utils';

export function LocationBand() {
  const { lang } = useLang();
  const c = HOME_V3[lang].closer;

  return (
    <section id="standort" className={cn('scroll-mt-24 bg-[var(--color-bg-soft)]', SECTION_Y_HOME)}>
      <Shell>
        <div className="grid overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-paper)] shadow-[0_30px_70px_-40px_rgba(17,17,17,0.28)] lg:grid-cols-[1.02fr_1fr]">
          {/* LINKS: echtes Kurs-Foto, fuellt die Kartenkante (kein Freisteller, keine KI-Person). */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[520px]">
            <img
              src="/photos/premium/community-story-1600.webp"
              alt="Tanzende im Salsaflow-Kurs, helle Studio-Atmosphaere nahe Bahnhof Basel SBB."
              className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
              width={1600}
              height={1200}
              loading="lazy"
            />
            {/* Standort-Chip auf dem Foto, gleiche Trust-Chip-DNA wie im Hero. */}
            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 shadow-[0_8px_22px_-6px_rgba(17,17,17,0.4)] backdrop-blur">
              <MapPin size={15} strokeWidth={2} aria-hidden className="text-[var(--color-salsa)]" />
              <span className="text-xs font-bold text-[var(--color-ink)]">Basel SBB</span>
            </div>
          </div>

          {/* RECHTS: Kontakt + Abschluss-CTA. */}
          <div className="p-8 sm:p-10 lg:p-14">
            <div>
              <div>
                <Eyebrow>{c.eyebrow}</Eyebrow>
              </div>
              {/* max-w-md (448px) war ein 16px-Mass auf einem 36-48px-Heading -> 3 Zeilen auf
                  390px. MEASURE_L skaliert mit der Schriftgroesse. */}
              <h2
                className={cn(
                  'mt-5 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-[var(--color-ink)] sm:text-[2.9rem] lg:text-5xl',
                  MEASURE_L,
                )}
              >
                {c.titleA} {c.titleAccent} {c.titleB}
              </h2>
              <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
                {c.body}
              </p>

              {/* Runde 2, Issue 2: Glow-Halo raus, EINE Button-Definition (CtaPill). */}
              <div className="mt-8">
                <CtaPill href={TRIAL_HREF}>{c.cta}</CtaPill>
              </div>

              {/* Kontakt-Zeile: WhatsApp + Telefon, klickbar (5-Sekunden-Kontakt). */}
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-[var(--color-ink)]">
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-[var(--color-salsa)]"
                >
                  <WhatsAppGlyph className="text-[var(--color-salsa)]" />
                  {c.whatsapp}
                </a>
                <a
                  href={CONTACT.phoneHref}
                  className="inline-flex items-center gap-2 tabular-nums transition-colors hover:text-[var(--color-salsa)]"
                >
                  <Phone size={16} strokeWidth={1.75} aria-hidden className="text-[var(--color-salsa)]" />
                  {CONTACT.phoneDisplay}
                </a>
              </div>

              {/* Standort-Meta: Bahnhof SBB + Elisabethenanlage + Adress-Platzhalter (bleibt as-is). */}
              <div className="mt-7 border-t border-[var(--color-line)] pt-5">
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]">
                  <MapPin size={16} strokeWidth={1.75} aria-hidden className="text-[var(--color-salsa)]" />
                  {c.metaLead}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-muted)]">{c.address}</p>
                <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">{c.reassurance}</p>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}
