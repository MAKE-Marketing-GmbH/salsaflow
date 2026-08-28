// Google-Maps-Einbettung mit Einwilligungs-Schranke.
//
// R208: Vorher lud der iframe sofort beim Seitenaufruf. Damit ging bei jedem Besuch
// die IP-Adresse an Google, bevor irgendjemand gefragt wurde — die eigene
// Datenschutzerklaerung beschreibt das woertlich («laden wir eine Google-Maps-Karte
// automatisch, also ohne dass du sie anklicken musst»).
//
// Seit der Cookie-Banner echte Kategorien hat, ist Maps die eine Kategorie, die
// tatsaechlich etwas steuert (Begruendung in src/lib/consent.ts). Diese Komponente ist
// die Gegenseite dazu: ohne Einwilligung wird KEIN iframe gerendert. Ein Schalter, der
// die Karte trotzdem laedt, waere schlimmer als gar kein Schalter.
//
// Ohne Einwilligung steht an der Stelle der Karte eine Vorschau mit einem Knopf. Der
// Knopf erteilt die Einwilligung fuer Maps und laedt die Karte sofort — der Besucher
// muss dafuer nicht zurueck in den Banner. Wer die Karte gar nicht braucht, bekommt
// darunter den Link zur Anfahrt bei Google, der ohne Einbettung auskommt.

import { useState } from 'react';
import { LoaderCircle, MapPin } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { readConsent, useConsent, writeConsent } from '@/lib/consent';

export function GoogleMapEmbed({
  title,
  src,
  className,
}: {
  title: string;
  src: string;
  className: string;
}) {
  const { lang } = useLang();
  const de = lang === 'de';
  const consent = useConsent();
  const [mapReady, setMapReady] = useState(false);

  /* Einwilligung fuer Maps nachtraeglich erteilen, ohne die uebrigen Felder zu
     ueberschreiben: `decided` bleibt true (der Besucher hat hier ja entschieden),
     alles andere kommt aus dem gespeicherten Stand. */
  const allowMaps = () => {
    const current = readConsent();
    writeConsent({ ...current, decided: true, maps: true });
  };

  if (!consent.maps) {
    return (
      <div
        className={`${className} overflow-hidden bg-[var(--color-bg-soft)]`}
        data-google-map-gate
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <MapPin size={26} strokeWidth={1.75} aria-hidden className="text-[var(--color-salsa)]" />
          <p className="max-w-sm text-sm leading-snug text-[var(--color-ink)]">
            {de
              ? 'Die Karte lädt erst, wenn du zustimmst. Dabei erhält Google deine IP-Adresse.'
              : 'The map loads once you agree. Google receives your IP address in the process.'}
          </p>
          <button
            type="button"
            data-testid="map-consent"
            onClick={allowMaps}
            className="t-hover min-h-11 rounded-full bg-[var(--color-salsa)] px-5 text-sm font-semibold text-white hover:bg-[var(--color-salsa-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2"
          >
            {de ? 'Karte laden' : 'Load map'}
          </button>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Elisabethenanlage+7,+4051+Basel"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-[var(--color-ink-muted)] underline underline-offset-2 hover:text-[var(--color-ink)]"
          >
            {de ? 'Stattdessen bei Google öffnen' : 'Open at Google instead'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} overflow-hidden bg-[var(--color-bg-soft)]`}>
      <iframe
        data-google-map-iframe
        title={title}
        src={src}
        onLoad={() => setMapReady(true)}
        className={`absolute inset-0 h-full w-full border-0 motion-safe:transition-opacity motion-safe:duration-300 ${mapReady ? 'opacity-100' : 'opacity-0'}`}
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      {!mapReady ? (
        <div
          data-google-map-loading
          role="status"
          className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-soft)] p-5 text-center text-[var(--color-ink)]"
        >
          <div>
            <LoaderCircle
              size={28}
              strokeWidth={1.75}
              aria-hidden
              className="mx-auto animate-spin text-[var(--color-salsa)] motion-reduce:animate-none"
            />
            <p className="mt-3 text-sm font-semibold">
              {de ? 'Google Maps wird geladen …' : 'Google Maps is loading …'}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
