import { StrictMode, Suspense } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
import { LangProvider } from '@/lib/i18n';
import { SmoothScroll } from '@/public/site/SmoothScroll';
import { resolveRoute } from '@/routes';

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
