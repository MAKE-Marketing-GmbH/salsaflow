import { StrictMode, Suspense } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
import { LangProvider } from '@/lib/i18n';
import { SmoothScroll } from '@/public/site/SmoothScroll';
import { resolveRoute } from '@/routes';
import type { ScheduleResponse } from '@/lib/schedule';
// Dev-Startwert des Kursplans (scripts/dev-schedule-global.mjs). Im Prerender-Build
// traegt das HTML den schedule-data-Tag; im Dev setzt diese Zeile denselben Plan als
// globale, BEVOR irgendeine Komponente rendert — embeddedSchedule() findet ihn dann.
import { embeddedScheduleData } from '@/generated/schedule-embedded';

// Vites Dev-HTML enthaelt nur ein leeres #root. Damit fehlt beim dokumentuebergreifenden
// Capture der neue Header noch, waehrend der prerendered Production-Build ihn bereits
// ausliefert. Im Dev uebernimmt deshalb der live CSS-Mount-Fallback aus index.css, und der
// Browser startet gar nicht erst einen Cross-Document-Uebergang ohne neuen Snapshot.
if (import.meta.env.DEV && !document.querySelector('#sf-dev-view-transition')) {
  const style = document.createElement('style');
  style.id = 'sf-dev-view-transition';
  style.textContent = '@view-transition { navigation: none; }';
  document.head.append(style);
}

// SAFETY: Erweitert globalThis nur um das eine optionale Feld, das embeddedSchedule()
// in src/lib/schedule.ts unter genau diesem Namen wieder liest — dieselbe Struktur
// wie dort in ScheduleScope dokumentiert.
(globalThis as { __EMBEDDED_SCHEDULE__?: ScheduleResponse }).__EMBEDDED_SCHEDULE__ ??=
  embeddedScheduleData;

const route = resolveRoute(window.location.pathname);

if (route.redirectTo) {
  window.location.replace(route.redirectTo + window.location.search + window.location.hash);
} else {
  const Matched = route.component;
  const view = (
    <StrictMode>
      <LangProvider>
        <SmoothScroll />
        {/* Suspense nur fuer die lazy Admin-Route (routes.tsx); erzeugt kein DOM und
            stoert die Hydration der prerenderten Seiten nicht. */}
        <Suspense fallback={null}>
          <Matched />
        </Suspense>
      </LangProvider>
    </StrictMode>
  );
  const root = document.getElementById('root');

  if (!root) {
    throw new Error('Root-Element fehlt.');
  }

  if (root.dataset.prerendered === 'true' && root.hasChildNodes()) {
    hydrateRoot(root, view);
  } else {
    createRoot(root).render(view);
  }
}
