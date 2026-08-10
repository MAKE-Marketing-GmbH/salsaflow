import { useEffect, useMemo, useState } from 'react';
import { api, formatDate, levelLabel, type DuplicatePreview, type Meta } from '@/lib/api';
import { Badge, Banner, Button, Card, ErrorNote, Field, Loading, Select, TextInput } from '@/admin/ui';

const AUTO = '__auto__'; // neue Advanced-Stufe wird beim Erstellen automatisch angelegt
const NONE = '__none__'; // Kurs ohne Level (Open-Workshop) bleibt ohne Level

export function DuplicateView({
  sourceTermId,
  meta,
  readonly,
  onCancel,
  onDone,
  showToast,
}: {
  sourceTermId: string;
  meta: Meta;
  readonly: boolean;
  onCancel: () => void;
  onDone: (newTermId: string) => Promise<void>;
  showToast: (msg: string) => void;
}) {
  const [preview, setPreview] = useState<DuplicatePreview | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get<DuplicatePreview>(`/api/admin/terms/${sourceTermId}/duplicate-preview`)
      .then((p) => {
        setPreview(p);
        setName(p.suggested.name);
        setStartDate(p.suggested.startDate);
        setEndDate(p.suggested.endDate);
        const init: Record<string, string> = {};
        for (const c of p.courses) {
          init[c.courseId] = c.autoNewAdvanced ? AUTO : (c.targetRungId ?? NONE);
        }
        setSelections(init);
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : 'Vorschau konnte nicht geladen werden.'));
  }, [sourceTermId]);

  // Rung-Optionen je Leiter (fuer das Override-Dropdown).
  const rungsByLadder = useMemo(() => {
    const map = new Map<string, Meta['levelRungs']>();
    for (const r of meta.levelRungs) {
      const list = map.get(r.ladderKey) ?? [];
      list.push(r);
      map.set(r.ladderKey, list);
    }
    return map;
  }, [meta]);

  if (loadError) {
    return (
      <div className="space-y-4">
        <ErrorNote>{loadError}</ErrorNote>
        <Button onClick={onCancel}>Zurück</Button>
      </div>
    );
  }
  if (!preview) return <Loading label="Vorschau wird berechnet..." />;

  async function submit() {
    if (readonly) return;
    setError(null);
    if (!name.trim()) return setError('Bitte gib der neuen Staffel einen Namen.');
    if (endDate < startDate) return setError('Das End-Datum liegt vor dem Start-Datum.');
    // Auto-Vorschlag pro Kurs (wie in init gesetzt). Nur BEWUSST geaenderte Auswahlen werden als
    // Override geschickt - unveraenderte laufen ueber den Server-Auto-Pfad, damit die "hochgestuft"-
    // Zaehlung stimmt (sonst meldet der Server faelschlich 0 hochgestufte Kurse).
    const autoValueOf = (c: DuplicatePreview['courses'][number]) =>
      c.autoNewAdvanced ? AUTO : (c.targetRungId ?? NONE);
    const autoByCourse = new Map(preview!.courses.map((c) => [c.courseId, autoValueOf(c)]));
    const overrides: Record<string, string> = {};
    for (const [courseId, val] of Object.entries(selections)) {
      if (val === autoByCourse.get(courseId)) continue; // unveraendert -> Auto-Pfad
      if (val !== AUTO && val !== NONE) overrides[courseId] = val; // bewusst gewaehlte echte Rung
    }
    setBusy(true);
    try {
      const res = await api.post<{ id: string; promoted: number }>(
        `/api/admin/terms/${sourceTermId}/duplicate`,
        { name: name.trim(), startDate, endDate, weekCount: preview!.suggested.weekCount, overrides },
      );
      showToast(`Neue Staffel erstellt - ${res.promoted} Kurse eine Stufe hochgesetzt.`);
      await onDone(res.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Konnte nicht erstellen.');
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <button onClick={onCancel} className="mb-2 text-sm text-neutral-500 hover:text-black">
          &larr; Zurück zur Übersicht
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Staffel duplizieren</h1>
        <p className="text-sm text-neutral-600">
          Quelle: <strong>{preview.source.name}</strong> &middot; {preview.courses.length} Kurse werden
          übernommen.
        </p>
      </div>

      <Banner tone="salsa">
        Die Level wurden <strong>automatisch eine Stufe hochgesetzt</strong> (zum Beispiel Beginner
        Stufe 1 &rarr; Beginner Stufe 2). {preview.changedCount} von {preview.courses.length} Kursen
        steigen auf. Du kannst einzelne Level unten anpassen, bevor du die Staffel erstellst.
      </Banner>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <Field label="Name der neuen Staffel" required>
              <TextInput value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
          </div>
          <Field label="Start" required>
            <TextInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Field>
          <Field label="Ende" required>
            <TextInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-neutral-200 px-5 py-3">
          <h2 className="font-semibold">Kurse &amp; neue Level</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          {preview.courses.map((c) => {
            const options = rungsByLadder.get(c.ladderKey) ?? [];
            const noLevel = c.currentRungId === null && !c.autoNewAdvanced;
            return (
              <div key={c.courseId} className="grid grid-cols-1 items-center gap-3 px-5 py-3 sm:grid-cols-[1fr_auto_auto]">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {c.styleDe}
                    {c.onVariant === 'on2' && <span className="text-neutral-500"> On2</span>}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {c.weekdayDe} &middot; {c.time}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500">{levelLabel(c.currentLevelDe, c.onVariant) || 'Kein Level'}</span>
                  <span className={c.changed ? 'font-bold text-[var(--color-salsa)]' : 'text-neutral-300'}>
                    &rarr;
                  </span>
                </div>

                <div className="sm:w-64">
                  {noLevel ? (
                    <span className="text-sm text-neutral-400">Kein Level</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Select
                        value={selections[c.courseId] ?? AUTO}
                        onChange={(e) =>
                          setSelections((s) => ({ ...s, [c.courseId]: e.target.value }))
                        }
                        disabled={readonly}
                      >
                        {c.autoNewAdvanced && (
                          <option value={AUTO}>{c.newLevelDe} (neu, automatisch)</option>
                        )}
                        {options.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.labelDe}
                          </option>
                        ))}
                      </Select>
                      {c.changed && <Badge tone="salsa">+1</Badge>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {error && <ErrorNote>{error}</ErrorNote>}

      <div className="sticky bottom-0 -mx-5 flex items-center justify-between gap-3 border-t border-neutral-200 bg-neutral-50/95 px-5 py-4 backdrop-blur">
        <p className="text-sm text-neutral-600">
          Neue Staffel <strong>{name || '...'}</strong>
          {startDate && endDate && (
            <>
              {' '}
              ({formatDate(startDate)} bis {formatDate(endDate)})
            </>
          )}
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button variant="primary" size="lg" onClick={submit} disabled={busy || readonly}>
            {busy ? 'Wird erstellt...' : 'Staffel jetzt erstellen'}
          </Button>
        </div>
      </div>
    </div>
  );
}
