// Rechtstexte (Etappe 15): Impressum + Datenschutzerklaerung, zweisprachig DE/EN.
// Copy-Regeln 003/069/085: simpel, du-Form, echte Umlaute (ä/ö/ü, kein ae/oe/ue), CH-ss (kein
// Eszett, Schweiz), keine Em-Dashes. Die Datenschutzerklaerung beschreibt die TATSAECHLICHEN
// Datenfluesse der Seite (Quellen: ARCHITEKTUR.md, DECISIONS Etappe 8/9/14): Kontaktformular ->
// Mail an info@, Buchung -> Postgres/Supabase (EU/Frankfurt), Zahlung -> Stripe, Mailversand ->
// Resend, Hosting -> Vercel, localStorage -> Sprache und Cookie-Hinweis (kein Analytics).
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

export const IMPRESSUM: Record<Lang, LegalDoc> = {
  de: {
    pageTitle: 'Impressum',
    intro: 'Angaben zur Betreiberin dieser Website.',
    lastUpdated: 'Stand: Juli 2026',
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
};

export const DATENSCHUTZ: Record<Lang, LegalDoc> = {
  de: {
    pageTitle: 'Datenschutzerklärung',
    intro:
      'Wir nehmen den Schutz deiner Daten ernst. Hier erklären wir einfach, welche Daten wir erheben, wofür wir sie nutzen und welche Rechte du hast. Es gilt das Schweizer Datenschutzgesetz (revDSG); für Besucher aus der EU zusätzlich die DSGVO.',
    lastUpdated: 'Stand: Juli 2026',
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
          'Wir nutzen diese Daten nur, um deine Anfrage zu beantworten. Die Nachricht wird als E-Mail an info@salsaflow-dc.com gesendet. Wir speichern dazu keine Daten in einer öffentlichen Datenbank.',
        ],
      },
      {
        title: 'Kursbuchung',
        body: [
          'Wenn du einen Kurs buchst, verarbeiten wir Vor- und Nachname, E-Mail, Telefonnummer, deine Rollenwahl (Leader/Follower), den Tarif und bei einer Paar-Anmeldung die Daten deiner Tanzpartnerin oder deines Tanzpartners.',
          'Wir brauchen diese Daten, um deinen Kursplatz zu verwalten, dich zu kontaktieren und die Anmeldung zu bestätigen. Rechtsgrundlage ist die Vertragserfüllung.',
        ],
      },
      {
        title: 'Zahlung',
        body: [
          'Die Zahlung läuft über den Zahlungsdienstleister Stripe (TWINT, Kredit- und Debitkarte). Deine Zahlungsdaten gibst du direkt auf der sicheren Bezahlseite von Stripe ein.',
          'Wir sehen keine vollständigen Kartendaten. Wir erhalten nur die Bestätigung, ob die Zahlung erfolgreich war, plus einen Beleg-Verweis. Stripe kann Daten auch ausserhalb der Schweiz/EU bearbeiten; die Übermittlung ist durch Standardvertragsklauseln abgesichert.',
        ],
      },
      {
        title: 'Bestätigungs-E-Mails',
        body: [
          'Für Buchungs- und Zahlungsbestätigungen sowie für Kontakt-Anfragen versenden wir E-Mails über den Dienstleister Resend. Dabei werden deine angegebenen Kontaktdaten und der Inhalt der jeweiligen Nachricht verarbeitet.',
        ],
      },
      {
        title: 'Hosting und Datenbank',
        body: [
          'Diese Website wird bei Vercel gehostet. Beim Aufruf entstehen technische Server-Protokolle (zum Beispiel IP-Adresse, Datum, aufgerufene Seite), die dem Betrieb und der Sicherheit dienen.',
          'Buchungsdaten speichern wir in einer Datenbank (Supabase) mit Serverstandort in der EU (Frankfurt).',
        ],
      },
      {
        title: 'Cookies und Tracking',
        body: [
          'Wir setzen keine Tracking-Cookies und kein Webanalyse-Werkzeug wie Google Analytics ein.',
          'Wir speichern zwei technische Einstellungen in deinem Browser (localStorage): deine gewählte Sprache und ob du den Cookie-Hinweis bestätigt hast. Diese Einstellungen verlassen deinen Browser nicht.',
        ],
      },
      {
        title: 'Externe Links und Dienste',
        body: [
          'Für den Ticketverkauf zu Events verlinken wir auf Eventfrog. Ausserdem verlinken wir auf Instagram, WhatsApp und Google. Wenn du diese Links öffnest, gelten die Datenschutzbestimmungen des jeweiligen Anbieters.',
          'Instagram-Videos laden erst, wenn du das jeweilige Video aktiv anklickst. Dann wird eine Verbindung zu Instagram beziehungsweise Meta aufgebaut. Dabei können technische Daten wie deine IP-Adresse übertragen und Cookies oder ähnliche Technologien eingesetzt werden.',
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
    lastUpdated: 'Last updated: July 2026',
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
          'We use this data only to answer your request. The message is sent as an email to info@salsaflow-dc.com. We do not store this data in any public database.',
        ],
      },
      {
        title: 'Course booking',
        body: [
          'When you book a course, we process your first and last name, email, phone number, your role (leader/follower), the tariff and, for a couple booking, the details of your dance partner.',
          'We need this data to manage your spot, contact you and confirm your registration. The legal basis is the performance of a contract.',
        ],
      },
      {
        title: 'Payment',
        body: [
          'Payments are handled by the payment provider Stripe (TWINT, credit and debit card). You enter your payment details directly on the secure Stripe payment page.',
          'We never see full card details. We only receive a confirmation of whether the payment succeeded plus a receipt reference. Stripe may process data outside Switzerland/the EU; the transfer is safeguarded by standard contractual clauses.',
        ],
      },
      {
        title: 'Confirmation emails',
        body: [
          'For booking and payment confirmations and for contact requests, we send emails through the provider Resend. This processes the contact details you provide and the content of the respective message.',
        ],
      },
      {
        title: 'Hosting and database',
        body: [
          'This website is hosted by Vercel. When you access the site, technical server logs are created (for example IP address, date, page requested) that serve operation and security.',
          'Booking data is stored in a database (Supabase) with a server location in the EU (Frankfurt).',
        ],
      },
      {
        title: 'Cookies and tracking',
        body: [
          'We do not use any tracking cookies and no web analytics tool such as Google Analytics.',
          'We store two technical settings in your browser (localStorage): your chosen language and whether you acknowledged the cookie notice. These settings do not leave your browser.',
        ],
      },
      {
        title: 'External links and services',
        body: [
          'For event ticket sales we link to Eventfrog. We also link to Instagram, WhatsApp and Google. When you open these links, the privacy terms of the respective provider apply.',
          'Instagram videos load only after you actively click the respective video. This establishes a connection to Instagram or Meta. Technical data such as your IP address may be transferred, and cookies or similar technologies may be used.',
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
};
