import { useId, useState } from 'react';
import { LoaderCircle, MapPin } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export function GoogleMapEmbed({
  title,
  src,
  className,
}: {
  title: string;
  src: string;
  className: string;
}) {
  const { lang } = useLang();
  const [consented, setConsented] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const disclosureId = useId();

  if (consented) {
    return (
      <div className={`${className} overflow-hidden bg-[var(--color-bg-soft)]`}>
        <iframe
          data-google-map-iframe
          title={title}
          src={src}
          onLoad={() => setMapReady(true)}
          className={`absolute inset-0 h-full w-full border-0 motion-safe:transition-opacity motion-safe:duration-300 ${mapReady ? 'opacity-100' : 'opacity-0'}`}
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
        {!mapReady ? (
          <div
            data-google-map-loading
            role="status"
            className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-soft)] p-5 text-center text-[var(--color-ink)]"
          >
            <div>
              <LoaderCircle
                size={28}
                strokeWidth={1.75}
                aria-hidden
                className="mx-auto animate-spin text-[var(--color-salsa)] motion-reduce:animate-none"
              />
              <p className="mt-3 text-sm font-semibold">
                {lang === 'de' ? 'Google Maps wird geladen …' : 'Google Maps is loading …'}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      data-google-map-placeholder
      className={`${className} flex items-center justify-center bg-[var(--color-bg-soft)] p-5 text-center`}
    >
      <div className="max-w-xs">
        <MapPin
          size={28}
          strokeWidth={1.75}
          aria-hidden
          className="mx-auto text-[var(--color-salsa)]"
        />
        <p className="mt-3 text-sm font-semibold text-[var(--color-ink)]">
          {lang === 'de' ? 'Standort auf Google Maps' : 'Location on Google Maps'}
        </p>
        <p id={disclosureId} className="mt-1 text-xs leading-relaxed text-[var(--color-ink-muted)]">
          {lang === 'de'
            ? 'Erst nach deinem Klick wird eine Verbindung zu Google hergestellt.'
            : 'A connection to Google is made only after you click.'}
        </p>
        <button
          type="button"
          data-google-map-load
          aria-describedby={disclosureId}
          onClick={() => setConsented(true)}
          className="t-hover mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-ink)] bg-[var(--color-paper-warm)] px-4 text-sm font-semibold text-[var(--color-ink)] hover:border-[var(--color-salsa)] hover:text-[var(--color-salsa)]"
        >
          {lang === 'de' ? 'Google Maps laden' : 'Load Google Maps'}
        </button>
      </div>
    </div>
  );
}
