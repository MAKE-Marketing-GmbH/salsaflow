// Anfrage-Wizard der Kontakt-Seite. Drei Schritte: Anliegen, Details, Kontakt.
//
// S3 (14.08.2026), drei Beschluesse aus der Absprache:
//
//  1. ANLIEGEN IST EIN ECHTES 2x4. Vorher spannte "Schnupperstunde" beide Spalten und eine
//     Ausgleichs-Regel gab der letzten Karte dieselbe Sonderbehandlung. Damit waren von acht
//     Karten zwei doppelt so breit wie die anderen sechs. Jetzt tragen alle acht dieselbe
//     Zelle: mobil 2 Spalten x 4 Reihen, ab sm dasselbe Raster mit mehr Luft. Keine
//     col-span-Ausnahme mehr, sonst kehrt der Bruch bei der naechsten neuen Karte zurueck.
//
//  2. AUSWAHL ZEIGT SICH NUR IN DER FARBE. Die CornerMarks-Komponente (vier weisse
//     Eckwinkel auf der aktiven Karte) ist geloescht. Sie sass mit -left-1/-top-1 ausserhalb
//     der Kartenkante und rendert auf Mobilgeraeten als Neon-Artefakt. Dazu kam scale-[1.015]
//     plus Schatten auf derselben Karte: drei Signale fuer eine Information. Geblieben ist
//     eines, gefuellt in Salsa-Rot mit weisser Schrift.
//
//  3. DETAILS FRAGEN, WAS DAS ANLIEGEN BRAUCHT. Vorher gab es genau zwei Faelle: Stil+Zeit
//     (nur Schnupperstunde und Kurs) oder ein leeres Textfeld fuer alle anderen. Eine
//     Raumanfrage musste Anlass, Datum und Personenzahl selbst in Prosa tippen. Jetzt hat
//     jedes der acht Anliegen seinen eigenen Satz Felder (DETAIL_FIELDS unten).
//
// KEINE VORAUSWAHL in Schritt 2. "Noch offen" und "Flexibel" stehen zur Wahl, sind aber nicht
// vorgeklickt: eine vorgeklickte Antwort ist eine Antwort, die niemand gegeben hat. Weiter
// geht es auch ohne jede Auswahl.
//
// PAYLOAD: Die Detail-Antworten faltet der Client in das bestehende `message`-Feld, als
// "Label: Wert"-Zeilen. Server-Schema (server/contact-routes.ts) bleibt damit unveraendert,
// headerSafe und die Umbruch-Abweisung im Namen ebenfalls.

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  DoorOpen,
  Gift,
  Mail,
  MessageCircle,
  PartyPopper,
  Phone,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';
import { CONTACT_PAGE, type TopicKey } from '@/public/contact/content';
import { CONTACT } from '@/public/site/SiteFooter';
import { WhatsAppIcon } from '@/public/site/BrandIcons';
import { EASE_OUT, useHydrated } from '@/public/home/motion';

const LAST_STEP = 2;

type Status = 'idle' | 'submitting' | 'success' | 'error';
type Reach = 'whatsapp' | 'call' | 'email';

/** Jedes Icon steht genau einmal und fuer genau eine Bedeutung im ganzen Wizard.
 *  Deshalb tauchen CalendarCheck, HelpCircle und Sparkles NICHT zusaetzlich in den
 *  Detail-Optionen auf: dort tragen die Wahl-Karten gar keine Icons mehr. */
const TOPIC_ICONS = {
  schnupperstunde: Sparkles,
  kurs: BookOpen,
  privatstunden: Users,
  raumvermietung: DoorOpen,
  geschenkgutschein: Gift,
  events: PartyPopper,
  animationen: Star,
  kontakt: MessageCircle,
} as const satisfies Record<TopicKey, LucideIcon>;

/** Reihenfolge der acht Karten. Zwei Spalten, vier Reihen, links oben der haeufigste Weg. */
const TOPIC_ORDER = [
  'schnupperstunde',
  'kurs',
  'privatstunden',
  'raumvermietung',
  'geschenkgutschein',
  'events',
  'animationen',
  'kontakt',
] as const satisfies readonly TopicKey[];

/* Watchdog R62 (16.08.2026): jede Anliegen-Karte trug nur Icon + Label, die rechte
   Haelfte blieb leer. Jetzt eine kurze Erklaerzeile je Karte — sie sagt, was die
   Wahl ausloest, und gibt der Flaeche einen Job. Lebt hier neben den Icons, nicht
   in content.ts: reine Karten-Mikrocopy, kein Seiten-Text. */
const TOPIC_HINTS = {
  schnupperstunde: { de: 'Gratis reinschauen', en: 'Free trial visit' },
  kurs: { de: 'Platz im laufenden Kurs', en: 'A spot in a running course' },
  privatstunden: { de: 'Eins zu eins, Tempo frei', en: 'One-to-one, at your pace' },
  raumvermietung: { de: 'Studio für deinen Anlass', en: 'Studio space for your event' },
  geschenkgutschein: { de: 'Tanzzeit verschenken', en: 'Give dance time as a gift' },
  events: { de: 'Workshops und Socials', en: 'Workshops and socials' },
  animationen: { de: 'Auftritt für deinen Anlass', en: 'A show for your occasion' },
  kontakt: { de: 'Alles andere', en: 'Anything else' },
} as const satisfies Record<TopicKey, { de: string; en: string }>;

/* ------------------------------------------------------------------ Detail-Felder je Anliegen */

type ChoiceField = {
  kind: 'choice';
  id: string;
  label: { de: string; en: string };
  options: { value: string; de: string; en: string }[];
};
type TextField = {
  kind: 'text';
  id: string;
  label: { de: string; en: string };
  placeholder: { de: string; en: string };
  /** true = mehrzeilig */
  long?: boolean;
};
type DetailField = ChoiceField | TextField;

const STYLE_OPTIONS = [
  { value: 'salsa', de: 'Salsa', en: 'Salsa' },
  { value: 'bachata', de: 'Bachata', en: 'Bachata' },
  { value: 'heels', de: 'Heels', en: 'Heels' },
  { value: 'offen', de: 'Noch offen', en: 'Not sure yet' },
];

/** Der Satz Fragen pro Anliegen. Genau die aus der Absprache vom 13.08.2026. */
const DETAIL_FIELDS = {
  schnupperstunde: [
    { kind: 'choice', id: 'stil', label: { de: 'Tanzstil', en: 'Dance style' }, options: STYLE_OPTIONS },
    {
      kind: 'choice',
      id: 'wunschtag',
      label: { de: 'Wunschtag', en: 'Preferred day' },
      options: [
        { value: 'woche', de: 'Unter der Woche', en: 'Weekday' },
        { value: 'wochenende', de: 'Wochenende', en: 'Weekend' },
        { value: 'flexibel', de: 'Flexibel', en: 'Flexible' },
      ],
    },
  ],
  kurs: [
    { kind: 'choice', id: 'stil', label: { de: 'Welcher Kurs oder Stil?', en: 'Which class or style?' }, options: STYLE_OPTIONS },
    {
      kind: 'choice',
      id: 'niveau',
      label: { de: 'Niveau', en: 'Level' },
      options: [
        { value: 'anfaenger', de: 'Anfänger', en: 'Beginner' },
        { value: 'erfahrung', de: 'Etwas Erfahrung', en: 'Some experience' },
        { value: 'fortgeschritten', de: 'Fortgeschritten', en: 'Advanced' },
        { value: 'unklar', de: 'Weiss ich nicht', en: 'Not sure' },
      ],
    },
  ],
  privatstunden: [
    { kind: 'choice', id: 'stil', label: { de: 'Tanzstil', en: 'Dance style' }, options: STYLE_OPTIONS },
    {
      kind: 'choice',
      id: 'personen',
      label: { de: 'Kommst du allein oder zu zweit?', en: 'Alone or as a pair?' },
      options: [
        { value: 'allein', de: 'Allein', en: 'On my own' },
        { value: 'zuzweit', de: 'Zu zweit', en: 'As a pair' },
      ],
    },
  ],
  raumvermietung: [
    {
      kind: 'choice',
      id: 'anlass',
      label: { de: 'Anlass', en: 'Occasion' },
      options: [
        { value: 'training', de: 'Training oder Probe', en: 'Training or rehearsal' },
        { value: 'workshop', de: 'Workshop', en: 'Workshop' },
        { value: 'feier', de: 'Feier', en: 'Celebration' },
        { value: 'anderes', de: 'Anderer Anlass', en: 'Other occasion' },
      ],
    },
    { kind: 'text', id: 'datum', label: { de: 'Wunschdatum', en: 'Preferred date' }, placeholder: { de: 'z. B. 12. September, abends', en: 'e.g. 12 September, evening' } },
    { kind: 'text', id: 'personen', label: { de: 'Wie viele Personen?', en: 'How many people?' }, placeholder: { de: 'ungefähre Zahl genügt', en: 'a rough number is enough' } },
  ],
  geschenkgutschein: [
    {
      kind: 'choice',
      id: 'fuerwen',
      label: { de: 'Für wen ist er?', en: 'Who is it for?' },
      options: [
        { value: 'partner', de: 'Partnerin oder Partner', en: 'Partner' },
        { value: 'freund', de: 'Freundin oder Freund', en: 'Friend' },
        { value: 'familie', de: 'Familie', en: 'Family' },
        { value: 'kollege', de: 'Kollegin oder Kollege', en: 'Colleague' },
      ],
    },
    { kind: 'text', id: 'betrag', label: { de: 'Betrag oder Art', en: 'Amount or type' }, placeholder: { de: 'z. B. eine Privatstunde', en: 'e.g. one private lesson' } },
  ],
  events: [
    { kind: 'text', id: 'event', label: { de: 'Welches Event?', en: 'Which event?' }, placeholder: { de: 'Name des Events', en: 'Name of the event' } },
    { kind: 'text', id: 'datum', label: { de: 'Datum', en: 'Date' }, placeholder: { de: 'falls du es schon kennst', en: 'if you already know it' } },
  ],
  animationen: [
    { kind: 'text', id: 'anlass', label: { de: 'Anlass', en: 'Occasion' }, placeholder: { de: 'z. B. Firmenfeier, Hochzeit', en: 'e.g. company party, wedding' } },
    { kind: 'text', id: 'datum', label: { de: 'Datum', en: 'Date' }, placeholder: { de: 'falls du es schon kennst', en: 'if you already know it' } },
    { kind: 'text', id: 'ort', label: { de: 'Ort', en: 'Place' }, placeholder: { de: 'Stadt oder Location', en: 'City or venue' } },
  ],
  kontakt: [
    {
      kind: 'text',
      id: 'frage',
      label: { de: 'Deine Frage', en: 'Your question' },
      placeholder: { de: 'Kurz beschreiben ...', en: 'Add a short note ...' },
      long: true,
    },
  ],
} satisfies Record<TopicKey, DetailField[]>;

export function InquiryWizard({
  initialTopic = 'schnupperstunde',
  onTopicChange,
  compact = false,
  lockTopic = false,
}: {
  initialTopic?: TopicKey;
  onTopicChange?: (topic: TopicKey) => void;
  compact?: boolean;
  /** true: Anliegen steht fest (eigene Schnupper-Seite). Kein 8er-Raster. */
  lockTopic?: boolean;
}) {
  const { lang } = useLang();
  const de = lang === 'de';
  const topics = CONTACT_PAGE[lang].form.topicOptions;
  const orderedTopics = TOPIC_ORDER.map((key) => ({
    key,
    label: topicCardLabel(key, topics.find((entry) => entry.key === key)?.label ?? key, de),
  }));

  const [step, setStep] = useState(lockTopic ? 1 : 0);
  const [topic, setTopic] = useState<TopicKey>(initialTopic);
  // Antworten auf die Detail-Felder, nach Feld-id. Leer heisst: nicht beantwortet.
  const [details, setDetails] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reach, setReach] = useState<Reach>('whatsapp');
  const [privacy, setPrivacy] = useState(false);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lastTopic = useRef(initialTopic);
  const prevStep = useRef(step);
  const reduced = useReducedMotion();
  const hydrated = useHydrated();

  // Wechselt das Anliegen von aussen (Hash-Link aus Nav oder Footer), springt der Wizard zurueck
  // auf Schritt 1. Der Vergleich mit lastTopic verhindert, dass ein blosser Re-Render der
  // Elternkomponente laufende Eingaben loescht.
  useEffect(() => {
    if (lastTopic.current === initialTopic) return;
    lastTopic.current = initialTopic;
    setTopic(initialTopic);
    setDetails({});
    setNotes('');
    setError('');
    setStatus('idle');
    setStep(lockTopic ? 1 : 0);
  }, [initialTopic, lockTopic]);

  // R164: Fokus nur nach echtem Schrittwechsel. lockTopic startet bei step=1.
  // StrictMode feuert den Effect zweimal auf demselben step — ohne Riegel
  // scrollt headingRef.focus() den Hero weg (H1 y −306, scrollY 528).
  useEffect(() => {
    const was = prevStep.current;
    prevStep.current = step;
    if (was === step) return;
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  const copy = useMemo(() => wizardCopy(de, topic), [de, topic]);
  const topicLabel = topicCardLabel(topic, topics.find((entry) => entry.key === topic)?.label ?? topic, de);
  const fields = DETAIL_FIELDS[topic];
  const emailValid = !email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const contactValid = Boolean(name.trim() && (email.trim() || phone.trim()) && emailValid);

  function selectTopic(next: TopicKey) {
    setTopic(next);
    onTopicChange?.(next);
    setDetails({});
    setNotes('');
    setError('');
  }

  function setDetail(id: string, value: string) {
    setDetails((current) => ({ ...current, [id]: value }));
    setError('');
  }

  // Schritt 2 ist ueberspringbar: keine Pflichtangabe, kein Fehler. Wer nichts weiss,
  // kommt trotzdem zum Kontakt-Schritt.
  function goNext() {
    setError('');
    setStep((current) => Math.min(LAST_STEP, current + 1));
  }

  /** Die Detail-Antworten als "Label: Wert"-Zeilen. Leere Felder fallen weg. */
  function detailLines() {
    const lines = fields
      .map((field) => {
        const raw = details[field.id]?.trim();
        if (!raw) return null;
        const value =
          field.kind === 'choice'
            ? field.options.find((option) => option.value === raw)?.[de ? 'de' : 'en'] ?? raw
            : raw;
        return `${field.label[de ? 'de' : 'en']}: ${value}`;
      })
      .filter((line): line is string => Boolean(line));
    if (notes.trim()) lines.push(`${copy.noteLabel}: ${notes.trim()}`);
    lines.push(`${copy.reachLabel}: ${copy.reachOptions.find((option) => option.key === reach)?.label ?? reach}`);
    return lines;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!compact && step < LAST_STEP) {
      goNext();
      return;
    }
    if (!contactValid) {
      setError(copy.contactError);
      return;
    }
    if (!privacy) {
      setError(copy.privacyError);
      return;
    }
    if (status === 'submitting') return;
    // setStatus('submitting') loescht auch einen alten Sendefehler. Sonst stuende die alte
    // Meldung noch da, waehrend der neue Versuch laeuft.
    setStatus('submitting');
    setError('');
    // Der Server verlangt mindestens 5 Zeichen in `message`. Die Anliegen-Zeile steht immer
    // drin, damit auch eine Anfrage ohne jede Detail-Antwort durchgeht.
    const message = [`${copy.requestLabel}: ${topicLabel}`, ...detailLines()].join('\n');
    try {
      const response = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          topic,
          message,
          language: lang,
          website,
        }),
      });
      if (!response.ok) throw new Error('request failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    // Naechste Schritte statt Sackgasse (UX-Audit 13.08.2026, Punkt 4): der Stil ist zu diesem
    // Zeitpunkt oft schon bekannt und filtert den Kursplan vor.
    const stil = details.stil;
    const stylePath = stil && stil !== 'offen' ? `/kursplan?stil=${stil}` : '/kursplan';
    return (
      <div data-testid="contact-success" role="status" aria-live="polite" className="flex min-h-[18rem] flex-col items-start justify-center p-6 sm:p-8">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-salsa)] text-white">
          <Check aria-hidden className="h-6 w-6" strokeWidth={2.4} />
        </span>
        <h3 className="type-h3 mt-5 text-[var(--color-ink)]">{copy.successTitle}</h3>
        <p className="mt-3 max-w-lg text-base leading-relaxed text-[var(--color-ink-muted)]">{copy.successBody}</p>
        <h4 className="type-h4 mt-7 text-[var(--color-salsa)]">{copy.successNext}</h4>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <a
            href={stylePath}
            data-testid="success-schedule-link"
            className="btn-base btn-primary group gap-2 px-5 text-sm"
          >
            {copy.successCta}
            <ArrowRight size={16} strokeWidth={2.25} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
          </a>
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="btn-base btn-outline gap-2 px-5 text-sm"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0" />
            WhatsApp
          </a>
        </div>
      </div>
    );
  }

  // Kurzform auf der Startseite: Anliegen-Raster plus die drei Kontaktfelder, ein Schritt.
  if (compact) {
    return (
      <form onSubmit={submit} onKeyDown={blockEnterSubmit} noValidate className="p-5 sm:p-6">
        <fieldset>
          <legend className="type-h3 text-[var(--color-ink)]">{copy.topicTitle}</legend>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{copy.topicLead}</p>
          <TopicGrid topics={orderedTopics} topic={topic} onSelect={selectTopic} />
        </fieldset>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input testId="contact-name" label={copy.name} value={name} onChange={(value) => { setName(value); setError(''); }} autoComplete="given-name" />
          <Input label={copy.phone} value={phone} onChange={(value) => { setPhone(value); setError(''); }} type="tel" autoComplete="tel" />
          <Input testId="contact-email" label={copy.email} value={email} onChange={(value) => { setEmail(value); setError(''); }} type="email" autoComplete="email" className="sm:col-span-2" />
        </div>
        <PrivacyCheck checked={privacy} onChange={(next) => { setPrivacy(next); setError(''); }} label={copy.privacyLabel} />
        <Honeypot value={website} onChange={setWebsite} />

        {(error || status === 'error') && (
          <p role="alert" id={ERROR_ID} className="mt-5 rounded-[var(--radius-chip)] bg-[var(--color-bg-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-salsa-700)]">
            {error || copy.sendError}
          </p>
        )}

        <div className="mt-6">
          <button type="submit" data-testid="contact-submit" disabled={status === 'submitting'} className="btn-base btn-primary min-h-12 w-full gap-2 px-7 text-base disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto">
            {status === 'submitting' ? copy.sending : copy.submit}
            {status === 'submitting' ? <Spinner /> : <ArrowRight aria-hidden className="h-4 w-4" />}
          </button>
        </div>
      </form>
    );
  }

  // Schritt-Uebergang: 200ms Fade plus 12px Versatz, ease-out. Vor der Hydration und bei
  // prefers-reduced-motion steht der Inhalt sofort da (kein opacity:0 im Prerender-HTML).
  const stepMotion =
    reduced || !hydrated
      ? { initial: false as const, animate: { opacity: 1, x: 0 }, exit: { opacity: 1 } }
      : {
          initial: { opacity: 0, x: 12 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -12 },
        };

  return (
    /* R178: mobil pt-1 statt pt-4. Der Kopf des Formulars ist die knappste Stelle der
       Seite: vom Formular-Rand (y 762) bis zum 390-Fold (844) sind es 82px, und
       davon muessen Fortschritt, Titel UND die erste Kartenreihe leben. Seiten und
       Boden bleiben bei 4, ab sm gilt wieder p-6. */
    <form onSubmit={submit} onKeyDown={blockEnterSubmit} noValidate className="flex flex-col px-4 pb-4 pt-0.5 sm:p-6 lg:p-7">
      <WizardProgress
        step={lockTopic ? step - 1 : step}
        labels={lockTopic ? copy.progress.slice(1) : copy.progress}
      />

      {/* pb-4 mobil als Reserve unter dem letzten Feld. Die klebende Leiste selbst braucht
          keine eigene Hoehe mehr im Fluss: sie steht jetzt auch mobil in EINER Zeile
          (Zurueck links, Weiter rechts, gemessen 73px). Vorher stapelte `flex-col-reverse`
          beide Knoepfe uebereinander, die Leiste wurde 133px hoch und lag damit auf der
          zweiten Wahl-Gruppe (Beleg /tmp/s3-mob-step2-fold.png).
          min-h nur bis sm: darueber haelt es die Karte bei kurzen Schritten stabil, mobil
          erzeugte es zusammen mit der Reserve rund 290px Leerraue ueber der Leiste. */}
      {/* R178: pb-20 auf pb-4 gekuerzt. Die Reserve stammt aus der Zeit, als die
          klebende Leiste ueber dem letzten Feld lag. Mit der kompakten Schritt-1-Hoehe
          stand darunter rund 190px Leerflaeche zwischen letzter Karte und Weiter-Knopf
          (Beleg kontakt-390-form-r178.png vor dieser Aenderung). pb-4 haelt weiter
          Abstand zur Leiste, ohne ein Loch zu reissen. */}
      <div className="mt-1 pb-4 sm:mt-5 sm:min-h-[14rem] sm:pb-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={stepMotion.initial}
            animate={stepMotion.animate}
            exit={stepMotion.exit}
            transition={{ duration: reduced ? 0 : 0.22, ease: EASE_OUT }}
          >
            {/* R178: Schritt 1 traegt nur noch Titel plus Raster. Die Lead-Zeile
                ("Waehle dein Anliegen") sagte dasselbe wie der Titel und dasselbe wie
                das Fortschritts-Label ANLIEGEN darueber — drei Saetze fuer eine
                Anweisung. Gestrichen sind damit 23px Zeile plus 8px Abstand, und die
                ersten beiden Karten stehen mobil ueber dem Fold. Die Zeile bleibt in
                der Kurzform auf der Startseite: dort fehlt die Fortschrittsleiste. */}
            {step === 0 && (
              <fieldset>
                {/* type-h3 BLEIBT stehen: die Klasse traegt in index.css eine eigene
                    Wortabstand-Regel fuer `form legend.type-h3` (dort word-spacing
                    0.1em, sonst kleben die Woerter). Darum wird die Klasse nicht
                    ersetzt, sondern nur ihre Groesse mobil ueberschrieben:
                    max-sm:text-[17px] statt der clamp-Groesse 20px. Das spart die
                    letzten Pixel, die der ersten Kartenreihe ueber dem Fold fehlten.
                    Ab sm greift wieder die clamp-Groesse aus type-h3. */}
                <legend className="type-h3 text-[var(--color-ink)] max-sm:text-[17px] max-sm:leading-tight">{copy.topicTitle}</legend>
                <TopicGrid topics={orderedTopics} topic={topic} onSelect={selectTopic} />
              </fieldset>
            )}

            {step === 1 && (
              <div>
                <h3 ref={headingRef} tabIndex={-1} className="type-h3 text-[var(--color-ink)] outline-none">{copy.detailTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{copy.detailLead}</p>
                <div className="mt-6 space-y-6">
                  {fields.map((field) =>
                    field.kind === 'choice' ? (
                      <fieldset key={field.id}>
                        <legend className="text-sm font-semibold text-[var(--color-ink)]">{field.label[de ? 'de' : 'en']}</legend>
                        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {field.options.map((option) => (
                            <ChoiceCard
                              key={option.value}
                              active={details[field.id] === option.value}
                              label={option[de ? 'de' : 'en']}
                            >
                              <input
                                className="sr-only"
                                type="radio"
                                name={field.id}
                                value={option.value}
                                checked={details[field.id] === option.value}
                                onChange={() => setDetail(field.id, option.value)}
                              />
                            </ChoiceCard>
                          ))}
                        </div>
                      </fieldset>
                    ) : 'long' in field && field.long ? (
                      <TextArea
                        key={field.id}
                        label={field.label[de ? 'de' : 'en']}
                        value={details[field.id] ?? ''}
                        onChange={(value) => setDetail(field.id, value)}
                        placeholder={field.placeholder[de ? 'de' : 'en']}
                      />
                    ) : (
                      <Input
                        key={field.id}
                        label={field.label[de ? 'de' : 'en']}
                        value={details[field.id] ?? ''}
                        onChange={(value) => setDetail(field.id, value)}
                        placeholder={field.placeholder[de ? 'de' : 'en']}
                      />
                    ),
                  )}
                  {/* Das freie Feld steht bei jedem Anliegen ausser "Allgemeine Frage" —
                      dort IST das lange Feld schon die Frage selbst. */}
                  {topic !== 'kontakt' && (
                    <TextArea label={copy.noteLabel} value={notes} onChange={setNotes} placeholder={copy.notePlaceholder} optional />
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 ref={headingRef} tabIndex={-1} className="type-h3 text-[var(--color-ink)] outline-none">{copy.contactTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{copy.contactLead}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Input testId="contact-name" label={copy.name} value={name} onChange={(value) => { setName(value); setError(''); }} autoComplete="given-name" />
                  <Input label={copy.phone} value={phone} onChange={(value) => { setPhone(value); setError(''); }} type="tel" autoComplete="tel" />
                  <Input testId="contact-email" label={copy.email} value={email} onChange={(value) => { setEmail(value); setError(''); }} type="email" autoComplete="email" invalid={!emailValid} className="sm:col-span-2" />
                </div>

                <fieldset className="mt-6">
                  <legend className="text-sm font-semibold text-[var(--color-ink)]">{copy.reachLabel}</legend>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {copy.reachOptions.map((option) => (
                      <ChoiceCard key={option.key} active={reach === option.key} label={option.label} icon={option.icon} nowrap>
                        <input
                          className="sr-only"
                          type="radio"
                          name="reach"
                          value={option.key}
                          checked={reach === option.key}
                          onChange={() => setReach(option.key)}
                        />
                      </ChoiceCard>
                    ))}
                  </div>
                </fieldset>

                <PrivacyCheck checked={privacy} onChange={(next) => { setPrivacy(next); setError(''); }} label={copy.privacyLabel} />
                <Honeypot value={website} onChange={setWebsite} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Eine Meldezeile statt zwei: sonst stehen Eingabefehler und Sendefehler gleichzeitig da. */}
      {(error || status === 'error') && (
        <p role="alert" id={ERROR_ID} className="mt-5 rounded-[var(--radius-chip)] bg-[var(--color-bg-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-salsa-700)]">
          {error || copy.sendError}
        </p>
      )}

      {/* -mx/px folgen dem Formular-Padding: mobil p-4, darum -mx-4/px-4. Stuenden hier
          weiter 5er-Werte, ragte die Leiste 4px ueber die Kartenkante hinaus. */}
      {/* R178 Runde 2: KEIN sticky mehr. Vorher klebte die Zeile mobil per
          `max-sm:sticky max-sm:bottom-0` am Fussrand. Weil das Formular hoch ist
          (8er-Raster), heftete sie sich schon bei scrollY=0 an den Viewport-Boden und
          stand damit BEI y=796 — quer ueber dem Schritt-1-Titel (804) und der ersten
          Kartenreihe (835). Gemessen mit elementFromPoint: titleSeen=false,
          card0Seen=false, also war der Kopf des Formulars nicht lesbar. Ihr
          natuerlicher Platz ist y=1183, gut unter dem Fold (Beleg /tmp/r178b-probe.cjs:
          stickyTop 796 vs naturalTop 1183). Ohne sticky verdeckt sie nichts mehr; der
          Weiter-Knopf steht dort, wo die letzte Karte endet, und wird beim Scrollen
          erreicht. Die alte Begruendung ("Knopf nicht unter dem Fold") galt fuer ein
          kurzes Formular; mit acht Karten kauft sie Sichtbarkeit des Knopfes mit
          Unsichtbarkeit des ganzen Formularkopfes. */}
      <div className="mt-6 flex flex-row items-center justify-between gap-3 max-sm:-mx-4 max-sm:border-t max-sm:border-[var(--color-line)] max-sm:px-4 max-sm:pt-3 sm:mt-7">
        {step > (lockTopic ? 1 : 0) ? (
          <button type="button" onClick={() => { setError(''); setStep((current) => current - 1); }} className="t-hover inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)]">
            <ArrowLeft aria-hidden className="h-4 w-4 shrink-0" />{copy.back}
          </button>
        ) : <span />}
        {step < LAST_STEP ? (
          <button key="wizard-next" type="submit" data-testid="inquiry-next" className="btn-base btn-primary min-h-12 gap-2 px-7 text-base">
            {copy.next}<ArrowRight aria-hidden className="h-4 w-4" />
          </button>
        ) : (
          <button key="wizard-submit" type="submit" data-testid="contact-submit" disabled={status === 'submitting'} className="btn-base btn-primary min-h-12 shrink-0 gap-2 whitespace-nowrap px-6 text-base disabled:cursor-not-allowed disabled:opacity-55 sm:px-7">
            {status === 'submitting' ? copy.sending : copy.submit}
            {status === 'submitting' ? <Spinner /> : <ArrowRight aria-hidden className="h-4 w-4" />}
          </button>
        )}
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ Bausteine */

/** Das 2x4-Raster der Anliegen. Acht gleich grosse Zellen, mobil wie am Desktop.
 *  Keine col-span-Ausnahme: sobald eine Karte breiter waere, ist es kein 2x4 mehr. */
function TopicGrid({
  topics,
  topic,
  onSelect,
}: {
  topics: { key: TopicKey; label: string }[];
  topic: TopicKey;
  onSelect: (key: TopicKey) => void;
}) {
  const { lang } = useLang();
  return (
    // R178: mobil mt-1 statt mt-6. Die gesparten Reihen Abstand entscheiden, ob
    // die erste Kartenreihe noch ueber dem 390-Fold steht. Ab sm bleibt es bei mt-6.
    <div className="mt-1 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3">
      {topics.map((entry) => (
        <ChoiceCard
          key={entry.key}
          active={topic === entry.key}
          icon={TOPIC_ICONS[entry.key]}
          label={entry.label}
          hint={TOPIC_HINTS[entry.key][lang === 'de' ? 'de' : 'en']}
          tall
        >
          <input
            className="sr-only"
            type="radio"
            name="topic"
            value={entry.key}
            checked={topic === entry.key}
            onChange={() => onSelect(entry.key)}
          />
        </ChoiceCard>
      ))}
    </div>
  );
}

/** Wahl-Karte. Genau EIN Signal fuer "gewaehlt": gefuellt in Salsa-Rot mit weisser Schrift.
 *  Kein Scale, kein Schatten, keine Eckwinkel, keine zweite Umrandung. Der Wechsel laeuft
 *  ueber Farbe (150ms), damit nichts springt. */
function ChoiceCard({
  active,
  icon: Icon,
  label,
  hint,
  tall = false,
  nowrap = false,
  children,
}: {
  active: boolean;
  icon?: LucideIcon | ((props: { className?: string }) => ReactNode);
  label: string;
  /** kurze Erklaerzeile unter dem Label (Anliegen-Karten, R62). */
  hint?: string;
  /** true = Anliegen-Karte (hoehere, gleich grosse Zelle im 2x4) */
  tall?: boolean;
  /** true = Kanal-Chips: ganze Wörter, kein Bindestrich (WhatsApp / Anruf / E-Mail). */
  nowrap?: boolean;
  children: ReactNode;
}) {
  return (
    <label
      className={cn(
        // focus-within macht die Tastatur-Auswahl sichtbar: das echte Radio ist sr-only, ohne
        // diesen Ring sieht man beim Durchtabben und bei Pfeiltasten gar nichts.
        'flex h-full cursor-pointer items-center rounded-[var(--radius-card)] border text-left font-semibold',
        'transition-[background-color,border-color,color] duration-[var(--dur-fast)] ease-out',
        'focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--color-salsa)] focus-within:ring-offset-2',
        // 390px: Icon über dem Wort, sonst schneidet "Schnupperstunde" ab (S7).
        // R62: mit Erklaerzeile bleibt die Karte ueberall eine Spalte — Icon links,
        // Label + Hint rechts gestapelt, sonst braeche der Hint in die Icon-Spalte.
        tall
          ? hint
            // R178 Runde 3: mobil min-h-11 und py-1.5. Gemessen war die Karte
            // trotz min-h-14 real 68px hoch, zwei sogar 86px — nicht wegen der
            // Luft, sondern wegen der Erklaerzeile: neben dem Icon bleiben bei
            // 390px genau 89px Textbreite, und sechs von acht Hints sind dort
            // 91-107px breit, brechen also auf zwei Zeilen (Beleg
            // /tmp/r178c-fit.cjs). Mobil traegt die Karte darum nur Icon plus
            // Label in EINER Zeile; der Hint kommt ab sm zurueck, wo die Spalte
            // breit genug ist. Ab sm bleibt das alte, luftigere Mass.
            ? 'min-h-11 flex-row items-center gap-2.5 px-3 py-1.5 text-[13px] sm:min-h-16 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm'
            : 'min-h-16 flex-col items-start gap-1.5 px-3 py-2.5 text-[13px] sm:flex-row sm:items-center sm:gap-3 sm:px-4 sm:py-3 sm:text-sm'
          : nowrap
            ? 'min-h-14 flex-col items-center justify-center gap-1 px-1.5 py-2 text-center text-[12px] sm:min-h-11 sm:flex-row sm:gap-2 sm:px-3 sm:text-sm'
            : 'min-h-11 gap-3 px-4 py-3 text-sm',
        active
          ? 'border-[var(--color-salsa)] bg-[var(--color-salsa)] text-white'
          : 'border-[var(--color-line)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:border-[var(--color-salsa)]',
      )}
    >
      {children}
      {Icon && (
        <Icon
          aria-hidden
          className={cn(tall ? 'h-4 w-4 shrink-0 sm:h-5 sm:w-5' : 'h-5 w-5 shrink-0', active ? 'text-white' : 'text-[var(--color-salsa)]')}
          strokeWidth={1.8}
        />
      )}
      <span
        className={cn(
          'min-w-0 leading-snug',
          nowrap ? 'hyphens-none whitespace-normal' : 'hyphens-auto break-words',
        )}
      >
        {label}
        {hint ? (
          // `hidden sm:block`: mobil kostet die Zeile zwei Zeilen statt einer und
          // damit die halbe Kartenhoehe (68-86px statt 44px). Sie erklaert eine
          // Wahl, die das Label schon nennt — unter dem Fold zu stehen ist der
          // hoehere Preis. Ab sm ist die Spalte breit genug, dort bleibt sie.
          <span
            className={cn(
              'mt-0.5 hidden text-[11px] font-medium leading-snug sm:block sm:text-xs',
              active ? 'text-white/80' : 'text-[var(--color-ink-muted)]',
            )}
          >
            {hint}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function WizardProgress({ step, labels }: { step: number; labels: readonly string[] }) {
  return (
    // Spaltenzahl aus den Labels, nicht als feste Zahl. Beim Kuerzen von vier auf drei Schritte
    // blieb `grid-cols-4` stehen: die vierte Spalte blieb leer, der Balken endete bei 75 %,
    // obwohl die Person fertig war. So kann derselbe Fehler nicht wiederkommen.
    <ol
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}
      aria-label="Fortschritt"
    >
      {labels.map((label, index) => (
        <li key={label} aria-current={index === step ? 'step' : undefined} className="min-w-0">
          {/* R178 Runde 3: mobil h-1 statt h-1.5 und eine feste, enge Zeilenhoehe
              (leading-[1.05]) auf dem Schritt-Wort. `leading-tight` liess bei 11px
              noch 14px Zeilenkasten stehen. Jeder dieser Pixel entscheidet, ob die
              erste Anliegen-Karte lesbar ueber dem Fold steht. Ab sm bleibt alles
              beim alten, luftigeren Mass. */}
          <span className={cn('block h-1 rounded-full transition-colors duration-[var(--dur-base)] sm:h-1.5', index <= step ? 'bg-[var(--color-salsa)]' : 'bg-[var(--color-line)]')} />
          <span className={cn('mt-0.5 block truncate text-[11px] font-semibold uppercase leading-[1.05] tracking-[0.12em] sm:mt-2 sm:text-[12px] sm:leading-normal sm:tracking-[0.1em]', index === step ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-muted)]')}>{label}</span>
        </li>
      ))}
    </ol>
  );
}

/** Datenschutz-Haekchen. Pflicht vor dem Absenden. */
function PrivacyCheck({ checked, onChange, label }: { checked: boolean; onChange: (next: boolean) => void; label: ReactNode }) {
  return (
    <label className="mt-6 flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        data-testid="contact-privacy"
        className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-salsa)]"
      />
      <span className="min-w-0 hyphens-none text-pretty">{label}</span>
    </label>
  );
}

/** Honeypot: ein fuer Menschen unsichtbares Feld. Bots fuellen es gern aus; der Server
 *  verwirft solche Anfragen still. Eigener relativ positionierter Anker, sonst haengt das
 *  Feld an einem fremden Vorfahren und kann das Layout verschieben. */
function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" value={value} onChange={(event) => onChange(event.target.value)} /></label>
      </div>
    </div>
  );
}

/** Lade-Ring im Absende-Knopf. Bei prefers-reduced-motion steht er still. */
function Spinner() {
  return (
    <span
      aria-hidden
      className="h-4 w-4 shrink-0 rounded-full border-2 border-white/35 border-t-white motion-safe:animate-spin"
    />
  );
}

const fieldClass = 'mt-1.5 w-full rounded-[var(--radius-chip)] border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-3 text-base text-[var(--color-ink)] outline-none focus:border-[var(--color-salsa)] focus:ring-2 focus:ring-[var(--color-salsa)]/25';

// Feste Kennung der Fehlerzeile. Felder zeigen per aria-describedby darauf, sobald ein Fehler
// steht — sonst liest ein Screenreader die Meldung vor, ohne zu sagen, wozu sie gehoert.
const ERROR_ID = 'inquiry-error';

function Input({ label, value, onChange, type = 'text', autoComplete, placeholder, optional, className, testId, invalid }: { label: string; value: string; onChange: (value: string) => void; type?: string; autoComplete?: string; placeholder?: string; optional?: boolean; className?: string; testId?: string; invalid?: boolean }) {
  return <label className={className}><span className="text-sm font-semibold text-[var(--color-ink)]">{label}{optional && <span className="font-normal text-[var(--color-ink-muted)]"> optional</span>}</span><input className={fieldClass} type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} placeholder={placeholder} data-testid={testId} aria-invalid={invalid || undefined} aria-describedby={invalid ? ERROR_ID : undefined} /></label>;
}

function TextArea({ label, value, onChange, placeholder, optional, invalid }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; optional?: boolean; invalid?: boolean }) {
  return <label className="block"><span className="text-sm font-semibold text-[var(--color-ink)]">{label}{optional && <span className="font-normal text-[var(--color-ink-muted)]"> optional</span>}</span><textarea className={cn(fieldClass, 'min-h-28 resize-y')} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-invalid={invalid || undefined} aria-describedby={invalid ? ERROR_ID : undefined} /></label>;
}

/**
 * Enter in einem einzeiligen Feld schickt sonst das Formular ab und springt einen Schritt weiter,
 * mitten im Tippen. Im mehrzeiligen Feld bleibt Enter ein Zeilenumbruch.
 */
function blockEnterSubmit(event: import('react').KeyboardEvent<HTMLFormElement>) {
  // SAFETY: Form-Keydown kommt vom aktuellen Zielknoten. Nur TAG-Name wird gelesen.
  const target = event.target as HTMLElement;
  if (event.key !== 'Enter' || target.tagName === 'TEXTAREA') return;
  if (target.tagName === 'INPUT') event.preventDefault();
}

function wizardCopy(de: boolean, topic: TopicKey) {
  const prompts: Record<TopicKey, [string, string]> = de ? {
    schnupperstunde: ['Wie soll deine erste Stunde aussehen?', 'Stil und Wunschtag. Beides darf offen bleiben.'],
    kurs: ['Welcher Kurs passt zu dir?', 'Stil und Niveau, soweit du es weisst.'],
    privatstunden: ['Was möchtest du in der Privatstunde üben?', 'Stil, und allein oder zu zweit.'],
    raumvermietung: ['Wann und wofür brauchst du den Raum?', 'Anlass, Datum, ungefähre Personenzahl.'],
    geschenkgutschein: ['Für wen ist der Gutschein?', 'Für wen, und welcher Betrag oder welche Art.'],
    events: ['Zu welchem Event hast du eine Frage?', 'Event und Datum, falls bekannt.'],
    animationen: ['Was plant ihr?', 'Anlass, Datum und Ort.'],
    kontakt: ['Was möchtest du wissen?', 'Ein paar Stichworte genügen.'],
  } : {
    schnupperstunde: ['What should your first class look like?', 'Choose a style and a day. Both can stay open.'],
    kurs: ['Which class suits you?', 'Tell us the style and your level, as far as you know it.'],
    privatstunden: ['What would you like to practise?', 'Tell us the style and whether you come alone or as a pair.'],
    raumvermietung: ['When and what do you need the room for?', 'Tell us the occasion, your preferred date and roughly how many people come.'],
    geschenkgutschein: ['Who is the voucher for?', 'Tell us who receives it and which amount or type you have in mind.'],
    events: ['Which event is your question about?', 'Tell us the event and the date, if you already know it.'],
    animationen: ['What are you planning?', 'Tell us the occasion, the date and the place of the show.'],
    kontakt: ['What would you like to know?', 'A few keywords are enough.'],
  };
  const [detailTitle, detailLead] = prompts[topic];
  return {
    progress: de ? ['Anliegen', 'Details', 'Kontakt'] : ['Request', 'Details', 'Contact'],
    topicTitle: de ? 'Worum geht es?' : 'What can we help with?',
    topicLead: de ? 'Wähle dein Anliegen.' : 'Choose your request.',
    detailTitle,
    detailLead,
    noteLabel: de ? 'Noch etwas wichtig?' : 'Anything else we should know?',
    notePlaceholder: de ? 'Kurz beschreiben ...' : 'Add a short note ...',
    contactTitle: de ? 'Wie erreichen wir dich?' : 'How can we reach you?',
    contactLead: de ? 'Vorname plus Handy oder E-Mail genügen.' : 'Your first name plus a mobile number or email are enough.',
    name: de ? 'Vorname' : 'First name',
    phone: de ? 'Handy' : 'Mobile',
    email: de ? 'E-Mail' : 'Email',
    reachLabel: de ? 'Wie erreichen wir dich am besten?' : 'How should we reach you?',
    reachOptions: [
      { key: 'whatsapp' as const, label: 'WhatsApp', icon: WhatsAppIcon },
      { key: 'call' as const, label: de ? 'Anruf' : 'Phone call', icon: Phone },
      // Mail, nicht MessageCircle: die Sprechblase steht im Anliegen-Raster schon fuer
      // "Allgemeine Frage". Ein Icon, eine Bedeutung.
      { key: 'email' as const, label: de ? 'E-Mail' : 'Email', icon: Mail },
    ],
    privacyLabel: de ? (
      <>
        Ich habe die{' '}
        <a href="/datenschutz" className="font-semibold text-[var(--color-salsa)] underline underline-offset-4">
          Datenschutzerklärung
        </a>{' '}
        gelesen und bin damit einverstanden.
      </>
    ) : (
      <>
        I have read the{' '}
        <a href="/datenschutz" className="font-semibold text-[var(--color-salsa)] underline underline-offset-4">
          privacy policy
        </a>{' '}
        and agree to it.
      </>
    ),
    // requestLabel steht in der Mail an das Studio, nicht auf der Seite.
    requestLabel: de ? 'Anliegen' : 'Request',
    contactError: de ? 'Bitte gib deinen Vornamen und eine E-Mail oder Handynummer an.' : 'Please add your first name and either an email or mobile number.',
    privacyError: de ? 'Bitte setze das Häkchen beim Datenschutz.' : 'Please tick the privacy box.',
    back: de ? 'Zurück' : 'Back',
    next: de ? 'Weiter' : 'Continue',
    submit: de ? 'Anfrage senden' : 'Send request',
    sending: de ? 'Wird gesendet ...' : 'Sending ...',
    sendError: de ? 'Das hat nicht geklappt. Bitte versuche es noch einmal.' : 'That did not work. Please try again.',
    successTitle: de ? 'Danke, wir melden uns.' : 'Thanks, we will be in touch.',
    successBody: de ? 'Deine Anfrage ist angekommen. Eine Person aus dem Team antwortet dir mit dem passenden nächsten Schritt.' : 'Your request has arrived. Someone from the team will reply with the right next step.',
    successNext: de ? 'So geht es weiter' : 'What happens next',
    successCta: de ? 'Passende Kurse ansehen' : 'Browse matching classes',
  };
}

function topicCardLabel(topic: TopicKey, fallback: string, de: boolean) {
  if (topic === 'schnupperstunde') return de ? 'Schnupperstunde' : 'Trial class';
  if (topic === 'kurs') return de ? 'Kursanmeldung' : 'Course sign-up';
  if (topic === 'privatstunden') return de ? 'Privatstunde' : 'Private lesson';
  if (topic === 'raumvermietung') return de ? 'Raum mieten' : 'Room rental';
  if (topic === 'geschenkgutschein') return de ? 'Gutschein' : 'Gift voucher';
  if (topic === 'events') return de ? 'Events & Workshops' : 'Events & workshops';
  // R178 Runde 3: "Shows & Animationen" (111px) passte als einzige Karte nicht in
  // die 89px Textbreite bei 390px und brach auf zwei Zeilen — die vierte Reihe war
  // dadurch 50 statt 44px hoch. "Shows" (32px) ist das Kopfwort desselben Namens,
  // steht so auch im Menue und in der Fusszeile, und die Erklaerzeile daneben sagt
  // ab sm weiter "Auftritt fuer deinen Anlass". Kein neues Wort fuer dieselbe Sache.
  if (topic === 'animationen') return de ? 'Shows' : 'Shows';
  if (topic === 'kontakt') return de ? 'Allgemeine Frage' : 'General question';
  return fallback;
}
