// Kontakt-Seite (Etappe 14) unter /kontakt. SiteHeader, Hero, ein echtes Kontaktformular (postet
// an /api/public/contact, server/contact-routes.ts), eine Direktkontakt-Karte, der Standort, die
// Raumvermietung und eine Kanal-Leiste, dann SiteFooter. Bright-Editorial-Standard (Geil-Pass v2):
// 1400px-Shell, durchgehend helle Flaechen (dunkel nur im Foto selbst), Lucide-Pfeile statt
// Unicode, ruhige Reveal-Motion. Inhalt + Fakten in contact/content.ts. KEINE Preise, keine
// erfundenen Fakten. Copy nach Regel 003/069/085 (simpel, du-Form, echte Umlaute, CH-ss, keine
// Em-Dashes).

import { useEffect, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';
import { Seo } from '@/lib/seo';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter, CONTACT } from '@/public/site/SiteFooter';
import { sectionTitle, sectionLead, TitleAccent, Shell, Eyebrow, GoogleRating } from '@/public/site/primitives';
import { WhatsAppIcon } from '@/public/site/BrandIcons';
import { MEASURE_XL, MEASURE_L } from '@/public/subpage/kit';
import { Reveal, useReveal } from '@/public/home/motion';
import { CONTACT_PAGE, type TopicKey } from '@/public/contact/content';
import { InquiryWizard } from '@/public/contact/InquiryWizard';
import { Music, MapPin, CalendarClock, ArrowRight, type LucideIcon } from 'lucide-react';

// Stage 4 Icon-System: sprechende Icons fuer die Raum-Miet-Punkte
// (helle Raeume mit Anlage -> Lage am SBB -> flexible Nutzung).
const ROOM_ICONS: LucideIcon[] = [Music, MapPin, CalendarClock];

const TOPIC_HASHES: Record<string, TopicKey> = {
  '#schnupperstunde': 'schnupperstunde',
  '#privatstunden': 'privatstunden',
  '#raumvermietung': 'raumvermietung',
  '#geschenkgutschein': 'geschenkgutschein',
  '#events': 'events',
  '#animationen': 'animationen',
};

function topicFromLocation(): TopicKey {
  if (typeof window === 'undefined') return 'schnupperstunde';
  const fromHash = TOPIC_HASHES[window.location.hash];
  if (fromHash) return fromHash;
  if (new URLSearchParams(window.location.search).has('kurs')) return 'kurs';
  return 'schnupperstunde';
}

export function ContactPage() {
  // Anliegen-State liegt hier in der Parent-Komponente (state lifting), damit "Raum anfragen"
  // in der RentalSection das Dropdown im Formular vorbelegen kann. FormSection ist controlled.
  const [topic, setTopic] = useState<TopicKey>(topicFromLocation);
  const [cookieVisible, setCookieVisible] = useState(false);
  const [cookieClear, setCookieClear] = useState(false);

  // Hash setzt das Anliegen und scrollt zum Wizard. #raumvermietung darf nicht an der
  // Infosektion landen — die Traegt bewusst keine gleichnamige id mehr.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const next = topicFromLocation();
    setTopic(next);
    if (!TOPIC_HASHES[window.location.hash]) return;
    const target = document.getElementById('kontaktformular');
    if (!target) return;
    const frame = window.requestAnimationFrame(() => {
      target.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Die fixe Cookie-Leiste darf den letzten Kontaktinhalt nicht verdecken. Das bestehende
  // Sichtbarkeits-Event hält den Abstand exakt so lange aktiv, wie die Leiste sichtbar ist.
  useEffect(() => {
    const onCookieVisibility = (event: Event) => {
      setCookieVisible(Boolean((event as CustomEvent<boolean>).detail));
    };
    window.addEventListener('salsaflow-cookie-visibility', onCookieVisibility);
    const frame = window.requestAnimationFrame(() => {
      setCookieVisible(Boolean(document.querySelector('[data-testid="cookie-accept"]')));
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('salsaflow-cookie-visibility', onCookieVisibility);
    };
  }, []);

  // Der Hinweis darf im Hero sichtbar bleiben. Sobald das Formular in den Viewport kommt,
  // räumt er die Arbeitsfläche dauerhaft frei; auf anderen Routen erscheint er weiter normal.
  useEffect(() => {
    const formSection = document.querySelector('#schnupperstunde');
    if (!formSection || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setCookieClear(true);
    });
    observer.observe(formSection);
    return () => observer.disconnect();
  }, []);

  const cookieSafe = cookieVisible && !cookieClear;

  return (
    <>
      <Seo page="contact" />
      <SiteHeader />
      <main
        id="main"
        tabIndex={-1}
        className="contact-page"
        data-cookie-clear={cookieClear ? 'true' : 'false'}
        style={{
          '--contact-cookie-safe': cookieSafe ? 'calc(3.625rem + env(safe-area-inset-bottom))' : '0px',
        } as CSSProperties}
      >
        <ContactHero />
        <FormSection topic={topic} setTopic={setTopic} />
        <LocationSection />
        <RentalSection onRequestRoom={() => setTopic('raumvermietung')} />
      </main>
      <SiteFooter entryCta={false} />
    </>
  );
}

/* ---------------------------------------------------------------------------- Hero */
// S3 (14.08.2026): Der Hero trug vorher nur Headline, eine Zeile und den WhatsApp-Knopf auf
// leerem Papier. Auf 1440px stand damit oberhalb des Formulars eine kalte Textwand ohne ein
// einziges Gesicht — auf der EINEN Seite, auf der jemand eine Person ansprechen will.
//
// Vorbild ist der /fotos-Hero (PhotosPage.tsx GalleryHero): links Text plus echte
// Google-Zeile, rechts eine kompakte Foto-Komposition aus hellen Studio-Bildern. Dieselbe
// Bauform, dieselbe Bild-Sprache, damit die Seite nicht ihr eigenes Muster erfindet.
//
// Bild-Wahl nach DESIGN.md:92 (ein Bild-Stil ueber die Seite). Drei Studio-Kacheln,
// Tageslicht, Helligkeits-Abstand max 38 (Kachel 2 vs 3):
//   kurse/kurs-07.jpg                   1067x1600  lum 128  R-B +59.0  Kurs vor roter Wand
//   premium/community-story-1600.webp   1600x1067  lum 151  R-B +22.2  Team auf der Couch
//   premium/offer-salsa-wide-1400.webp  1400x1000  lum 113  R-B +50    Paar in der Salsa-Haltung
// R178: 2026/kurse-classfreude-01.webp raus (Home-Duplikat WhyGrid.tsx:91, 10 Fundstellen).
// Dritte Kachel nicht auf der Startseite. 4/3-Crop: object-center haelt beide Koepfe frei.
// Raus: gallery/kurse/01 (lum 96, 55 Punkte unter Kachel 2, 10 Fundstellen gegen DESIGN.md:93),
// gallery/kurse/08 (gleicher Taenzer/Shooting wie Kachel 1, sichtbares Duplikat),
// kurs-03 (Logo-Wand, im Spiegel doppelt), kurs-05 (Logo-Wand), heels-energie (Logo-Wand),
// hero-paar-dreh (Tungsten-Orange), gallery/kurse/06 (LocationSection),
// hp-03/21/29 (Logo-Wand), party-03, party-07-v3, event-06-v3 (Schriftzug/Wasserzeichen),
// party-25, party-50-v3, hp-13 (Salsaflow-Wand-Logo bzw. Plakat).
function ContactHero() {
  const { lang } = useLang();
  const h = CONTACT_PAGE[lang].hero;
  const direct = CONTACT_PAGE[lang].direct;
  const { container, item } = useReveal();
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-paper-warm)]" style={{ paddingTop: 'calc(var(--nav-h) + 0.75rem)' }}>
      {/* Kunden-Feedback 2026-08-07: "Die Hintergrund-Illustrationen sehen uebelst komisch aus."
          Die gezeichnete Choreo-Kurve (/graphics/choreo-curve-*.webp) lag hier hinter dem
          Hero und ist ersatzlos gestrichen — sie war die einzige gezeichnete Grafik der
          Seite und stand damit allein neben lauter echten Fotos.
          Sie war absolut positioniert, das Layout aendert sich durch das Entfernen also
          nicht. An ihre Stelle tritt derselbe warme Lichtschein, den JEDER Unterseiten-Hero
          traegt (subpage/kit.tsx HeroFrame) — Farbe statt Zeichnung, sitewide dieselbe
          Signatur. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(173,24,39,0.07)_0%,transparent_68%)]"
      />
      <Shell className="grid grid-cols-1 items-center gap-9 pb-8 pt-2 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:pb-12">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl">
          {/* Hierarchie: die H1 traegt NUR den Zuruf ("Schreib uns, was du suchst."). Der zweite
              Satz ("Wir helfen dir beim naechsten Schritt.") war vorher als erzwungener Block in
              derselben H1 und hat sie auf 1440px auf 3 Zeilen mit Waisenwort "Schritt." gerissen
              (gemessen 2026-08-06). Er steht jetzt als Versprechen ueber dem Lead — gleiche Worte,
              klare Staffelung gross -> mittel -> Fliesstext. */}
          <motion.h1
            variants={item}
            className={cn(
              'type-h1 text-[var(--color-ink)]',
              MEASURE_XL,
            )}
          >
            {h.titleA} <TitleAccent>{h.titleAccent}</TitleAccent>
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-3 max-w-lg text-pretty font-display text-lg font-bold leading-snug text-[var(--color-ink)] sm:text-xl"
          >
            {h.titleB}
          </motion.p>
          <motion.p
            variants={item}
            className="mt-4 max-w-md text-pretty text-base leading-relaxed text-[var(--color-ink-muted)]"
          >
            {lang === 'de'
              ? 'Ein paar Angaben genügen. Wir antworten meistens innerhalb von 24 Stunden.'
              : 'A few details are enough. We usually reply within 24 hours.'}
          </motion.p>
          {/* R56: Der einzige Hero-Knopf fuehrte per WhatsApp raus, das eigene Formular
              (direkt unter dem Hero, Anker #kontaktformular) blieb ohne Einstieg. Jetzt
              Primary = Formular ("Anfrage starten"), WhatsApp als ruhiger zweiter Weg
              daneben (Outline statt Primary-Rot). */}
          <motion.div variants={item} className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="#kontaktformular"
              className="btn-base btn-primary group gap-2 px-5 text-sm"
            >
              {h.primaryCta}
              <ArrowRight size={16} strokeWidth={2.25} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
            </a>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn-base btn-outline group gap-2 px-5 text-sm"
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0" />
              {direct.whatsappLabel}
            </a>
          </motion.div>
          {/* Echte Google-Bewertung auf hellem Grund, mit dem Vierfarb-G aus
              public/logo/google-g.svg (GoogleRating in site/primitives). */}
          <motion.div variants={item} className="mt-6">
            <GoogleRating />
          </motion.div>
        </motion.div>

        {/* Foto-Komposition nach /fotos-Vorbild: ein grosses Hochformat plus zwei Querformate. */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4 lg:max-w-none"
        >
          <motion.div
            variants={item}
            className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-media)] bg-[var(--color-bg-soft)] shadow-[0_26px_60px_-30px_rgba(17,17,17,0.45)] ring-1 ring-black/5"
          >
            <img
              src="/photos/kurse/kurs-07.jpg"
              alt={lang === 'de'
                ? 'Trainer in grauem Tanktop führt den Schritt, die Kursgruppe tanzt vor der roten Studiowand'
                : 'Instructor in a grey tank top leading the step, the class dancing in front of the red studio wall'}
              // object-top: Hochformat (1067x1600) im 4/5-Ausschnitt, mittig lagen die Koepfe
              // der hinteren Reihe ausserhalb.
              className="h-full w-full object-cover object-top"
              width={1067}
              height={1600}
              loading="eager"
              fetchPriority="high"
            />
          </motion.div>
          <div className="grid gap-3 sm:gap-4">
            <motion.div
              variants={item}
              className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-media)] bg-[var(--color-bg-soft)] shadow-[0_20px_48px_-26px_rgba(17,17,17,0.45)] ring-1 ring-black/5"
            >
              <img
                src="/photos/premium/community-story-1600.webp"
                alt={lang === 'de'
                  ? 'Vier Team-Mitglieder sitzen lachend auf einer Ledercouch im hellen Studio'
                  : 'Four team members sitting and smiling on a leather couch in the bright studio'}
                // 3:2 (1600x1067) in 4/3: Crop nur links/rechts, volle Hoehe. object-center
                // haelt alle vier Koepfe frei. Kein Wand-Logo.
                className="h-full w-full object-cover object-center"
                width={1600}
                height={1067}
                loading="eager"
              />
            </motion.div>
            <motion.div
              variants={item}
              className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-media)] bg-[var(--color-bg-soft)] shadow-[0_20px_48px_-26px_rgba(17,17,17,0.45)] ring-1 ring-black/5"
            >
              <img
                src="/photos/premium/offer-salsa-wide-1400.webp"
                alt={lang === 'de'
                  ? 'Tanzpaar in der Salsa-Haltung, Frau mit blonden Locken im Vordergrund, heller Übungsraum'
                  : 'Dancing couple in salsa hold, woman with blonde curls in the foreground, bright practice room'}
                // 1400x1000 (7:5) in 4/3: Crop nur minimal links/rechts. object-center haelt beide Koepfe frei.
                className="h-full w-full object-cover object-center"
                width={1400}
                height={1000}
                loading="eager"
              />
            </motion.div>
          </div>
        </motion.div>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Formular + Direktkontakt */
function FormSection({
  topic,
  setTopic,
}: {
  topic: TopicKey;
  setTopic: (topic: TopicKey) => void;
}) {
  const { item } = useReveal();

  return (
    <section id="schnupperstunde" className="scroll-mt-24 bg-[var(--color-bg-soft)] py-10 lg:py-14">
      {/* id="kontaktformular" bleibt als Alias-Anker (Shell nimmt keine id entgegen), damit
          "Raum anfragen" weiter hierher scrollt. */}
      <span id="kontaktformular" aria-hidden className="block scroll-mt-24" />
      <Shell>
        <Reveal>
          {/* max-w-[640px] zentriert (Absprache S3, Punkt 2): der Wizard lief vorher ueber die
              volle 1400px-Shell. Ein Formular mit drei Feldern in einer 1400px-Karte liest sich
              wie ein leeres Amtsblatt; die Anliegen-Karten wurden dabei so breit, dass zwischen
              Icon und Label ein halber Bildschirm Luft stand.
              overflow-visible statt hidden: der mobile sticky "Weiter"-Knopf des Wizards
              sass bei y=832 im 844er-Fold und wurde vom Rahmen abgeschnitten (Critic
              Runde 7, Item 1). */}
          <motion.div
            variants={item}
            className="mx-auto w-full max-w-[640px] overflow-visible rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_22px_70px_rgba(17,17,17,0.08)]"
          >
            <InquiryWizard initialTopic={topic} onTopicChange={setTopic} />
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Standort */
function LocationSection() {
  const { lang } = useLang();
  const l = CONTACT_PAGE[lang].location;
  const { item } = useReveal();
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Text + Maps-Button */}
        <Reveal>
          <motion.h2 variants={item} className={cn(sectionTitle, MEASURE_L)}>{l.title}</motion.h2>
          <motion.p variants={item} className={`mt-4 max-w-xl text-pretty ${sectionLead}`}>{l.body}</motion.p>
          <motion.div variants={item}>
            <a
              href={CONTACT.anfahrt}
              data-testid="contact-maps"
              target="_blank"
              rel="noreferrer"
              className="btn-base btn-outline group mt-6 gap-2 px-6 py-3 text-base"
            >
              {l.mapsCta}
              <ArrowRight size={18} strokeWidth={2} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </Reveal>

        {/* Helles Studio-Foto rechts.
            Design-Kritik Runde 3, Issue 3: hier lag /photos/gallery/kurse/03.jpg — dasselbe
            Foto wie im Home-Hero, in der Team-Sektion, auf der Bachata-Kachel und in der
            Galerie (9 Fundstellen, erlaubt sind sitewide 2, DESIGN.md:93). Dazu kam ein
            Alt/Bild-Widerspruch: der Alt-Text versprach "Heller Tanzraum mit Holzboden und
            Spiegelwand", gezeigt wurde ein dunkler Party-Schnappschuss (Luminanz 53/255).
            Jetzt kurse/06.jpg (Luminanz 128/255, Tageslicht, Holzboden, laufender Kurs) und
            der Alt-Text in contact/content.ts beschreibt genau dieses Bild statt eines
            Wunschbilds. kurse/09.jpg waere ebenfalls hell, gehoert aber schon der
            Team-Sektion (TeamPage.tsx:203) — es haette die Dopplung nur verschoben. */}
        <Reveal>
          <motion.div variants={item} className="relative overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_18px_50px_rgba(17,17,17,0.08)]">
            {/* Hochformat-Foto (1066x1600) im Querformat-Crop: object-top haelt die Koepfe
                im Bild, object-center schnitt sie ab. 68% statt center horizontal: am linken
                Rahmen wurde sonst der Frauenkopf angeschnitten — Crop auf den mittleren
                Taenzer (Critic 13.08.2026). */}
            <img
              src="/photos/gallery/kurse/06.jpg"
              alt={l.imageAlt}
              className="aspect-[3/2] w-full object-cover object-[68%_top] sm:aspect-[4/3]"
              width={1066}
              height={1600}
              loading="eager"
            />
            {/* Sitewide Warm-Soft-Light: letztes editoriales Foto in die warme Bild-Welt. */}
            {/* Festes Papier statt Glas (bg-white/92 + backdrop-blur) auf dem Foto —
                Glas-Optik ist im Bild-System verboten (Critic 13.08.2026). */}
            <div className="relative m-4 rounded-[var(--radius-card)] bg-[var(--color-paper-warm)] p-4 text-[var(--color-ink)] sm:absolute sm:bottom-4 sm:left-4 sm:m-0 sm:max-w-[17rem] sm:shadow-xl">
              <p className="font-display text-xl font-bold leading-tight">
                {lang === 'de' ? 'Drei Studios. Wenige Schritte.' : 'Three studios. A few steps.'}
              </p>
            </div>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Raumvermietung (Anker #raumvermietung) */
// Collabs + FAQ leben jetzt auf /mehr (Master-Plan: Kontakt bleibt schlank auf ankommen/schreiben/
// finden). Raumvermietung bleibt hier, weil ihre Aktion das Kontaktformular ist.
function RentalSection({ onRequestRoom }: { onRequestRoom: () => void }) {
  const { lang } = useLang();
  const r = CONTACT_PAGE[lang].rental;
  const { item } = useReveal();
  const uses =
    lang === 'de'
      ? ['Training', 'Workshop', 'Probe', 'kleines Event']
      : ['Training', 'Workshop', 'Rehearsal', 'small event'];
  return (
    <section id="raum-info" className="scroll-mt-24 bg-[var(--color-bg-soft)] pt-16 pb-[calc(4rem+var(--contact-cookie-safe,0px))] lg:pt-24 lg:pb-[calc(6rem+var(--contact-cookie-safe,0px))]">
      <Shell>
        <Reveal>
          <motion.article
            variants={item}
            className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_22px_70px_rgba(17,17,17,0.08)]"
          >
            <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-10">
                <div>
                  <Eyebrow>{r.eyebrow}</Eyebrow>
                  <h2 className={cn('type-h2 mt-5 text-[var(--color-ink)]', MEASURE_L)}>
                    {r.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-[var(--color-ink-muted)]">{r.body}</p>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {uses.map((use) => (
                    <span
                      key={use}
                      className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-paper-warm)] px-4 py-3 text-sm font-bold text-[var(--color-ink)]"
                    >
                      {use}
                    </span>
                  ))}
                </div>
                <a
                  href="#kontaktformular"
                  onClick={onRequestRoom}
                  className="btn-base btn-primary group mt-8 w-fit gap-2 px-6 py-3 text-base"
                >
                  {r.cta}
                  <ArrowRight size={18} strokeWidth={2.25} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
                </a>
              </div>

              <div className="relative overflow-hidden bg-[var(--color-paper-warm)] lg:min-h-[28rem] lg:bg-[var(--color-ink)]">
                <img
                  src="/photos/schedule/kurs-aktion.webp"
                  alt={lang === 'de'
                    ? 'Heller Tanzraum mit Spiegelwand und Holzboden im Salsaflow Studio'
                    : 'Bright dance room with mirror wall and wooden floor at the Salsaflow studio'}
                  // Raumvermietung zeigt den RAUM: vorher lag hier danceflow/05.jpg, ein
                  // dunkles Party-Close-up (Critic 13.08.2026). kurs-aktion.webp ist der
                  // helle Tanzraum mit Spiegelwand — zweite Nutzung neben /kursplan,
                  // sitewide-Limit 2 eingehalten. 25%: Kopfreihe bleibt im Bild.
                  className="aspect-[4/3] w-full object-cover object-[center_25%] opacity-92 lg:absolute lg:inset-0 lg:h-full lg:aspect-auto"
                  width={1600}
                  height={1065}
                  loading="lazy"
                />
                <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-t from-black/72 via-black/8 to-transparent lg:block" />
                {/* Festes Papier statt Glas auf dem Foto — wie bei der Standort-Karte
                    (Critic 13.08.2026). */}
                <div className="relative m-5 rounded-[var(--radius-media)] bg-[var(--color-paper-warm)] p-5 text-[var(--color-ink)] lg:absolute lg:bottom-5 lg:right-5 lg:m-0 lg:max-w-[25rem] lg:shadow-xl">
                  <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                    {lang === 'de' ? 'Direkt am Bahnhof SBB' : 'By Basel SBB station'}
                  </p>
                  <div className="mt-4 grid gap-3">
                    {r.points.map((point, i) => {
                      const Icon = ROOM_ICONS[i] ?? Music;
                      return (
                        <div key={point} className="grid grid-cols-[auto_1fr] gap-3 text-sm font-semibold leading-snug text-[var(--color-ink)]">
                          <Icon aria-hidden className="mt-0.5 h-[1.1rem] w-[1.1rem] shrink-0 text-[var(--color-salsa)]" strokeWidth={1.75} />
                          {point}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        </Reveal>
      </Shell>
    </section>
  );
}
