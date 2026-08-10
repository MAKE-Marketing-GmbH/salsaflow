// Impressum-Seite (Etappe 15) unter /impressum. Inhalt + Recht in legal/content.ts.
// Teilt das ruhige Lese-Layout mit der Datenschutz-Seite ueber LegalView.
import { LegalView } from '@/public/legal/LegalView';
import { IMPRESSUM } from '@/public/legal/content';

export function ImpressumPage() {
  return <LegalView doc={IMPRESSUM} seoKey="impressum" />;
}
