// Route-Wrapper der drei Stilseiten. Salsa + Bachata teilen sich das StylePage-Template
// (styles/content.ts). Heels hat einen eigenen Plan-Rhythmus und damit eine eigene View
// (HeelsView.tsx), rendert aber im gleichen Design-System.
import { StylePage } from '@/public/courses/styles/StylePage';
import { STYLE_CONTENT } from '@/public/courses/styles/content';
import { HeelsPage as HeelsView } from '@/public/courses/styles/HeelsView';

export function SalsaPage() {
  return <StylePage data={STYLE_CONTENT.salsa} />;
}
export function BachataPage() {
  return <StylePage data={STYLE_CONTENT.bachata} />;
}
export function HeelsPage() {
  return <HeelsView />;
}
