// Datenschutz-Seite (Etappe 15) unter /datenschutz. Inhalt + Recht in legal/content.ts.
import { LegalView } from '@/public/legal/LegalView';
import { DATENSCHUTZ } from '@/public/legal/content';

export function DatenschutzPage() {
  return <LegalView doc={DATENSCHUTZ} seoKey="datenschutz" />;
}
