// Balance-Sicht im Admin (Etappe 8): pro Kurs bestaetigte Leader vs. Follower, Balance,
// offene Aushilfe-Bedarfe und Warteliste, plus die Buchungsliste mit Storno (rueckt die
// Warteliste nach). Ersetzt die heutigen WhatsApp-Aushilfe-Chats (ARCHITEKTUR.md 5.4).

import { useCallback, useEffect, useState } from 'react';
import { api, levelLabel, type CourseBalance, type TermBalance } from '@/lib/api';
import { Badge, Banner, Button, Card, Loading } from '@/admin/ui';

const STATUS_DE: Record<string, string> = {
  pending_payment: 'Vorgemerkt',
  waitlisted: 'Warteliste',
  confirmed: 'Bestätigt',
  cancelled: 'Storniert',
  expired: 'Abgelaufen',
  completed: 'Abgeschlossen',
};
const ROLE_DE: Record<string, string> = { leader: 'Leader', follower: 'Follower' };

export function BalanceView({
  termId,
  readonly,
  onBack,
  showToast,
}: {
  termId: string;
  readonly: boolean;
  onBack: () => void;
  showToast: (msg: string) => void;
}) {
  const [data, setData] = useState<TermBalance | null>(null);

  const reload = useCallback(async () => {
    const d = await api.get<TermBalance>(`/api/admin/terms/${termId}/balance`);
    setData(d);
    return d;
  }, [termId]);

  useEffect(() => {
    reload().catch(() => setData(null));
  }, [reload]);

  if (!data) return <Loading label="Buchungen werden geladen..." />;

  const totalBookings = data.courses.reduce((n, c) => n + c.bookings.length, 0);

  return (
    <div className="space-y-6" data-testid="balance-view">
      <div>
        <button onClick={onBack} className="mb-2 text-sm text-neutral-500 hover:text-black">
          &larr; Zurück zur Staffel
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Buchungen &amp; Balance</h1>
        <p className="text-sm text-neutral-600">
          {data.term.name} &middot; {totalBookings} {totalBookings === 1 ? 'Buchung' : 'Buchungen'}
        </p>
      </div>

      {data.courses.length === 0 ? (
        <Banner>Diese Staffel hat noch keine Kurse.</Banner>
      ) : (
        <div className="space-y-4">
          {data.courses.map((c) => (
            <CourseBalanceCard key={c.courseId} course={c} readonly={readonly} reload={reload} showToast={showToast} />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseBalanceCard({
  course,
  readonly,
  reload,
  showToast,
}: {
  course: CourseBalance;
  readonly: boolean;
  reload: () => Promise<TermBalance>;
  showToast: (msg: string) => void;
}) {
  const a = course.availability;
  const isOpen = course.bookingType === 'open';
  const active = course.bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'expired' && b.status !== 'refunded');

  return (
    <Card className="overflow-hidden" >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 px-5 py-3">
        <div>
          <p className="font-semibold">
            {course.weekdayDe} {course.time} &middot; {course.styleDe}{' '}
            <span className="text-neutral-500">{levelLabel(course.levelDe, course.onVariant)}</span>
          </p>
          <p className="text-xs text-neutral-500">
            {course.bookings.length} {course.bookings.length === 1 ? 'Buchung' : 'Buchungen'} &middot; Kapazität{' '}
            {course.capacityTotal}
          </p>
        </div>

        {a && !isOpen ? (
          <div className="flex flex-wrap items-center gap-2 text-sm" data-testid="balance-course" data-course-id={course.courseId}>
            <Badge tone="neutral">
              <span data-testid="bal-leader">Leader {a.confirmedLeader}</span>/{a.capLeader}
            </Badge>
            <Badge tone="neutral">
              <span data-testid="bal-follower">Follower {a.confirmedFollower}</span>/{a.capFollower}
            </Badge>
            <BalanceBadge balance={a.balance} />
          </div>
        ) : (
          a && (
            <div className="text-sm" data-testid="balance-course" data-course-id={course.courseId}>
              <Badge tone="neutral">
                Anmeldungen {course.capacityTotal - a.freeOpen}/{course.capacityTotal}
              </Badge>
            </div>
          )
        )}
      </div>

      {/* Aushilfe + Warteliste */}
      {a && (
        <div className="flex flex-wrap gap-2 px-5 py-3 text-xs">
          {a.needsAushilfeFollower > 0 && (
            <Badge tone="amber">Follower-Aushilfe gesucht: {a.needsAushilfeFollower}</Badge>
          )}
          {a.needsAushilfeLeader > 0 && <Badge tone="amber">Leader-Aushilfe gesucht: {a.needsAushilfeLeader}</Badge>}
          {a.waitlistLeader > 0 && <Badge tone="salsa">Warteliste Leader: {a.waitlistLeader}</Badge>}
          {a.waitlistFollower > 0 && <Badge tone="salsa">Warteliste Follower: {a.waitlistFollower}</Badge>}
          {a.waitlistCouple > 0 && <Badge tone="salsa">Warteliste Paar: {a.waitlistCouple}</Badge>}
          {a.waitlistOpen > 0 && <Badge tone="salsa">Warteliste: {a.waitlistOpen}</Badge>}
          {a.needsAushilfeFollower === 0 &&
            a.needsAushilfeLeader === 0 &&
            a.waitlistLeader === 0 &&
            a.waitlistFollower === 0 &&
            a.waitlistCouple === 0 &&
            a.waitlistOpen === 0 && <span className="text-neutral-400">Keine offenen Aushilfen, keine Warteliste.</span>}
        </div>
      )}

      {/* Buchungsliste */}
      {active.length === 0 ? (
        <p className="px-5 py-4 text-sm text-neutral-400">Noch keine aktiven Buchungen.</p>
      ) : (
        <div className="divide-y divide-neutral-100">
          {active.map((b) => (
            <BookingRow key={b.id} booking={b} isOpen={isOpen} readonly={readonly} reload={reload} showToast={showToast} />
          ))}
        </div>
      )}
    </Card>
  );
}

function BalanceBadge({ balance }: { balance: number }) {
  if (balance === 0) {
    return (
      <Badge tone="green">
        <span data-testid="bal-balance">Ausgeglichen</span>
      </Badge>
    );
  }
  const text =
    balance > 0
      ? `+${balance} Leader - Follower-Aushilfe gesucht`
      : `+${-balance} Follower - Leader-Aushilfe gesucht`;
  return (
    <Badge tone="amber">
      <span data-testid="bal-balance">{text}</span>
    </Badge>
  );
}

function BookingRow({
  booking,
  isOpen,
  readonly,
  reload,
  showToast,
}: {
  booking: CourseBalance['bookings'][number];
  isOpen: boolean;
  readonly: boolean;
  reload: () => Promise<TermBalance>;
  showToast: (msg: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const roleMode = isOpen
    ? 'Offene Klasse'
    : booking.mode === 'couple'
      ? `Paar${booking.partnerName ? ` (mit ${booking.partnerName})` : ''}`
      : ROLE_DE[booking.role ?? ''] ?? '-';

  async function cancel() {
    setBusy(true);
    try {
      const r = await api.post<{ promoted: number }>(`/api/admin/bookings/${booking.id}/cancel`, {});
      await reload();
      showToast(r.promoted > 0 ? `Storniert. ${r.promoted} von der Warteliste nachgerückt.` : 'Buchung storniert.');
    } catch {
      showToast('Konnte nicht stornieren.');
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3" data-testid="booking-row">
      <div className="min-w-0">
        <p className="text-sm font-medium">
          {booking.participantName}{' '}
          <span className="font-normal text-neutral-500">&middot; {roleMode}</span>
        </p>
        <p className="text-xs text-neutral-500">
          {booking.participantEmail}
          {booking.needsAushilfe && <> &middot; Aushilfe gesucht</>}
          {booking.status === 'waitlisted' && booking.waitlistPosition != null && (
            <> &middot; Warteplatz {booking.waitlistPosition}</>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge tone={booking.status === 'confirmed' ? 'green' : booking.status === 'waitlisted' ? 'salsa' : 'neutral'}>
          {STATUS_DE[booking.status] ?? booking.status}
        </Badge>
        {!readonly && (
          <Button
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={cancel}
            data-testid="cancel-booking"
          >
            {busy ? '...' : 'Stornieren'}
          </Button>
        )}
      </div>
    </div>
  );
}
