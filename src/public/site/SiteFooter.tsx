// Footer (Etappe 10), HELL (Master-Plan §4 [Fix F7]). Off-White-Grund, Ink-Text, duenne Linien-Trenner,
// Logo schwarz-rot. Die einzige dunkle Sektion sitewide gehoert Danceflow auf der Startseite.
// 4 Spalten: Marke / Kontakt / Entdecken / Social. Kontaktdaten ECHT aus wiki.md Abschnitt 1
// (info@salsaflow-dc.com, +41 76 478 84 11, Instagram salsaflowdc, 3 Studios am Bahnhof SBB).
// KEIN Facebook (Briefing leer). Impressum/Datenschutz -> echte Rechtsseiten.
// Runde 1: volle NAP-Adresse jetzt bewusst IM Footer — Begruendung an der Kontakt-Spalte.

import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import { HOME } from '@/public/home/content';
import { WhatsAppFloat } from '@/public/site/WhatsAppFloat';
import { CookieBanner } from '@/public/site/CookieBanner';
// Design-Kritik Runde 2: der Footer lief auf max-w-6xl (1152px) waehrend Header und Content
// auf 1400px liefen — Footer-Inhalt startete bei x=168, die H1 darueber bei x=55. Jetzt EINE Shell.
import { Shell } from '@/public/site/primitives';

export const CONTACT = {
  email: 'info@salsaflow-dc.com',
  phoneDisplay: '+41 76 478 84 11',
  phoneHref: 'tel:+41764788411',
  whatsapp: 'https://wa.me/41764788411',
  instagram: 'https://www.instagram.com/salsaflowdc/',
  googleReviews: 'https://www.google.com/maps/search/?api=1&query=Salsaflow+Dance+Company+Basel',
};

// entryCta: der "Dein Einstieg"-Block ueber den Footer-Spalten. Sitewide an, auf der
// Startseite aus (dort schliesst schon der dunkle Fullbleed-Closer mit demselben CTA,
// zwei Abschluss-CTAs direkt nacheinander waeren doppelt).
export function SiteFooter({ entryCta = true, float = true }: { entryCta?: boolean; float?: boolean }) {
  const { lang } = useLang();
  const c = HOME[lang].footer;
  const nav = HOME[lang].nav;
  const year = 2026;

  // Cookie-Banner steuert, ob der WhatsApp-Float ausweichen muss (z-Order, sitewide.md §7/§8).
  const [cookieVisible, setCookieVisible] = useState(false);

  /* Spalte 3 "Entdecken": Schnell-Links auf die echten Seiten (Labels aus der Navi).
   *
   * Runde 1: Die drei Stil-Seiten (Salsa, Bachata, Heels), Privatstunden und Kursaufbau
   * fehlten hier komplett — sie hingen sitewide nur am Desktop-Dropdown, und genau das war
   * bis eben zugeclippt (siehe SiteHeader.tsx). Der Footer ist der zweite Weg dorthin und
   * das stabilere interne Link-Signal, weil er auf JEDER Seite im HTML steht.
   *
   * `key` laeuft ab jetzt ueber `label`, nicht ueber `href`: "Kontakt" und
   * "Geschenkgutschein" zeigen beide auf /kontakt, das gab zwei React-Warnungen
   * ("Encountered two children with the same key") auf jeder Seite der Site. */
  const discover = [
    { label: nav.tanzkurse, href: '/tanzkurse' },
    { label: 'Salsa', href: '/tanzkurse/salsa' },
    { label: 'Bachata', href: '/tanzkurse/bachata' },
    { label: 'Heels', href: '/tanzkurse/heels' },
    { label: lang === 'de' ? 'Privatstunden' : 'Private lessons', href: '/privatstunden' },
    { label: lang === 'de' ? 'Kursaufbau' : 'Course levels', href: '/kursaufbau' },
    { label: nav.kursplan, href: '/kursplan' },
    { label: lang === 'de' ? 'Preise' : 'Prices', href: '/preise' },
    { label: nav.events, href: '/events' },
    { label: nav.team, href: '/team' },
    { label: nav.fotos, href: '/fotos' },
    { label: nav.faq, href: '/faq' },
    { label: nav.kontakt, href: '/kontakt' },
    // Runde 2, Issue 9: Gutschein und Shows/Animationen standen als eigenes Zwei-Karten-Band
    // auf der Startseite (src/public/home/Offer.tsx). Beides sind Nebenwege, keine
    // Hauptentscheidung - sie gehoeren in den Footer, nicht in den Scroll der Startseite.
    { label: lang === 'de' ? 'Geschenkgutschein' : 'Gift voucher', href: '/kontakt#geschenkgutschein' },
    { label: lang === 'de' ? 'Raumvermietung' : 'Room rental', href: '/kontakt/standort-raumvermietung' },
    { label: lang === 'de' ? 'Shows & Animationen' : 'Shows & animation', href: '/shows-animationen' },
  ];

  // Spalte 4 "Folg uns": beschriftete Liste (Icon + Label) im selben Rhythmus wie "Entdecken",
  // damit die Spalte vertikal traegt und kein nacktes Icon als Platzhalter wirkt.
  const social = [
    { label: 'Instagram', href: CONTACT.instagram, icon: <InstagramIcon /> },
    { label: 'WhatsApp', href: CONTACT.whatsapp, icon: <WhatsappIcon /> },
    { label: lang === 'de' ? 'Google-Bewertung' : 'Google reviews', href: CONTACT.googleReviews, icon: <StarIcon /> },
  ];
  return (
    <>
    <footer className="border-t border-white/10 bg-[var(--color-surface-dark)] text-white">
      {entryCta && (
      <div className="border-b border-[var(--color-line)] bg-[var(--color-paper-warm)]">
        <Shell className="flex flex-col items-start gap-6 py-8 sm:flex-row sm:items-center sm:gap-8 lg:py-10">
          {/* Bild als kleiner Akzent (kein halbseitiger Anker). */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] shadow-sm sm:h-24 sm:w-24">
            <img
              src="/photos/events/event-04.jpg"
              alt={lang === 'de' ? 'Zwei lachende Tänzer auf der Tanzfläche' : 'Two smiling dancers on the dance floor'}
              className="h-full w-full object-cover object-[center_42%]"
              width={1600}
              height={1066}
              loading="lazy"
            />
          </div>

          {/* Ein klarer Schwerpunkt: Eyebrow + Headline + eine Zeile. */}
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              <span aria-hidden className="flex items-end gap-[2px] opacity-70">
                <span className="h-2 w-[2px] rounded-full bg-[var(--color-salsa)]" />
                <span className="h-3 w-[2px] rounded-full bg-[var(--color-salsa)]" />
                <span className="h-1.5 w-[2px] rounded-full bg-[var(--color-salsa)]" />
              </span>
              {lang === 'de' ? 'Dein Einstieg' : 'Your first step'}
            </p>
            <p className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-[var(--color-ink)] sm:text-3xl">
              {lang === 'de' ? 'Bereit für deinen ersten Tanz?' : 'Ready for your first dance?'}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {lang === 'de'
                ? 'Komm zur gratis Schnupperstunde oder schreib uns kurz.'
                : 'Join a free trial class or send us a quick message.'}
            </p>
          </div>

          {/* CTA-Dock: ein klarer Abschluss, kein zweiter Hero. */}
          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
            <a
              href="/kontakt#schnupperstunde"
              className="t-hover inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-salsa)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-salsa-700)]"
            >
              {lang === 'de' ? 'Gratis Schnupperstunde' : 'Free trial class'}
            </a>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="t-hover inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white"
            >
              WhatsApp
            </a>
          </div>
        </Shell>
      </div>
      )}
      {/* Extra Boden-Freiraum (pb), damit der fixe WhatsApp-Float (bottom-5, ~68px hoch) die
          Legal-Row am Seitenende nie überlappt, auch im Laptop-Band wo der Container die Viewport-
          Kante berührt. */}
      <Shell className="py-12 pb-20 sm:py-14 sm:pb-24">
        {/* Kritiker final-2, Issue 1 (home-390, MAJOR): unter ENTDECKEN und FOLG UNS standen
            grosse leere Schwarzflaechen, die Spalten wirkten abgeschnitten. Ursache war NICHT
            fehlender Inhalt, sondern die Zeilenhoehe: jeder Link trug `min-h-8` (32px Touch-
            Target) PLUS `space-y-2` (8px) in EINER Spalte. Zehn Entdecken-Links ergaben so
            10x40 = 400px, waehrend die Nachbarspalte "Folg uns" nach 3 Eintraegen (120px) endet
            — die Differenz stand als schwarze Flaeche daneben, und beide Spalten liefen
            zusammen ueber eine ganze Bildschirmhoehe.
            Fix: auf Mobil laufen die Link-Listen zweispaltig (gap-x), der Touch-Target bleibt
            ueber `py-1.5` statt `min-h-8` erhalten (Zeile ~36px inkl. Padding, weiter ueber der
            24px-Textzeile). Zehn Links brauchen damit fuenf Zeilen statt zehn. Ab `sm` gilt
            wieder das Vier-Spalten-Raster, dort ist eine Spalte pro Liste richtig. */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.35fr_0.9fr]">
          {/* 1. Marke */}
          <div className="space-y-4">
            <img
              src="/logo/salsaflow-logo-weissrot.png"
              alt="Salsaflow Dance Company"
              className="h-10 w-auto"
              width={158}
              height={40}
            />
            <p className="max-w-xs text-sm leading-relaxed text-white/85">{c.tagline}</p>
            {/* Der Claim stand als salsa-500 (#C61F30) auf der aufgehellten Chip-Flaeche
                (effektiv rgb(36,36,36)) bei 2.7:1 — die einzige echte Kontrast-Verletzung,
                die sitewide auf JEDER Seite auftrat. Rot bleibt die Farbe der Marke, traegt
                hier aber die Flaeche statt den Text. */}
            <p className="inline-flex rounded-full bg-[var(--color-salsa)] px-4 py-2 font-display text-lg font-semibold italic text-white">
              {c.claim}
            </p>
          </div>

          {/* 2. Kontakt — NAP (Name, Adresse, Telefon) vollstaendig und auf jeder Seite.
              Die alte Regel "KEINE Strassen-Adresse im Footer" (Kopfkommentar, MASTER-PLAN
              §123) ist ueberholt: dieselbe Adresse steht laengst offen im Impressum
              (legal/content.ts:31), auf /kontakt, auf /kontakt/standort-raumvermietung und
              im LocalBusiness-JSON-LD auf JEDER Seite (seo-schema.ts:150). Sie im Footer
              wegzulassen schuetzte also nichts, kostete aber das Local-SEO-Signal, das
              genau von der Wiederholung derselben NAP-Zeichenkette lebt (audit/ai-seo.md,
              P0 Nr. 3 "LocalBusiness vervollstaendigen", P3 Nr. 15 "Konsistente NAP").
              Schreibweise darum ZEICHENGLEICH zum Schema, nicht sinngemaess. */}
          <div className="space-y-2">
            <FooterHeading>{c.contactTitle}</FooterHeading>
            <address className="not-italic">
              <p className="flex items-start gap-2.5 py-1.5 text-sm leading-relaxed text-white/85">
                <PinIcon />
                <span>
                  Elisabethenanlage 7<br />
                  4051 Basel
                  <span className="mt-0.5 block text-white/70">{c.studios}</span>
                </span>
              </p>
              {/* Mail und Telefon gehoeren mit in das <address>-Element: es umschliesst die
                  Kontaktdaten der Seite, nicht nur die Postanschrift. */}
              <a href={`mailto:${CONTACT.email}`} className="t-hover flex items-center gap-2.5 py-1.5 text-sm text-white/85 hover:text-white">
                <MailIcon /> {CONTACT.email}
              </a>
              <a href={CONTACT.phoneHref} className="t-hover flex items-center gap-2.5 py-1.5 text-sm text-white/85 hover:text-white">
                <PhoneIcon /> {CONTACT.phoneDisplay}
              </a>
            </address>
          </div>

          {/* 3. Entdecken — Abnahme-Kritik: auf Desktop lief die Liste einspaltig auf ~400px
              Hoehe und liess links unter Logo/Claim eine grosse leere Dunkelzone stehen.
              Zweispaltig (5 Zeilen) traegt die Spalte dieselbe Hoehe wie die Nachbarn. */}
          <div className="space-y-3">
            <FooterHeading>{c.discoverTitle}</FooterHeading>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-0.5 sm:gap-y-1">
              {discover.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="inline-flex items-center py-1.5 text-sm text-white/85 hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Social */}
          <div className="space-y-3">
            <FooterHeading>{c.followTitle}</FooterHeading>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-0.5 sm:grid-cols-1 sm:gap-y-1">
              {social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="group flex items-center gap-2.5 py-1.5 text-sm text-white/85 hover:text-white"
                  >
                    <span className="text-white/70 group-hover:text-white">{s.icon}</span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/85 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {c.rights} &middot; {c.legal}
          </p>
          <div className="flex gap-5">
            <a href="/impressum" className="inline-flex min-h-8 items-center hover:text-white">{c.impressum}</a>
            <a href="/datenschutz" className="inline-flex min-h-8 items-center hover:text-white">{c.datenschutz}</a>
          </div>
        </div>
      </Shell>
    </footer>

    {/* Sitewide-Floats: liegen position:fixed ueber dem Layout, darum als Geschwister neben dem
        Footer (nicht im Footer-Fluss). Erscheinen damit auf jeder Seite (sitewide.md §7/§8). */}
    {float && <WhatsAppFloat raised={cookieVisible} />}
    <CookieBanner onVisibleChange={setCookieVisible} />
    </>
  );
}

/** Spaltentitel im Footer.
 *  Design-Kritik Runde 3, Issue 8: hier stand derselbe rote Takt-Marker wie vor einer
 *  Kernsektion — viermal nebeneinander ueber "Kontakt", "Entdecken", "Folg uns". Der Marker
 *  soll eine Kapitelgrenze bedeuten; ueber einer Linkspalte bedeutet er nichts und verbraucht
 *  nur die Signatur. Der Titel traegt sich hier ueber Grossbuchstaben und Sperrung allein. */
function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/85">{children}</h3>
  );
}

/* Individuelle, schlichte Line-Icons (keine Icon-Library-Dependency). */
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l-1 4-3 1A14 14 0 0 1 4 8z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
export function InstagramIcon({ className }: { className?: string } = {}) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function WhatsappIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 21l1.6-4.5A8 8 0 1 1 8 19.5z" /><path d="M8.5 8.5c-.3 1 .2 2.3 1.2 3.4s2.4 1.6 3.4 1.3c.5-.1.9-.6.9-1.1l-.1-.9-1.6-.5-.8.7c-.6-.3-1.2-.8-1.5-1.5l.7-.8-.5-1.6-.9-.1c-.5 0-1 .3-1.1.8z" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
    </svg>
  );
}
