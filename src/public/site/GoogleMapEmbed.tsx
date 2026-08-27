import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
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
  const [mapReady, setMapReady] = useState(false);

  return (
    <div className={`${className} overflow-hidden bg-[var(--color-bg-soft)]`}>
      <iframe
        data-google-map-iframe
        title={title}
        src={src}
        onLoad={() => setMapReady(true)}
        className={`absolute inset-0 h-full w-full border-0 motion-safe:transition-opacity motion-safe:duration-300 ${mapReady ? 'opacity-100' : 'opacity-0'}`}
        referrerPolicy="strict-origin-when-cross-origin"
        loading="lazy"
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
