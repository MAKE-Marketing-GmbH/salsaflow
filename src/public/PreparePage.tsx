import { useEffect, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { CONTACT } from '@/public/site/SiteFooter';
import { InstagramIcon, WhatsAppIcon } from '@/public/site/BrandIcons';
import { SubHero, SubPageShell, Shell, Reveal } from '@/public/subpage/kit';
import { ArrowRight } from 'lucide-react';

const COPY = {
  de: {
    crumb: 'Vorbereiten',
    title: 'So bereitest du dich vor.',
    lead: 'Dein Platz ist da. Drei Dinge, dann tanzt du locker mit.',
    bookingTitle: 'Dein Platz',
    factWhen: 'Wann',
    factWhere: 'Wo',
    factPay: 'Bezahlung',
    cards: [
      {
        title: 'Folge uns auf Instagram',
        body: 'Reels, Schritte und die Stimmung im Studio. Am besten jetzt abonnieren.',
        href: CONTACT.instagram,
        label: 'Instagram öffnen',
        external: true,
        icon: 'instagram' as const,
      },
      {
        title: 'Frage? WhatsApp.',
        body: 'Was anziehen, welcher Kurs, mit wem tanzen. Eine Nachricht reicht.',
        href: CONTACT.whatsapp,
        label: 'Auf WhatsApp schreiben',
        external: true,
        icon: 'whatsapp' as const,
      },
      {
        title: 'Was du mitbringst',
        body: 'Bequeme Kleidung. Hallenschuhe oder barfuss. Den Rest zeigen wir dir vor Ort.',
        href: '/kursplan',
        label: 'Kursplan ansehen',
        external: false,
        icon: 'plan' as const,
      },
    ],
  },
  en: {
    crumb: 'Prepare',
    title: 'How to get ready.',
    lead: 'Your spot is booked. Three things, then you just dance.',
    bookingTitle: 'Your spot',
    factWhen: 'When',
    factWhere: 'Where',
    factPay: 'Payment',
    cards: [
      {
        title: 'Follow us on Instagram',
        body: 'Reels, steps and the studio mood. Subscribe now.',
        href: CONTACT.instagram,
        label: 'Open Instagram',
        external: true,
        icon: 'instagram' as const,
      },
      {
        title: 'A question? WhatsApp.',
        body: 'What to wear, which class, who to dance with. One message is enough.',
        href: CONTACT.whatsapp,
        label: 'Message us on WhatsApp',
        external: true,
        icon: 'whatsapp' as const,
      },
      {
        title: 'What to bring',
        body: 'Comfortable clothes. Indoor shoes or barefoot. We show you the rest on site.',
        href: '/kursplan',
        label: 'See the schedule',
        external: false,
        icon: 'plan' as const,
      },
    ],
  },
} as const;

/* Die Buchung liegt nicht im Client-State: der Erfolgspfad verlaesst das Modal per
   window.location.assign. Kurs, Termin, Studio und Zahlung kommen deshalb als Query
   an — sonst stuende die Bestaetigung ohne die drei Fakten da, die vorher im Modal
   sichtbar waren. Ohne Query rendert der Block gar nicht (Direktaufruf der Seite). */
type Booking = { kurs: string; wann: string; wo: string; zahlung: string };

function readBooking(): Booking | null {
  if (typeof window === 'undefined') return null;
  const q = new URLSearchParams(window.location.search);
  const kurs = q.get('kurs')?.trim();
  const wann = q.get('wann')?.trim();
  const wo = q.get('wo')?.trim();
  const zahlung = q.get('zahlung')?.trim();
  if (!kurs || !wann || !wo || !zahlung) return null;
  return { kurs, wann, wo, zahlung };
}

export function PreparePage() {
  const { lang } = useLang();
  const c = COPY[lang];
  // Erst nach der Hydration lesen: der Server kennt die Query des Browsers nicht, ein
  // direktes Lesen im Render wuerde Server- und Client-Markup auseinanderlaufen lassen.
  const [booking, setBooking] = useState<Booking | null>(null);
  useEffect(() => setBooking(readBooking()), []);
  return (
    <SubPageShell seo="prepare">
      <SubHero
        axis="split"
        seoCrumbs={[{ label: c.crumb, href: '/vorbereiten' }]}
        title={c.title}
        lead={c.lead}
        dense
        tightBottom
      />
      <section className="bg-[var(--color-paper-warm)] pb-20 pt-2 lg:pb-24">
        <Shell>
          {booking && (
            <div
              data-testid="prepare-booking"
              className="mb-6 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-5 shadow-[0_14px_40px_rgba(17,17,17,0.04)] sm:p-6"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
                {c.bookingTitle}
              </p>
              <h2 className="type-h3 mt-1 text-[var(--color-ink)]">{booking.kurs}</h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                {(
                  [
                    [c.factWhen, booking.wann],
                    [c.factWhere, booking.wo],
                    [c.factPay, booking.zahlung],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm leading-snug text-[var(--color-ink)]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <Reveal className="grid gap-4 sm:grid-cols-3">
            {c.cards.map((card) => (
              <article
                key={card.title}
                className="flex flex-col rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-5 shadow-[0_14px_40px_rgba(17,17,17,0.04)]"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                  {card.icon === 'instagram' ? (
                    <InstagramIcon className="h-5 w-5" />
                  ) : card.icon === 'whatsapp' ? (
                    <WhatsAppIcon className="h-5 w-5" />
                  ) : (
                    <ArrowRight className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                  )}
                </span>
                <h2 className="type-h3 mt-4 text-[var(--color-ink)]">{card.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">{card.body}</p>
                <a
                  href={card.href}
                  {...(card.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="btn-base btn-primary mt-5 min-h-11 w-full gap-2 px-5 text-sm sm:w-auto"
                >
                  {card.label}
                  <ArrowRight size={16} strokeWidth={2.25} aria-hidden />
                </a>
              </article>
            ))}
          </Reveal>
        </Shell>
      </section>
    </SubPageShell>
  );
}
