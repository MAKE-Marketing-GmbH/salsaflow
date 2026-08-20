// Eigene Schnupper-Unterseite. Raphael 17.08.: Wer eine Schnupperstunde will,
// landet hier, nicht im vollen Kontakt-Wizard mit acht Anliegen.
// Kontakt bleibt fuer allgemeine Anfragen. Das Formular hier ist fest auf
// Schnupperstunde gesperrt.

import { motion } from 'framer-motion';
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
        title={de ? 'Komm einmal. Entscheide danach.' : 'Come once. Decide after.'}
        lead={
          de
            ? 'Die Schnupperstunde ist eine echte Lektion. Du siehst, wie wir unterrichten, und merkst, ob Salsaflow zu dir passt.'
            : 'The trial class is a real lesson. You see how we teach and whether Salsaflow suits you.'
        }
        primary={{ label: de ? 'Schnupperstunde anfragen' : 'Request a trial class', href: '#anfrage' }}
        secondary={{ label: de ? 'Kursplan ansehen' : 'See the schedule', href: '/kursplan' }}
        microcopy={de ? 'Ohne Verpflichtung. Wir antworten persönlich.' : 'No commitment. We reply in person.'}
        media={{
          src: '/photos/2026/kurse-classfreude-01.webp',
          alt:
            lang === 'de'
              ? 'Kurs im Salsaflow Studio, Gruppe tanzt mit Freude'
              : 'Class at the Salsaflow studio, group dancing with joy',
          // R113 (17.08.): Fold hatte kein Kursfoto. Band unter dem Typo-Block,
          // gleiches Muster wie Events/StylePages.
          // R164 (19.08.): 16rem + 30% schnitt die Koepfe. Gemessen live: Band-Top
          // 319, Fenster deckte Quell-y 282-623 — Scheitel der vorderen Reihe fiel
          // raus. Koepfe liegen im Motiv (1920x1280) bei y 240-560.
          // Neu lg: Hoehe 20rem (320px) und object-position 27%.
          // Rechnung 1440: scale 0.75, Fenster 320/0.75 = 427 Quell-Pixel,
          // Start (960-320)*0.27/0.75 = 230, Ende 657. Koepfe komplett drin.
          // Band-Bottom 319+320 = 639 < 900, das Band bleibt im Fold.
          // Schmal bleibt es bei 40%: dort zeigt das kurze Band fast das ganze
          // Motiv, ein hoeherer Start wuerde nur Decke zeigen.
          positionClass: 'object-[50%_40%] lg:object-[50%_27%]',
          heightClass: 'h-[10rem] sm:h-[11rem] lg:h-[20rem]',
        }}
        dense
        tightBottom
      />
      <FactsSection de={de} />
      <FormSection de={de} />
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
        <Reveal className="max-w-2xl pr-24 lg:pr-0">
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
            <ArrowRight size={16} strokeWidth={2.25} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </Shell>
    </section>
  );
}

// R164 (19.08.): Mobil lag der Weiter-Knopf des Wizards auf Hoehe des fixen
// WhatsApp-Kreises. Gemessen 390x844: Knopf x 165-289 y 784-832,
// Kreis x 314-370 y 768-824.
// Ursache: die Knopf-Leiste im Wizard ist mobil sticky am unteren Rand —
// genau dort sitzt der Kreis. Abstand an der Sektion hilft darum nicht.
// Fix auf unserem eigenen Wrapper: den Knopf selbst um 65px nach links
// ruecken. Der Kreis braucht 76px (56 breit + right-5); der Wizard-eigene
// pr-20 (80px) reicht nicht, weil sich die Leiste mit -mx-5 ueber den
// Karton hinaus zieht — gemessen bleiben damit nur 25px Luft.
//
// Anker ist data-testid="inquiry-next", nicht ein Klassen-String: das
// Attribut ist ein benutzter Vertrag (scripts/ui-smoke-contact.cjs:92,
// scripts/r1-kursplan-capture.cjs:56). Wer es umbenennt, bricht sofort
// diese Smoke-Skripte und den Assert im Beleg-Skript. Ein Griff nach
// max-sm:sticky waere dagegen still zerbrochen: Tailwind-Utilities in
// fremden Dateien sind kein Vertrag.
// margin statt padding auf der Leiste: so haengt der Abstand nicht daran,
// ob die Leiste sticky, flex oder sonst etwas ist.
// pb-32 statt pb-12 haelt zusaetzlich Luft unter der Sektion.
// Kein pr auf der Sektion selbst: das hat den Wizard-Karton auf 262px
// gequetscht, waehrend die Fact-Karten 350px breit blieben.

function FormSection({ de }: { de: boolean }) {
  return (
    <section
      id="anfrage"
      className="scroll-mt-24 bg-[var(--color-paper-warm)] pt-2 pb-32 lg:pt-2 lg:pb-16"
    >
      <Shell>
        <Reveal className="mx-auto w-full max-w-[640px] overflow-visible rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_22px_70px_rgba(17,17,17,0.08)] max-sm:[&_[data-testid='inquiry-next']]:mr-[65px]">
          <InquiryWizard initialTopic="schnupperstunde" lockTopic />
        </Reveal>
        <p className="mx-auto mt-6 max-w-[640px] text-center text-sm text-[var(--color-ink-muted)]">
          {de
            ? 'Andere Anliegen stehen auf der Kontaktseite.'
            : 'Other requests live on the contact page.'}{' '}
          <a href="/kontakt" className="font-semibold text-[var(--color-salsa)] underline underline-offset-4">
            {de ? 'Zum Kontakt' : 'Go to contact'}
          </a>
        </p>
      </Shell>
    </section>
  );
}
