// Eigene Schnupper-Unterseite. Raphael 17.08.: Wer eine Schnupperstunde will,
// landet hier, nicht im vollen Kontakt-Wizard mit acht Anliegen.
// Das Formular sitzt direkt im Hero: Name, Erreichbarkeit, Senden.

import { motion } from 'motion/react';
import { useLang } from '@/lib/i18n';
import { CONTACT } from '@/public/site/SiteFooter';
import {
  ClosingInvite,
  MEASURE_L,
  Reveal,
  SectionHead,
  Shell,
  SubHero,
  SubPageShell,
  useReveal,
} from '@/public/subpage/kit';
import { InquiryWizard } from '@/public/contact/InquiryWizard';
import { ArrowRight } from 'lucide-react';

const FACTS = {
  de: [
    ['Gratis', 'Die erste Stunde kostet nichts. Du entscheidest danach.'],
    ['Allein oder zu zweit', 'Ein Tanzpartner ist nicht nötig. Wir achten auf die Balance.'],
    ['60 Minuten', 'Eine echte Lektion. Du siehst Kurs, Level und Atmosphäre.'],
  ],
  en: [
    ['Free', 'The first class costs nothing. You decide afterwards.'],
    ['Alone or as a pair', 'A dance partner is not required. We watch the balance.'],
    ['60 minutes', 'A real lesson. You see the class, the level and the room.'],
  ],
} as const;

export function SchnupperstundePage() {
  const { lang } = useLang();
  const de = lang === 'de';
  return (
    <SubPageShell seo="schnupper">
      <SubHero
        axis="split"
        seoCrumbs={[{ label: de ? 'Schnupperstunde' : 'Trial class', href: '/schnupperstunde' }]}
        title={de ? 'Erste Stunde. Gratis.' : 'First class. Free.'}
        lead={
          de
            ? 'Name und Nummer. Wir holen dich in der Stunde ab.'
            : 'Name and number. We meet you in class.'
        }
        microcopy={de ? 'Ohne Verpflichtung. Wir antworten persönlich.' : 'No commitment. We reply in person.'}
        media={{
          src: '/photos/2026/kurse-classfreude-01.webp',
          alt:
            lang === 'de'
              ? 'Kurs im Salsaflow Studio, Gruppe tanzt mit Freude'
              : 'Class at the Salsaflow studio, group dancing with joy',
          positionClass: 'object-[50%_40%] lg:object-[50%_27%]',
          heightClass: 'h-[10rem] sm:h-[11rem] lg:h-[20rem]',
        }}
        dense
        tightBottom
      >
        <div id="anfrage" className="scroll-mt-24 overflow-visible rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_22px_70px_rgba(17,17,17,0.08)]">
          <InquiryWizard initialTopic="schnupperstunde" lockTopic compact onSuccessHref="/vorbereiten" />
        </div>
      </SubHero>
      <FactsSection de={de} />
      <ClosingInvite
        title={de ? 'Lieber erst den Plan sehen?' : 'Want the schedule first?'}
        body={
          de
            ? 'Im Kursplan siehst du Tag, Uhrzeit und ob Plätze frei sind. Die Schnupperstunde bleibt der leichte Einstieg.'
            : 'The schedule shows day, time and open spots. The trial class stays the easy start.'
        }
        ctaLabel={de ? 'Kursplan öffnen' : 'Open the schedule'}
        ctaHref="/kursplan"
        secondary={{ label: de ? 'Alle Kurse' : 'All courses', href: '/tanzkurse' }}
      />
    </SubPageShell>
  );
}

function FactsSection({ de }: { de: boolean }) {
  const { item } = useReveal();
  const facts = FACTS[de ? 'de' : 'en'];
  return (
    <section className="bg-[var(--color-bg-soft)] pt-4 pb-2 lg:pt-4 lg:pb-2">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead
            tight
            title={de ? 'Was dich erwartet' : 'What to expect'}
            lead={
              de
                ? 'Keine Verkaufsstunde. Du tanzt mit, siehst das Studio und sprichst mit uns.'
                : 'Not a sales pitch. You dance, see the studio and talk to us.'
            }
          />
        </Reveal>
        <Reveal id="schnupper-facts" className="mt-4 grid gap-4 sm:grid-cols-3" stagger={0.06}>
          {facts.map(([title, body]) => (
            <motion.article
              key={title}
              variants={item}
              className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-4 shadow-[0_14px_40px_rgba(17,17,17,0.04)]"
            >
              <h2 className={`type-h3 text-[var(--color-ink)] ${MEASURE_L}`}>{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{body}</p>
            </motion.article>
          ))}
        </Reveal>
        <Reveal className="mt-4">
          <a
            href={CONTACT.anfahrt}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[var(--color-salsa)]"
          >
            {de ? 'Studio am Bahnhof Basel SBB' : 'Studio at Basel SBB station'}
            <ArrowRight size={16} strokeWidth={2.25} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-[var(--motion-out)] group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </Shell>
    </section>
  );
}
