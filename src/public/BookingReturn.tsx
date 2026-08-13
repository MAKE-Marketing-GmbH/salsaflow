import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Seo } from '@/lib/seo';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter } from '@/public/site/SiteFooter';

type BookingStatus = { bookingStatus: string };

export function BookingReturn() {
  const [status, setStatus] = useState<BookingStatus | null>(null);
  const [failed, setFailed] = useState(false);
  const bookingId = new URLSearchParams(window.location.search).get('booking');

  useEffect(() => {
    if (!bookingId) { setFailed(true); return; }
    api.get<BookingStatus>(`/api/public/bookings/${bookingId}/status`).then(setStatus).catch(() => setFailed(true));
  }, [bookingId]);

  const confirmed = status?.bookingStatus === 'confirmed' || status?.bookingStatus === 'completed';
  const title = confirmed ? 'Deine Buchung ist bestätigt' : failed ? 'Buchung nicht gefunden' : 'Buchungsstatus wird geladen';
  const body = confirmed ? 'Wir freuen uns auf dich. Die Bestätigung ist per E-Mail unterwegs.' : failed ? 'Bitte prüfe den Link oder melde dich bei uns.' : 'Einen Moment bitte.';
  return <><Seo page="bookingStatus" noindex /><SiteHeader /><main id="main" tabIndex={-1} className="flex min-h-[80vh] items-center justify-center bg-neutral-50 px-4 py-12" style={{ paddingTop: 'calc(var(--nav-h) + 2rem)' }}><div className="w-full max-w-md rounded-[var(--radius-card)] bg-white p-8 text-center shadow-xl"><h1 className="text-xl font-bold">{title}</h1><p className="mt-2 text-sm text-neutral-600">{body}</p><a href="/kursplan" className="mt-6 inline-block rounded-[var(--radius-chip)] bg-black px-5 py-2 text-sm font-semibold text-white">Zum Kursplan</a></div></main><SiteFooter /></>;
}
