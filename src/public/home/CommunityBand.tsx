// Der Signature-Moment der Seite (Design-Kritik Runde 1, kritisch: "Kein Signature-Moment").
//
// Befund: saemtliche Reveals der Site waren derselbe Effekt (y 14px, 0.45s, Stagger 0.07,
// src/public/home/motion.tsx:26-28) — auf jeder Sektion jeder Seite. Die einzige Komponente
// mit Eigencharakter, `Marquee` (src/public/home/motion.tsx:118), war definiert, aber in
// KEINER Datei importiert. Genau die wird hier aktiviert.
//
// Genau EIN Moment, nicht mehr: ein full-bleed Foto-Band zwischen Angebot und Kursplan.
// Es laeuft langsam (60s pro Runde), ist rein dekorativ (aria-hidden im Marquee) und
// unterbricht als einziges Element die Spaltenordnung der Seite.
//
// prefers-reduced-motion: die Marquee-Komponente schaltet selbst auf ein stehendes,
// seitlich scrollbares Band um. Zusaetzlich blendet dieses Modul dann ein statisches
// 3er-Grid ein, damit ohne Bewegung trotzdem eine ruhige Komposition steht.
//
// Bilder: echte Community-Fotos, alle 3:2 und sitewide noch ungenutzt (geprueft gegen
// grep ueber src/). Keine Datei doppelt.

import { useReducedMotion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { Marquee, useHydrated } from '@/public/home/motion';
import { LABEL, TEXT_LOW, PAPER, SECTION_Y_PEAK, Rise, Wrap } from '@/public/home/kit';

type BandPhoto = { src: string; alt: string; altEn: string };

// Design-Kritik Runde 2: "im Marquee laufen fuenf Fotos mit eingebrannten Wasserzeichen in
// drei verschiedenen Groessen und Positionen nebeneinander (klein unten mittig, gross unten
// links, angeschnitten am rechten Rand)."
//
// Nachgemessen statt geschaetzt: Anteil der Pixel >=235 Luminanz im unteren 26%-Band jedes
// Bildes (Wasserzeichen = weisse Schrift im dunklen Fussbereich). Werte:
//   party-03 1.58%  ·  party-24 1.40%  ·  community-crowd-01 1.48%   -> Wasserzeichen
//   party-09 0.00%  ·  party-14 0.33%  ·  party-19 0.00%             -> sauber
// Dieselbe Messung ueber die 49 ungenutzten Party-Fotos liefert die Ersatzkandidaten.
//
// Die drei Traeger sind ersetzt statt beschnitten: ein einheitlicher Beschnitt haette bei
// drei verschiedenen Logo-Positionen drei verschiedene Motive gekostet. Die Marke steht
// ohnehin im Header.
const PHOTOS: BandPhoto[] = [
  {
    // ersetzt party-03 (Wasserzeichen unten mittig, 1.58%)
    src: '/photos/party/party-12.webp',
    alt: 'Tanzende drehen sich eng auf der vollen Fläche einer Danceflow Night',
    altEn: 'Dancers turning close together on a packed Danceflow Night floor',
  },
  {
    src: '/photos/party/party-09.webp',
    alt: 'Zwei Tanzende lachen mitten in einer Figur',
    altEn: 'Two dancers laughing in the middle of a move',
  },
  {
    src: '/photos/party/party-14.webp',
    alt: 'Gruppe tanzt ausgelassen im warmen Licht des Saals',
    altEn: 'A group dancing freely in the warm light of the hall',
  },
  {
    src: '/photos/party/party-19.webp',
    alt: 'Paar tanzt Bachata dicht umschlungen',
    altEn: 'A couple dancing bachata close together',
  },
  {
    // ersetzt party-24 (Wasserzeichen unten links, 1.40%)
    src: '/photos/party/party-16.webp',
    alt: 'Volle Tanzfläche von der Seite, viele Paare in Bewegung',
    altEn: 'A full dance floor from the side, many couples in motion',
  },
  {
    // ersetzt 2026/community-crowd-01 (Wasserzeichen angeschnitten rechts, 1.48%)
    src: '/photos/party/party-18.webp',
    alt: 'Die Community von Salsaflow dicht beieinander im Saal',
    altEn: 'The Salsaflow community close together in the hall',
  },
];

function Frame({ photo, eager = false }: { photo: BandPhoto; eager?: boolean }) {
  const { lang } = useLang();
  return (
    // Fuge als border-right statt gap: der Marquee-Innencontainer gehoert der
    // Marquee-Komponente, hier wird nichts in fremde Klassen hineingegriffen.
    <span className="block w-[68vw] shrink-0 border-r border-[var(--color-line)] sm:w-[38vw] lg:w-[26vw]">
      <img
        src={photo.src}
        alt={lang === 'de' ? photo.alt : photo.altEn}
        width={1500}
        height={1000}
        loading={eager ? 'eager' : 'lazy'}
        className="aspect-[3/2] h-full w-full object-cover [filter:saturate(0.96)_contrast(1.03)]"
      />
    </span>
  );
}

export function CommunityBand() {
  const { lang } = useLang();
  const reduced = useReducedMotion();
  // Ohne Bewegung ist ein ruhiges 3er-Grid besser als ein stehendes Laufband. Diese
  // Entscheidung faellt aber ERST nach der Hydration: der Server kennt die Motion-
  // Praeferenz nicht, und ein Struktur-Wechsel im ersten Frame wirft den ganzen
  // Seitenbaum weg (Fehler 418). Bis dahin steht das Marquee still (siehe motion.tsx),
  // niemand sieht also ungewollte Bewegung.
  const hydrated = useHydrated();
  const stillLayout = hydrated && reduced;

  return (
    // Das Community-Bild ist laut Kritik Runde 2 DER Hoehepunkt der Startseite und bekommt
    // als einzige Home-Sektion die grosse Abstandsstufe (SECTION_Y_PEAK).
    <section aria-labelledby="community-band-label" className={`overflow-hidden ${PAPER} ${SECTION_Y_PEAK}`}>
      <Wrap>
        <Rise>
          <p id="community-band-label" className={`${LABEL} ${TEXT_LOW}`}>
            {lang === 'de' ? 'Die Community' : 'The community'}
          </p>
        </Rise>
      </Wrap>

      {stillLayout ? (
        // Ohne Bewegung: ruhiges 3er-Grid statt eines stehenden Bandes.
        <div className="mt-6 grid grid-cols-1 gap-px bg-[var(--color-line)] sm:grid-cols-3">
          {PHOTOS.slice(0, 3).map((photo) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={lang === 'de' ? photo.alt : photo.altEn}
              width={1500}
              height={1000}
              loading="lazy"
              className="aspect-[3/2] w-full object-cover [filter:saturate(0.96)_contrast(1.03)]"
            />
          ))}
        </div>
      ) : (
        <Marquee className="mt-6" duration={60}>
          {PHOTOS.map((photo, i) => (
            <Frame key={photo.src} photo={photo} eager={i === 0} />
          ))}
        </Marquee>
      )}
    </section>
  );
}
