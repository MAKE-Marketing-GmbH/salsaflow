// Kontakt-Seite (Etappe 14) unter /kontakt. SiteHeader, Hero, ein echtes Kontaktformular (postet
// an /api/public/contact, server/contact-routes.ts), eine Direktkontakt-Karte, der Standort, die
// Raumvermietung und eine Kanal-Leiste, dann SiteFooter. Bright-Editorial-Standard (Geil-Pass v2):
// 1400px-Shell, durchgehend helle Flaechen (dunkel nur im Foto selbst), Lucide-Pfeile statt
// Unicode, ruhige Reveal-Motion. Inhalt + Fakten in contact/content.ts. KEINE Preise, keine
// erfundenen Fakten. Copy nach Regel 003/069/085 (simpel, du-Form, echte Umlaute, CH-ss, keine
// Em-Dashes).

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';
import { Seo } from '@/lib/seo';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter, CONTACT } from '@/public/site/SiteFooter';
import { sectionTitle, sectionLead, TitleAccent, Shell, Eyebrow } from '@/public/site/primitives';
import { MEASURE_XL, MEASURE_L } from '@/public/subpage/kit';
import { Reveal, useReveal } from '@/public/home/motion';
import { CONTACT_PAGE, type TopicKey } from '@/public/contact/content';
import { InquiryWizard } from '@/public/contact/InquiryWizard';
import { Music, MapPin, CalendarClock, ArrowRight, type LucideIcon } from 'lucide-react';

// Stage 4 Icon-System: sprechende Icons fuer die Raum-Miet-Punkte
// (helle Raeume mit Anlage -> Lage am SBB -> flexible Nutzung).
const ROOM_ICONS: LucideIcon[] = [Music, MapPin, CalendarClock];

export function ContactPage() {
  // Anliegen-State liegt hier in der Parent-Komponente (state lifting), damit "Raum anfragen"
  // in der RentalSection das Dropdown im Formular vorbelegen kann. FormSection ist controlled.
  const [topic, setTopic] = useState<TopicKey>('kontakt');
  const [cookieVisible, setCookieVisible] = useState(false);
  const [cookieClear, setCookieClear] = useState(false);

  // Hash-Vorauswahl: kommt der Besucher ueber den sitewide CTA /kontakt#schnupperstunde,
  // ist das Anliegen-Dropdown direkt auf "Schnupperstunde" vorbelegt. Ueber /kontakt#raumvermietung
  // (Mehr-Nav) ist es analog auf "Raumvermietung" vorbelegt.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash === '#schnupperstunde') {
      setTopic('schnupperstunde');
    } else if (window.location.hash === '#raumvermietung') {
      setTopic('raumvermietung');
    } else if (new URLSearchParams(window.location.search).has('kurs')) {
      setTopic('kurs');
    }
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
function ContactHero() {
  const { lang } = useLang();
  const h = CONTACT_PAGE[lang].hero;
  const direct = CONTACT_PAGE[lang].direct;
  const { container, item } = useReveal();
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-paper-warm)]" style={{ paddingTop: 'calc(var(--nav-h) + 1.5rem)' }}>
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
      <Shell className="grid items-center gap-8 pb-12 pt-6 sm:pb-14 lg:grid-cols-[1fr_0.72fr] lg:gap-14 lg:pt-10">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
          {/* Hierarchie: die H1 traegt NUR den Zuruf ("Schreib uns, was du suchst."). Der zweite
              Satz ("Wir helfen dir beim naechsten Schritt.") war vorher als erzwungener Block in
              derselben H1 und hat sie auf 1440px auf 3 Zeilen mit Waisenwort "Schritt." gerissen
              (gemessen 2026-08-06). Er steht jetzt als Versprechen ueber dem Lead — gleiche Worte,
              klare Staffelung gross -> mittel -> Fliesstext. */}
          <motion.h1
            variants={item}
            className={cn(
              'font-display text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.022em] text-balance text-[var(--color-ink)] sm:text-5xl lg:text-[3.55rem]',
              MEASURE_XL,
            )}
          >
            {h.titleA} <TitleAccent>{h.titleAccent}</TitleAccent>
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-5 max-w-lg text-pretty font-display text-xl font-bold leading-snug text-[var(--color-ink)] sm:text-2xl"
          >
            {h.titleB}
          </motion.p>
          <motion.p variants={item} className={`mt-4 max-w-xl text-pretty ${sectionLead}`}>{h.lead}</motion.p>
        </motion.div>

        <motion.div variants={item} initial="hidden" animate="show">
          <aside className="rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white p-6 shadow-[0_18px_50px_rgba(17,17,17,0.08)] sm:p-7">
            <h2 className="font-display text-2xl font-bold leading-tight text-[var(--color-ink)]">
              {direct.title}
            </h2>
            <div className="mt-6 space-y-3">
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="group grid min-h-14 grid-cols-[1fr_auto] items-center gap-3 rounded-[var(--radius-card)] bg-[var(--color-salsa)] px-4 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-salsa-700)]"
              >
                <span>{direct.whatsappLabel}</span>
                <ArrowRight size={18} strokeWidth={2.25} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="grid min-h-14 gap-1 rounded-[var(--radius-card)] border border-[var(--color-line)] px-4 py-3 font-semibold text-[var(--color-ink)] hover:border-[var(--color-salsa)] sm:grid-cols-[auto_1fr] sm:items-center sm:gap-4"
              >
                <span>{direct.emailLabel}</span>
                <span className="min-w-0 break-words text-sm font-medium leading-snug text-[var(--color-ink-muted)] sm:text-right">
                  {CONTACT.email}
                </span>
              </a>
              <a
                href={CONTACT.phoneHref}
                className="grid min-h-14 gap-1 rounded-[var(--radius-card)] border border-[var(--color-line)] px-4 py-3 font-semibold text-[var(--color-ink)] hover:border-[var(--color-salsa)] sm:grid-cols-[auto_1fr] sm:items-center sm:gap-4"
              >
                <span>{direct.phoneLabel}</span>
                <span className="text-sm font-medium leading-snug text-[var(--color-ink-muted)] sm:text-right">{CONTACT.phoneDisplay}</span>
              </a>
            </div>
            <p className="mt-5 border-t border-[var(--color-line)] pt-5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {direct.hours}
            </p>
          </aside>
        </motion.div>
      </Shell>

      {/* Kritiker final-1, Issue 3 ("Utility-Seiten eine Klasse unter den Story-Seiten"):
          /events und /team oeffnen beide mit Typo-Block PLUS full-bleed Bildband darunter
          (subpage/kit.tsx HeroFrame, Prop `media`) — /kontakt hatte als einzige Story-relevante
          Seite gar kein Bild ueber der Falz und startete direkt mit dem Formular.

          Gemessen an den Kritiker-Screenshots (_screenshots-kritiker/final-1, gerenderte
          <img src="/photos/...">-Tags in dist/): team 12, events 12, kontakt 6, preise 1.

          Dieselbe Geometrie wie HeroFrame media (h-[16rem] / sm:h-[22rem] / lg:h-[30rem],
          randlos, ohne Radius) — bewusst kopierte MASSE statt kopierter Code, weil dieser
          Hero seine eigene Bauform mit der Direkt-Karte rechts traegt und nicht auf HeroFrame
          umgestellt werden kann, ohne genau diese Karte zu verlieren. */}
      <div className="relative w-full overflow-hidden">
        <img
          src="/photos/party/party-29.webp"
          alt={
            lang === 'de'
              ? 'Lachende Tanzende auf der Fläche bei einer Salsaflow Danceflow Night'
              : 'Laughing dancers on the floor at a Salsaflow Danceflow Night'
          }
          // Kritiker final-2, Issue 6: Datei 1500x1000, Hero-Band 1440x480 -> skaliert 1440x960,
          // 480px fallen weg. Bei 40% lagen 192px oben: die Koepfe der hinteren Reihe standen
          // dicht an der Oberkante, unten wurde ein Gesicht halbiert. Bei 22% (106px oben)
          // bekommt die hintere Reihe Kopfraum, und der Schnitt unten faellt in den Boden.
          className="h-[18rem] w-full object-cover object-[center_4%] sm:h-[24rem] lg:h-[32rem]"
          width={1500}
          height={1000}
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Formular + Direktkontakt */
type Status = 'idle' | 'submitting' | 'success' | 'error';

function FormSection({
  topic,
  setTopic,
}: {
  topic: TopicKey;
  setTopic: (topic: TopicKey) => void;
}) {
  const { lang } = useLang();
  const f = CONTACT_PAGE[lang].form;
  const { item } = useReveal();
  const topicHints: Record<TopicKey, string> =
    lang === 'de'
      ? {
          kontakt: 'Allgemeine Frage. Wir leiten dich an die richtige Person weiter.',
          schnupperstunde: 'Schnupperstunde. Wir schlagen dir direkt passende Kurse vor.',
          kurs: 'Kursfrage. Nenne uns gern Stil, Level oder Wochentag.',
          privatstunden: 'Privatstunden. Schreib kurz dein Ziel und deinen Wunschzeitraum.',
          raumvermietung: 'Raumvermietung. Nenne Datum, Uhrzeit und Gruppengrösse.',
          events: 'Events. Schreib kurz, zu welchem Abend du eine Frage hast.',
          geschenkgutschein: 'Geschenkgutschein. Nenne kurz Betrag oder Anlass.',
          animationen: 'Animationen und Shows. Schreib Ort, Datum und Rahmen dazu.',
        }
      : {
          kontakt: 'General question. We forward it to the right person.',
          schnupperstunde: 'Trial class. We suggest suitable classes right away.',
          kurs: 'Class question. Tell us the style, level or weekday if you know it.',
          privatstunden: 'Private lessons. Share your goal and preferred time.',
          raumvermietung: 'Room rental. Add date, time and group size.',
          events: 'Events. Tell us which night you mean.',
          geschenkgutschein: 'Gift voucher. Add the amount or occasion.',
          animationen: 'Animations and shows. Add place, date and context.',
        };
  const submitHelper =
    lang === 'de'
      ? 'Wir melden uns so schnell wie möglich mit dem passenden nächsten Schritt.'
      : 'We will get back to you as soon as possible with the right next step.';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot (fuer Menschen unsichtbar)
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const formRef = useRef<HTMLFormElement>(null);

  const mailtoFallback = `mailto:${CONTACT.email}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: { name?: string; email?: string; message?: string } = {};
    if (!name.trim()) next.name = lang === 'de' ? 'Bitte gib deinen Namen ein.' : 'Please enter your name.';
    if (!email.trim()) {
      next.email = lang === 'de' ? 'Bitte gib deine E-Mail-Adresse ein.' : 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = lang === 'de' ? 'Bitte prüfe deine E-Mail-Adresse.' : 'Please check your email address.';
    }
    if (message.trim().length < 5) {
      next.message = lang === 'de' ? 'Bitte schreib mindestens fünf Zeichen.' : 'Please write at least five characters.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() ? phone.trim() : null,
          topic,
          message: message.trim(),
          language: lang,
          website,
        }),
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="schnupperstunde" className="scroll-mt-24 bg-[var(--color-bg-soft)] py-16 lg:py-24">
      {/* id="kontaktformular" bleibt als Alias-Anker (Shell nimmt keine id entgegen), damit
          "Raum anfragen" weiter hierher scrollt. */}
      <span id="kontaktformular" aria-hidden className="block scroll-mt-24" />
      <Shell>
        <Reveal>
          <motion.div
            variants={item}
            className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_22px_70px_rgba(17,17,17,0.08)]"
          >
            <div className="grid gap-0 border-b border-[var(--color-line)] bg-[var(--color-paper-warm)] lg:grid-cols-[1fr_0.62fr]">
              {/* Eyebrow "Anfrage planen" raus: er sagte dasselbe wie die H2 direkt darunter
                  (Formel-Abbau, Lex-Lin Regel 11 — die Headline traegt die Hierarchie). */}
              <div className="p-6 sm:p-8 lg:p-10">
                <h2 className={cn(sectionTitle, MEASURE_L)}>
                  {lang === 'de' ? 'Deine Anfrage, Schritt für Schritt.' : 'Your request, step by step.'}
                </h2>
                <p className={`mt-4 max-w-md text-pretty ${sectionLead}`}>
                  {lang === 'de'
                    ? 'Wähle dein Anliegen. Danach fragen wir nur, was wirklich zählt.'
                    : 'Choose your request. We then only ask what really matters.'}
                </p>
              </div>
              <div className="relative hidden min-h-full overflow-hidden bg-[var(--color-ink)] lg:block">
                <img
                  src="/photos/gallery/danceflow/08.jpg"
                  alt={lang === 'de' ? 'Salsaflow Gespräch nach dem Kurs' : 'Salsaflow conversation after class'}
                  className="h-full w-full object-cover object-[center_42%] opacity-85"
                  width={1200}
                  height={900}
                  loading="lazy"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/8 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-[var(--radius-card)] bg-white/92 p-4 text-[var(--color-ink)] backdrop-blur">
                  <p className="font-display text-lg font-bold leading-tight">
                    {lang === 'de' ? 'Eine Person aus dem Team meldet sich.' : 'Someone from the team gets back to you.'}
                  </p>
                </div>
              </div>
            </div>

            <InquiryWizard initialTopic={topic} onTopicChange={setTopic} />

            <details className="border-t border-[var(--color-line)] bg-[var(--color-paper-warm)] px-6 py-5 sm:px-8 lg:px-10">
              <summary className="cursor-pointer text-sm font-semibold text-[var(--color-ink)] hover:text-[var(--color-salsa)]">
                {lang === 'de' ? 'Lieber direkt eine Nachricht schreiben?' : 'Prefer to write a direct message?'}
              </summary>
              {/* Kein eigener Karten-Rahmen mehr: dieser Block sitzt bereits in der aeusseren
                  Kontakt-Karte. Zusammen mit den Feld-Kaesten darin waren das drei Ebenen
                  (Design-Kritik Runde 1, "Karten in Karten"). Jetzt traegt eine Trennlinie. */}
              <div className="mt-5 overflow-hidden border-t border-[var(--color-line)]">
            {status === 'success' ? (
              <div
                role="status"
                data-testid="contact-success"
                className="m-6 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-6 sm:m-8 sm:p-8 lg:m-10"
              >
                <p className="font-display text-xl font-bold text-[var(--color-ink)]">{f.successTitle}</p>
                <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">{f.successBody}</p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} className="space-y-5 p-6 sm:p-8 lg:p-10" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="cf-name" label={f.name} required error={errors.name}>
                    <input
                      id="cf-name"
                      name="name"
                      data-testid="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
                      }}
                      autoComplete="name"
                      required
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'cf-name-error' : undefined}
                      className={inputClass}
                    />
                  </Field>
                  <Field id="cf-email" label={f.email} required error={errors.email}>
                    <input
                      id="cf-email"
                      name="email"
                      data-testid="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((current) => ({ ...current, email: undefined }));
                      }}
                      autoComplete="email"
                      required
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'cf-email-error' : undefined}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="cf-phone" label={`${f.phone} (${f.phoneOptional})`}>
                    <input
                      id="cf-phone"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      className={inputClass}
                    />
                  </Field>
                  <Field id="cf-topic" label={f.topic}>
                    <select
                      id="cf-topic"
                      name="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value as TopicKey)}
                      className={inputClass}
                    >
                      {f.topicOptions.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{topicHints[topic]}</p>
                  </Field>
                </div>

                <Field id="cf-message" label={f.message} required error={errors.message}>
                  <textarea
                    id="cf-message"
                    name="message"
                    data-testid="contact-message"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((current) => ({ ...current, message: undefined }));
                    }}
                    required
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'cf-message-error' : undefined}
                    rows={5}
                    placeholder={f.messagePlaceholder}
                    className={cn(inputClass, 'resize-y')}
                  />
                </Field>

                {/* Honeypot: fuer Menschen unsichtbar, Bots fuellen es gern aus. */}
                <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden" style={{ position: 'absolute' }}>
                  <label>
                    Website
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </label>
                </div>

                {status === 'error' && (
                  <div role="alert" className="rounded-[var(--radius-chip)] border border-[var(--color-salsa)]/30 bg-white p-4">
                    <p className="text-sm font-semibold text-[var(--color-salsa)]">{f.errorTitle}</p>
                    <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{f.errorBody}</p>
                    <a
                      href={mailtoFallback}
                      className="mt-2 inline-flex text-sm font-semibold text-[var(--color-salsa)] underline-offset-2 hover:underline"
                    >
                      {f.mailtoFallback}
                    </a>
                  </div>
                )}

                <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
                  <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">{submitHelper}</p>
                  <button
                    type="submit"
                    data-testid="contact-submit"
                    disabled={status === 'submitting'}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--color-salsa)] px-7 py-3.5 text-base font-semibold text-white hover:bg-[var(--color-salsa-700)] disabled:opacity-60"
                  >
                    {/* Lade-Spinner nur waehrend submitting; unter reduced-motion versteckt
                        (der Text "Wird gesendet" traegt dann die Loading-Info allein). */}
                    {status === 'submitting' && (
                      <span
                        aria-hidden
                        className="mr-2.5 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      />
                    )}
                    {status === 'submitting' ? f.submitting : f.submit}
                  </button>
                </div>
              </form>
            )}
              </div>
            </details>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

const inputClass =
  'mt-1.5 w-full rounded-[var(--radius-chip)] border border-[var(--color-line)] bg-white px-4 py-3 text-base text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/70 focus:border-[var(--color-salsa)] focus:outline-none focus:ring-2 focus:ring-[var(--color-salsa)]/30';

function Field({
  id,
  label,
  required = false,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-[var(--color-ink)]">
        {label}
        {required && <span className="text-[var(--color-salsa)]"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-[var(--color-salsa)]">
          {error}
        </p>
      )}
    </div>
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
              href={CONTACT.googleReviews}
              data-testid="contact-maps"
              target="_blank"
              rel="noreferrer"
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)] px-6 py-3 text-base font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-white"
            >
              {l.mapsCta}
              <ArrowRight size={18} strokeWidth={2} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
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
            <img
              src="/photos/gallery/kurse/06.jpg"
              alt={l.imageAlt}
              className="aspect-[3/2] w-full object-cover object-center sm:aspect-[4/3]"
              width={1600}
              height={1066}
              loading="eager"
            />
            {/* Sitewide Warm-Soft-Light: letztes editoriales Foto in die warme Bild-Welt. */}
            <div className="relative m-4 rounded-[var(--radius-card)] bg-[var(--color-paper-warm)] p-4 text-[var(--color-ink)] sm:absolute sm:bottom-4 sm:left-4 sm:m-0 sm:max-w-[17rem] sm:bg-white/92 sm:shadow-xl sm:backdrop-blur">
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
    <section id="raumvermietung" className="scroll-mt-24 bg-[var(--color-bg-soft)] pt-16 pb-[calc(4rem+var(--contact-cookie-safe,0px))] lg:pt-24 lg:pb-[calc(6rem+var(--contact-cookie-safe,0px))]">
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
                  <h2 className={cn('mt-5 font-display text-3xl font-bold leading-[1.05] tracking-tight text-balance text-[var(--color-ink)] sm:text-4xl', MEASURE_L)}>
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
                  className="group mt-8 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[var(--color-salsa)] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[var(--color-salsa-700)]"
                >
                  {r.cta}
                  <ArrowRight size={18} strokeWidth={2.25} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>

              <div className="relative overflow-hidden bg-[var(--color-paper-warm)] lg:min-h-[28rem] lg:bg-[var(--color-ink)]">
                <img
                  src="/photos/gallery/danceflow/05.jpg"
                  alt={lang === 'de' ? 'Stimmungsvolle Danceflow Night bei Salsaflow' : 'Atmospheric Danceflow Night at Salsaflow'}
                  // Kritiker final-2, Issue 6 (schwerster Fall auf /kontakt). Datei 1066x1600,
                  // Rahmen ~740x448: skaliert 740x1111, 663px Hoehe fallen weg. Bei 42% lagen
                  // 278px oben — der Kopf der Taenzerin lag KOMPLETT ausserhalb, im Rahmen stand
                  // nur noch Hals und Schulter. Bei 12% (80px oben) ist das Gesicht ganz im Bild.
                  className="aspect-[4/3] w-full object-cover object-[center_12%] opacity-92 lg:absolute lg:inset-0 lg:h-full lg:aspect-auto"
                  width={1600}
                  height={1067}
                  loading="lazy"
                />
                <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-t from-black/72 via-black/8 to-transparent lg:block" />
                <div className="relative m-5 rounded-[var(--radius-media)] bg-white p-5 text-[var(--color-ink)] lg:absolute lg:bottom-5 lg:right-5 lg:m-0 lg:max-w-[25rem] lg:bg-white/92 lg:shadow-xl lg:backdrop-blur">
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
