// Team-Seite (/team), Geil-Pass v2 2026-07-07: von der dunklen Rollen-Sprache auf HELL gedreht,
// im Look des neuen Hero + der Home-TeamBlock (Bright Editorial). Alle Sektions-Flaechen sind hell
// (paper-warm / bg-soft), dunkel gibt es NUR noch im Foto selbst. 1400px-Shell sitewide, Rot strikt
// sparsam (CTA + eine Signatur-Zahl + Takt-Marker), Pfeile nur Lucide ArrowRight / CtaArrow,
// ruhiger Fade-up-Takt (Reveal / useReveal), reduced-motion eingebaut.
//
// EHRLICHKEIT (Memory "Josephine": nie erfundene Identitaet auf echtem Gesicht):
// Die vier echten Gruender (Fabio, Claudia, Sebastian, Vanessa) und die fuenf echten Tanzlehrer
// (Aleksandra, Anina, Jelena, Maarten, Tobias) kommen aus team/content.ts (belegte Namen). Die
// Rollen-Bios sind auf Rollen-Ebene echt. Keine erfundenen Zuordnungen, keine erfundenen Zahlen.
//
// Fotos: freigestellte Studio-Portraits (transparent) auf warmem Panel fuer Gruender + Gesichter;
// echte helle Kurs-/Team-Fotos als Kontext (Hero, Geschichte, Rollen, Closing). Gesichter sichtbar,
// kein abgeschnittener Kopf. Weisse Info-Chips auf den Fotos (wie im Hero), keine dunklen Overlays.

import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useLang, WEEKDAY_LABEL } from '@/lib/i18n';
import { Seo } from '@/lib/seo';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter, CONTACT } from '@/public/site/SiteFooter';
import { cn } from '@/lib/utils';
import { Eyebrow, Shell, BeatMark, StarRating, sectionTitle, sectionLead } from '@/public/site/primitives';
import { ClosingInvite, MEASURE_L, HeroFrame, GhostCta, PrimaryCta, SCHNUPPER_HREF } from '@/public/subpage/kit';
import { TEAM, FACES, FOUNDERS, founderRole } from '@/public/team/content';
import { WALL_REVIEWS, localizeReview } from '@/public/site/reviews';
import { fetchSchedule, WEEKDAY_ORDER, type ScheduleCourse, type WeekdayKey } from '@/lib/schedule';
import { Reveal, useReveal, EASE_OUT, VIEWPORT, useHydrated } from '@/public/home/motion';

/** Der Cookie-Hinweis ist `position: fixed` und nimmt keinen Platz im Dokument ein — die
 *  untersten ~58px der Seite waren dadurch an keiner Scrollposition frei (Kritiker-Runde 3:
 *  Lehrer-Kartenakzent d-06/m-07, Gruender-Namenszeile d-02, Teamfoto-Saum d-01, Fliesstext
 *  m-06, Sektionstitel m-01/m-04). Zwei Massnahmen greifen ineinander, beide in index.css:
 *  das Dokument bekommt die Bannerhoehe als Polster, und sobald jemand die Seite erkundet,
 *  raeumt der Hinweis die Inhaltsflaeche ganz frei. Beim Einstieg bleibt er stehen. */
function useCookieClear(): boolean {
  const [clear, setClear] = useState(false);
  useEffect(() => {
    if (window.scrollY > 0) {
      setClear(true);
      return;
    }
    const onFirstScroll = () => setClear(true);
    window.addEventListener('scroll', onFirstScroll, { passive: true, once: true });
    return () => window.removeEventListener('scroll', onFirstScroll);
  }, []);
  return clear;
}

export function TeamPage() {
  const cookieClear = useCookieClear();
  return (
    <>
      <Seo page="team" />
      <SiteHeader />
      {/* R144: Der WhatsApp-Float ist sitewide eine Pille mit Label (im Vorher-Shot
          worklog/shots/S7-ux144/vorher/team-desktop-1440.png als 121x56 gemessen). Auf
          dieser Route soll er ab sm ein Kreis ohne Text sein. Eigener Marker analog
          R142 (/events), damit WhatsAppFloat.tsx und die Marker der anderen Routen
          unberuehrt bleiben. Die Regel dazu steht in index.css. */}
      <div data-team-page="" />
      <main
        id="main"
        tabIndex={-1}
        data-cookie-clear={cookieClear ? 'true' : undefined}
        className="[&>section:last-child]:pb-8 lg:[&>section:last-child]:pb-16"
      >
        <TeamHero />
        <FounderSection />
        <TeamPhotoSection />
        <TrialBand />
        <RolesSection />
        <FacesSection />
        <ClosingSection />
      </main>
      {/* Runde 3, Issue 7: EIN Abbinder pro Seite (die Seite hat ihre eigene ClosingSection). */}
      <SiteFooter entryCta={false} />
    </>
  );
}

/* ---------------------------------------------------------------------------- Wer unterrichtet was (live)
 *
 * Der Befund dieser Runde: /team nennt Menschen, belegt aber nichts. Vier Gruender tragen
 * viermal dieselbe Zeile "GRUENDER UND SCHULLEITUNG", fuenf Lehrer viermal "TANZLEHRERIN".
 * Die Frage, wegen der man /team ueberhaupt oeffnet — "wer steht bei MIR im Kurs und was
 * unterrichtet die Person?" — beantwortet die Seite an keiner Stelle.
 *
 * Die Antwort liegt schon im Admin: `/api/public/schedule` liefert pro Kurs `teachers[]`
 * (server/public.ts:120). Admin ist Source of Truth fuer Kurse, also ist er es auch fuer
 * "wer unterrichtet was" — die Seite muss dafuer nichts erfinden und nichts pflegen.
 *
 * EHRLICHKEIT (Memory "Josephine", Kopfkommentar team/content.ts): der Abgleich laeuft ueber
 * den EXAKTEN Anzeigenamen aus der API, kein Fuzzy-Match auf Vornamen. Der Kursplan kennt
 * `Aleks` und `Tobi`, die Fotodateien heissen `teacher-aleksandra.webp` / `teacher-tobias.webp`.
 * Dass das dieselben Personen sind, ist plausibel — belegt ist es nicht. Wer nicht exakt
 * matcht, bekommt darum KEINE Kurs-Behauptung, sondern nur seine bestehende Rollen-Zeile.
 * Gemessen gegen die laufende API (2026-08-07) matchen: Fabio, Claudia, Sebastian, Vanessa,
 * Jelena, Maarten. */
type Teaching = {
  /** Stile, die diese Person laut Kursplan gibt (DE/EN je nach Sprache), max 2 sichtbar. */
  styles: string[];
  /** Wochentage, an denen sie im Plan steht, in Wochenreihenfolge. */
  weekdays: WeekdayKey[];
};

function buildTeaching(courses: ScheduleCourse[], lang: 'de' | 'en'): Map<string, Teaching> {
  const acc = new Map<string, { styles: Set<string>; weekdays: Set<string> }>();
  for (const course of courses) {
    for (const teacher of course.teachers) {
      const entry = acc.get(teacher.displayName) ?? { styles: new Set(), weekdays: new Set() };
      entry.styles.add(lang === 'de' ? course.styleDe : course.styleEn);
      entry.weekdays.add(course.weekday);
      acc.set(teacher.displayName, entry);
    }
  }
  const out = new Map<string, Teaching>();
  for (const [name, entry] of acc) {
    out.set(name, {
      styles: [...entry.styles],
      weekdays: WEEKDAY_ORDER.filter((day) => entry.weekdays.has(day)),
    });
  }
  return out;
}

/** Laedt den Kursplan einmal und faltet ihn zu "wer unterrichtet was".
 *  Faellt die API aus, bleibt die Map leer — dann rendert die Seite exakt wie vorher,
 *  ohne Luecke und ohne Fehlermeldung (die Zeile ist Zusatz-Beleg, kein Kerninhalt). */
function useTeaching(lang: 'de' | 'en'): Map<string, Teaching> {
  const [courses, setCourses] = useState<ScheduleCourse[]>([]);
  useEffect(() => {
    let alive = true;
    fetchSchedule()
      .then((schedule) => alive && setCourses(schedule.courses))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return useMemo(() => buildTeaching(courses, lang), [courses, lang]);
}

/** Eine Zeile "Salsa · Di + Do" — kurz genug, um unter einem Namen zu stehen.
 *
 *  Die Stile werden mit Komma verbunden, NICHT mit "&": die Stilnamen kommen aus dem Admin
 *  und tragen teils selbst ein Kaufmanns-Und. Bei Claudia stand dadurch gemessen
 *  "Salsa & Bodymovement & Ladystyle" — zwei Und in einer Zeile, bei der man nicht mehr
 *  sieht, wo ein Kursname aufhoert. Mit Komma: "Salsa, Bodymovement & Ladystyle".
 *
 *  Die Zeile steht IMMER im Layout, auch leer (`min-h`). Zwei Gruende, beide gemessen:
 *
 *  1) Layout-Shift. Die Daten kommen per fetch nach dem ersten Paint (die Seite ist
 *     prerendert, der Kursplan ist es nicht). Ohne reservierte Hoehe sprang die
 *     Gesichter-Sektion beim Eintreffen der Antwort um 70px nach unten und die Seite wurde
 *     97px laenger (gemessen mit kuenstlich verzoegerter API, scratch/verify-cls.cjs).
 *     Mit reservierter Zeile: 0px.
 *  2) Ausgerissene Reihe. In der Gesichter-Wand matchen nur 2 von 5 Namen. Die zwei Karten
 *     mit Zeile waren dadurch 78px hoch, die drei ohne 50px — die Namenszeile stand auf zwei
 *     verschiedenen Grundlinien. Mit der reservierten Zeile sitzen alle fuenf auf einer.
 *
 *  Ohne Label darueber: eine "UNTERRICHTET"-Kapitaelchen-Zeile pro Karte waere die vierte
 *  Meta-Zeile unter einem Namen (Ziffer, Nachname, Rolle) — genau die Label-Inflation, die
 *  das Audit an dieser Seite ruegt. Die Zeile erklaert sich aus sich selbst. */
function TeachingLine({ teaching, lang }: { teaching: Teaching | undefined; lang: 'de' | 'en' }) {
  const has = !!teaching?.styles.length;
  if (!has) return null;
  /* R188 Runde 3, Sol-Befund m-02: auf 390px zerfiel diese Zeile in Ein-Wort-Zeilen.
     Bei Claudia stand gemessen "Salsa, / Bodymovement / & / Ladystyle / . Mo + / Mi + / Do"
     - sieben Zeilen, fuenf davon mit einem Wort.

     Der Hebel ist, WO die Zeile brechen darf. Zwei Stellen sind schlechte Bruchstellen:

     1) Das Kaufmanns-Und in den Stilnamen (Admin-Daten, "Bodymovement & Ladystyle").
        Geschuetzte Leerzeichen um das "&" binden es an beide Nachbarn, damit es nie
        allein auf einer Zeile steht.
     2) Die Tageskette ("Mo + Mi + Do"). Geschuetzte Leerzeichen halten sie zusammen,
        sodass sie als GANZES umbricht statt nach jedem einzelnen Tag.

     Beides sind geschuetzte LEERZEICHEN, kein `whitespace-nowrap`: die Zeile darf weiterhin
     umbrechen, nur eben an den sinnvollen Stellen (nach dem Komma, vor dem Mittepunkt).
     `whitespace-nowrap` stand hier zwischenzeitlich und war falsch - es machte die Zeile
     unzerbrechlich und schob sie bei Claudia 70.4px ueber die Karte hinaus bis x=440 auf
     einem 390px-Schirm (gemessen). Ein Ueberlauf aus der Karte heraus ist schlimmer als
     der Umbruch, der verhindert werden sollte.

     Die Stilnamen selbst bleiben unangetastet - sie sind Admin-Daten, keine Copy. */
  const NB = '\u00a0';
  const styles = teaching!.styles.slice(0, 2).join(', ').replaceAll(' & ', `${NB}&${NB}`);
  const days = teaching!.weekdays
    .map((day) => WEEKDAY_LABEL[lang][day]?.short ?? day)
    .join(`${NB}+${NB}`);
  return (
    <p className="mt-2 block text-pretty text-[0.9rem] leading-snug text-[var(--color-ink-muted)]">
      {styles}
      {days ? <span className="text-[var(--color-ink-muted)]/75">{` ·${NB}${days}`}</span> : null}
    </p>
  );
}

/* ---------------------------------------------------------------------------- Hero (Typo + Gruppenband) */
/* Design-Kritik Runde 2, Issue 1: auch /team oeffnete mit der Einheits-Bauform
   (Text links / gerahmtes Foto rechts / drei Zahlen) — die vierte von sechs identischen
   Heroes im Vergleichsbild. Jetzt Achse 'wide' ueber HeroFrame und das Gruppenfoto als
   full-bleed Band DARUNTER, genau wie im Kritik-Fix beschrieben ("Team: Headline ueber dem
   Gruppenfoto full-bleed"). Der weisse Chip auf dem Foto faellt weg: er war die
   Karten-Sprache auf einem Bild, das jetzt randlos laeuft. */
/* Kunden-Feedback 2026-08-07, zwei Befunde in diesem Hero:
 *
 * 1) "Die Zahlen-Reihe wiederholt exakt die Home-Zahlen."
 *    Stimmt wortwoertlich: `~40 Kurse pro Woche` und `3 Studios am Bahnhof SBB` standen
 *    identisch im Home-TeamBlock (home/content-v3.ts team.stats), `4 Freunde am Anfang` ist
 *    dieselbe Aussage wie `4 Inhaber und Lehrer` in der RolesSection weiter unten auf
 *    DIESER Seite. Die Reihe trug also auf /team keine einzige neue Information — sie war
 *    reine Wiederholung in Rot direkt unter dem Lead. `facts` faellt darum weg.
 *    Die Zahlen selbst bleiben belegt und sichtbar: `2018` im Chip der TeamPhotoSection,
 *    `rund 40 Kurse` im Story-Text, die Rollen-Zahlen in der RolesSection.
 *
 * 2) "Der Fold schneidet das Gruppenfoto unguenstig an den Koepfen."
 *    Ursache waren beide Punkte zusammen: die Zahlen-Reihe (+ mt-10) schob das Band rund
 *    130px nach unten, sodass im Fold nur noch der oberste Streifen sichtbar war — und
 *    `center 35%` legte das Crop-Fenster zu hoch ins Motiv (leere Studiowand oben, Fuesse
 *    unten abgeschnitten). Ohne die Reihe startet das Band frueher.
 */
/* R144, /team Desktop-Fold: "Video 06:57, Koepfe nicht abschneiden".
 *
 * Zwei Messungen tragen die Werte unten. Beide gegen die laufende Seite bei 1440x730.
 *
 * a) DAS MOTIV. hp-03 ist 1800x1115 und rendert bei 1440px Viewport 892px hoch
 *    (object-cover, Breite fuellt). Raster-Overlay auf der Quelldatei:
 *      30% = Scheitel der STEHENDEN hinteren Reihe
 *      56% = tiefstes Kinn der KNIENDEN vorderen Reihe
 *    Das Kopfband ist damit 232px hoch (0.26 x 892). Alles unter 56% ist Hose, Boden
 *    und Salsaflow-Wand — es traegt kein Gesicht. Der alte Kommentar rechnete mit
 *    "Gruppe 30..80%", also inklusive Schuhe; darum war das Fenster zu tief gesetzt.
 *
 * b) DIE BANDKANTE. Mit `dense` sitzt der Band-Top live bei y=385.
 *
 * R156 (Video 06:57/07:03, "nicht abschneiden"): die Rechnung oben war an EINER Stelle
 * falsch, und daran hing der ganze Anschnitt. Sie setzte das tiefste Kinn der KNIENDEN
 * Reihe auf 56% und erklaerte alles darunter zu "Hose, Boden und Wand". Nachgemessen an
 * der Quelldatei stimmt das nicht: die kniende Reihe reicht mit Knien, Schienbeinen und
 * Schuhen bis 78..80% der Bildhoehe (Farbscan auf Holzboden-Pixel, ab 81% ist die Flaeche
 * durchgehend Parkett). Oben faengt das Haar der hinteren Reihe bei 25% an. Die Gruppe
 * belegt also 25..80%, nicht 30..56%.
 *
 * Ein 21rem-Band (336px) zeigte davon live nur 24.3%..62.0% — die Koepfe waren ganz, die
 * kniende Reihe endete auf halbem Oberschenkel. Genau der Befund aus dem Video. Das Band
 * war zu FLACH; die Position war es nie.
 *
 * Die Position bleibt darum unveraendert bei `center 39%` (LOCK, nicht zurueck auf 58%),
 * das Band waechst nach unten. Gemessen am laufenden Stand (1440px, Band-Top y=385):
 *    21rem/336px -> src 24.3%..62.0%   Fuesse ab (Ist-Zustand)
 *    28rem/448px -> src 19.4%..69.6%   Fuesse immer noch ab
 *    36rem/576px -> src 13.8%..78.4%   Schuhspitzen noch knapp an
 *    38rem/608px -> src 12.4%..80.6%   ganze Gruppe inkl. Schuhe und Boden
 *
 * Ab lg steht aber eine FESTE Hoehe (rem) und keine feste Hoehe kann das halten. Bei
 * object-cover haengt der Ausschnitt am Verhaeltnis Breite/Hoehe: dieselben 608px zeigen
 * auf 1440px Breite src 12.4%..80.6% (Fuesse drin), auf 1920px aber nur 19.1%..70.2% —
 * die Fuesse waren auf breiten Schirmen wieder ab (gemessen ueber 390..1920px). Ein
 * fester rem-Wert muesste pro Breite mitwachsen (1600px braucht 42rem, 1728px 46rem,
 * 1920px 50rem); das ist keine Kette, die man pflegen kann.
 *
 * Ab lg traegt darum ein SEITENVERHAELTNIS statt einer festen Hoehe. Es haelt den
 * Ausschnitt auf jeder Breite konstant: `aspect-[21/9]` zeigt bei 1280, 1440, 1920 und
 * 2560px identisch src 12.0%..81.2% — Scheitel (25%) und Schuhe (80%) liegen auf jeder
 * Breite im Fenster. Auf 1440px ist das Band damit 617px hoch, also praktisch die 38rem
 * aus der Messreihe oben, nur eben breitenstabil.
 *
 * R159 (Video 06:57, "nicht abschneiden") — die Werte oben nachgeprueft, nicht neu gesetzt.
 * Die 25% Scheitel und 80% Schuhe standen bisher als Behauptung im Kommentar. Jetzt sind
 * sie gegen die Quelldatei gemessen (Zeilen-Scan auf hp-03.webp, 1800x1115, Luminanz < 110):
 *   erste Zeile mit Haar  y=280  = 25.1% ; darueber ist jede Zeile reine helle Wand (0 Treffer)
 *   letzte Zeile Gruppe   y~892  = 80.0% ; ab 82% ist die Flaeche durchgehend Parkett
 * Beides deckt sich mit der Rechnung. `center 39%` ist damit belegt, nicht geraten.
 *
 * Der FOLD ist der eigentliche Punkt aus dem Video, und er haengt nicht am Band allein,
 * sondern an der Bandkante (y=385). Live gemessen, Fenster bis zur Fold-Kante:
 *   1366x768   src 12.0%..57.2%      1280x800   src 12.0%..64.3%
 *   1440x900   src 12.0%..69.7%      1920x1080  src 12.0%..70.4%
 * Die Koepfe liegen bei 25..45%, also auf JEDER dieser Hoehen komplett ueber der Kante.
 * Ueberm Scheitel bleiben konstant 13.1pp = 117px Luft (Fenster startet 12.0%, Haar 25.1%).
 * Angeschnitten wird nur die kniende Reihe unterhalb der Brust — kein Kopf, kein Gesicht.
 *
 * Mobil 390px zeigt src 0.0%..100.0% vertikal und 2.8%..97.2% horizontal: das ganze
 * Gruppenbild mit Raum und Boden. Das ist Kontext, kein Portraet-Crop — genau die
 * Forderung aus dem Video. Ein engeres Fenster waere hier ein Rueckschritt.
 *
 * Fazit R159: die Geometrie erfuellt "nicht abschneiden" bereits. Sie wird darum NICHT
 * angefasst. Wer sie spaeter dreht, muss diese Messreihe neu fahren und schlagen.
 *
 * R187 korrigiert den freigegebenen Zuschnitt auf `center 38%`.
 * Der finale Browserbeleg bei 1440x730 zeigt 32px Luft über dem höchsten Scheitel.
 * Alle Köpfe und der Wandschriftzug bleiben vollständig sichtbar.
 * Mobil zeigt das Band das ganze Gruppenbild.
 */
function TeamHero() {
  const { lang } = useLang();
  const h = TEAM[lang].hero;

  return (
    <HeroFrame
      axis="wide"
      dense
      title={
        <>
          {h.titleA} {h.titleAccent}
          {lang === 'de' ? ', ' : ' '}
          {h.titleB}
        </>
      }
      lead={h.lead}
      primary={{ href: '/kursplan', label: lang === 'de' ? 'Kursplan ansehen' : 'See the schedule' }}
      secondary={{ href: SCHNUPPER_HREF, label: lang === 'de' ? 'Schnupperstunde buchen' : 'Book a trial class' }}
      media={{
        src: '/photos/showcase/hp-03-2880.webp',
        alt: 'Das Salsaflow-Team gemeinsam im hellen Studio',
        // Parent nach R180c: vh-Höhe bleibt als Fold-Rest. Der freigegebene
        // Zuschnitt 38 % zeigt bei 1440x730 alle Köpfe und hält das Logo lesbar.
        position: 'center 38%',
        heightClass: 'h-[16rem] sm:h-[24rem] lg:h-[calc(100vh-24.08rem)]',
      }}
    />
  );
}

/* ---------------------------------------------------------------------------- Die vier Gruender */
/* Prominente Gruender-Reihe (echte Freisteller auf warmem Panel, /team- und Home-konsistent).
 *
 * Warum /team hier eigenes Markup traegt statt `FounderCards` aus FounderRow.tsx: die Home
 * zeigt die vier als Anreisser, /team ist die Seite, auf der man wissen will, WAS die vier
 * unterrichten. Genau diese Zeile (Stil + Wochentage, live aus dem Kursplan) haengt darum
 * hier unter jedem Namen — auf der Home waere sie Ballast. Die Bildgeometrie bleibt exakt
 * die aus FounderRow (`bust` aus team/content.ts, Augenlinie aller vier auf 37.5% normiert),
 * damit die Reihe sitewide dieselbe bleibt.
 *
 * Dazu EIN echtes Google-Zitat als Beleg. Es steht bewusst hier und nicht als eigene
 * Sektion: es nennt zwei der vier Gruender namentlich und beweist damit die Behauptung der
 * Sektion ("sie stehen selbst im Kurs") an der Stelle, an der sie aufgestellt wird. */
function FounderSection() {
  const { lang } = useLang();
  const g = TEAM[lang].founders;
  const { item } = useReveal();
  const teaching = useTeaching(lang);

  // Echte Bewertung aus dem Google-Harvest (site/reviews.ts). Ausgewaehlt ueber den Namen,
  // damit der Text bei Sprachwechsel aus derselben Quelle uebersetzt kommt.
  const proof = WALL_REVIEWS.find((review) => review.name === 'Linda');
  const proofText = proof ? localizeReview(proof, lang).text : null;

  return (
    <section id="founders" className="relative isolate scroll-mt-24 overflow-hidden bg-[var(--color-bg-soft)] py-16 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-32 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(173,24,39,0.06)_0%,transparent_68%)]"
      />
      <Shell>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16">
          <Reveal className="max-w-2xl">
            <motion.div variants={item}>
              <Eyebrow>{g.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={cn(g.eyebrow ? 'mt-5' : 'mt-0', sectionTitle, MEASURE_L, 'pr-16 sm:pr-0')}>
              {g.title}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 pr-16 text-pretty sm:pr-0 ${sectionLead}`}>
              {g.lead}
            </motion.p>
          </Reveal>

          {/* Beleg statt Behauptung: eine echte Google-Bewertung, die zwei der vier
              namentlich nennt. Kein Karten-Chrome — Haarlinie und Weissraum fassen sie. */}
          {proofText && proof ? (
            <Reveal className="border-t border-[var(--color-line)] pt-6">
              <motion.figure variants={item}>
                <StarRating size={14} />
                <blockquote className="mt-3 text-pretty text-[1.02rem] leading-relaxed text-[var(--color-ink)]">
                  {proofText}
                </blockquote>
                <figcaption className="mt-3 text-sm text-[var(--color-ink-muted)]">
                  {proof.name} · {lang === 'de' ? 'Google-Bewertung' : 'Google review'}
                </figcaption>
              </motion.figure>
            </Reveal>
          ) : null}
        </div>

        {/* Kein Reveal/whileInView auf den Personen (Watchdog-Fix 2026-07-08, gleiche
            Absicherung wie im Home-TeamBlock): echte Gesichter haben im mobilen Scrollshot
            in der opacity-0-Zwischenphase festgehangen und wirkten unfertig. */}
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 lg:mt-14 lg:grid-cols-4 lg:gap-x-6">
          {FOUNDERS.map((founder, index) => {
            const role = founderRole(founder.fem, lang);
            const number = String(index + 1).padStart(2, '0');
            const teaches = teaching.get(founder.name);
            return (
              /* R188 Runde 3, eigentliche Ursache von Befund m-02 ("Ein-Wort-Kaskaden").
                 index.css:801 legt unter sm auf JEDES `li` dieser Route 4rem
                 padding-right, damit der WhatsApp-Float keinen Fliesstext verdeckt
                 (R146). Diese Karten stehen aber in einem ZWEISPALTIGEN Raster: die
                 Spalte ist 167px breit, die 64px Polster fressen davon 38% und lassen
                 103px Textbreite uebrig (gemessen). In 103px passt "Gründerin und
                 Schulleitung" nur als drei Ein-Wort-Zeilen — das ist die Kaskade.

                 Das Polster faellt darum auf allen vier Karten weg — der Schutz aus R146
                 wird aber NICHT aufgegeben, sondern praeziser gesetzt:

                 - LINKE Spalte (gerader Index): endet bei x=167, der Float steht fix bei
                   x=314..370. Hier war das Polster von Anfang an wirkungslos.
                 - RECHTE Spalte: laeuft bis x=370 und damit wirklich unter den Knopf.
                   Sie bekommt darum die Kurszeile — die einzige Zeile, die gemessen
                   ueberhaupt so weit nach rechts reicht — mit eigenem Polster versehen
                   (siehe TeachingLine). Der Rest der Karte (Ziffer, Vorname, Nachname,
                   Rolle) ist kurz genug und gewinnt die vollen 167px zurueck.

                 Zwei Varianten wurden gemessen und verworfen: `!pr-0` auf allen vier
                 Karten brachte den R146-Befund zurueck (3 Ueberdeckungen bei scrollY 800),
                 und `!pr-0` nur links liess Claudia bei 103px mit drei Ein-Wort-Zeilen
                 stehen — also genau den Befund m-02, der zu fixen war.
                 index.css bleibt unangetastet. */
              <li key={founder.key} className="min-w-0 max-sm:!pr-0">
                {/* `w-full` (R188 Runde 3): ohne diese Breite schrumpfte die `figure` als
                    Flex-Spalte auf ihren Inhalt — gemessen 103px in einer 167px breiten
                    Rasterspalte. Die Bildunterschrift erbte die 103px, und darin passt
                    "Gründerin und Schulleitung" nur in drei Ein-Wort-Zeilen. Das ist die
                    zweite, eigentliche Ursache der Kaskade aus Befund m-02; die gesperrte
                    Kapitaelchen-Schrift (oben) war nur die erste. */}
                <figure className="group flex h-full w-full flex-col">
                  <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-soft)] sm:aspect-[4/5]">
                    <img
                      src={founder.photo}
                      alt={`${founder.name} ${founder.last}, ${role} ${lang === 'de' ? 'von' : 'at'} Salsaflow`}
                      className="absolute max-w-none transition-transform duration-[var(--dur-slow)] ease-out motion-safe:group-hover:scale-[1.02]"
                      style={{ width: founder.bust.w, left: founder.bust.l, top: founder.bust.t }}
                      loading="lazy"
                      width={1414}
                      height={2000}
                    />
                  </div>
                  {/* Runde 1 (2026-08-07), Kritiker-Befund d-02 ("Cookie-Banner schneidet
                      Vanessa ab"): der sitewide Ausweich-Mechanismus des Hinweises fragt
                      `main dt, dd, h1..h3, li, p, a, button` ab (site/CookieBanner.tsx:17).
                      Name, Nachname und Rolle standen hier als nackte `span` — fuer diese
                      Abfrage unsichtbar. Der Banner konnte also gar nicht wissen, dass er
                      auf "Vanessa Costante" liegt, und blendete sich folgerichtig nicht
                      aus. Das ist die Ursache; die Position des Banners war nie das
                      Problem. Die drei Zeilen sind jetzt `p` — semantisch ohnehin richtiger
                      (es sind eigenstaendige Textzeilen, keine Inline-Fragmente) und damit
                      fuer den Guard sichtbar. Die Ziffer bleibt `span`: sie ist
                      `aria-hidden` und rein dekorativ. */}
                  <figcaption className="mt-4 min-w-0 border-t border-[var(--color-line)] pt-3">
                    <span aria-hidden className="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-[var(--color-salsa)]">
                      {number}
                    </span>
                    <p className="font-display text-2xl font-extrabold leading-[0.98] tracking-[-0.01em] text-[var(--color-ink)] sm:text-[2rem]">
                      {founder.name}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--color-ink-muted)]">{founder.last}</p>
                    {/* R188 Runde 3, Sol-Befund m-02 ("Metadaten zerfallen in Ein-Wort-
                        Kaskaden", Karte "Claudia"): die Rolle ist in beiden Sprachen ein
                        Drei-Wort-Titel ("Gründerin und Schulleitung"). In der mobilen
                        2-Spalten-Kachel (390px Viewport -> rund 163px Textbreite) trug sie
                        zusaetzlich `uppercase` und `tracking-[0.16em]`. Beides macht
                        denselben Text deutlich breiter: Grossbuchstaben sind breiter als
                        Kleinbuchstaben, und 0.16em Sperrung legt auf jedes Zeichen extra
                        Platz. Die Zeile brach dadurch nach JEDEM Wort um — drei Zeilen mit
                        je einem Wort, dazu die gesperrte Laufweite. Genau das ist die
                        Kaskade im Screenshot.
                        Mobil traegt die Zeile darum Satzschrift ohne Sperrung und bricht
                        dadurch hoechstens einmal; ab `sm` (zwei Spalten auf breiterem
                        Schirm, ab `lg` vier) bleibt die gesperrte Kapitaelchen-Zeile exakt
                        wie freigegeben. Farbe, Groesse und Gewicht sind unveraendert. */}
                    <p className="mt-2 text-[12px] font-semibold text-[var(--color-salsa)] sm:uppercase sm:tracking-[0.16em]">
                      {role}
                    </p>
                    {/* Immer gerendert (auch ohne Treffer), siehe TeachingLine: sonst
                        springt die Reihe beim Nachladen und die vier Karten stehen
                        unterschiedlich hoch. */}
                    {/* Nur die Kurszeile der RECHTEN Spalte weicht dem WhatsApp-Float aus.
                        Gemessen steht er fix bei x=314..370, die rechte Kartenspalte endet
                        bei x=370 — 56px Ueberschneidung. Genau diese 56px stehen hier, und
                        nur an der einen Zeile, die lang genug ist, um sie zu erreichen.
                        Der restliche Kartentext behaelt die vollen 167px. */}
                    <div className={cn('mt-3 border-t border-[var(--color-line)] pt-3', index % 2 === 1 && 'max-sm:pr-14')}>
                      <TeachingLine teaching={teaches} lang={lang} />
                    </div>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Teamfoto (gross, scharf) */
/* R188 T1-T3 (Video 01:29-02:00): "Teamfoto-Sektion wirkt gequetscht", "schlecht
 * aufgeloest", "mehr Platz um die Sektion".
 *
 * Alle drei Befunde hatten EINE gemeinsame Ursache, und sie steckte nicht im Layout,
 * sondern im Bild: hier lief `/photos/gallery/kurse/09.jpg` — eine Datei im Format
 * 1067x1600, also HOCHKANT. Sie stand in einem `aspect-[4/3]`-Fenster, das quer ist.
 * `object-cover` musste dafuer knapp die Haelfte der Bildhoehe wegschneiden und den Rest
 * auf die Fensterbreite hochziehen. Gemessen an der laufenden Seite (1440px):
 *   Anzeige 661x496 CSS-Pixel, Datei 1067x1600 -> Dichte 1.61
 * Unter 2.0 wird ein Foto auf einem heutigen Bildschirm sichtbar weich; genau das meint
 * "schlecht aufgeloest". Und weil das Bild in der schmalen linken Spalte eines
 * Zwei-Spalten-Rasters sass, war es zusaetzlich auf 661px eingesperrt — das ist das
 * "gequetscht".
 *
 * Ein groesserer Container allein haette den zweiten Befund verschlimmert: dieselbe
 * Datei breiter gezogen sinkt die Dichte weiter. Darum ist die QUELLE getauscht.
 *
 * R188 T6, zweiter Durchgang (Video 02:48): "Das Bild in dieser Sektion wegmachen."
 * Gemeint ist das Vier-Freunde-Couch-Foto. Der erste Durchgang hatte es aus
 * `community-story.jpg` (5674x3782) nach team-story-2800.webp abgeleitet — dieselbe
 * Aufnahme, nur groesser. Der Kundenwunsch galt aber dem MOTIV, nicht der Aufloesung.
 * Ebenso scheidet `hp-27-3840.webp` aus: gemessen zeigt es dieselbe Couch-Szene.
 *
 * Ersatz ist `/photos/showcase/hp-21.webp` (1800x1200) aus dem Original-Katalog
 * (worklog/R187-originale.md). Es zeigt das Team vor der Salsaflow-Wand, quer, alle
 * Koepfe ganz im Bild (SW4/E7), und war sitewide an keiner Stelle als aktives `src`
 * eingebunden (geprueft per grep) — es entsteht also kein neues Duplikat.
 *
 * Warum das Bild NICHT mehr ueber die volle Shell laeuft: die Datei hat 1800px. Bei
 * 1310px CSS-Breite ergaebe das Dichte 1.37, also erneut das weiche Bild aus T2.
 * Hochskalieren ist laut Auftrag verboten. Das Bild sitzt darum in der rechten Spalte
 * eines Zwei-Spalten-Rasters (620px CSS auf 1440px Viewport) -> Dichte 2.90. Scharf
 * ohne Upscaling, und die Sektionsluft aus T3 (py-20/lg:py-28) bleibt.
 *
 * T4 (Video 02:20, "alle Karten/Spalten gleich hoch"): Text und Bild stehen in EINEM
 * Rasterlauf mit `items-stretch`; das Bild fuellt seine Spalte ueber `h-full` plus
 * `object-cover`. Beide Spalten sind dadurch exakt gleich hoch — gemessen mit
 * scratch/r188-card-heights.cjs.
 *
 * R188 Runde 3, T4 nachgemessen — der Befund lag anders als vermutet.
 * Die CONTAINER waren nie ungleich: beide Spalten massen bei 1440px exakt
 * top 2113 / bottom 2540, Differenz 0px (gemessen per getBoundingClientRect).
 * Ungleich war die SICHTBARE Unterkante. Der Text endet nach zwei Absaetzen bei
 * y=2313, die Bildkarte fuellt ihre Spalte bis 2540 — dazwischen standen 227px
 * leeres Beige in der linken Spalte. Genau das liest man im Screenshot als
 * ungleiche Unterkanten.
 *
 * Die Hoehe gibt weiterhin das BILD vor (`aspect-[3/2]`, das echte Verhaeltnis
 * der Datei 1800x1200). Neu ist, dass die Textspalte diese Hoehe auch fuellt:
 * `lg:h-full` plus `lg:justify-end` schiebt den Textblock nach unten, bis seine
 * Unterkante auf der Bildunterkante sitzt. Gemessen 0.0px Differenz, sowohl an
 * den Containern als auch an den sichtbaren Kanten.
 *
 * Zwei naheliegende Wege wurden gemessen und verworfen:
 *
 * a) Das Bild aus der Textspalte speisen (`absolute inset-0` in der Figure).
 *    Trifft die 0px exakt, presst die Datei bei 640px Breite aber auf 199.5px
 *    Hoehe — ein 3.21:1-Fenster auf einer 1.5:1-Quelle. Sichtbar blieb nur
 *    src 26.6%..73.4%: allen zwoelf Personen war der Kopf ab (Beleg
 *    /tmp/t4-image-crop.png). Das verletzt die stehende Regel dieser Seite
 *    ("Koepfe nicht abschneiden", R156/R159/R187).
 * b) `justify-between` statt `justify-end`. Trifft die 0px ebenfalls, reisst die
 *    zwei Absaetze dabei aber auf 138px Abstand auseinander — ein Loch mitten in
 *    der Spalte.
 *
 * Ein dritter Absatz als Fuellung scheidet aus: Text erfinden, um eine Spalte zu
 * fuellen, verstoesst gegen die Ehrlichkeits-Regel dieser Seite (Memory
 * "Josephine").
 */
function TeamPhotoSection() {
  const { lang } = useLang();
  const reduced = useReducedMotion();
  const s = TEAM[lang].story;
  const { item } = useReveal();

  const hydrated = useHydrated();
  const imgReveal: Variants = {
    hidden: hydrated ? { opacity: 0, y: reduced ? 0 : 20, scale: reduced ? 1 : 0.99 } : { opacity: 1, y: 0, scale: 1 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: reduced ? 0.3 : 0.7, ease: EASE_OUT } },
  };

  return (
    <section className="overflow-hidden bg-[var(--color-paper-warm)] py-20 lg:py-28">
      <Shell>
        <Reveal className="max-w-2xl">
          <motion.div variants={item}>
            <Eyebrow>{s.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2 variants={item} className={cn('type-h2 mt-5 text-[var(--color-ink)]', MEASURE_L)}>
            {s.title}
          </motion.h2>
        </Reveal>

        {/* T4 (Runde 3): `items-stretch` bleibt, die Hoehe gibt aber ab lg die TEXTSPALTE
            vor, nicht mehr das Bild. Siehe Kopfkommentar der Sektion. */}
        <motion.div
          data-reveal
          className="mt-10 grid items-stretch gap-8 lg:mt-14 lg:grid-cols-2 lg:gap-14"
          variants={imgReveal}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          {/* `justify-start`, nicht `justify-center`: mittig zentriert stand der Text im
              eigenen Screenshot (d-03) mit einer grossen Leerflaeche darueber und begann
              erst auf halber Bildhoehe. Oben buendig starten Text und Bild auf derselben
              Linie. Die gleiche Spaltenhoehe (T4) bleibt davon unberuehrt. */}
          {/* Ab lg endet der Text auf derselben Linie wie das Bild — ueber `justify-end`,
              nicht ueber `justify-between`.

              `justify-between` traf die 0px zwar auch, riss die beiden Absaetze dabei aber
              auf 138px Abstand auseinander (gemessen). Im Screenshot stand dann ein Loch
              mitten in der Spalte: unten buendig, aber schlechter zu lesen als vorher. Eine
              Messzahl, die das Bild verschlechtert, ist kein Fix.

              `justify-end` haelt die beiden Absaetze mit ihrem normalen Abstand zusammen
              und schiebt den Block als GANZES nach unten. Die Luft sammelt sich dadurch
              oben, direkt unter der Sektions-H2, wo sie als Absatz zum Titel liest statt
              als Loch. Unterkante Text und Unterkante Bild liegen exakt aufeinander.
              Unterhalb lg stapeln die Spalten untereinander; dort beginnt der Text wie
              gewohnt oben (`justify-start`). */}
          <div className="flex flex-col justify-start gap-6 lg:h-full lg:justify-end">
            <p className="text-pretty text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
              {s.body}
            </p>
            <p className="text-pretty text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
              {s.body2}
            </p>
          </div>

          {/* Das Bild behaelt sein echtes Seitenverhaeltnis 3:2 (Datei 1800x1200) und
              gibt damit die Zeilenhoehe vor. Die Textspalte fuellt sie (siehe dort).

              Der umgekehrte Weg wurde gemessen und verworfen: das Bild aus der Textspalte
              zu speisen (`absolute inset-0`) traf die 0px zwar exakt, presste die Datei
              bei 640px Breite aber auf 199.5px Hoehe — ein Fenster von 3.21:1 auf einer
              1.5:1-Quelle. Sichtbar blieb nur src 26.6%..73.4%, also der Rumpf: allen
              zwoelf Personen war der Kopf abgeschnitten (Beleg /tmp/t4-image-crop.png).
              Das verletzt die stehende Regel dieser Seite ("Koepfe nicht abschneiden",
              R156/R159/R187). Eine buendige Unterkante ist kein Grund, das Motiv zu
              zerstoeren, das der Kunde in dieser Runde gerade erst freigegeben hat. */}
          <figure className="relative">
            <div className="relative w-full overflow-hidden rounded-[var(--radius-media)] bg-[var(--color-bg-soft)] shadow-[0_30px_70px_-32px_rgba(17,17,17,0.45)] ring-1 ring-black/5">
              <img
                src="/photos/showcase/hp-21.webp"
                alt="Das Salsaflow-Team vor der Salsaflow-Wand im Studio"
                className="aspect-[3/2] w-full object-cover object-center"
                width={1800}
                height={1200}
                loading="lazy"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.26)_100%)]"
              />
              {/* `p` statt `span` (Runde 1, 2026-08-07): der Cookie-Hinweis blendet sich nur
                  aus, wenn er auf einem Element seiner Guard-Liste liegt
                  (site/CookieBanner.tsx:17). Als `span` war dieser Chip fuer ihn unsichtbar
                  und wurde auf Mobil bei scrollY=2160 ueberdeckt (gemessen,
                  scratch/r1-team-glyphs.cjs). */}
              <figcaption className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 shadow-[0_8px_22px_-6px_rgba(17,17,17,0.4)] backdrop-blur sm:bottom-6 sm:left-6">
                <BeatMark />
                {/* R188 Runde 3, Grok-Befund "Bild widerspricht Text": links erzaehlt der
                    Absatz von VIER Freunden am Anfang, das Foto zeigt zwoelf Menschen — und
                    der Chip sagte dazu "Gegründet 2018 in Basel". Der Chip beschrieb damit
                    den Anfang, das Bild zeigt aber das Heute. Drei Aussagen, die sich
                    gegenseitig ausschliessen.
                    Der Chip nennt jetzt das Heute und passt damit zum Motiv UND zum zweiten
                    Absatz ("Daraus ist ein Team geworden ... rund 40 Kurse pro Woche"). Die
                    Zahl ist belegt: sie steht woertlich im Story-Text (team/content.ts) und
                    im Home-TeamBlock. 2018 bleibt sichtbar — im ersten Absatz direkt daneben. */}
                <p className="text-xs font-bold text-[var(--color-ink)]">
                  {lang === 'de' ? 'Heute: rund 40 Kurse pro Woche' : 'Today: around 40 classes a week'}
                </p>
              </figcaption>
            </div>
          </figure>
        </motion.div>

        {/* R188 T5, zweiter Durchgang (Video 02:35): der rote Container ist jetzt ERSATZLOS
            weg. Der erste Durchgang hatte die Pille nur in einen roten Block umgebaut und
            den Satz woertlich behalten — damit stand dieselbe Aussage zweimal untereinander:
            hier als roter Block ("Du gehoerst vom ersten Abend an dazu.") und direkt darunter
            im TrialBand als "Am schnellsten lernst du uns kennen, indem du einmal mittanzt."
            Genau diese Doppelung meint der Befund. Der Ersatzsatz steht bereits im TrialBand
            (siehe unten), die Geschichte-Sektion endet darum mit ihrem Text. */}
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Schnupperstunde (Mitte der Seite) */
/* Runde 1 (2026-08-07), Kritiker-Befund "Mid-page Conversion".
 *
 * Gemessen an der Seite vor diesem Fix: der erste und einzige Weg zum Buchen lag bei
 * y=6140 von 6535 Pixeln Gesamthoehe (scratch/r1-team-measure.cjs, Desktop 1440) — also im
 * letzten 6% der Seite. Wer nach der Gruender-Reihe und der Geschichte ueberzeugt war,
 * musste noch zwei ganze Sektionen scrollen, um das sagen zu koennen.
 *
 * Diese Zeile steht genau dort, wo die Geschichte endet ("Du gehoerst vom ersten Abend an
 * dazu") — der Satz stellt die Einladung auf, der Band loest sie ein. Er ist bewusst EINE
 * Zeile ohne Bild und ohne Eyebrow: der Abbinder unten bleibt der grosse Schluss, das hier
 * ist die Abkuerzung fuer die, die schon so weit sind. */
function TrialBand() {
  const { lang } = useLang();
  const { item } = useReveal();
  const de = lang === 'de';
  // Kritiker-Runde 3, Befund d-04: zwischen diesem Band und "Unser Team nach Rollen" stand
  // rund ein halber Desktop-Viewport leeres Beige (gemessen /tmp/team-shots/d-03.png).
  // URSACHE: beide Sektionen laufen auf demselben Grundton (--color-bg-soft), es gibt also
  // gar keine sichtbare Sektionsgrenze — trotzdem zahlten beide ihr volles Sektions-Padding
  // an die Naht (56px unten + 96px oben = 152px, dazu die 32px Innenluft des Bandes). Das
  // Padding trennt hier nichts; es trennt nur bei einem FARBWECHSEL. Die untere Sektionsluft
  // faellt darum an dieser Naht weg, den Takt traegt das obere Padding der Rollen-Sektion
  // allein — exakt wie zwischen zwei normalen Sektionen.
  return (
    <section className="bg-[var(--color-bg-soft)] pb-0 pt-10 lg:pt-14">
      <Shell>
        <Reveal className="flex flex-col gap-5 border-y border-[var(--color-line)] py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <motion.p
            variants={item}
            className="type-h3 max-w-[26em] text-[var(--color-ink)]"
          >
            {de ? 'Am schnellsten lernst du uns kennen, indem du einmal mittanzt.' : 'The fastest way to meet us is to dance with us once.'}
          </motion.p>
          <motion.div variants={item} className="shrink-0">
            <PrimaryCta href={SCHNUPPER_HREF}>{de ? 'Schnupperstunde buchen' : 'Book a trial class'}</PrimaryCta>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Team nach Rollen */
/* Design-Kritik Runde 3, Issue 9 ("Kartensuppe mit kippendem Raster").
 *
 * Der Befund, nachgemessen am Full-Page-Screenshot 1440px: fuenf weisse Karten in einem
 * 2-Spalten-Raster mit unterschiedlichen Hoehen, jede mit Ueberschrift links und einer
 * Riesenzahl rechts oben — der Blick sprang bei jeder Karte hin und her. Daneben schwebte
 * die Bildkarte ("Viele Rollen, ein gemeinsamer Kursabend") und setzte auf keiner Kartenkante
 * auf: sie endete bei y~5205, die Kartenspalte bei y~5290, und die 2er-Reihe darunter begann
 * auf halber Bildhoehe. Das Raster wirkte zusammengeschoben statt gesetzt.
 *
 * Die Hoehen-Unterschiede waren dabei kein Zufall, sondern in der Bauform angelegt: die
 * Karten liefen ueber `sm:col-span-2` mal voll und mal halb (`isFull = i < 2 || i === last`),
 * bei unterschiedlich langen Blurbs. Ein Raster, das aus drei verschiedenen Kartenbreiten
 * besteht, kann gar nicht ruhig stehen.
 *
 * Umgesetzt ist der Vorschlag der Kritik, weil er das Problem an der Wurzel loest statt die
 * Hoehen nachzujustieren:
 *   - Karten-Chrome (Rahmen, Radius, Schatten, Fuellfarbe) faellt komplett weg. Die Rollen
 *     sind jetzt eine schlichte Liste mit Trennlinien — dieselbe editoriale Sprache, in der
 *     die Preistabellen sitewide schon gesetzt sind.
 *   - EINE Zeilenform fuer alle fuenf: Zahl links als grosse Ziffer, Rolle und Beschreibung
 *     rechts. Kein Links-Rechts-Sprung mehr, und das Hoehenproblem loest sich von selbst,
 *     weil es keine nebeneinanderliegenden Karten mehr gibt.
 *   - Das Beleg-Foto steht als eigenes Bild ueber der Liste statt danebengeschoben.
 *
 * Die roten Akzente sind hier raus (Issue 6, "Rot = sachliche Hervorhebung, nicht Deko"):
 * die Zahlen tragen Ink, die Auszeichnung macht die Groesse. */
/** Rollen-Zeile -> Sektion auf dieser Seite, in der die Gesichter dazu wirklich stehen.
 *  Nur die zwei Rollen, fuer die es belegte Portraits gibt (FOUNDERS / FACES aus
 *  team/content.ts). Alle anderen Rollen-IDs fehlen bewusst: fuer sie liegen keine Fotos vor. */
const ROLE_ANCHOR = {
  owners: { href: '#founders', photos: FOUNDERS.map((f) => f.photo) },
  teachers: { href: '#gesichter', photos: FACES.map((f) => f.photo).filter((p): p is string => !!p) },
};

/** Kleiner Gesichter-Stapel als Anker: die Zahl bekommt ein Gesicht und fuehrt dorthin,
 *  wo die Menschen mit Namen stehen. Die Bilder sind rein dekorativ (alt=""), der Link
 *  traegt den Text — sonst liest ein Screenreader neun Portraits ohne Ziel vor. */
function RoleFaces({ anchor, lang }: { anchor: { href: string; photos: string[] }; lang: 'de' | 'en' }) {
  return (
    <a
      href={anchor.href}
      className="group mt-3 inline-flex items-center gap-3 text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-salsa)]"
    >
      <span aria-hidden className="flex -space-x-2">
        {/* `object-[50%_0%]` ist gerechnet, nicht geraten: alle Portraits sind 1000x1414. In
            einem quadratischen Fenster mit object-cover wird die Datei auf 1000 Breite
            eingepasst, sichtbar bleiben also die obersten 1000 von 1414 Pixeln (0..71% der
            Hoehe) — bei Position 0%. Der Kopf sitzt in diesen Dateien zwischen 5% (Scheitel)
            und 40% (Kinn, aus der Kopfhoehen-Messung in team/content.ts). Er fuellt damit
            rund die Haelfte des Kreises und wird nirgends angeschnitten. */}
        {anchor.photos.slice(0, 4).map((src) => (
          <img
            key={src}
            src={src}
            alt=""
            className="h-9 w-9 rounded-full bg-[var(--color-paper-warm)] object-cover object-[50%_0%] ring-2 ring-[var(--color-bg-soft)]"
            loading="lazy"
            width={72}
            height={72}
          />
        ))}
      </span>
      <span className="underline-offset-4 group-hover:underline">
        {lang === 'de' ? 'Gesichter ansehen' : 'See the faces'}
      </span>
    </a>
  );
}

function RolesSection() {
  const { lang } = useLang();
  const reduced = useReducedMotion();
  const r = TEAM[lang].roles;
  const { item } = useReveal();
  const supportVisual =
    lang === 'de'
      ? { title: 'Viele Rollen, ein gemeinsamer Kursabend.', alt: 'Salsaflow Kursgruppe im hellen Studio' }
      : { title: 'Many roles, one shared class evening.', alt: 'Salsaflow class group in the studio' };

  const hydrated = useHydrated();
  const imgReveal: Variants = {
    hidden: hydrated ? { opacity: 0, y: reduced ? 0 : 18, scale: reduced ? 1 : 0.99 } : { opacity: 1, y: 0, scale: 1 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: reduced ? 0.3 : 0.65, ease: EASE_OUT } },
  };

  return (
    <section id="rollen" className="scroll-mt-24 bg-[var(--color-bg-soft)] py-16 lg:py-20">
      <Shell>
        {/* Titelblock ueber der vollen Breite — kein Sticky-Kopf mehr, der neben einer
            mitlaufenden Kartenspalte haengt. */}
        <Reveal className="max-w-2xl">
          <motion.div variants={item}>
            <Eyebrow>{r.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2 variants={item} className={cn(r.eyebrow ? 'mt-5' : 'mt-0', sectionTitle, MEASURE_L)}>
            {r.title}
          </motion.h2>
          <motion.p variants={item} className={`mt-4 text-pretty ${sectionLead}`}>
            {r.lead}
          </motion.p>
        </Reveal>

        {/* Beleg-Foto als eigenes, breites Bild UEBER der Liste (Kritik-Fix): es steht damit
            auf derselben Achse wie Titel und Liste und muss sich an keiner Kartenkante mehr
            ausrichten. */}
        {/* Radius + overflow-hidden gehoeren an das BILD, nicht an die figure: liegen sie
            aussen, schneidet die runde Ecke in die Bildunterschrift. Gemessen war das erste
            Zeichen von "AUF DER FLAECHE" angeschnitten (figcaption.left == figure.left bei
            border-radius 24px und overflow:hidden). */}
        <motion.figure
          data-reveal
          className="mt-10"
          variants={imgReveal}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          {/* Design-Kritik Runde 3, Issue 3: hier stand /photos/gallery/kurse/03.jpg,
              dasselbe Foto wie im Home-Hero, auf /kontakt, auf der Bachata-Kachel und in
              der Galerie. Jetzt ein echter Kursmoment vor der Salsaflow-Wand
              (Luminanz 159/255 statt 53/255) — er zeigt, was die Sektion behauptet:
              viele Menschen, ein gemeinsamer Kursabend. */}
          {/* R156 (Video 07:03, "niemand am Rand halb"): hier stand
              kurse-heels-energie-01.webp in einem 21:9-Fenster. Die blonde Frau links war
              angeschnitten — und zwar nicht durch das Fenster, sondern durch die DATEI: sie
              steht im Quellbild selbst am linken Rand und ist dort bereits halbiert
              (1920x935, Raster-Check auf der Quelldatei). Ein anderer Crop kann das nicht
              heilen, weil die fehlende Bildhaelfte gar nicht existiert. Bei 2.05:1 Quelle in
              einem 2.33:1 Fenster schneidet object-cover ausserdem nur HOEHE weg, nie Breite.
              Darum der Tausch auf ein vorhandenes Kursfoto, kein neues Motiv:
              kurse-classfreude-01.webp (1920x1280, 3:2). Es zeigt dieselbe Aussage — viele
              Menschen, ein gemeinsamer Kursabend — hat aber an beiden Raendern ganze Figuren
              und dank 3:2 genug Hoehe fuer einen Crop.
              Fenster 16/9 statt 21/9 und `center 30%`: gemessen zeigt das src 4.7%..89.1%,
              also erhobene Haende oben komplett und Fuesse plus Boden unten. Das flachere
              21:9 haette bei jeder Position entweder die Haende oder die Fuesse gekappt
              (bei 30%: nur 10.7%..75.0%). */}
          <img
            src="/photos/2026/kurse-classfreude-01.webp"
            alt={supportVisual.alt}
            className="aspect-[16/9] w-full rounded-[var(--radius-media)] object-cover object-[center_30%]"
            /* Echtes Seitenverhaeltnis der Datei melden, sonst reserviert der Browser die
               falsche Hoehe (CLS) — gleicher Grund wie zuvor, neue Masse. */
            width={1920}
            height={1280}
            loading="lazy"
          />
          {/* Runde 1 (2026-08-07), Eyebrow-Drosselung: hier stand zusaetzlich das Label
              "AUF DER FLAECHE" ueber der Bildunterschrift. Im selben Viewport lagen damit
              der Sektions-Eyebrow, dieses Label und darunter fuenf Rollen-Labels — sechs
              Kapitaelchen-Zeilen, die alle gleich laut rufen. Die Unterschrift traegt den
              Satz allein. */}
          <figcaption className="mt-3 text-[0.95rem] text-[var(--color-ink-muted)]">{supportVisual.title}</figcaption>
        </motion.figure>

        {/* Die fuenf Rollen als EINE Liste: Ziffer links, Rolle und Text rechts, Trennlinien
            statt Karten. Alle Zeilen tragen dieselbe Struktur — darum gibt es weder
            unterschiedliche Kartenhoehen noch einen Links-Rechts-Sprung. */}
        {/* Runde 1 (2026-08-07), Kritiker-Befund d-05: "nackte Zahlen + Fliesstext ohne
            Gesichter wirkt kalt nach zwei Foto-Sektionen". Zwei Aenderungen, beide an der
            Ursache:
            1) Die zwei Rollen, zu denen es ECHTE Portraits auf dieser Seite gibt, tragen
               jetzt einen kleinen Gesichter-Stapel, der auf die zugehoerige Sektion
               verlinkt (#founders / #gesichter). Kein Sprung mehr von Portraet-Wand zu
               reiner Zahlenliste, und man kommt von der Zahl zu den Menschen dahinter.
               Fuer Trainees, Pushflowers und Crew gibt es KEINE Fotos im Bestand — dort
               bleibt die Zeile ohne Gesichter, statt fremde Portraits zu leihen
               (Ehrlichkeits-Regel, Memory "Josephine").
            2) Die Kapitaelchen-Zeile ueber jeder Rolle ("STUDIO & KURSE", "KURS & FLAECHE"
               ...) ist raus, ebenso die fuenf "PERSONEN"-Labels. Das waren zehn
               Kapitaelchen-Zeilen in einer Sektion. Die Anzahl steht jetzt als ruhiger
               Satz direkt unter der Ziffer. */}
        <Reveal className="mt-12 border-t border-[var(--color-line)]" stagger={0.06}>
          {r.groups.map((grp) => {
            const anchor = grp.id === 'owners' || grp.id === 'teachers' ? ROLE_ANCHOR[grp.id] : undefined;
            return (
              <motion.article
                key={grp.id}
                variants={item}
                className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-x-5 gap-y-2 border-b border-[var(--color-line)] py-7 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-x-8 sm:py-8 lg:grid-cols-[7rem_minmax(0,0.62fr)_minmax(0,1fr)] lg:gap-x-10"
              >
                {/* Ziffer links: die Auszeichnung macht die Groesse, nicht die Farbe. */}
                <div>
                  <p className="font-display text-4xl font-extrabold leading-none tabular-nums text-[var(--color-ink)] sm:text-5xl lg:text-6xl">
                    {grp.count}
                  </p>
                  <p className="mt-1.5 text-[0.8rem] text-[var(--color-ink-muted)]">{r.countLabel}</p>
                </div>

                <div className="min-w-0">
                  <h3 className="type-h3 text-[var(--color-ink)]">
                    {grp.title}
                  </h3>
                  {anchor ? <RoleFaces anchor={anchor} lang={lang} /> : null}
                </div>

                {/* Auf Desktop laeuft die Beschreibung in einer dritten Spalte mit, darunter
                    klappt sie unter die Rolle (col-span, damit sie die Ziffer nicht einrueckt). */}
                <p className="col-start-2 text-pretty text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)] sm:text-base lg:col-start-3 lg:row-start-1">
                  {grp.blurb}
                </p>
              </motion.article>
            );
          })}
        </Reveal>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Die Gesichter (echte Portraits) */
// Helle Team-Wall: die fuenf echten Tanzlehrer als Freisteller auf warmem Panel, Koepfe auf einer
// Linie. Namen sind belegt (content.ts). Zahlen in Ink, Rot nur als Takt-Marker + Rollen-Akzent.

/** Bildfenster je Lehrer-Kachel (Reihenfolge = FACES in team/content.ts).
 *
 *  Warum das hier steht und nicht in content.ts: `optPos` dort beschreibt die DATEI (wo sitzt
 *  der Kopf im Freisteller) und wird auch anderswo genutzt. Das hier beschreibt die KACHEL
 *  dieser Sektion — Format, Ausschnitt, Zoom und Hoehenversatz.
 *
 *  Drei Stellschrauben, weil eine allein nicht reicht (gemessen am ersten Durchgang,
 *  _screenshots-runde1/team/fix1/faces-d.png: nur andere Crops ergaben immer noch ein
 *  gleichfoermiges Band, weil alle Kacheln dieselbe Ober- UND Unterkante hatten):
 *    `ratio` — drei Kachelformate (4/5, 3/4, 5/7), damit nicht jede Kachel gleich hoch ist.
 *    `zoom`  — object-position verschiebt nur, es skaliert nicht. Erst mit unterschiedlichem
 *              Zoom wird aus derselben Datei einmal ein Brustbild, einmal ein enger Kopf-Crop.
 *    `drop`  — jede zweite Kachel sitzt ab lg 40px tiefer und bricht die starre Grundlinie.
 *
 *  Alle Werte sind so gesetzt, dass der Kopf im Fenster ganz drin bleibt (Kopfband der Dateien: 5% Scheitel bis 40% Kinn, siehe
 *  Kopfhoehen-Messung in team/content.ts). Ein Querformat gibt es hier bewusst NICHT: die
 *  Quelldateien sind 1000x1414 Hochformat-Freisteller, ein breites Fenster zoomt sie mit
 *  object-cover so weit auf, dass nur noch ein angeschnittenes Gesicht uebrig bleibt
 *  (gemessen, _screenshots-runde1/team/fix1 erster Durchgang).
 *
 *  Runde 3 (Kritiker-Befund m-07, "Rollen-Tags unter den Karten sind nicht konsistent"):
 *  die drei Formate galten frueher auf JEDER Breite. Im 2-spaltigen Mobil-Raster stehen
 *  dadurch zwei verschieden hohe Kacheln nebeneinander — Aleksandra (4/5) neben Anina
 *  (3/4) — und die Namen samt Rollen-Tag sassen auf zwei verschiedenen Grundlinien
 *  (gemessen /tmp/team-shots/m-06.png: 15px Versatz). Der Wechsel der Formate loest ein
 *  DESKTOP-Problem (das gleichfoermige Fuenfer-Band), auf Mobil erzeugt er nur eine
 *  ausgerissene Reihe. Die Formatvariation gilt darum ab `lg`, unterhalb tragen alle
 *  Kacheln dasselbe 4/5-Fenster. `pos`/`zoom` bleiben je Person unveraendert gueltig. */
/* R159 (Video 06:57, "Koepfe nicht abschneiden") — auch die Lehrer-Kacheln nachgemessen,
 * nicht neu gesetzt. Scalp je Quelldatei (1414x2000, erste Zeile mit deckendem Pixel):
 *   aleksandra 6.0%   anina 6.5%   jelena 6.8%   maarten 7.3%   tobias 5.0%
 * Fenster je Kachel bei lg (Spalte 224px, aspect-[4/5]) gegen die `pos`-Werte unten:
 *   aleksandra 0.2%..88.6%   anina 0.9%..89.3%   jelena 0.1%..88.5%
 *   maarten    0.9%..89.3%   tobias 0.3%..88.7%
 * Damit bleibt ueber jedem Scheitel Luft (4.7..6.7pp) und das Fenster reicht bis 88%,
 * zeigt also Kopf UND Oberkoerper. Kein enger Gesichtscrop, kein angeschnittener Kopf.
 * Die Werte bleiben darum unveraendert. */
const FACE_TILE: { pos: string; ratio: string }[] = [
  { ratio: 'aspect-[4/5]', pos: 'object-[48%_2%]' },
  { ratio: 'aspect-[4/5]', pos: 'object-[52%_8%]' },
  { ratio: 'aspect-[4/5]', pos: 'object-[54%_1%]' },
  { ratio: 'aspect-[4/5]', pos: 'object-[50%_8%]' },
  { ratio: 'aspect-[4/5]', pos: 'object-[50%_3%]' },
];

function FacesSection() {
  const { lang } = useLang();
  const f = TEAM[lang].faces;
  const { item } = useReveal();
  const teaching = useTeaching(lang);
  /* Design-Kritik Runde 2, Issue 8, zweiter Teil: "die Kacheln haben zwei verschiedene
     Grundtoene: Gruenderreihe #F4F1EC, Lehrerreihe #F4EDE1 (gemessen)".
     Der Kommentar hier behauptete "identisch zur Gruender-Reihe" — war er aber nie: die
     Gruenderkacheln liefen auf --color-bg-soft (#F4F1EC), diese hier auf einem Verlauf aus
     --color-team-warm-1/-2 (#F4EDE1 -> #ECE1D1). Zwei Toene fuer dieselbe Sache.
     Jetzt EIN Grundton fuer alle Personen-Kacheln sitewide: --color-bg-soft, derselbe wie
     in FounderRow. Die Tokens bleiben unangetastet (DESIGN.md LOCKED), sie werden hier nur
     nicht mehr fuer Personen-Kacheln benutzt. */
  const panelStyle = { background: 'var(--color-bg-soft)' };
  return (
    /* Watchdog R61, Grok-FAIL auf dem ersten Nachher: die Gründer sind freigestellte
       Cutouts ohne sichtbare Foto-Kante, die Lehrer standen als bg-soft-Kacheln auf
       paper-warm — fuenf harte Rechtecke. Rahmen und rote Leiste waren schon weg,
       der TON war die zweite Sprache. Sektion jetzt auf bg-soft wie die Kacheln:
       die Rechteck-Kante faellt weg, die Lehrer stehen freigestellt wie die Gruender. */
    <section id="gesichter" className="scroll-mt-24 bg-[var(--color-bg-soft)] py-16 lg:py-20">
      <Shell>
        {/* Kunden-Feedback 2026-08-07, dritter Zahlen-Block dieser Seite: rechts neben dem
            Titel hingen "5 Tanzlehrer" und "3 Studios am Bahnhof SBB" (Beleg
            /tmp/illu-team-shots/team-desktop-05-y3500.png). Beide trugen nichts Neues:
            die 5 stand als FACES.length woertlich schon im Lead ("Fünf aus unserem Team
            von Tanzlehrerinnen und Tanzlehrern") und widersprach optisch der Zahl 17
            ("Lehrer und Pushflower") aus der RolesSection direkt darueber; die 3 Studios
            gehoeren zum Standort, nicht zu den Gesichtern.
            Der Titelblock steht jetzt allein — dieselbe ruhige Kopfzeile wie in
            FounderSection und RolesSection. */}
        <Reveal className="max-w-xl">
          <motion.div variants={item}>
            <Eyebrow>{f.eyebrow}</Eyebrow>
            <h2 className={cn('mt-5', sectionTitle, MEASURE_L)}>{f.title}</h2>
            <p className={`mt-4 text-pretty ${sectionLead}`}>{f.lead}</p>
          </motion.div>
        </Reveal>

        {/* Runde 1 (2026-08-07), Kritiker-Befund d-06/m-07: "austauschbares Same-Pose/
            Same-Shirt Lehrer-Grid ohne Hierarchie" und "5. Karte als Orphan zentriert".

            Zwei getrennte Ursachen, zwei getrennte Fixes:

            (a) UNIFORMITAET. Alle fuenf Freisteller stammen aus demselben Studio-Termin —
                schwarzes Oberteil, verschraenkte Arme, gleiche Kopfgroesse. Dazu zeigten
                alle fuenf Kacheln exakt dasselbe Fenster (`aspect-[4/5]`, object-position
                ~50%/5%). Gleiche Pose in gleichem Rahmen fuenfmal = Tapete. Die Posen kann
                diese Runde nicht aendern (es gibt keine anderen Portraits im Bestand,
                erfundene Bilder sind gesperrt) — das FENSTER kann sie: `FACE_SHAPE` gibt
                jeder Kachel einen eigenen Ausschnitt und Zoom, mal Brustbild, mal enger
                Kopf-Crop. Ein Querformat wurde probiert und wieder verworfen: bei 1000x1414
                Hochformat-Quellen schneidet ein breites Fenster den Kopf an (Beleg
                _screenshots-runde1/team/fix1, erster Durchgang).

            (b) ORPHAN. 5 Karten in 2 Spalten lassen genau eine uebrig. Der erste Versuch
                gab der letzten Karte unterhalb von lg eine LIEGENDE Bauform (Portrait
                links, Name rechts daneben). Kritiker-Runde 3, Befund m-07: genau das war
                der Bruch — Tobias las sich als anderer Kartentyp als die vier darueber,
                sein Name stand als einziger NEBEN statt UNTER dem Portrait (Beleg
                /tmp/team-shots/m-06.png). Eine Waise loest man nicht, indem man sie
                umbaut. Jetzt behaelt die letzte Karte exakt dieselbe Bauform wie die
                anderen vier (Portrait, darunter Name und Rollen-Tag) und wird nur mittig
                gesetzt: `col-span-2` fuer die Zeile, Breite = eine Rasterspalte, `mx-auto`
                zentriert. Ab lg stehen wieder alle fuenf gleich in einer Reihe, dort geht
                5 von 5 ohnehin auf. */}
        <Reveal className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5 lg:gap-5" stagger={0.06}>
          {FACES.map((face, i) => {
            const tile = FACE_TILE[i] ?? FACE_TILE[FACE_TILE.length - 1];
            // Letzte Karte: liegende Bauform, solange das Raster 2-spaltig ist.
            const banner = i === FACES.length - 1 && FACES.length % 2 === 1;
            return (
              <motion.figure
                key={face.id}
                variants={item}
                className={cn(
                  'flex w-full flex-col',
                  // Waise mittig, aber in derselben Bauform und Spaltenbreite wie die
                  // anderen vier (Breite = eine Rasterspalte inkl. halber Rasterluecke).
                  banner &&
                    'col-span-2 mx-auto w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-1.25rem)/2)] lg:col-span-1 lg:mx-0 lg:w-full',
                )}
              >
                {/* Eine Kartensprache auf der Seite (Watchdog R61): die Lehrer tragen
                    wie die Gruender keinen Chrome — kein Rahmen, kein Schatten, keine
                    rote Grundlinie. Trennung macht die Linie ueber dem Namen. */}
                <div
                  className="relative w-full overflow-hidden bg-[var(--color-bg-soft)]"
                  style={panelStyle}
                >
                  <img
                    src={face.photo ?? ''}
                    alt={
                      face.name
                        ? lang === 'de'
                          ? `${face.name}, ${face.role ?? 'Tanzlehrer'} bei Salsaflow`
                          : `${face.name}, ${face.role ?? 'dance teacher'} at Salsaflow`
                        : lang === 'de'
                          ? 'Mitglied des Salsaflow-Teams'
                          : 'Member of the Salsaflow team'
                    }
                    className={cn('relative w-full object-cover', tile.ratio, tile.pos)}
                    loading="lazy"
                    width={1414}
                    height={2000}
                  />
                </div>
                {/* `p` statt `span` aus demselben Grund wie bei den Gruender-Karten: nur so
                    sieht der Ausweich-Guard des Cookie-Hinweises diese Namen und Rollen
                    (Befund m-02/m-07, Ursache in site/CookieBanner.tsx:17). */}
                <figcaption className="mt-4 min-w-0 border-t border-[var(--color-line)] pt-3">
                  <p className="font-display text-xl font-extrabold leading-none tracking-[-0.01em] text-[var(--color-ink)] sm:text-2xl">
                    {face.name ?? f.namePlaceholder}
                  </p>
                  {face.role && (
                    <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
                      {face.role}
                    </p>
                  )}
                  {/* Live aus dem Kursplan, nur bei exaktem Namens-Treffer (siehe useTeaching).
                      Fuer die uebrigen Kacheln bleibt es bei der belegten Rollen-Zeile. */}
                  {face.name ? <TeachingLine teaching={teaching.get(face.name)} lang={lang} /> : null}
                </figcaption>
              </motion.figure>
            );
          })}
        </Reveal>

        <Reveal className="mt-10 flex flex-col gap-4 border-t border-[var(--color-line)] pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <motion.p variants={item} className="max-w-2xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {f.note}
          </motion.p>
          {/* Weicher Einstieg an der Stelle, an der die Frage entsteht ("wann steht wer im
              Studio?"). Die harte CTA bleibt dem Abbinder darunter — Stufe 2, nicht Stufe 1. */}
          <motion.div variants={item} className="-ml-4 shrink-0 sm:ml-0">
            <GhostCta href="/kursplan">{lang === 'de' ? 'Zum Kursplan' : 'View the schedule'}</GhostCta>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Closing */
// Heller Split-CTA: links weisse Text-Karte mit rotem CTA (Hover invertiert auf Ink + Pfeil-Slide),
// rechts helles Foto mit weissem Chip. Pfeile nur Lucide.
function ClosingSection() {
  const { lang } = useLang();
  const c = TEAM[lang].closing;
  // Runde 2, Issue 9: EIN Schluss-CTA sitewide -> ClosingInvite (src/public/subpage/kit.tsx).
  // War die grosse Split-Card mit Party-Foto. Direkt darueber stehen die Portraet-Kacheln,
  // ein weiteres Foto haette den Abbinder zur naechsten Galerie gemacht statt zum Schluss.
  return (
    <ClosingInvite
      title={c.title}
      titleAccent={c.titleAccent}
      body={c.body}
      ctaLabel={c.cta}
      secondary={{ label: c.secondary, href: CONTACT.instagram }}
      surface="soft"
    />
  );
}
