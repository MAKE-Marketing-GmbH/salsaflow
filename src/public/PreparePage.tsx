import { useEffect, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { takeReservation, type ReservationFacts } from '@/lib/reservation-handoff';
import { CONTACT } from '@/public/site/SiteFooter';
import { InstagramIcon, WhatsAppIcon } from '@/public/site/BrandIcons';
import { SubHero, SubPageShell, Shell, Reveal } from '@/public/subpage/kit';
import { ArrowRight } from 'lucide-react';

const COPY = {
  de: {
    crumb: 'Vorbereiten',
    title: 'So bereitest du dich vor.',
    lead: 'Drei Dinge, dann tanzt du locker mit.',
    leadBooked: 'Deine Anmeldung ist da. Das Studio bestätigt dir den Platz, meist am selben Tag. Bis dahin: drei Dinge.',
    bookingTitle: 'Deine Anmeldung',
    bookingNote: 'Das Studio schaut sie an und bestätigt dir den Platz, meist am selben Tag.',
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
        body: 'Bequeme Kleidung, saubere Schuhe mit flacher Sohle oder barfuss. Studio Elisabethenanlage 7, 4051 Basel — 5 Minuten vom Bahnhof SBB.',
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
    lead: 'Three things, then you just dance.',
    leadBooked: 'We have your sign-up. The studio confirms your spot, usually the same day. Until then: three things.',
    bookingTitle: 'Your sign-up',
    bookingNote: 'The studio looks at it and confirms your spot, usually the same day.',
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
        body: 'Comfortable clothes, clean flat-soled shoes or barefoot. Studio Elisabethenanlage 7, 4051 Basel — 5 minutes from Basel SBB.',
        href: '/kursplan',
        label: 'See the schedule',
        external: false,
        icon: 'plan' as const,
      },
    ],
  },
} as const;

export function PreparePage() {
  const { lang } = useLang();
  const c = COPY[lang];
  /* Erst nach der Hydration lesen: der Server kennt den sessionStorage des Browsers
     nicht, ein direktes Lesen im Render wuerde Server- und Client-Markup auseinander-
     laufen lassen. Ohne Reservierung rendert der Block gar nicht — die Seite ist auch
     ueber das Schnupper-Formular und per Direktaufruf erreichbar. */
  const [booking, setBooking] = useState<ReservationFacts | null>(null);
  useEffect(() => setBooking(takeReservation()), []);
  /* Der behauptende Lead haengt an `booking`: die Route ist per Direktaufruf und
     geteiltem Link erreichbar, und takeReservation() raeumt den Eintrag beim ersten
     Lesen. Ohne bekannte Anmeldung — Direktaufruf, Reload — steht der neutrale Satz. */
  const lead = booking ? c.leadBooked : c.lead;
  return (
    <SubPageShell seo="prepare">
      <SubHero
        axis="split"
        seoCrumbs={[{ label: c.crumb, href: '/vorbereiten' }]}
        title={c.title}
        lead={lead}
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
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {c.bookingNote}
              </p>
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
