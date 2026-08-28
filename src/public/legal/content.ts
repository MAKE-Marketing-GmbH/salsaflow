// Rechtstexte (Etappe 15): Impressum + Datenschutzerklaerung, zweisprachig DE/EN.
// Copy-Regeln 003/069/085: simpel, du-Form, echte Umlaute (ä/ö/ü, kein ae/oe/ue), CH-ss (kein
// Eszett, Schweiz), keine Em-Dashes. Die Datenschutzerklaerung beschreibt die TATSAECHLICHEN
// Datenfluesse der Seite: Kontaktformular und Reservierung gehen per Resend als Mail an das
// Studio; der oeffentliche Funnel speichert sie nicht in der Redaktionsdatenbank und nimmt
// keine Online-Zahlung an. Das geschuetzte Redaktionssystem darf Kurs- und Event-Stammdaten
// in einer Datenbank halten. Hosting -> Vercel, localStorage -> Sprache und Cookie-Hinweis
// (kein Analytics). Konkrete Anbieter- oder Standortzusagen werden nur genannt, wenn der
// ausgelieferte Runtime-Vertrag sie belegt.
//
// Rechtsname, Adresse, Vertretung und UID stammen aus CONTENT-SPEC und Business-Reality.
// Ein MWST-Status wird nicht behauptet, weil dafuer kein Beleg vorliegt.

import type { Lang } from '@/lib/i18n';

export type LegalSection = { title: string; body: string[] };
export type LegalDoc = {
  pageTitle: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export const IMPRESSUM = {
  de: {
    pageTitle: 'Impressum',
    intro: 'Angaben zur Betreiberin dieser Website.',
    lastUpdated: 'Stand: August 2026',
    sections: [
      {
        title: 'Betreiberin',
        body: [
          'Salsaflow Dance Company GmbH',
          'Elisabethenanlage 7',
          '4051 Basel, Schweiz',
        ],
      },
      {
        title: 'Kontakt',
        body: [
          'E-Mail: info@salsaflow-dc.com',
          'Telefon: +41 76 478 84 11',
          'Instagram: @salsaflowdc',
        ],
      },
      {
        title: 'Vertretungsberechtigte Personen',
        body: [
          'Fábio Couteiro Branco',
          'Cláudia Barradas Branco',
          'Sebastian Carballo Gonzalez',
          'Vanessa Carballo-Costante',
        ],
      },
      {
        title: 'Handelsregister',
        body: ['Handelsregister-Nr.: CH-270.4.009.120-3', 'UID: CHE-441.271.107'],
      },
      {
        title: 'Haftung für Inhalte',
        body: [
          'Wir erstellen die Inhalte dieser Seite mit Sorgfalt. Für Richtigkeit, Vollständigkeit und Aktualität können wir aber keine Gewähr übernehmen.',
          'Für Inhalte auf verlinkten externen Seiten sind die jeweiligen Anbieter verantwortlich. Beim Verlinken haben wir diese Seiten auf rechtswidrige Inhalte geprüft.',
        ],
      },
      {
        title: 'Urheberrecht',
        body: [
          'Die Texte, Fotos und Grafiken auf dieser Seite gehören der Salsaflow Dance Company oder werden mit Erlaubnis genutzt. Eine Weiterverwendung braucht unsere schriftliche Zustimmung.',
        ],
      },
    ],
  },
  en: {
    pageTitle: 'Imprint',
    intro: 'Information about the operator of this website.',
    lastUpdated: 'Last updated: July 2026',
    sections: [
      {
        title: 'Operator',
        body: [
          'Salsaflow Dance Company GmbH',
          'Elisabethenanlage 7',
          '4051 Basel, Switzerland',
        ],
      },
      {
        title: 'Contact',
        body: [
          'Email: info@salsaflow-dc.com',
          'Phone: +41 76 478 84 11',
          'Instagram: @salsaflowdc',
        ],
      },
      {
        title: 'Authorised representatives',
        body: [
          'Fábio Couteiro Branco',
          'Cláudia Barradas Branco',
          'Sebastian Carballo Gonzalez',
          'Vanessa Carballo-Costante',
        ],
      },
      {
        title: 'Commercial register',
        body: ['Commercial register no.: CH-270.4.009.120-3', 'UID: CHE-441.271.107'],
      },
      {
        title: 'Liability for content',
        body: [
          'We create the content of this site with care. However, we cannot guarantee that it is correct, complete or always up to date.',
          'The respective providers are responsible for the content of linked external sites. We checked these sites for unlawful content when we linked them.',
        ],
      },
      {
        title: 'Copyright',
        body: [
          'The texts, photos and graphics on this site belong to Salsaflow Dance Company or are used with permission. Any reuse needs our written consent.',
        ],
      },
    ],
  },
} satisfies Record<Lang, LegalDoc>;

export const DATENSCHUTZ = {
  de: {
    pageTitle: 'Datenschutzerklärung',
    intro:
      'Wir nehmen den Schutz deiner Daten ernst. Hier erklären wir einfach, welche Daten wir erheben, wofür wir sie nutzen und welche Rechte du hast. Es gilt das Schweizer Datenschutzgesetz (revDSG); für Besucher aus der EU zusätzlich die DSGVO.',
    lastUpdated: 'Stand: August 2026',
    sections: [
      {
        title: 'Verantwortliche Stelle',
        body: [
          'Verantwortlich für die Datenbearbeitung ist die Salsaflow Dance Company GmbH, Elisabethenanlage 7, 4051 Basel.',
          'Bei Fragen zum Datenschutz schreib uns an info@salsaflow-dc.com.',
        ],
      },
      {
        title: 'Kontaktformular',
        body: [
          'Wenn du ein Kontaktformular nutzt, verarbeiten wir deinen Namen, deine Nachricht, dein Anliegen sowie je nach Formular deine E-Mail-Adresse oder Telefonnummer.',
          'Wir nutzen diese Daten nur, um deine Anfrage zu beantworten. Die Nachricht wird über Resend als E-Mail an info@salsaflow-dc.com gesendet und nicht in der Redaktionsdatenbank gespeichert.',
        ],
      },
      {
        title: 'Kursreservierung',
        body: [
          'Wenn du einen Kursplatz reservierst, verarbeiten wir Vor- und Nachname, E-Mail, Telefonnummer, deine Rollenwahl (Leader/Follower) und bei einer Anmeldung zu zweit die Daten deiner Tanzpartnerin oder deines Tanzpartners.',
          'Deine Reservierung wird über Resend als E-Mail an das Studio gesendet und nicht in der Redaktionsdatenbank gespeichert. Wir brauchen die Daten, um den Platz zu prüfen, dich zu erreichen und die Reservierung zu bestätigen. Rechtsgrundlage ist unser berechtigtes Interesse, deine Anfrage zu beantworten.',
        ],
      },
      {
        title: 'Zahlung',
        body: [
          'Über diese Website läuft keine Zahlung. Du reservierst nur deinen Platz; bezahlt wird vor Ort im Studio, mit Twint oder bar.',
          'Wir erheben deshalb keine Zahlungsdaten und geben keine an einen Zahlungsdienstleister weiter.',
        ],
      },
      {
        title: 'Bestätigungs-E-Mails',
        body: [
          'Für Reservierungsbestätigungen und Kontakt-Anfragen versenden wir E-Mails über den Dienstleister Resend. Dabei werden deine angegebenen Kontaktdaten und der Inhalt der jeweiligen Nachricht verarbeitet.',
        ],
      },
      {
        title: 'Hosting und Datenbank',
        body: [
          'Diese Website wird bei Vercel gehostet. Beim Aufruf entstehen technische Server-Protokolle (zum Beispiel IP-Adresse, Datum, aufgerufene Seite), die dem Betrieb und der Sicherheit dienen.',
          'Das geschützte Redaktionssystem kann eine Datenbank für Kurs-, Event- und Administrationsdaten verwenden. Inhalte aus Kontaktformularen und Reservierungen werden dort nicht gespeichert; sie erreichen uns als E-Mail und liegen danach in unserem Postfach.',
        ],
      },
      {
        title: 'Cookies und Tracking',
        body: [
          'Wir setzen keine Tracking-Cookies und kein Webanalyse-Werkzeug wie Google Analytics ein.',
          'Wir speichern technische Einstellungen in deinem Browser (localStorage und sessionStorage) — und zwar erst, wenn du etwas tust, nicht schon beim Aufrufen der Seite: deine Auswahl im Cookie-Hinweis (also auch, ob du Google Maps erlaubt hast), deine gewählte Sprache, sobald du sie umstellst, und während einer Buchung deine bereits ausgefüllten Angaben bis zum nächsten Schritt. Diese Einstellungen verlassen deinen Browser nicht.',
          'Im Cookie-Hinweis kannst du über «Einstellungen» einzeln festlegen, was du erlaubst. Notwendige Einstellungen lassen sich nicht abwählen, weil die Seite ohne sie nicht funktioniert. Deine Wahl kannst du jederzeit ändern, indem du die Website-Daten in deinem Browser löschst.',
        ],
      },
      {
        title: 'Externe Links und Dienste',
        body: [
          'Für den Ticketverkauf zu Events verlinken wir auf Eventfrog. Ausserdem verlinken wir auf Instagram, WhatsApp und Google. Wenn du diese Links öffnest, gelten die Datenschutzbestimmungen des jeweiligen Anbieters.',
          'Das Hero-Video wird direkt von unserer Website ausgeliefert und baut keine Verbindung zu Instagram oder Meta auf. Eingebettete Instagram-Videos laden erst, wenn du das jeweilige Video aktiv anklickst. Dann können technische Daten wie deine IP-Adresse übertragen und Cookies oder ähnliche Technologien eingesetzt werden.',
          'Auf Seiten mit unserer Karte (Startseite und Standort) laden wir die Google-Maps-Karte erst, wenn du zugestimmt hast. Ohne deine Zustimmung wird die Karte nicht eingebettet und dein Browser baut keine Verbindung zu Google auf; an ihrer Stelle siehst du einen Hinweis mit der Schaltfläche «Karte laden». Sobald du zustimmst — im Cookie-Hinweis unter «Einstellungen» oder direkt an der Karte — werden technische Daten wie deine IP-Adresse an Google übertragen, und Google kann Cookies oder ähnliche Technologien einsetzen. Es gelten die Datenschutzbestimmungen von Google. Ohne Einbettung kannst du die Anfahrt auch über einen normalen Link bei Google öffnen.',
        ],
      },
      {
        title: 'Aufbewahrung',
        body: [
          'Wir bewahren deine Daten nur so lange auf, wie wir sie für den genannten Zweck brauchen oder wie es das Gesetz verlangt (zum Beispiel Aufbewahrungsfristen für Belege).',
        ],
      },
      {
        title: 'Deine Rechte',
        body: [
          'Du hast das Recht auf Auskunft, Berichtigung und Löschung deiner Daten sowie auf Einschränkung und Widerspruch der Bearbeitung.',
          'Schreib uns dafür an info@salsaflow-dc.com. Du hast ausserdem das Recht, dich bei der zuständigen Datenschutzbehörde zu beschweren.',
        ],
      },
      {
        title: 'Änderungen',
        body: [
          'Wir können diese Datenschutzerklärung anpassen, wenn sich die Seite oder die rechtlichen Vorgaben ändern. Es gilt jeweils die hier veröffentlichte Fassung.',
        ],
      },
    ],
  },
  en: {
    pageTitle: 'Privacy policy',
    intro:
      'We take the protection of your data seriously. Here we explain in plain words which data we collect, what we use it for and which rights you have. The Swiss Data Protection Act (revDSG) applies; for visitors from the EU the GDPR applies as well.',
    lastUpdated: 'Last updated: August 2026',
    sections: [
      {
        title: 'Controller',
        body: [
          'Salsaflow Dance Company GmbH, Elisabethenanlage 7, 4051 Basel, is responsible for data processing on this site.',
          'For any privacy questions, write to us at info@salsaflow-dc.com.',
        ],
      },
      {
        title: 'Contact form',
        body: [
          'When you use a contact form, we process your name, message, topic and, depending on the form, your email address or phone number.',
          'We use this data only to answer your request. The message is sent through Resend to info@salsaflow-dc.com and is not stored in the editorial database.',
        ],
      },
      {
        title: 'Course reservation',
        body: [
          'When you reserve a spot, we process your first and last name, email, phone number, your role (leader/follower) and, if you sign up as a pair, the details of your dance partner.',
          'Your reservation is sent through Resend to the studio and is not stored in the editorial database. We need the data to check the spot, get in touch and confirm the reservation. The legal basis is our legitimate interest in answering your request.',
        ],
      },
      {
        title: 'Payment',
        body: [
          'No payment runs through this website. You only reserve your spot; you pay on site at the studio, by TWINT or cash.',
          'We therefore collect no payment data and pass none on to a payment provider.',
        ],
      },
      {
        title: 'Confirmation emails',
        body: [
          'For reservation confirmations and contact requests, we send emails through the provider Resend. This processes the contact details you provide and the content of the respective message.',
        ],
      },
      {
        title: 'Hosting and database',
        body: [
          'This website is hosted by Vercel. When you access the site, technical server logs are created (for example IP address, date, page requested) that serve operation and security.',
          'The protected editorial system may use a database for course, event and administration data. Contact-form and reservation content is not stored there; it reaches us by email and then remains in our mailbox.',
        ],
      },
      {
        title: 'Cookies and tracking',
        body: [
          'We do not use any tracking cookies and no web analytics tool such as Google Analytics.',
          'We store technical settings in your browser (localStorage and sessionStorage) — and only once you do something, not merely by opening the page: your choice in the cookie notice (including whether you allowed Google Maps), your chosen language as soon as you switch it, and during a booking the details you already entered until the next step. These settings do not leave your browser.',
          'In the cookie notice you can use «Settings» to decide individually what you allow. Necessary settings cannot be switched off because the site does not work without them. You can change your choice at any time by clearing this site\'s data in your browser.',
        ],
      },
      {
        title: 'External links and services',
        body: [
          'For event ticket sales we link to Eventfrog. We also link to Instagram, WhatsApp and Google. When you open these links, the privacy terms of the respective provider apply.',
          'The hero video is delivered directly by our website and does not connect to Instagram or Meta. Embedded Instagram videos load only after you actively click them. Technical data such as your IP address may then be transferred, and cookies or similar technologies may be used.',
          'On pages that show our map (home page and location page) the Google Maps map only loads once you have agreed. Without your consent the map is not embedded and your browser does not connect to Google; instead you see a notice with a «Load map» button. As soon as you agree — in the cookie notice under «Settings» or directly at the map — technical data such as your IP address is transferred to Google, and Google may use cookies or similar technologies. Google\'s privacy terms apply. Without the embed you can also open the directions through a normal link at Google.',
        ],
      },
      {
        title: 'Retention',
        body: [
          'We keep your data only as long as we need it for the stated purpose or as required by law (for example retention periods for receipts).',
        ],
      },
      {
        title: 'Your rights',
        body: [
          'You have the right to access, correct and delete your data, as well as to restrict and object to its processing.',
          'To exercise these rights, write to us at info@salsaflow-dc.com. You also have the right to lodge a complaint with the competent data protection authority.',
        ],
      },
      {
        title: 'Changes',
        body: [
          'We may adapt this privacy policy when the site or the legal requirements change. The version published here always applies.',
        ],
      },
    ],
  },
} satisfies Record<Lang, LegalDoc>;
