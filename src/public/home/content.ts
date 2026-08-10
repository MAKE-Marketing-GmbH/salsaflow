// Startseiten-Inhalt (Etappe 10), zweisprachig DE/EN. Quelle: wiki.md (Single-Source),
// konzept-1-die-persoenliche-welle.md, DECISIONS.md.
// Copy-Regeln (003/069/085): simpel, du-Form, echte Umlaute, CH-ss, keine Em-Dashes,
// ~50 Woerter pro Sektion. KEINE Preise/CHF-Zahlen (Dauerregel "keine Preise auf Website").
// KEINE erfundenen Zitate/Sterne-Zahlen - Community-Beweis laeuft ueber echte Fotos + Google-Link.
//
// Etappe 15 (Zweisprachigkeit sitewide) zieht den LangProvider auf die App-Wurzel und
// ergaenzt SEO/Meta/Recht. Der DE/EN-Inhalt der Home liegt schon hier vollstaendig vor,
// damit der Sprachschalter nicht halb-tot ist.

export type OfferCard = {
  key: string;
  title: string;
  hint: string; // kurzer Editorial-Hinweis fuer den Course-Index (z.B. "Anfänger bis Advanced")
  text: string;
  photo: string; // /photos/...
  alt: string;
  href: string; // eigenes Ziel je Karte (Stil-vorgefilterter Kursplan bzw. Privatstunden-Anker)
};

// Zusatz-Angebote ohne eigenes Kursfoto (Geschenkgutschein, Animationen/Shows).
// Kompakte Icon-Zeile unter dem Foto-Grid, sprengt das 4er-Grid nicht. icon -> Inline-SVG in Offer.tsx.
export type OfferExtra = {
  key: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  icon: 'gift' | 'show';
};

export type NewsItem = {
  key: string;
  kicker: string;
  date: string; // echter wiederkehrender Anker (z.B. "Alle 8 Wochen"), kein erfundenes Kalenderdatum
  title: string;
  text: string;
  photo: string;
  alt: string;
  href: string;
};

export type HomeStrings = {
  nav: {
    tanzkurse: string;
    kursplan: string;
    events: string;
    team: string;
    fotos: string;
    mehr: string;
    kontakt: string;
    // Mehr-Dropdown
    shows: string;
    faq: string;
    collabs: string;
    tanzschuhe: string;
    partys: string;
    raumvermietung: string;
  };
  cta: { trial: string; plan: string; book: string };
  hero: {
    eyebrow: string;
    titleA: string;
    titleAccent: string; // ein Wort in Rot
    titleB: string;
    lead: string;
    claim: string; // "Bailar es vivir."
    claimNote: string;
  };
  about: { eyebrow: string; title: string; body: string; link: string };
  offer: { eyebrow: string; title: string; lead: string; cards: OfferCard[]; extras: OfferExtra[] };
  schedule: {
    eyebrow: string;
    title: string;
    lead: string;
    all: string;
    empty: string;
    soonTitle: string;
    soonText: string;
  };
  events: { eyebrow: string; title: string; body: string; cta: string };
  community: { eyebrow: string; title: string; body: string; google: string };
  // Standort-Band (Home-Redesign 2026-07): heller Atem zwischen den zwei dunklen Fullbleeds
  // (Danceflow-Nacht + Schluss-CTA). Trennt die beiden Dunkel-Flaechen (Design-Vertrag 3.3).
  location: {
    eyebrow: string;
    title: string;
    titleAccent: string; // ein rotes Akzent-Wort (Handschrift)
    body: string;
    studios: { name: string; note: string; address: string }[];
    contact: string;
    phone: string;
  };
  news: { eyebrow: string; title: string; all: string; items: NewsItem[] };
  closing: { title: string; body: string; cta: string; secondary: string };
  footer: {
    tagline: string;
    claim: string; // "Bailar es vivir."
    studiosTitle: string;
    studios: string;
    contactTitle: string;
    discoverTitle: string; // "Entdecken"
    followTitle: string;
    rights: string;
    legal: string; // GmbH / UID-Zeile
    impressum: string;
    datenschutz: string;
  };
};

// Premium-Serie 2026-07-03 (warm gegradet, ein Look). Offer.tsx baut daraus das srcset
// (800w/1200w) ueber den Dateinamen. Ein Bild pro Tanzstil, passend zum Subject.
const offerPhotos = {
  // Kritiker final-2, Issue 4 (home-1440): die grosse Karte "Salsa tanzen in Basel" zeigte nur
  // einen Hinterkopf. Beleg an der Datei geprueft: offer-salsa-1200.webp (1200x1600) ist ein
  // Rueckenportraet — die Frau im Vordergrund fuellt die halbe Bildhoehe mit Haaren, ihr Gesicht
  // ist abgewandt, das einzige sichtbare Gesicht (Mann im roten Shirt) liegt unscharf dahinter.
  // Auf der wichtigsten Angebotskarte der Startseite verkauft das niemanden.
  // Neu: kurs-01.jpg — Salsa-Paar mitten in der Drehung, BEIDE Gesichter sichtbar und zugewandt,
  // Studio erkennbar. Hatte bisher 1 Platzierung (nur im Foto-Archiv), bleibt mit dieser
  // zweiten also im Limit von verify-image-reuse.cjs.
  salsa: '/photos/kurse/kurs-01.jpg',
  bachata: '/photos/premium/offer-bachata-wide-v2.webp',
  heels: '/photos/premium/offer-heels-1200.webp',
  privat: '/photos/premium/offer-privat-wide-original-v2.webp',
};

export const HOME: { de: HomeStrings; en: HomeStrings } = {
  de: {
    nav: {
      tanzkurse: 'Tanzkurse',
      kursplan: 'Kursplan',
      events: 'Events',
      team: 'Team',
      fotos: 'Fotos',
      mehr: 'Mehr',
      kontakt: 'Kontakt',
      shows: 'Shows',
      faq: 'FAQ',
      collabs: 'Collabs',
      tanzschuhe: 'Tanzschuhe',
      partys: 'Partys',
      raumvermietung: 'Raumvermietung',
    },
    cta: { trial: 'Gratis Schnupperstunde', plan: 'Kursplan ansehen', book: 'Jetzt buchen' },
    hero: {
      eyebrow: 'Tanzschule direkt am Bahnhof Basel SBB',
      titleA: 'Salsa, Bachata &',
      titleAccent: 'Heels',
      titleB: 'tanzen in Basel.',
      lead: 'Starte bei Salsaflow mit einer Gratis Schnupperstunde, auch ohne Vorkenntnisse und ohne Tanzpartner. In drei Studios direkt am Bahnhof SBB lernst du in persönlicher Atmosphäre und mit einem klaren Kursaufbau.',
      claim: 'Bailar es vivir.',
      claimNote: 'Tanzen heisst leben.',
    },
    about: {
      eyebrow: 'Wer wir sind',
      title: 'Vier Freunde, eine Tanzfläche.',
      body: 'Wir sind vier Tänzerinnen und Tänzer aus Basel. 2018 haben wir Salsaflow gegründet, weil uns die steifen Tanzschulen fehlten. Heute sind wir drei Studios am Bahnhof Basel SBB mit rund 40 Kursen pro Woche. Bei uns lernst du tanzen und findest gleichzeitig neue Leute.',
      link: 'Lern uns kennen',
    },
    offer: {
      eyebrow: 'Unser Angebot',
      title: 'Welcher Tanz passt zu dir?',
      lead: 'Salsa, Bachata und Heels fühlen sich unterschiedlich an. Entdecke die Stile oder wähle Privatstunden, Workshops und Shows passend zu deinem Ziel.',
      cards: [
        { key: 'salsa', title: 'Salsa tanzen in Basel', hint: 'Beginner bis Advanced', text: 'Für alle, die Rhythmus, Technik und Social Dancing verbinden wollen. Von den ersten Basics bis zu fliessenden Kombinationen.', photo: offerPhotos.salsa, alt: 'Tanzpaar dreht sich beim Salsa im Salsaflow Studio', href: '/tanzkurse/salsa' },
        { key: 'bachata', title: 'Bachata mit Verbindung und Flow', hint: 'Bachata Sensual', text: 'Für weiche Bewegungen, Musikalität und Paartanz mit Gefühl. Ideal, wenn du Technik und Connection aufbauen willst.', photo: offerPhotos.bachata, alt: 'Bachata-Paar beim Üben', href: '/tanzkurse/bachata' },
        { key: 'heels', title: 'Heels für Ausdruck und Präsenz', hint: 'Haltung und Choreografie', text: 'Für alle, die sicherer, stärker und freier tanzen wollen. Technik, Haltung und Choreografie in einer unterstützenden Atmosphäre.', photo: offerPhotos.heels, alt: 'Heels-Class im Studio', href: '/tanzkurse/heels' },
        { key: 'privat', title: 'Privatstunden: gezielt besser werden', hint: '1:1 Coaching', text: 'Privatstunden passen, wenn du an Technik, Stil, Hochzeitstanz oder einem konkreten Ziel arbeiten möchtest.', photo: offerPhotos.privat, alt: 'Lehrerin begleitet einen Schüler in einer Privatstunde', href: '/privatstunden' },
      ],
      extras: [
        { key: 'gutschein', title: 'Geschenkgutschein', text: 'Verschenk Tanzen. Ein Gutschein für die Schnupperstunde, einen Kurs oder Privatstunden.', cta: 'Gutschein anfragen', href: '/kontakt', icon: 'gift' },
        { key: 'shows', title: 'Animationen & Shows', text: 'Wir bringen Tanz auf deine Bühne. Auftritte und Animation für Feste, Firmen und Events.', cta: 'Auftritt anfragen', href: '/kontakt', icon: 'show' },
      ],
    },
    schedule: {
      eyebrow: 'Kursplan & Buchung',
      title: 'Finde deinen nächsten Kurs in wenigen Minuten.',
      lead: 'Öffne den Kursplan, wähle Tanzstil und Level oder starte mit einer Gratis Schnupperstunde, wenn du unsicher bist.',
      all: 'Zum ganzen Kursplan',
      empty: 'Die nächste Staffel wird gerade geplant.',
      soonTitle: 'Bald geht es wieder los',
      soonText: 'Neue Kurse starten alle 8 Wochen. Schau in den Kursplan oder komm zur Schnupperstunde.',
    },
    events: {
      eyebrow: 'Events & Workshops',
      title: 'Lernen ist der Anfang. Tanzen passiert in der Community.',
      body: 'Bei der Danceflow Night triffst du Freunde, übst das Gelernte und tanzt in entspannter Atmosphäre. Vor ausgewählten Abenden finden Workshops statt.',
      cta: 'Alle Events ansehen',
    },
    community: {
      eyebrow: 'Unsere Community',
      title: 'Du gehörst sofort dazu.',
      body: 'Bei uns bucht niemand nur einen Kurs. Du wirst Teil einer Community, die zusammen übt, lacht und feiert. Komm allein, wir organisieren deinen Tanzpartner. Schau dir an, wie ein Abend bei Salsaflow aussieht.',
      google: 'Lies, was unsere Community auf Google sagt',
    },
    location: {
      eyebrow: 'Wo du uns findest',
      title: 'Drei Studios, mitten in',
      titleAccent: 'Basel.',
      body: 'Wir sind direkt am Bahnhof Basel SBB, an der Elisabethenanlage. In wenigen Minuten bist du da, egal ob du mit dem Zug oder dem Tram kommst.',
      studios: [
        { name: 'Studio 1', note: 'Kurse und Privatstunden', address: 'Elisabethenanlage 7, 4051 Basel' },
        { name: 'Studio 2', note: 'Kurse und Heels', address: 'Elisabethenanlage 7, 4051 Basel' },
        { name: 'Studio 3', note: 'Danceflow Nights', address: 'Elisabethenanlage 7, 4051 Basel' },
      ],
      contact: 'Schreib uns auf WhatsApp',
      phone: '+41 76 478 84 11',
    },
    news: {
      eyebrow: 'Aktuelles',
      title: 'Was als Nächstes ansteht.',
      all: 'Alle News',
      items: [
        { key: 'staffel', kicker: 'Neue Staffel', date: 'Alle 8 Wochen', title: 'Die nächsten Kurse starten bald', text: 'Quereinstieg ist möglich. Sichere dir früh deinen Platz im Kursplan.', photo: '/photos/kurse/kurs-07.jpg', alt: 'Fussarbeit auf dem Parkett beim Kurs', href: '/kursplan' },
        { key: 'night', kicker: 'Danceflow Night', date: '1., 3. und 5. Freitag', title: 'Frei tanzen am Freitag', text: 'Jeden 1., 3. und 5. Freitag tanzen wir frei zusammen. Eigene DJs und warme Stimmung für alle Levels.', photo: '/photos/events/event-07.jpg', alt: 'Lachende Frau im Dreh mit ihrem Partner', href: '/events' },
        { key: 'schnupper', kicker: 'Schnupperstunde', date: 'Jederzeit', title: 'Komm gratis vorbei', text: 'Probier eine Stunde aus, bevor du dich entscheidest. Ganz ohne Verpflichtung.', photo: '/photos/gallery/kurse/07.jpg', alt: 'Paar tanzt im Kurs, Gruppe im Hintergrund', href: '/kontakt#schnupperstunde' },
      ],
    },
    closing: {
      title: 'Dein erster Schritt muss nicht perfekt sein. Nur gebucht.',
      body: 'Starte mit einer Gratis Schnupperstunde und finde heraus, welcher Kurs, welches Level und welche Atmosphäre zu dir passen.',
      cta: 'Gratis Schnupperstunde buchen',
      secondary: 'Kursplan ansehen',
    },
    footer: {
      tagline: 'Tanzschule Basel für Salsa, Bachata und Heels. Werde Teil der Community.',
      claim: 'Bailar es vivir.',
      studiosTitle: 'Wo du uns findest',
      studios: '3 Studios am Bahnhof Basel SBB',
      contactTitle: 'Kontakt',
      discoverTitle: 'Entdecken',
      followTitle: 'Folg uns',
      rights: 'Salsaflow Dance Company Basel',
      legal: 'Salsaflow Dance Company GmbH, UID CHE-441.271.107',
      impressum: 'Impressum',
      datenschutz: 'Datenschutz',
    },
  },
  en: {
    nav: {
      tanzkurse: 'Classes',
      kursplan: 'Schedule',
      events: 'Events',
      team: 'Team',
      fotos: 'Photos',
      mehr: 'More',
      kontakt: 'Contact',
      shows: 'Shows',
      faq: 'FAQ',
      collabs: 'Collabs',
      tanzschuhe: 'Dance shoes',
      partys: 'Parties',
      raumvermietung: 'Room rental',
    },
    cta: { trial: 'Free trial class', plan: 'View schedule', book: 'Book now' },
    hero: {
      eyebrow: 'Dance school right at Basel SBB station',
      titleA: 'Salsa, Bachata &',
      titleAccent: 'Heels',
      titleB: 'in Basel.',
      lead: 'Start at Salsaflow with a free trial class, even without experience or a dance partner. In three studios right by Basel SBB, you learn in a welcoming atmosphere with a clear course structure.',
      claim: 'Bailar es vivir.',
      claimNote: 'To dance is to live.',
    },
    about: {
      eyebrow: 'Who we are',
      title: 'Four friends, one dance floor.',
      body: 'We are four dancers from Basel. In 2018 we founded Salsaflow because the stiff dance schools were not for us. Today we are three studios at Basel SBB station with around 40 classes a week. Here you learn to dance and meet new people at the same time.',
      link: 'Get to know us',
    },
    offer: {
      eyebrow: 'What we offer',
      title: 'Which dance style suits you?',
      lead: 'Salsa, Bachata and Heels each feel different. Explore the styles or choose private lessons, workshops and shows based on your goal.',
      cards: [
        { key: 'salsa', title: 'Dance Salsa in Basel', hint: 'Beginner to advanced', text: 'For everyone who wants to connect rhythm, technique and social dancing. From the first basics to flowing combinations.', photo: offerPhotos.salsa, alt: 'Dance couple turning while dancing salsa at the Salsaflow studio', href: '/tanzkurse/salsa' },
        { key: 'bachata', title: 'Bachata with connection and flow', hint: 'Bachata Sensual', text: 'For soft movement, musicality and partner dancing with feeling. Ideal if you want to build technique and connection.', photo: offerPhotos.bachata, alt: 'Bachata couple practising', href: '/tanzkurse/bachata' },
        { key: 'heels', title: 'Heels for expression and presence', hint: 'Posture and choreography', text: 'For everyone who wants to dance with more confidence, strength and freedom. Technique, posture and choreography in a supportive atmosphere.', photo: offerPhotos.heels, alt: 'Heels class in the studio', href: '/tanzkurse/heels' },
        { key: 'privat', title: 'Private lessons for a specific goal', hint: '1:1 coaching', text: 'Private lessons are useful when you want to work on technique, style, a wedding dance or another specific goal.', photo: offerPhotos.privat, alt: 'Teacher giving a private lesson', href: '/privatstunden' },
      ],
      extras: [
        { key: 'gutschein', title: 'Gift voucher', text: 'Give the gift of dance. A voucher for a trial class, a course or private lessons.', cta: 'Request a voucher', href: '/kontakt', icon: 'gift' },
        { key: 'shows', title: 'Shows & animation', text: 'We bring dance to your stage. Performances and animation for parties, companies and events.', cta: 'Request a show', href: '/kontakt', icon: 'show' },
      ],
    },
    schedule: {
      eyebrow: 'Course schedule & booking',
      title: 'Find your next course in just a few minutes.',
      lead: 'Open the schedule, choose a dance style and level or start with a free trial class if you are unsure.',
      all: 'See the full schedule',
      empty: 'The next course block is being planned.',
      soonTitle: 'New courses coming soon',
      soonText: 'New courses start every 8 weeks. Check the schedule or join a trial class.',
    },
    events: {
      eyebrow: 'Events & workshops',
      title: 'Learning is the beginning. Dancing happens in the community.',
      body: 'At the Danceflow Night you meet friends, practise what you learned and dance in a relaxed atmosphere. Workshops take place before selected evenings.',
      cta: 'See all events',
    },
    community: {
      eyebrow: 'Our community',
      title: 'You belong from day one.',
      body: 'Nobody just books a class with us. You become part of a community that practises, laughs and celebrates together. Come on your own, we organise your dance partner. See what an evening at Salsaflow looks like.',
      google: 'Read what our community says on Google',
    },
    location: {
      eyebrow: 'Where to find us',
      title: 'Three studios, right in',
      titleAccent: 'Basel.',
      body: 'We are right at Basel SBB station, on Elisabethenanlage. You are there in a few minutes, whether you come by train or by tram.',
      studios: [
        { name: 'Studio 1', note: 'Courses and private lessons', address: 'Elisabethenanlage 7, 4051 Basel' },
        { name: 'Studio 2', note: 'Courses and heels', address: 'Elisabethenanlage 7, 4051 Basel' },
        { name: 'Studio 3', note: 'Danceflow Nights', address: 'Elisabethenanlage 7, 4051 Basel' },
      ],
      contact: 'Message us on WhatsApp',
      phone: '+41 76 478 84 11',
    },
    news: {
      eyebrow: 'News',
      title: 'What is coming up next.',
      all: 'All news',
      items: [
        { key: 'staffel', kicker: 'New course block', date: 'Every 8 weeks', title: 'The next courses start soon', text: 'Late entry may be possible. Check the schedule for available places.', photo: '/photos/kurse/kurs-07.jpg', alt: 'Footwork on the dance floor in class', href: '/kursplan' },
        { key: 'night', kicker: 'Danceflow Night', date: '1st, 3rd and 5th Friday', title: 'Free dancing on Friday', text: 'Every 1st, 3rd and 5th Friday we dance freely together. Our own DJs and a warm vibe for all levels.', photo: '/photos/events/event-07.jpg', alt: 'Laughing woman spinning with her partner', href: '/events' },
        { key: 'schnupper', kicker: 'Trial class', date: 'Anytime', title: 'Drop by for free', text: 'Try a class before you decide. No strings attached.', photo: '/photos/gallery/kurse/07.jpg', alt: 'Couple dancing in class, group in the background', href: '/kontakt#schnupperstunde' },
      ],
    },
    closing: {
      title: 'Your first step does not have to be perfect. Just booked.',
      body: 'Start with a free trial class and find out which course, which level and which atmosphere fit you.',
      cta: 'Book a free trial class',
      secondary: 'View schedule',
    },
    footer: {
      tagline: 'Dance school in Basel for Salsa, Bachata and Heels. Become part of the community.',
      claim: 'Bailar es vivir.',
      studiosTitle: 'Where to find us',
      studios: '3 studios at Basel SBB station',
      contactTitle: 'Contact',
      discoverTitle: 'Discover',
      followTitle: 'Follow us',
      rights: 'Salsaflow Dance Company Basel',
      legal: 'Salsaflow Dance Company GmbH, UID CHE-441.271.107',
      impressum: 'Imprint',
      datenschutz: 'Privacy',
    },
  },
};
