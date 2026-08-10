// Auto-Aufstiegs-Logik (ARCHITEKTUR.md Abschnitt 3.4), als reine Funktion -> einzeln testbar.
// Beim "Staffel duplizieren" steigt jeder Kurs genau EINE Stufe hoch (ordinal + 1).
// Daten-getrieben ueber level_rungs.ordinal; Code muss nicht angefasst werden, wenn der Kunde
// die Kategorie-Grenzen aendert (nur die level_rungs-Daten).

export type LevelCat = 'beginner' | 'intermediate' | 'advanced' | 'open' | 'heels';

export type Rung = {
  id: string;
  ladderKey: string;
  ordinal: number;
  category: LevelCat;
  stufe: number | null;
  isFlow: boolean;
  isOpenEnded: boolean;
  labelDe: string;
  labelEn: string;
};

// Eine noch nicht existierende Advanced-Stufe (nach oben offen). Wird beim Commit angelegt.
export type NewRungDef = {
  ladderKey: string;
  ordinal: number;
  category: 'advanced';
  stufe: number;
  isFlow: boolean;
  isOpenEnded: true;
  labelDe: string;
  labelEn: string;
};

export type Promotion =
  | { kind: 'null' } //                       Kurs ohne Level (Open-Workshop) -> bleibt ohne Level
  | { kind: 'same'; rung: Rung } //           kein Aufstieg (Open, Heels-Advanced, Advanced-Flow ohne Nr.)
  | { kind: 'existing'; rung: Rung } //       normaler Schritt auf eine vorhandene Rung
  | { kind: 'new'; def: NewRungDef }; //      Advanced nach oben offen -> neue Stufe anlegen

function advancedLabels(stufe: number): { labelDe: string; labelEn: string } {
  return { labelDe: `Advanced Stufe ${stufe}`, labelEn: `Advanced Level ${stufe}` };
}

/**
 * Bestimmt das Ziel-Level eines Kurses beim Duplizieren der Staffel.
 * @param current  aktuelle Rung des Kurses (oder null)
 * @param rungs    alle level_rungs (mindestens die der betroffenen Leiter)
 */
export function promote(current: Rung | null, rungs: Rung[]): Promotion {
  if (!current) return { kind: 'null' };
  // Open-Leiter und Spezialstile steigen nie automatisch auf.
  if (current.ladderKey === 'open') return { kind: 'same', rung: current };

  const next = rungs.find(
    (r) => r.ladderKey === current.ladderKey && r.ordinal === current.ordinal + 1,
  );
  if (next) return { kind: 'existing', rung: next };

  // Kein naechster Eintrag vorhanden: Advanced nummeriert + nach oben offen -> neue Stufe.
  if (current.isOpenEnded && current.stufe !== null) {
    const stufe = current.stufe + 1;
    return {
      kind: 'new',
      def: {
        ladderKey: current.ladderKey,
        ordinal: current.ordinal + 1,
        category: 'advanced',
        stufe,
        isFlow: current.isFlow, // Flow-Charakter bleibt erhalten (z.B. Advanced Flow)
        isOpenEnded: true,
        ...advancedLabels(stufe),
      },
    };
  }

  // Ende einer endlichen Leiter (Heels Advanced) ODER Advanced-Flow ohne Nummer -> bleibt.
  return { kind: 'same', rung: current };
}

// Das voraussichtliche Ziel-Label fuer die Vorschau (DE/EN), ohne etwas anzulegen.
export function promotionLabel(p: Promotion, lang: 'de' | 'en' = 'de'): string | null {
  switch (p.kind) {
    case 'null':
      return null;
    case 'same':
      return lang === 'de' ? p.rung.labelDe : p.rung.labelEn;
    case 'existing':
      return lang === 'de' ? p.rung.labelDe : p.rung.labelEn;
    case 'new':
      return lang === 'de' ? p.def.labelDe : p.def.labelEn;
  }
}
