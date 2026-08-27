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

export function PreparePage() {
  const { lang } = useLang();
  const c = COPY[lang];
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
