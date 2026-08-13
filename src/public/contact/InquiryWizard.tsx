import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Check,
  DoorOpen,
  Gift,
  HelpCircle,
  MessageCircle,
  PartyPopper,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';
import { CONTACT_PAGE, type TopicKey } from '@/public/contact/content';

// Drei Schritte: Anliegen, Details, Kontakt. Der frühere Prüf-Schritt ist raus (Beschluss
// 13.08.2026): Bei einer unverbindlichen Anfrage kostet er Abschlüsse und zeigt nur, was die
// Person gerade selbst eingetippt hat.
const LAST_STEP = 2;

type Status = 'idle' | 'submitting' | 'success' | 'error';
type StyleKey = 'salsa' | 'bachata' | 'heels' | 'unsure';
type TimeKey = 'weekday' | 'weekend' | 'flexible';

const TOPIC_ICONS: Record<TopicKey, LucideIcon> = {
  kontakt: MessageCircle,
  schnupperstunde: Sparkles,
  kurs: BookOpen,
  privatstunden: Users,
  raumvermietung: DoorOpen,
  events: PartyPopper,
  geschenkgutschein: Gift,
  animationen: CalendarCheck,
};

export function InquiryWizard({
  initialTopic = 'schnupperstunde',
  onTopicChange,
  compact = false,
}: {
  initialTopic?: TopicKey;
  onTopicChange?: (topic: TopicKey) => void;
  compact?: boolean;
}) {
  const { lang } = useLang();
  const de = lang === 'de';
  const topics = CONTACT_PAGE[lang].form.topicOptions;
  const orderedTopics = (['schnupperstunde', 'kurs', 'privatstunden', 'kontakt', 'raumvermietung', 'events', 'geschenkgutschein', 'animationen'] as const)
    .map((key) => topics.find((entry) => entry.key === key))
    .filter((entry): entry is (typeof topics)[number] => Boolean(entry));
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState<TopicKey>(initialTopic);
  const [style, setStyle] = useState<StyleKey>('unsure');
  const [time, setTime] = useState<TimeKey>('flexible');
  const [notes, setNotes] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lastTopic = useRef(initialTopic);

  // Wechselt das Anliegen von aussen (Hash-Link aus Nav oder Footer), springt der Wizard zurueck
  // auf Schritt 1. Der Vergleich mit lastTopic verhindert, dass ein blosser Re-Render der
  // Elternkomponente laufende Eingaben loescht.
  useEffect(() => {
    if (lastTopic.current === initialTopic) return;
    lastTopic.current = initialTopic;
    setTopic(initialTopic);
    setStyle('unsure');
    setTime('flexible');
    setNotes('');
    setError('');
    setStatus('idle');
    setStep(0);
  }, [initialTopic]);

  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  const copy = useMemo(() => wizardCopy(de, topic), [de, topic]);
  const topicLabel = topics.find((entry) => entry.key === topic)?.label ?? topics[0].label;
  const styleLabel = copy.styles.find((entry) => entry.key === style)?.label ?? style;
  const timeLabel = copy.times.find((entry) => entry.key === time)?.label ?? time;
  const needsChoices = topic === 'schnupperstunde' || topic === 'kurs';
  const emailValid = !email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const contactValid = Boolean(name.trim() && (email.trim() || phone.trim()) && emailValid);

  function selectTopic(next: TopicKey) {
    setTopic(next);
    onTopicChange?.(next);
    setStyle('unsure');
    setTime('flexible');
    setNotes('');
    setError('');
  }

  function goNext() {
    if (step === 1 && !needsChoices && notes.trim().length < 5) {
      setError(copy.detailError);
      return;
    }
    setError('');
    setStep((current) => Math.min(LAST_STEP, current + 1));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!compact && step < LAST_STEP) {
      goNext();
      return;
    }
    if (!contactValid || (!compact && !needsChoices && notes.trim().length < 5)) {
      setError(!contactValid ? copy.contactError : copy.detailError);
      return;
    }
    if (status === 'submitting') return;
    // setStatus('submitting') loescht auch einen alten Sendefehler. Sonst stuende die alte
    // Meldung noch da, waehrend der neue Versuch laeuft.
    setStatus('submitting');
    setError('');
    const details = needsChoices
      ? `${copy.styleLabel}: ${styleLabel}\n${copy.timeLabel}: ${timeLabel}${notes.trim() ? `\n${copy.noteLabel}: ${notes.trim()}` : ''}`
      : notes.trim();
    try {
      const response = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          topic,
          message: `${copy.requestLabel}: ${topicLabel}\n${details}`,
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
    return (
      <div data-testid="contact-success" role="status" aria-live="polite" className="flex min-h-[18rem] flex-col items-start justify-center p-6 sm:p-8">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-salsa)] text-white">
          <Check aria-hidden className="h-6 w-6" strokeWidth={2.4} />
        </span>
        <h3 className="mt-5 font-display text-3xl font-bold leading-tight text-[var(--color-ink)]">{copy.successTitle}</h3>
        <p className="mt-3 max-w-lg text-base leading-relaxed text-[var(--color-ink-muted)]">{copy.successBody}</p>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={submit} onKeyDown={blockEnterSubmit} noValidate className="p-5 sm:p-6">
        <fieldset>
          <legend className="font-display text-2xl font-bold leading-tight text-[var(--color-ink)]">{copy.topicTitle}</legend>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{copy.topicLead}</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {orderedTopics.map((entry) => {
              const Icon = TOPIC_ICONS[entry.key];
              return (
                <ChoiceCard
                  key={entry.key}
                  active={topic === entry.key}
                  icon={Icon}
                  label={topicCardLabel(entry.key, entry.label, de)}
                  compact
                  className={entry.key === 'schnupperstunde' ? 'col-span-2' : undefined}
                >
                  <input className="sr-only" type="radio" name="topic" value={entry.key} checked={topic === entry.key} onChange={() => selectTopic(entry.key)} />
                </ChoiceCard>
              );
            })}
          </div>
        </fieldset>

        {needsChoices && (
          <fieldset className="mt-6">
            <legend className="text-sm font-semibold text-[var(--color-ink)]">{copy.styleLabel}</legend>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {copy.styles.map((entry) => (
                <ChoiceCard key={entry.key} active={style === entry.key} label={entry.label} compact>
                  <input className="sr-only" type="radio" name="style" value={entry.key} checked={style === entry.key} onChange={() => setStyle(entry.key)} />
                </ChoiceCard>
              ))}
            </div>
          </fieldset>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input testId="contact-name" label={copy.name} value={name} onChange={(value) => { setName(value); setError(''); }} autoComplete="given-name" />
          <Input label={copy.phone} value={phone} onChange={(value) => { setPhone(value); setError(''); }} type="tel" autoComplete="tel" />
          <Input testId="contact-email" label={copy.email} value={email} onChange={(value) => { setEmail(value); setError(''); }} type="email" autoComplete="email" className="sm:col-span-2" />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-[var(--color-ink-muted)]">{copy.privacy}</p>
        <div className="relative">
          <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
          </div>
        </div>

        {(error || status === 'error') && (
          <p role="alert" className="mt-5 rounded-[var(--radius-chip)] bg-[var(--color-salsa-50)] px-4 py-3 text-sm font-semibold text-[var(--color-salsa-700)]">
            {error || copy.sendError}
          </p>
        )}

        <div className="mt-6">
          <button type="submit" data-testid="contact-submit" disabled={status === 'submitting'} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-salsa)] px-7 text-base font-semibold text-white transition-colors hover:bg-[var(--color-salsa-700)] disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto">
            {status === 'submitting' ? copy.sending : copy.submit}
            <ArrowRight aria-hidden className="h-4 w-4" />
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={submit} onKeyDown={blockEnterSubmit} noValidate className={cn('p-5 sm:p-6', !compact && 'lg:p-8')}>
      <WizardProgress step={step} labels={copy.progress} />

      <div className="mt-5 min-h-[12rem]">
        {step === 0 && (
          <fieldset>
            <legend className="font-display text-2xl font-bold leading-tight text-[var(--color-ink)]">{copy.topicTitle}</legend>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{copy.topicLead}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {orderedTopics.map((entry) => {
                const Icon = TOPIC_ICONS[entry.key];
                return (
                  <ChoiceCard
                    key={entry.key}
                    active={topic === entry.key}
                    icon={Icon}
                    label={topicCardLabel(entry.key, entry.label, de)}
                    compact
                    className={entry.key === 'schnupperstunde' ? 'col-span-2' : undefined}
                  >
                    <input className="sr-only" type="radio" name="topic" value={entry.key} checked={topic === entry.key} onChange={() => selectTopic(entry.key)} />
                  </ChoiceCard>
                );
              })}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <div>
            <h3 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold leading-tight text-[var(--color-ink)] outline-none">{copy.detailTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{copy.detailLead}</p>
            {needsChoices ? (
              <div className="mt-6 space-y-6">
                <fieldset>
                  <legend className="text-sm font-semibold text-[var(--color-ink)]">{copy.styleLabel}</legend>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {copy.styles.map((entry) => (
                      <ChoiceCard key={entry.key} active={style === entry.key} label={entry.label} compact>
                        <input className="sr-only" type="radio" name="style" value={entry.key} checked={style === entry.key} onChange={() => setStyle(entry.key)} />
                      </ChoiceCard>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-semibold text-[var(--color-ink)]">{copy.timeLabel}</legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {copy.times.map((entry) => (
                      <ChoiceCard key={entry.key} active={time === entry.key} icon={entry.icon} label={entry.label} compact>
                        <input className="sr-only" type="radio" name="time" value={entry.key} checked={time === entry.key} onChange={() => setTime(entry.key)} />
                      </ChoiceCard>
                    ))}
                  </div>
                </fieldset>
                <TextArea label={copy.noteLabel} value={notes} onChange={setNotes} placeholder={copy.notePlaceholder} optional />
              </div>
            ) : (
              <div className="mt-6">
                <TextArea label={copy.noteLabel} value={notes} onChange={(value) => { setNotes(value); setError(''); }} placeholder={copy.notePlaceholder} />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold leading-tight text-[var(--color-ink)] outline-none">{copy.contactTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{copy.contactLead}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Input testId="contact-name" label={copy.name} value={name} onChange={(value) => { setName(value); setError(''); }} autoComplete="name" />
              <Input label={copy.phone} value={phone} onChange={(value) => { setPhone(value); setError(''); }} type="tel" autoComplete="tel" optional />
              <Input testId="contact-email" label={copy.email} value={email} onChange={(value) => { setEmail(value); setError(''); }} type="email" autoComplete="email" optional className="sm:col-span-2" />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[var(--color-ink-muted)]">{copy.privacy}</p>
            {/* Honeypot: eigener relativ positionierter Anker, sonst haengt das Feld an einem
                fremden Vorfahren und kann das Layout verschieben. */}
            <div className="relative">
              <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Eine Meldezeile statt zwei: sonst stehen Eingabefehler und Sendefehler gleichzeitig da. */}
      {(error || status === 'error') && (
        <p role="alert" className="mt-5 rounded-[var(--radius-chip)] bg-[var(--color-salsa-50)] px-4 py-3 text-sm font-semibold text-[var(--color-salsa-700)]">
          {error || copy.sendError}
        </p>
      )}

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <button type="button" onClick={() => { setError(''); setStep((current) => current - 1); }} className="t-hover inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)]">
            <ArrowLeft aria-hidden className="h-4 w-4" />{copy.back}
          </button>
        ) : <span />}
        {step < LAST_STEP ? (
          <button key="wizard-next" type="submit" data-testid="inquiry-next" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-salsa)] px-7 text-base font-semibold text-white transition-colors hover:bg-[var(--color-salsa-700)]">
            {copy.next}<ArrowRight aria-hidden className="h-4 w-4" />
          </button>
        ) : (
          <button key="wizard-submit" type="submit" data-testid="contact-submit" disabled={status === 'submitting'} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-salsa)] px-7 text-base font-semibold text-white transition-colors hover:bg-[var(--color-salsa-700)] disabled:cursor-not-allowed disabled:opacity-55">
            {status === 'submitting' ? copy.sending : copy.submit}<ArrowRight aria-hidden className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}

function ChoiceCard({ active, icon: Icon, label, compact = false, className, children }: { active: boolean; icon?: LucideIcon; label: string; compact?: boolean; className?: string; children: ReactNode }) {
  return (
    <label className={cn(
      // focus-within macht die Tastatur-Auswahl sichtbar: das echte Radio ist sr-only, ohne
      // diesen Ring sieht man beim Durchtabben und bei Pfeiltasten gar nichts.
      'relative flex cursor-pointer items-center gap-3 rounded-[var(--radius-card)] border px-4 text-left font-semibold transition-[background-color,border-color,color,transform] duration-[var(--dur-fast)] focus-within:ring-2 focus-within:ring-[var(--color-salsa)] focus-within:ring-offset-2',
      compact ? 'min-h-14 py-3 text-sm' : 'min-h-[4.2rem] text-base',
      active ? 'z-10 scale-[1.015] border-[var(--color-salsa)] bg-[var(--color-salsa)] text-white shadow-[0_12px_28px_-18px_rgba(173,24,39,0.8)]' : 'border-[var(--color-line)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:border-[var(--color-salsa)]',
      className,
    )}>
      {children}
      {Icon && <Icon aria-hidden className={cn('h-5 w-5 shrink-0', active ? 'text-white' : 'text-[var(--color-salsa)]')} strokeWidth={1.8} />}
      <span className="min-w-0 leading-tight">{label}</span>
      {active && <CornerMarks />}
    </label>
  );
}

function CornerMarks() {
  const base = 'pointer-events-none absolute h-3 w-3 border-white/85';
  return <span aria-hidden><i className={`${base} -left-1 -top-1 border-l-2 border-t-2`} /><i className={`${base} -right-1 -top-1 border-r-2 border-t-2`} /><i className={`${base} -bottom-1 -left-1 border-b-2 border-l-2`} /><i className={`${base} -bottom-1 -right-1 border-b-2 border-r-2`} /></span>;
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
          <span className={cn('block h-1.5 rounded-full transition-colors', index <= step ? 'bg-[var(--color-salsa)]' : 'bg-[var(--color-line)]')} />
          <span className={cn('mt-2 block truncate text-[12px] font-semibold uppercase tracking-[0.16em] sm:text-[12px] sm:tracking-[0.1em]', index === step ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-muted)]')}>{label}</span>
        </li>
      ))}
    </ol>
  );
}

const fieldClass = 'mt-1.5 w-full rounded-[var(--radius-chip)] border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-3 text-base text-[var(--color-ink)] outline-none focus:border-[var(--color-salsa)] focus:ring-2 focus:ring-[var(--color-salsa)]/25';

// Feste Kennung der Fehlerzeile. Felder zeigen per aria-describedby darauf, sobald ein Fehler
// steht — sonst liest ein Screenreader die Meldung vor, ohne zu sagen, wozu sie gehoert.
const ERROR_ID = 'inquiry-error';

function Input({ label, value, onChange, type = 'text', autoComplete, optional, className, testId, invalid }: { label: string; value: string; onChange: (value: string) => void; type?: string; autoComplete?: string; optional?: boolean; className?: string; testId?: string; invalid?: boolean }) {
  return <label className={className}><span className="text-sm font-semibold text-[var(--color-ink)]">{label}{optional && <span className="font-normal text-[var(--color-ink-muted)]"> optional</span>}</span><input className={fieldClass} type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} data-testid={testId} aria-invalid={invalid || undefined} aria-describedby={invalid ? ERROR_ID : undefined} /></label>;
}

function TextArea({ label, value, onChange, placeholder, optional, invalid }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; optional?: boolean; invalid?: boolean }) {
  return <label><span className="text-sm font-semibold text-[var(--color-ink)]">{label}{optional && <span className="font-normal text-[var(--color-ink-muted)]"> optional</span>}</span><textarea className={cn(fieldClass, 'min-h-28 resize-y')} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-invalid={invalid || undefined} aria-describedby={invalid ? ERROR_ID : undefined} /></label>;
}

/**
 * Enter in einem einzeiligen Feld schickt sonst das Formular ab und springt einen Schritt weiter,
 * mitten im Tippen. Im mehrzeiligen Feld bleibt Enter ein Zeilenumbruch.
 */
function blockEnterSubmit(event: import('react').KeyboardEvent<HTMLFormElement>) {
  const target = event.target as HTMLElement;
  if (event.key !== 'Enter' || target.tagName === 'TEXTAREA') return;
  if (target.tagName === 'INPUT') event.preventDefault();
}

function wizardCopy(de: boolean, topic: TopicKey) {
  const prompts: Record<TopicKey, [string, string]> = de ? {
    kontakt: ['Was möchtest du wissen?', 'Ein paar Stichworte genügen.'],
    schnupperstunde: ['Wie soll deine erste Stunde aussehen?', 'Wähle Stil und Zeitpunkt. Wir schlagen dir danach etwas Passendes vor.'],
    kurs: ['Welcher Kurs passt zu dir?', 'Wähle Stil und Zeitpunkt. Dein genaues Level klären wir gemeinsam.'],
    privatstunden: ['Was möchtest du erreichen?', 'Zum Beispiel Technik, Hochzeitstanz, Musikalität oder ein persönliches Ziel.'],
    raumvermietung: ['Wann und wofür brauchst du den Raum?', 'Nenne Datum, Zeitraum, Zweck und ungefähr wie viele Personen kommen.'],
    events: ['Zu welchem Event hast du eine Frage?', 'Eventname, Datum und deine Frage genügen.'],
    geschenkgutschein: ['Für wen ist der Gutschein?', 'Nenne Anlass und was du ungefähr verschenken möchtest.'],
    animationen: ['Was plant ihr?', 'Ort, Datum, Publikum und gewünschter Rahmen helfen uns bei der Antwort.'],
  } : {
    kontakt: ['What would you like to know?', 'A few keywords are enough.'],
    schnupperstunde: ['What should your first class look like?', 'Choose a style and timing. We then suggest a suitable class.'],
    kurs: ['Which class might suit you?', 'Choose a style and timing. We can clarify your exact level together.'],
    privatstunden: ['What would you like to achieve?', 'For example technique, a wedding dance, musicality or a personal goal.'],
    raumvermietung: ['When and what do you need the room for?', 'Add the date, time, purpose and approximate group size.'],
    events: ['Which event is your question about?', 'The event name, date and your question are enough.'],
    geschenkgutschein: ['Who is the voucher for?', 'Tell us the occasion and what you would roughly like to give.'],
    animationen: ['What are you planning?', 'Place, date, audience and format help us answer.'],
  };
  const [detailTitle, detailLead] = prompts[topic];
  return {
    progress: de ? ['Anliegen', 'Details', 'Kontakt'] : ['Request', 'Details', 'Contact'],
    topicTitle: de ? 'Worum geht es?' : 'What can we help with?',
    topicLead: de ? 'Wähle den Weg, der am besten passt. Der nächste Schritt wird darauf abgestimmt.' : 'Choose the path that fits best. The next step adapts to your request.',
    detailTitle,
    detailLead,
    styleLabel: de ? 'Tanzstil' : 'Dance style',
    timeLabel: de ? 'Wann passt es?' : 'When suits you?',
    noteLabel: de ? 'Noch etwas wichtig?' : 'Anything else we should know?',
    notePlaceholder: de ? 'Kurz beschreiben ...' : 'Add a short note ...',
    styles: [
      { key: 'salsa' as const, label: 'Salsa' },
      { key: 'bachata' as const, label: 'Bachata' },
      { key: 'heels' as const, label: 'Heels' },
      { key: 'unsure' as const, label: de ? 'Noch offen' : 'Not sure' },
    ],
    times: [
      { key: 'weekday' as const, label: de ? 'Unter der Woche' : 'Weekday', icon: CalendarCheck },
      { key: 'weekend' as const, label: de ? 'Wochenende' : 'Weekend', icon: PartyPopper },
      { key: 'flexible' as const, label: de ? 'Flexibel' : 'Flexible', icon: HelpCircle },
    ],
    contactTitle: de ? 'Wie erreichen wir dich?' : 'How can we reach you?',
    contactLead: de ? 'Vorname plus E-Mail oder Handynummer genügen.' : 'Your first name plus email or mobile number are enough.',
    name: de ? 'Vorname' : 'First name',
    phone: de ? 'Handy' : 'Mobile',
    email: de ? 'E-Mail' : 'Email',
    privacy: de ? 'Wir nutzen deine Angaben nur, um auf diese Anfrage zu antworten.' : 'We only use your details to answer this request.',
    // requestLabel steht in der Mail an das Studio, nicht auf der Seite.
    requestLabel: de ? 'Anliegen' : 'Request',
    detailError: de ? 'Bitte schreib kurz, worum es geht.' : 'Please add a short note about your request.',
    contactError: de ? 'Bitte gib deinen Vornamen und eine E-Mail oder Handynummer an.' : 'Please add your first name and either an email or mobile number.',
    back: de ? 'Zurück' : 'Back',
    next: de ? 'Weiter' : 'Continue',
    submit: de ? 'Anfrage senden' : 'Send request',
    sending: de ? 'Wird gesendet ...' : 'Sending ...',
    sendError: de ? 'Das hat nicht geklappt. Bitte versuche es noch einmal.' : 'That did not work. Please try again.',
    successTitle: de ? 'Danke, wir melden uns.' : 'Thanks, we will be in touch.',
    successBody: de ? 'Deine Anfrage ist angekommen. Eine Person aus dem Team antwortet dir mit dem passenden nächsten Schritt.' : 'Your request has arrived. Someone from the team will reply with the right next step.',
  };
}

function topicCardLabel(topic: TopicKey, fallback: string, de: boolean) {
  if (topic === 'schnupperstunde') return de ? 'Schnupperstunde' : 'Trial class';
  if (topic === 'kurs') return de ? 'Kursanmeldung' : 'Course registration';
  if (topic === 'raumvermietung') return de ? 'Raum mieten' : 'Room rental';
  if (topic === 'geschenkgutschein') return de ? 'Gutschein' : 'Gift voucher';
  return fallback;
}
