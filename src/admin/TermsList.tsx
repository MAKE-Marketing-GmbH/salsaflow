import { useState } from 'react';
import { api, formatDate, STATUS_LABEL, type TermListItem } from '@/lib/api';
import { Badge, Banner, Button, Card, ErrorNote, Field, Modal, TextInput } from '@/admin/ui';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
const MONTHS_DE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];
function monthYearDe(iso: string): string {
  const [y, m] = iso.split('-').map(Number);
  return `${MONTHS_DE[(m - 1) % 12]} ${y}`;
}

function statusTone(status: string): 'green' | 'neutral' | 'amber' {
  if (status === 'published') return 'green';
  if (status === 'archived') return 'amber';
  return 'neutral';
}

export function TermsList({
  terms,
  readonly,
  onOpen,
  onDuplicate,
  reloadTerms,
  showToast,
}: {
  terms: TermListItem[];
  readonly: boolean;
  onOpen: (termId: string) => void;
  onDuplicate: (termId: string) => void;
  reloadTerms: () => Promise<TermListItem[]>;
  showToast: (msg: string) => void;
}) {
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Kursplan verwalten</h1>
          <p className="max-w-xl text-sm text-neutral-600">
            Hier legst du die Kurs-Staffeln an. Am einfachsten erstellst du eine neue Staffel, indem du
            die letzte <strong>duplizierst</strong> - die Level steigen dann automatisch eine Stufe.
          </p>
        </div>
        {!readonly && (
          <Button variant="secondary" size="lg" onClick={() => setShowNew(true)}>
            + Neue Staffel anlegen
          </Button>
        )}
      </div>

      {terms.length === 0 && (
        <Banner>Noch keine Staffel vorhanden. Lege oben rechts deine erste Staffel an.</Banner>
      )}

      <div className="space-y-4">
        {terms.map((t, i) => (
          <Card key={t.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{t.name}</h2>
                  <Badge tone={statusTone(t.status)}>{STATUS_LABEL[t.status] ?? t.status}</Badge>
                  {i === 0 && <Badge tone="salsa">Neueste</Badge>}
                </div>
                <p className="text-sm text-neutral-600">
                  {formatDate(t.startDate)} bis {formatDate(t.endDate)} &middot; {t.weekCount} Wochen
                  &middot; <strong>{t.courseCount}</strong> {t.courseCount === 1 ? 'Kurs' : 'Kurse'}
                </p>
              </div>

              <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                <Button onClick={() => onOpen(t.id)}>Öffnen</Button>
                {!readonly && (
                  <Button variant="primary" onClick={() => onDuplicate(t.id)} title="Neue Staffel aus dieser erstellen">
                    Duplizieren
                    <span className="hidden font-normal opacity-90 sm:inline">- Level steigen automatisch</span>
                  </Button>
                )}
              </div>
            </div>

            {!readonly && t.status === 'draft' && (
              <div className="mt-3 border-t border-neutral-100 pt-3">
                <DeleteTermButton term={t} reloadTerms={reloadTerms} showToast={showToast} />
              </div>
            )}
          </Card>
        ))}
      </div>

      {showNew && (
        <NewTermModal
          onClose={() => setShowNew(false)}
          onCreated={async (id) => {
            await reloadTerms();
            setShowNew(false);
            showToast('Neue Staffel angelegt. Füge jetzt Kurse hinzu.');
            onOpen(id);
          }}
        />
      )}
    </div>
  );
}

function DeleteTermButton({
  term,
  reloadTerms,
  showToast,
}: {
  term: TermListItem;
  reloadTerms: () => Promise<TermListItem[]>;
  showToast: (msg: string) => void;
}) {
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!confirm) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setConfirm(true)}>
        Entwurf löschen
      </Button>
    );
  }
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-neutral-600">Diese Staffel wirklich löschen?</span>
      <Button
        variant="danger"
        size="sm"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await api.del(`/api/admin/terms/${term.id}`);
            await reloadTerms();
            showToast('Staffel gelöscht.');
          } finally {
            setBusy(false);
          }
        }}
      >
        Ja, löschen
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setConfirm(false)}>
        Abbrechen
      </Button>
    </div>
  );
}

function NewTermModal({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const start0 = todayISO();
  const [name, setName] = useState(`Staffel ${monthYearDe(start0)}`);
  const [startDate, setStartDate] = useState(start0);
  const [endDate, setEndDate] = useState(addDaysISO(start0, 8 * 7 - 1));
  const [weekCount, setWeekCount] = useState(8);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    if (!name.trim()) return setError('Bitte gib der Staffel einen Namen.');
    if (endDate < startDate) return setError('Das End-Datum liegt vor dem Start-Datum.');
    setBusy(true);
    try {
      const res = await api.post<{ id: string }>('/api/admin/terms', {
        name: name.trim(),
        startDate,
        endDate,
        weekCount,
      });
      onCreated(res.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Konnte nicht speichern.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      title="Neue Staffel anlegen"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Abbrechen
          </Button>
          <Button variant="primary" onClick={submit} disabled={busy}>
            {busy ? 'Speichern...' : 'Staffel anlegen'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Banner>
          Eine leere Staffel zum selbst Befüllen. Tipp: Wenn es die Kurse schon gab, ist
          <strong> Duplizieren </strong> meist schneller.
        </Banner>
        <Field label="Name der Staffel" required hint="Zum Beispiel: Staffel März 2026">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Start" required>
            <TextInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Field>
          <Field label="Ende" required>
            <TextInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Field>
        </div>
        <Field label="Anzahl Wochen">
          <TextInput
            type="number"
            min={1}
            max={52}
            value={weekCount}
            onChange={(e) => setWeekCount(Number(e.target.value) || 8)}
            className="max-w-[8rem]"
          />
        </Field>
        {error && <ErrorNote>{error}</ErrorNote>}
      </div>
    </Modal>
  );
}
