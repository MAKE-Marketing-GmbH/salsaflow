// Inhalt der Tanzschuhe-Seite (/mehr/tanzschuhe) aus dem V3-Copyplan (pages/22_mehr__tanzschuhe.md).
// Zweisprachig DE/EN. de = Plan-Wortlaut, en = treu uebersetzt. Echte Umlaute, CH-ss, keine
// Em-Dashes. Ruhige Beratungsseite (Plan: soll Supportfragen reduzieren, nicht hart verkaufen).
//
// Partner-Shop = verifizierter 2332dancewear-Salsaflow-Collab (COLLAB_URL). Der Plan nennt
// "Dancing Queens" nur bedingt und ohne URL, darum bleibt der reale, bestaetigte Partner mit der
// bereits gesicherten Kollektions-Copy. Checklisten/Bullets/FAQ sind woertlich uebernommen.

import type { Lang } from '@/lib/i18n';
import type { Faq, Crumb } from '@/public/subpage/kit';
import { SCHNUPPER_HREF } from '@/public/subpage/kit';
import { COLLAB_URL } from '@/public/contact/content';

type Cta = { label: string; href: string };
type Img = { src: string; alt: string };
type StyleCard = { name: string; text: string; href: string };

export type TanzschuheContent = {
  crumbs: Crumb[];
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    primary: Cta;
    secondary: Cta;
    microcopy: string;
    image: Img;
    cardLabel: string;
    cardText: string;
  };
  byStyle: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    cards: StyleCard[];
    cta: Cta;
  };
  checklist: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    items: string[];
  };
  notNeeded: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    cta: Cta;
  };
  partner: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    badge: string;
    bullets: string[];
    primary: Cta;
    secondary: Cta;
    image: Img;
  };
  care: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    items: string[];
  };
  faqEyebrow: string;
  faqTitle: string;
  faq: Faq[];
  closing: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    primary: Cta;
    secondary: Cta;
  };
};

export const TANZSCHUHE: Record<Lang, TanzschuheContent> = {
  de: {
    crumbs: [
      { label: 'Mehr', href: '/mehr' },
      { label: 'Tanzschuhe', href: '/mehr/tanzschuhe' },
    ],
    hero: {
      eyebrow: 'Schuhe & Vorbereitung',
      title: 'Gute Tanzschuhe machen den Einstieg leichter. Nicht',
      titleAccent: 'komplizierter.',
      lead: 'Du brauchst am Anfang nicht den teuersten Schuh. Du brauchst Halt, passende Sohle und einen Schuh, mit dem du dich sicher fühlst.',
      primary: { label: 'Empfehlungen ansehen', href: '#partner' },
      secondary: { label: 'Kursplan öffnen', href: '/kursplan' },
      microcopy: 'Im Zweifel vor dem Kurs kurz fragen.',
      image: { src: '/composites/heels-shoes-stilllife.webp', alt: 'Schwarze Dance Heels und rote Salsa-Schuhe im hellen Salsaflow Studio' },
      cardLabel: 'Für den Start',
      cardText: 'Halt, passende Sohle, sicheres Gefühl.',
    },
    byStyle: {
      eyebrow: 'Nach Tanzstil',
      title: 'Der richtige Schuh hängt vom',
      titleAccent: 'Tanz ab.',
      cards: [
        {
          name: 'Salsa',
          text: 'Eine drehfreundliche Sohle und guter Halt helfen, sauberer und leichter zu drehen.',
          href: '/tanzkurse/salsa',
        },
        {
          name: 'Bachata',
          text: 'Der Schuh sollte bequem, kontrolliert und nicht zu rutschig sein, weil Connection und Gewichtswechsel wichtig sind.',
          href: '/tanzkurse/bachata',
        },
        {
          name: 'Heels',
          text: 'Stabiler Absatz, sicherer Sitz und Kontrolle sind wichtiger als Höhe.',
          href: '/tanzkurse/heels',
        },
      ],
      cta: { label: 'Kursstil wählen', href: '/tanzkurse' },
    },
    checklist: {
      eyebrow: 'Checkliste',
      title: 'Worauf Anfänger achten',
      titleAccent: 'sollten.',
      items: [
        'nicht zu hohe Absätze beim Start',
        'Schuh muss fest sitzen, ohne zu drücken',
        'Sohle sollte für Studio/Tanzfläche geeignet sein',
        'keine Strass-/Mode-Optik über Sicherheit stellen',
        'im Zweifel Kursleitung fragen',
        'Schuhe nur im Studio nutzen, wenn Sohle sauber bleiben soll',
      ],
    },
    notNeeded: {
      eyebrow: 'Kein Stress',
      title: 'Du brauchst nicht sofort den perfekten',
      titleAccent: 'Schuh.',
      body: 'Viele warten mit dem Kursstart, weil sie erst Ausrüstung kaufen wollen. Für die erste Stunde ist wichtiger, dass du sicher stehen und dich bequem bewegen kannst. Gute Tanzschuhe helfen später, aber sie ersetzen keinen Start.',
      cta: { label: 'Schnupperstunde buchen', href: SCHNUPPER_HREF },
    },
    partner: {
      eyebrow: 'Partner & Shop',
      title: 'Empfehlung statt endloser',
      titleAccent: 'Suche.',
      body: 'Bei 2332dancewear gibt es eine eigene Salsaflow-Kollektion mit Tanzschuhen und Kleidung. Beides passt zum Kurs und zu den Partys. Am Anfang reicht bequeme Kleidung, richtig ausrüsten kannst du dich später.',
      badge: '2332dancewear',
      bullets: ['Eigene Salsaflow-Kollektion', 'Tanzschuhe und Kleidung', 'Gut für Kurs und Socials'],
      primary: { label: 'Shop öffnen', href: COLLAB_URL },
      secondary: { label: 'Collabs ansehen', href: '/mehr/collabs' },
      // TODO KI-Still-Life (Tanzschuhe-Auslage im hellen Studio), vorerst echtes Studio-Foto.
      image: { src: '/photos/showcase/hp-11.webp', alt: 'Tänzerinnen und Tänzer im hellen Salsaflow Studio' },
    },
    care: {
      eyebrow: 'Mitbringen',
      title: 'Kleine Vorbereitung, besserer',
      titleAccent: 'Kursabend.',
      items: [
        'Schuhe sauber halten',
        'Wechselshirt oder Wasser bei intensiven Kursen',
        'keine Strassenschuhe mit dreckiger Sohle im Studio',
        'bei Heels vorher Stabilität testen',
        'bei Unsicherheit vorab fragen',
      ],
    },
    faqEyebrow: 'Tanzschuhe FAQ',
    faqTitle: 'Häufige Fragen zu Tanzschuhen',
    faq: [
      {
        q: 'Kann ich mit Sneakers starten?',
        a: 'Für manche Beginner-Situationen kann das gehen, wenn die Schuhe sauber und sicher sind. Frag im Zweifel kurz nach den Regeln für deinen Kurs.',
      },
      {
        q: 'Welche Heels-Höhe ist geeignet?',
        a: 'Am Anfang lieber stabil und kontrollierbar als hoch und unsicher.',
      },
      {
        q: 'Brauche ich für die Schnupperstunde schon Tanzschuhe?',
        a: 'Nicht zwingend. Bequeme, saubere Schuhe reichen oft für den ersten Eindruck. Für regelmässige Kurse können Tanzschuhe sinnvoll sein.',
      },
      {
        q: 'Wo kann ich Tanzschuhe kaufen?',
        a: 'Ja. Unter Collabs verlinken wir dir unseren empfohlenen Partner für Tanzschuhe.',
      },
    ],
    closing: {
      eyebrow: 'Nächster Schritt',
      title: 'Schuhe geklärt? Dann fehlt nur der',
      titleAccent: 'Kurs.',
      body: 'Starte mit einer Schnupperstunde oder öffne den Kursplan. Du brauchst keine perfekte Ausrüstung, um anzufangen.',
      primary: { label: 'Kursplan ansehen', href: '/kursplan' },
      secondary: { label: 'Frage zu Schuhen stellen', href: '/kontakt' },
    },
  },
  en: {
    crumbs: [
      { label: 'More', href: '/mehr' },
      { label: 'Dance shoes', href: '/mehr/tanzschuhe' },
    ],
    hero: {
      eyebrow: 'Shoes & preparation',
      title: 'Good dance shoes can make movement feel more',
      titleAccent: 'comfortable.',
      lead: 'You do not need expensive shoes for your first class. A secure fit, suitable sole and enough support matter most.',
      primary: { label: 'See recommendations', href: '#partner' },
      secondary: { label: 'Open the schedule', href: '/kursplan' },
      microcopy: 'When in doubt, just ask before class.',
      image: { src: '/composites/heels-shoes-stilllife.webp', alt: 'Black dance heels and red Salsa shoes in the bright Salsaflow studio' },
      cardLabel: 'For the start',
      cardText: 'A secure fit, suitable sole and good support.',
    },
    byStyle: {
      eyebrow: 'By dance style',
      title: 'The right shoe depends on the',
      titleAccent: 'dance.',
      cards: [
        {
          name: 'Salsa',
          text: 'A turn-friendly sole and secure fit help you turn more smoothly and with greater control.',
          href: '/tanzkurse/salsa',
        },
        {
          name: 'Bachata',
          text: 'The shoe should be comfortable, controlled and not too slippery, because connection and weight changes matter.',
          href: '/tanzkurse/bachata',
        },
        {
          name: 'Heels',
          text: 'A stable heel, a secure fit and control matter more than height.',
          href: '/tanzkurse/heels',
        },
      ],
      cta: { label: 'Choose a course style', href: '/tanzkurse' },
    },
    checklist: {
      eyebrow: 'Checklist',
      title: 'What beginners should look',
      titleAccent: 'out for.',
      items: [
        'not too high heels at the start',
        'the shoe must sit firmly without pinching',
        'the sole should suit the studio and dance floor',
        'do not put rhinestone or fashion looks above safety',
        'when in doubt, ask the instructor',
        'use the shoes only in the studio if you want to keep the sole clean',
      ],
    },
    notNeeded: {
      eyebrow: 'No stress',
      title: 'You do not need the perfect shoe right',
      titleAccent: 'away.',
      body: 'You do not need to buy equipment before your first class. Start in clean, comfortable shoes that let you move safely. Dance shoes can help later, but they are not required to begin.',
      cta: { label: 'Book a trial class', href: SCHNUPPER_HREF },
    },
    partner: {
      eyebrow: 'Partner & shop',
      title: 'A recommendation instead of an endless',
      titleAccent: 'search.',
      body: '2332dancewear offers a dedicated Salsaflow collection of dance shoes and clothing for classes and socials. Comfortable clothes are enough when you start, and you can add specialist gear later if you want it.',
      badge: '2332dancewear',
      bullets: ['A dedicated Salsaflow collection', 'Dance shoes and clothing', 'Good for class and socials'],
      primary: { label: 'Open the shop', href: COLLAB_URL },
      secondary: { label: 'See collabs', href: '/mehr/collabs' },
      image: { src: '/photos/showcase/hp-11.webp', alt: 'Dancers in the bright Salsaflow studio' },
    },
    care: {
      eyebrow: 'Bring along',
      title: 'A little preparation, a better course',
      titleAccent: 'evening.',
      items: [
        'keep your shoes clean',
        'a spare shirt or water for intense classes',
        'no street shoes with a dirty sole in the studio',
        'test stability first with heels',
        'ask in advance if unsure',
      ],
    },
    faqEyebrow: 'Dance shoes FAQ',
    faqTitle: 'Common questions about dance shoes',
    faq: [
      {
        q: 'Can I start with sneakers?',
        a: 'For some beginner situations that can work, if the shoes are clean and safe. Please check the specific studio and course rules in the end.',
      },
      {
        q: 'Which heel height is suitable?',
        a: 'At the start, rather stable and controllable than high and unsteady.',
      },
      {
        q: 'Do I already need dance shoes for the trial class?',
        a: 'Not necessarily. Comfortable, clean shoes are often enough for the first impression. For regular classes dance shoes can make sense.',
      },
      {
        q: 'Where can I buy dance shoes?',
        a: 'Yes. Under Collabs we link you our recommended partner for dance shoes.',
      },
    ],
    closing: {
      eyebrow: 'Next step',
      title: 'Shoes sorted? Then all that is missing is the',
      titleAccent: 'course.',
      body: 'Start with a trial class or open the schedule. You do not need perfect gear to begin.',
      primary: { label: 'See the schedule', href: '/kursplan' },
      secondary: { label: 'Ask about shoes', href: '/kontakt' },
    },
  },
};
