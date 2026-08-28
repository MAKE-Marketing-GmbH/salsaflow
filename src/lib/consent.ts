// Einwilligungs-Zustand der Seite. EINE Quelle, von der sowohl der Banner als auch
// jeder einwilligungspflichtige Einbau (heute: Google Maps) liest.
//
// WARUM ES DIESE DATEI GIBT
//
// Der Cookie-Hinweis konnte bisher genau eins: sich wegklicken lassen. Er hiess
// «Nur noetige Cookies» und hatte einen Knopf «Akzeptieren» — es gab nichts zu
// entscheiden, weil es keine Wahl gab. Raphael will (28.08.) aufklappbare Kategorien
// zum Anklicken.
//
// Der naheliegende Weg waere gewesen, die ueblichen drei Kategorien hinzuschreiben:
// Notwendig / Statistik / Marketing. Das waere falsch gewesen. Die Seite setzt
// nachweislich KEIN Analytics und KEIN Marketing:
//   - kein gtag, kein GTM, kein Pixel, kein Plausible/Matomo/Hotjar im Quelltext
//   - index.html laedt genau ein Skript: /src/main.tsx
//   - die eigene Datenschutzerklaerung sagt woertlich «Wir setzen keine
//     Tracking-Cookies und kein Webanalyse-Werkzeug wie Google Analytics ein»
//     (src/public/legal/content.ts)
// Ein Schalter «Statistik», der nichts schaltet, ist eine Schein-Auswahl: er behauptet
// eine Datenverarbeitung, die es nicht gibt, und widerspricht der eigenen
// Datenschutzerklaerung. Solche Kategorien gehoeren nicht ins UI.
//
// ES GIBT ABER EINE ECHTE. Google Maps laedt auf Startseite und Standort-Seite
// automatisch, «ohne dass du sie anklicken musst» — so steht es in der
// Datenschutzerklaerung selbst, inklusive IP-Uebertragung an Google und moeglichen
// Cookies. Das ist der eine Dienst auf dieser Seite, der eine Einwilligung braucht
// und bisher keine hatte. Genau der wird hier schaltbar.
//
// Ergebnis: zwei Kategorien, beide ehrlich.
//   'necessary' — immer an, nicht abwaehlbar (Sprachwahl, diese Einwilligung selbst,
//                 Zwischenspeicher der Buchungsstrecke). Alles nur im Browser.
//   'maps'      — Google Maps. Standardmaessig AUS. Ohne Zustimmung laedt kein
//                 iframe; die Karte zeigt stattdessen eine Vorschau mit Knopf.
//
// Kommt spaeter ein echtes Analytics dazu, ist die Kategorie hier eine Zeile — und
// ab dann steuert sie auch wirklich etwas.

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'salsaflow-consent';
/** Der alte Schluessel aus der Zeit vor den Kategorien. Wird nur noch gelesen, um
 *  Wiederkehrer nicht erneut zu fragen (siehe readConsent). */
const LEGACY_KEY = 'salsaflow-cookie-ok';

/** Event, das bei jeder Aenderung feuert. Wer Einwilligung braucht, hoert darauf,
 *  statt zu pollen. */
export const CONSENT_EVENT = 'salsaflow-consent-change';

export type ConsentCategory = 'necessary' | 'maps';

export type ConsentState = {
  /** Hat der Besucher ueberhaupt schon entschieden? Solange false, zeigt der Banner. */
  decided: boolean;
  maps: boolean;
};

const DEFAULT: ConsentState = { decided: false, maps: false };

/* oxlint-disable-next-line anti-slop/no-runtime-typeof --
 * Feature-Erkennung fuer die Laufzeitumgebung, keine Typ-Verengung an einer I/O-Grenze:
 * beim Prerender (entry-server.tsx) gibt es kein `window`, und jeder Zugriff wuerfe.
 * Es gibt hier keinen Domaenenwert zu parsen — die Frage ist allein, ob die Umgebung
 * einen Browser mitbringt. Steht als EINE Funktion hier statt an drei Aufrufstellen. */
const hasWindow = () => typeof window !== 'undefined';

/** Liest den gespeicherten Stand.
 *
 *  Die Legacy-Bruecke ist bewusst: Wer den alten Hinweis schon bestaetigt hat, soll
 *  nicht erneut gefragt werden — er hat aber auch nie in Google Maps eingewilligt,
 *  denn diese Frage gab es damals nicht. Darum `decided: true, maps: false`. Der
 *  Besucher sieht den Banner nicht wieder, die Karte fragt einmalig an ihrer eigenen
 *  Stelle nach. Alles andere waere entweder eine unterstellte Einwilligung oder ein
 *  Banner, der Bestandsbesucher erneut behelligt. */
/** Parst den rohen Speicherwert zu einem ConsentState.
 *
 *  Das ist die I/O-Grenze: was aus localStorage kommt, ist beliebiger Text — von einer
 *  aelteren Fassung dieser Seite, aus einer anderen Anwendung auf derselben Domain oder
 *  von Hand in der Konsole gesetzt. Ein fehlendes Feld, ein String statt Boolean oder
 *  gar kein Objekt sind normale Faelle, kein Fehler.
 *
 *  Die Regel ist deshalb eng: NUR ein exaktes `true` gilt als Einwilligung. Alles
 *  andere — undefined, 'true', 1, null — faellt auf false. Bei Einwilligung ist die
 *  strengere Lesart die richtige: im Zweifel nicht zugestimmt. */
function parseStored(raw: string): ConsentState | null {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  /* Nur ein Objekt kann Einwilligungen tragen. `JSON.parse` liefert aber genauso gut
     eine Zahl, einen String oder null — alles davon ist hier kein gueltiger Stand. */
  if (value === null || Array.isArray(value) || !(value instanceof Object)) return null;

  /* Der benannte Vertrag fuer das, was im Speicher liegen DARF: dieselben Felder wie
     ConsentState, aber jedes optional und ausdruecklich `true | undefined`. Diese enge
     Form ist der Punkt — geschrieben haben kann den Wert eine aeltere Fassung, eine
     andere Anwendung auf derselben Domain oder die Konsole, und alles ausser einem
     echten `true` ist dann eben KEINE Einwilligung. Ein Feld mit 'true' als String oder
     mit 1 faellt hier durch und landet auf false. */
  const stored: StoredConsent = value;
  return {
    decided: stored.decided === true,
    maps: stored.maps === true,
  };
}

/** Die Form, in der eine Einwilligung im localStorage liegen kann — im Gegensatz zu
 *  ConsentState, das die Form beschreibt, mit der die Anwendung arbeitet.
 *  Bewusst `true | undefined` statt `boolean`: ein gespeichertes `false` und ein
 *  fehlendes Feld bedeuten hier dasselbe, naemlich keine Zustimmung. */
type StoredConsent = {
  [K in keyof ConsentState]?: true;
};

export function readConsent(): ConsentState {
  if (!hasWindow()) return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw === null ? null : parseStored(raw);
    if (parsed) return parsed;
    if (window.localStorage.getItem(LEGACY_KEY) === '1') {
      return { decided: true, maps: false };
    }
  } catch {
    // localStorage kann blockiert sein (Privatmodus, Unternehmensrichtlinie).
    // Dann gilt der Default: nichts eingewilligt, Banner zeigt.
  }
  return DEFAULT;
}

/** Schreibt den Stand und benachrichtigt alle Hoerer im selben Dokument.
 *
 *  `storage`-Events feuern nur in ANDEREN Tabs, nicht im schreibenden — deshalb das
 *  eigene CustomEvent. Ohne das muesste die Karte pollen, um mitzubekommen, dass
 *  jemand gerade zugestimmt hat. */
export function writeConsent(next: ConsentState): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    // Den Alt-Schluessel mitschreiben: Sonst zeigt ein Zurueckrollen auf eine
    // aeltere Fassung dieser Seite den Banner erneut.
    window.localStorage.setItem(LEGACY_KEY, next.decided ? '1' : '0');
  } catch {
    // Wahl liess sich nicht merken. Der Rest der Funktion laeuft trotzdem: in dieser
    // Sitzung gilt die Entscheidung, sie ueberlebt nur den Reload nicht.
  }
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: next }));
}

/** Kurzform fuer den haeufigsten Fall: «darf ich Google Maps laden?» */
export function hasMapsConsent(): boolean {
  return readConsent().maps;
}

/** React-Bindung. Liest den Stand nach dem Mount (nicht beim ersten Render — auf dem
 *  Server gibt es kein localStorage, und ein abweichender Erstwert waere ein
 *  Hydration-Mismatch) und aktualisiert sich bei jeder Aenderung.
 *
 *  Beide Ereignisse zaehlen: das eigene CONSENT_EVENT fuer denselben Tab und
 *  `storage` fuer parallel offene Tabs — wer in einem Tab zustimmt, soll die Karte
 *  im anderen nicht erst nach einem Reload sehen. */
export function useConsent(): ConsentState {
  const [state, setState] = useState<ConsentState>(DEFAULT);

  useEffect(() => {
    setState(readConsent());
    const onChange = (e: Event) => {
      // SAFETY: Auf CONSENT_EVENT hoert ausschliesslich diese Datei, und gefeuert wird es
      // nur in writeConsent() — immer als CustomEvent<ConsentState> mit gesetztem detail.
      // Der `??`-Zweig faengt trotzdem ab, falls jemand von aussen ein gleichnamiges
      // Event ohne detail feuert: dann gilt der gespeicherte Stand, nicht undefined.
      const detail = (e as CustomEvent<ConsentState>).detail;
      setState(detail ?? readConsent());
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === LEGACY_KEY) setState(readConsent());
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return state;
}
