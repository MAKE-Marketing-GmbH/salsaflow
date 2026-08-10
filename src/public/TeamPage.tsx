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
import { Reveal, useReveal, EASE_OUT, VIEWPORT } from '@/public/home/motion';

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
      <main
        id="main"
        tabIndex={-1}
        data-cookie-clear={cookieClear ? 'true' : undefined}
        className="[&>section:last-child]:pb-8 lg:[&>section:last-child]:pb-16"
      >
        <TeamHero />
        <FounderSection />
        <StorySection />
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
  const styles = has ? teaching!.styles.slice(0, 2).join(', ') : null;
  const days = has ? teaching!.weekdays.map((day) => WEEKDAY_LABEL[lang][day]?.short ?? day).join(' + ') : '';
  return (
    <p className="mt-2 block min-h-[1.4rem] text-[0.9rem] leading-snug text-[var(--color-ink-muted)]">
      {styles}
      {days ? <span className="text-[var(--color-ink-muted)]/75"> · {days}</span> : null}
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
 *    Die Zahlen selbst bleiben belegt und sichtbar: `2018` im Chip der StorySection,
 *    `rund 40 Kurse` im Story-Text, die Rollen-Zahlen in der RolesSection.
 *
 * 2) "Der Fold schneidet das Gruppenfoto unguenstig an den Koepfen."
 *    Ursache waren beide Punkte zusammen: die Zahlen-Reihe (+ mt-10) schob das Band rund
 *    130px nach unten, sodass im Fold nur noch der oberste Streifen sichtbar war — und
 *    `center 35%` legte das Crop-Fenster zu hoch ins Motiv (leere Studiowand oben, Fuesse
 *    unten abgeschnitten). Ohne die Reihe startet das Band frueher.
 *
 *    Der neue Wert ist gemessen, nicht geschaetzt (Raster-Overlay /tmp/hp03-grid.jpg):
 *    in hp-03 (1800x1115) liegt die Gruppe zwischen 30% (Kopflinie) und 80% (Schuhe).
 *    Bei 1440px Viewport rendert das Motiv 892px hoch, das Band (lg:h-30rem) zeigt 480px,
 *    es werden also 412px weggeschnitten. `center 58%` legt das Fenster auf 239..719px —
 *    die Gruppe (268..714px) liegt komplett drin, mit 29px Luft ueber den Koepfen.
 */
function TeamHero() {
  const { lang } = useLang();
  const h = TEAM[lang].hero;

  return (
    <HeroFrame
      axis="wide"
      title={
        <>
          {h.titleA} {h.titleAccent}
          {lang === 'de' ? ', ' : ' '}
          {h.titleB}
        </>
      }
      lead={h.lead}
      media={{
        src: '/photos/showcase/hp-03.webp',
        alt: 'Das Salsaflow-Team gemeinsam im hellen Studio',
        position: 'center 58%',
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
            <motion.h2 variants={item} className={cn(g.eyebrow ? 'mt-5' : 'mt-0', sectionTitle, MEASURE_L)}>
              {g.title}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 text-pretty ${sectionLead}`}>
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
              <li key={founder.key} className="min-w-0">
                <figure className="group flex h-full flex-col">
                  <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-soft)] sm:aspect-[4/5]">
                    <img
                      src={founder.photo}
                      alt={`${founder.name} ${founder.last}, ${role} ${lang === 'de' ? 'von' : 'at'} Salsaflow`}
                      className="absolute max-w-none transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.02]"
                      style={{ width: founder.bust.w, left: founder.bust.l, top: founder.bust.t }}
                      loading="lazy"
                      width={1000}
                      height={1414}
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
                    <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
                      {role}
                    </p>
                    {/* Immer gerendert (auch ohne Treffer), siehe TeachingLine: sonst
                        springt die Reihe beim Nachladen und die vier Karten stehen
                        unterschiedlich hoch. */}
                    <div className="mt-3 border-t border-[var(--color-line)] pt-3">
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

/* ---------------------------------------------------------------------------- Geschichte (vier Freunde) */
// Helles Zwei-Spalten-Kapitel: links das ganze Team im Studio (helles Foto, weisser Chip), rechts
// die Geschichte. Kein dunkles Overlay, keine Karte-in-Karte mehr.
function StorySection() {
  const { lang } = useLang();
  const reduced = useReducedMotion();
  const s = TEAM[lang].story;
  const { item } = useReveal();
  const storyNote =
    lang === 'de' ? 'Du gehörst vom ersten Abend an dazu.' : 'You belong from your very first evening.';

  const imgReveal: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 20, scale: reduced ? 1 : 0.99 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: reduced ? 0.3 : 0.7, ease: EASE_OUT } },
  };

  return (
    <section className="overflow-hidden bg-[var(--color-paper-warm)] py-16 lg:py-20">
      <Shell className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <motion.figure
          data-reveal
          className="relative order-2 lg:order-1"
          variants={imgReveal}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <div className="relative w-full overflow-hidden rounded-[var(--radius-media)] bg-[var(--color-bg-soft)] shadow-[0_30px_70px_-32px_rgba(17,17,17,0.45)] ring-1 ring-black/5">
            <img
              src="/photos/gallery/kurse/09.jpg"
              alt="Das ganze Salsaflow-Team gemeinsam im hellen Studio"
              className="aspect-[4/3] w-full object-cover object-[center_28%]"
              width={1067}
              height={1600}
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
            <figcaption className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 shadow-[0_8px_22px_-6px_rgba(17,17,17,0.4)] backdrop-blur">
              <BeatMark />
              <p className="text-xs font-bold text-[var(--color-ink)]">
                {lang === 'de' ? 'Gegründet 2018 in Basel' : 'Founded 2018 in Basel'}
              </p>
            </figcaption>
          </div>
        </motion.figure>

        <Reveal className="order-1 max-w-xl lg:order-2">
          <motion.div variants={item}>
            <Eyebrow>{s.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2
            variants={item}
            className={cn(
              'mt-5 font-display text-3xl font-extrabold leading-[1.05] tracking-[-0.02em] text-balance text-[var(--color-ink)] sm:text-4xl lg:text-[2.9rem]',
              MEASURE_L,
            )}
          >
            {s.title}
          </motion.h2>
          <motion.p variants={item} className="mt-6 text-pretty text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
            {s.body}
          </motion.p>
          <motion.p variants={item} className="mt-4 text-pretty text-base leading-relaxed text-[var(--color-ink-muted)]">
            {s.body2}
          </motion.p>
          <motion.p
            variants={item}
            className="mt-6 inline-flex rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)] shadow-sm"
          >
            {storyNote}
          </motion.p>
        </Reveal>
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
            className="max-w-[26em] text-balance font-display text-[1.55rem] font-bold leading-[1.15] tracking-[-0.015em] text-[var(--color-ink)] sm:text-[1.85rem]"
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
const ROLE_ANCHOR: Record<string, { href: string; photos: string[] }> = {
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

  const imgReveal: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 18, scale: reduced ? 1 : 0.99 },
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
          <img
            src="/photos/2026/kurse-heels-energie-01.webp"
            alt={supportVisual.alt}
            className="aspect-[21/9] w-full rounded-[var(--radius-media)] object-cover object-[center_40%]"
            /* Runde 3, Issue 8: die Datei ist jetzt 1920x935 (Wasserzeichen-Streifen unten
               abgeschnitten). width/height muessen das echte Seitenverhaeltnis melden,
               sonst reserviert der Browser die falsche Hoehe (CLS). */
            width={1920}
            height={935}
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
            const anchor = ROLE_ANCHOR[grp.id];
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
                  <h3 className="font-display text-[1.45rem] font-bold leading-[1.1] tracking-tight text-[var(--color-ink)] sm:text-[1.7rem]">
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
const FACE_SHAPE: { pos: string; zoom?: string; ratio: string; drop?: string }[] = [
  { ratio: 'aspect-[4/5]', pos: 'object-[48%_2%]' },
  { ratio: 'aspect-[4/5] lg:aspect-[3/4]', pos: 'object-[52%_15%]', zoom: 'scale-[1.16]', drop: 'lg:mt-10' },
  { ratio: 'aspect-[4/5] lg:aspect-[5/7]', pos: 'object-[54%_1%]' },
  { ratio: 'aspect-[4/5] lg:aspect-[3/4]', pos: 'object-[50%_14%]', zoom: 'scale-[1.12]', drop: 'lg:mt-10' },
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
    <section id="gesichter" className="scroll-mt-24 bg-[var(--color-paper-warm)] py-16 lg:py-20">
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
            const shape = FACE_SHAPE[i] ?? FACE_SHAPE[FACE_SHAPE.length - 1];
            // Letzte Karte: liegende Bauform, solange das Raster 2-spaltig ist.
            const banner = i === FACES.length - 1 && FACES.length % 2 === 1;
            return (
              <motion.figure
                key={face.id}
                variants={item}
                className={cn(
                  'flex w-full flex-col',
                  shape.drop,
                  // Waise mittig, aber in derselben Bauform und Spaltenbreite wie die
                  // anderen vier (Breite = eine Rasterspalte inkl. halber Rasterluecke).
                  banner &&
                    'col-span-2 mx-auto w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-1.25rem)/2)] lg:col-span-1 lg:mx-0 lg:w-full',
                )}
              >
                <div
                  className="relative w-full overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] shadow-[0_14px_38px_-18px_rgba(17,17,17,0.32)]"
                  style={panelStyle}
                >
                  {/* dezenter Rot-Akzent: schmale Grundlinie unter dem Freisteller */}
                  <span aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-[3px] bg-[var(--color-salsa)]/70" />
                  <img
                    src={face.photo ?? ''}
                    alt={face.name ? `${face.name}, ${face.role ?? 'Tanzlehrer'} bei Salsaflow` : 'Mitglied des Salsaflow-Teams'}
                    className={cn('relative w-full object-cover', shape.ratio, shape.pos, shape.zoom)}
                    loading="lazy"
                    width={1000}
                    height={1414}
                  />
                </div>
                {/* `p` statt `span` aus demselben Grund wie bei den Gruender-Karten: nur so
                    sieht der Ausweich-Guard des Cookie-Hinweises diese Namen und Rollen
                    (Befund m-02/m-07, Ursache in site/CookieBanner.tsx:17). */}
                <figcaption className="mt-3.5 min-w-0 px-1">
                  <p className="font-display text-xl font-extrabold leading-none tracking-[-0.01em] text-[var(--color-ink)] sm:text-2xl">
                    {face.name ?? f.namePlaceholder}
                  </p>
                  {face.role && (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
                      <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--color-salsa)]" />
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
