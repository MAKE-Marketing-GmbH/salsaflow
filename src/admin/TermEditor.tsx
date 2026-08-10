import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  api,
  formatDate,
  levelLabel,
  STATUS_LABEL,
  type AdminCourse,
  type Meta,
  type TermDetail,
  type TermListItem,
} from '@/lib/api';
import {
  Badge,
  Banner,
  Button,
  Card,
  ErrorNote,
  Field,
  Loading,
  Modal,
  Select,
  TextInput,
} from '@/admin/ui';

const WEEKDAY_INDEX: Record<string, number> = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6,
};

function courseDateRange(startDate: string, endDate: string, weekday: string): string | null {
  const target = WEEKDAY_INDEX[weekday];
  if (target === undefined) return null;
  const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
  const start = toDate(startDate);
  const end = toDate(endDate);
  const startIndex = (start.getUTCDay() + 6) % 7;
  const endIndex = (end.getUTCDay() + 6) % 7;
  const first = new Date(start);
  first.setUTCDate(start.getUTCDate() + ((target - startIndex + 7) % 7));
  if (first > end) return null;
  const last = new Date(end);
  last.setUTCDate(end.getUTCDate() - ((endIndex - target + 7) % 7));
  const format = (date: Date) =>
    date.toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return `${format(first)} – ${format(last)}`;
}

export function TermEditor({
  termId,
  meta,
  readonly,
  onBack,
  onShowBalance,
  reloadTerms,
  showToast,
}: {
  termId: string;
  meta: Meta;
  readonly: boolean;
  onBack: () => void;
  onShowBalance: () => void;
  reloadTerms: () => Promise<TermListItem[]>;
  showToast: (msg: string) => void;
}) {
  const [detail, setDetail] = useState<TermDetail | null>(null);
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const [form, setForm] = useState<{ mode: 'new' } | { mode: 'edit'; course: AdminCourse } | null>(null);
  const [editTerm, setEditTerm] = useState(false);
  const reducedMotion = useReducedMotion();
  const reveal: { container: Variants; item: Variants } = {
    container: {
      hidden: {},
      show: { transition: { staggerChildren: reducedMotion ? 0 : 0.07, delayChildren: 0.03 } },
    },
    item: {
      hidden: { opacity: 0, y: reducedMotion ? 0 : 14 },
      show: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0.01 : 0.45, ease: [0.22, 1, 0.36, 1] } },
    },
  };

  const reload = useCallback(async () => {
    const d = await api.get<TermDetail>(`/api/admin/terms/${termId}`);
    setDetail(d);
    return d;
  }, [termId]);

  useEffect(() => {
    reload().catch(() => setDetail(null));
  }, [reload]);

  const byWeekday = useMemo(() => {
    if (!detail) return [];
    return meta.weekdays
      .map((w) => ({ ...w, courses: detail.courses.filter((c) => c.weekday === w.key) }))
      .filter((g) => g.courses.length > 0);
  }, [detail, meta.weekdays]);

  if (!detail) return <Loading label="Staffel wird geladen..." />;
  const { term } = detail;

  async function setStatus(status: 'draft' | 'published') {
    await api.patch(`/api/admin/terms/${termId}`, { status });
    await reload();
    await reloadTerms();
    showToast(status === 'published' ? 'Staffel ist jetzt veröffentlicht.' : 'Staffel auf Entwurf gesetzt.');
  }

  return (
    <motion.div
      className="space-y-6"
      data-reveal
      variants={reveal.container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={reveal.item}>
        <button onClick={onBack} className="mb-2 text-sm text-neutral-500 hover:text-black">
          &larr; Zurück zur Übersicht
        </button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{term.name}</h1>
              <Badge tone={term.status === 'published' ? 'green' : 'neutral'}>
                {STATUS_LABEL[term.status] ?? term.status}
              </Badge>
            </div>
            <p className="text-sm text-neutral-600">
              {formatDate(term.startDate)} bis {formatDate(term.endDate)} &middot; {term.weekCount} Wochen
              &middot; {detail.courses.length} {detail.courses.length === 1 ? 'Kurs' : 'Kurse'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={onShowBalance} data-testid="open-balance">
              Buchungen &amp; Balance
            </Button>
          </div>
          {!readonly && (
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" onClick={() => setEditTerm(true)}>
                Staffel bearbeiten
              </Button>
              {term.status === 'published' ? (
                <Button variant="outline" onClick={() => setStatus('draft')}>
                  Auf Entwurf setzen
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => setStatus('published')}>
                  Veröffentlichen
                </Button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <motion.div variants={reveal.item} className="flex gap-1 rounded-lg border border-neutral-200 bg-white p-1 text-sm font-medium">
        <button
          onClick={() => setTab('edit')}
          className={tabClass(tab === 'edit')}
        >
          Kurse bearbeiten
        </button>
        <button
          onClick={() => setTab('preview')}
          className={tabClass(tab === 'preview')}
        >
          Vorschau
        </button>
      </motion.div>

      <motion.div variants={reveal.item}>
      {tab === 'edit' ? (
        <div className="space-y-4">
          {!readonly && (
            <Button variant="primary" onClick={() => setForm({ mode: 'new' })}>
              + Kurs hinzufügen
            </Button>
          )}
          {detail.courses.length === 0 ? (
            <Banner>Noch keine Kurse. Füge mit "Kurs hinzufügen" den ersten Kurs hinzu.</Banner>
          ) : (
            byWeekday.map((group) => (
              <Card key={group.key} className="overflow-hidden">
                <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-2 text-sm font-semibold">
                  {group.de}
                  {courseDateRange(term.startDate, term.endDate, group.key) && (
                    <span className="font-normal text-neutral-500">
                      {' '}· {courseDateRange(term.startDate, term.endDate, group.key)}
                    </span>
                  )}
                </div>
                <div className="divide-y divide-neutral-100">
                  {group.courses.map((c) => (
                    <CourseRow
                      key={c.id}
                      course={c}
                      readonly={readonly}
                      onEdit={() => setForm({ mode: 'edit', course: c })}
                      onDeleted={async () => {
                        await reload();
                        await reloadTerms();
                        showToast('Kurs gelöscht.');
                      }}
                    />
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        <PreviewPlan groups={byWeekday} term={term} />
      )}
      </motion.div>

      {form && (
        <CourseForm
          termId={termId}
          meta={meta}
          existing={form.mode === 'edit' ? form.course : null}
          onClose={() => setForm(null)}
          onSaved={async (msg) => {
            setForm(null);
            await reload();
            await reloadTerms();
            showToast(msg);
          }}
        />
      )}

      {editTerm && (
        <EditTermModal
          term={term}
          onClose={() => setEditTerm(false)}
          onSaved={async () => {
            setEditTerm(false);
            await reload();
            await reloadTerms();
            showToast('Staffel aktualisiert.');
          }}
        />
      )}
    </motion.div>
  );
}

function tabClass(active: boolean): string {
  return `flex-1 rounded-md px-4 py-2 ${active ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'}`;
}

/* ----------------------------------------------------------------------------
 * Kurs-Zeile (Edit-Ansicht)
 * -------------------------------------------------------------------------- */
function CourseRow({
  course,
  readonly,
  onEdit,
  onDeleted,
}: {
  course: AdminCourse;
  readonly: boolean;
  onEdit: () => void;
  onDeleted: () => Promise<void>;
}) {
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const normal = course.prices.find((p) => p.tariffKey === 'normal');

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">
          {course.startTime}-{course.endTime} &middot; {course.styleDe}{' '}
          <span className="text-neutral-500">{levelLabel(course.levelDe, course.onVariant)}</span>
        </p>
        <p className="text-xs text-neutral-500">
          {course.teachers.map((t) => t.displayName).join(', ') || 'Keine Lehrer'} &middot;{' '}
          {course.locationName}
          {normal && <> &middot; CHF {Number(normal.amountChf).toFixed(0)}</>}
          {course.status !== 'open' && (
            <> &middot; {STATUS_LABEL[course.status] ?? course.status}</>
          )}
        </p>
      </div>
      {!readonly && (
        <div className="flex items-center gap-2">
          {confirm ? (
            <>
              <span className="text-xs text-neutral-500">Löschen?</span>
              <Button
                variant="danger"
                size="sm"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await api.del(`/api/admin/courses/${course.id}`);
                    await onDeleted();
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Ja
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirm(false)}>
                Nein
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={onEdit}>
                Bearbeiten
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirm(true)}>
                Löschen
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Vorschau-Plan (read-only, wie der oeffentliche Kursplan)
 * -------------------------------------------------------------------------- */
function PreviewPlan({
  groups,
  term,
}: {
  groups: { key: string; de: string; courses: AdminCourse[] }[];
  term: TermListItem;
}) {
  if (groups.length === 0) {
    return <Banner>Noch keine Kurse zum Anzeigen. Fuege erst Kurse hinzu.</Banner>;
  }
  return (
    <div className="space-y-5">
      <Banner>
        So sieht der Kursplan später aus (Vorschau). Die öffentliche Seite zeigt diese Daten in DE und
        EN automatisch an (Etappe 7).
      </Banner>
      {groups.map((g) => (
        <div key={g.key}>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-neutral-500">
            {g.de}
            {courseDateRange(term.startDate, term.endDate, g.key) && (
              <span className="font-normal normal-case tracking-normal"> · {courseDateRange(term.startDate, term.endDate, g.key)}</span>
            )}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {g.courses.map((c) => (
              <Card key={c.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">
                    {c.styleDe} <span className="text-neutral-500">{levelLabel(c.levelDe, c.onVariant)}</span>
                  </p>
                  <span className="whitespace-nowrap text-sm text-neutral-500">
                    {c.startTime}-{c.endTime}
                  </span>
                </div>
                <p className="mt-1 text-sm text-neutral-600">
                  {c.teachers.map((t) => t.displayName).join(', ') || 'Kein Lehrer'}
                </p>
                <p className="text-xs text-neutral-500">{c.locationName}</p>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Staffel-Stammdaten bearbeiten
 * -------------------------------------------------------------------------- */
function EditTermModal({
  term,
  onClose,
  onSaved,
}: {
  term: TermListItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(term.name);
  const [startDate, setStartDate] = useState(term.startDate);
  const [endDate, setEndDate] = useState(term.endDate);
  const [weekCount, setWeekCount] = useState(term.weekCount);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    if (!name.trim()) return setError('Name darf nicht leer sein.');
    if (endDate < startDate) return setError('Das End-Datum liegt vor dem Start-Datum.');
    setBusy(true);
    try {
      await api.patch(`/api/admin/terms/${term.id}`, { name: name.trim(), startDate, endDate, weekCount });
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Konnte nicht speichern.');
      setBusy(false);
    }
  }

  return (
    <Modal
      title="Staffel bearbeiten"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Abbrechen
          </Button>
          <Button variant="primary" onClick={submit} disabled={busy}>
            {busy ? 'Speichern...' : 'Speichern'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Name" required>
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

/* ----------------------------------------------------------------------------
 * Kurs anlegen / bearbeiten
 * -------------------------------------------------------------------------- */
function CourseForm({
  termId,
  meta,
  existing,
  onClose,
  onSaved,
}: {
  termId: string;
  meta: Meta;
  existing: AdminCourse | null;
  onClose: () => void;
  onSaved: (msg: string) => Promise<void>;
}) {
  const normalTariff = meta.tariffs.find((t) => t.key === 'normal');
  const studentTariff = meta.tariffs.find((t) => t.key === 'student');

  const [styleId, setStyleId] = useState(existing?.styleId ?? meta.styles[0]?.id ?? '');
  const [levelRungId, setLevelRungId] = useState<string>(existing?.levelRungId ?? '');
  const [onVariant, setOnVariant] = useState<'on1' | 'on2'>(existing?.onVariant === 'on2' ? 'on2' : 'on1');
  const [weekday, setWeekday] = useState(existing?.weekday ?? meta.weekdays[0]?.key ?? 'mon');
  const [startTime, setStartTime] = useState(existing?.startTime ?? '18:30');
  const [endTime, setEndTime] = useState(existing?.endTime ?? '19:30');
  const [locationId, setLocationId] = useState(existing?.locationId ?? meta.locations[0]?.id ?? '');
  const [teacherIds, setTeacherIds] = useState<string[]>(existing?.teachers.map((t) => t.id) ?? []);
  const [capacity, setCapacity] = useState(existing?.capacityTotal ?? 24);
  const [status, setStatus] = useState<AdminCourse['status']>(existing?.status ?? 'open');
  const [priceNormal, setPriceNormal] = useState<string>(
    existing?.prices.find((p) => p.tariffKey === 'normal')?.amountChf ?? '190',
  );
  const [priceStudent, setPriceStudent] = useState<string>(
    existing?.prices.find((p) => p.tariffKey === 'student')?.amountChf ?? '160',
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const selectedStyle = meta.styles.find((s) => s.id === styleId);
  const ladderKey = selectedStyle?.ladderKey ?? 'open';
  const isSalsa = selectedStyle?.key === 'salsa';
  const levelOptions = meta.levelRungs.filter((r) => r.ladderKey === ladderKey);

  // Beim Stilwechsel ein nicht mehr passendes Level zuruecksetzen.
  function changeStyle(id: string) {
    setStyleId(id);
    const newLadder = meta.styles.find((s) => s.id === id)?.ladderKey ?? 'open';
    if (levelRungId && !meta.levelRungs.some((r) => r.id === levelRungId && r.ladderKey === newLadder)) {
      setLevelRungId('');
    }
  }

  function toggleTeacher(id: string) {
    setTeacherIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  async function submit() {
    setError(null);
    if (!styleId) return setError('Bitte einen Stil wählen.');
    if (!locationId) return setError('Bitte einen Ort wählen.');
    if (endTime <= startTime) return setError('Die End-Zeit muss nach der Start-Zeit liegen.');

    const prices: { tariffId: string; amountChf: number }[] = [];
    if (normalTariff && Number(priceNormal) > 0) prices.push({ tariffId: normalTariff.id, amountChf: Number(priceNormal) });
    if (studentTariff && Number(priceStudent) > 0) prices.push({ tariffId: studentTariff.id, amountChf: Number(priceStudent) });

    const bookingType = ladderKey === 'salsa_bachata' ? 'leader_follower' : 'open';
    const payload = {
      styleId,
      levelRungId: levelRungId || null,
      onVariant: isSalsa && onVariant === 'on2' ? 'on2' : null,
      weekday,
      startTime,
      endTime,
      locationId,
      bookingType,
      capacityTotal: capacity,
      status,
      teacherIds,
      prices,
    };

    setBusy(true);
    try {
      if (existing) {
        await api.patch(`/api/admin/courses/${existing.id}`, payload);
        await onSaved('Kurs aktualisiert.');
      } else {
        await api.post('/api/admin/courses', { termId, ...payload });
        await onSaved('Kurs hinzugefügt.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Konnte nicht speichern.');
      setBusy(false);
    }
  }

  return (
    <Modal
      title={existing ? 'Kurs bearbeiten' : 'Kurs hinzufügen'}
      onClose={onClose}
      wide
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Abbrechen
          </Button>
          <Button variant="primary" onClick={submit} disabled={busy}>
            {busy ? 'Speichern...' : existing ? 'Speichern' : 'Kurs hinzufügen'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Stil" required>
            <Select value={styleId} onChange={(e) => changeStyle(e.target.value)}>
              {meta.styles.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nameDe}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Level" hint={ladderKey === 'open' ? 'Spezialstile haben oft kein festes Level.' : undefined}>
            <Select value={levelRungId} onChange={(e) => setLevelRungId(e.target.value)}>
              <option value="">Kein Level</option>
              {levelOptions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.labelDe}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {isSalsa && (
          <Field label="Salsa-Timing">
            <Select value={onVariant} onChange={(e) => setOnVariant(e.target.value as 'on1' | 'on2')}>
              <option value="on1">On1</option>
              <option value="on2">On2</option>
            </Select>
          </Field>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Wochentag" required>
            <Select value={weekday} onChange={(e) => setWeekday(e.target.value)}>
              {meta.weekdays.map((w) => (
                <option key={w.key} value={w.key}>
                  {w.de}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Von" required>
            <TextInput type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </Field>
          <Field label="Bis" required>
            <TextInput type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Ort" required>
            <Select value={locationId} onChange={(e) => setLocationId(e.target.value)}>
              {meta.locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Veröffentlichung" hint="Entwurf bleibt intern; veröffentlicht ist im Kursplan buchbar.">
            <Select value={status} onChange={(e) => setStatus(e.target.value as AdminCourse['status'])}>
              <option value="open">Veröffentlicht</option>
              <option value="draft">Entwurf</option>
              <option value="full">Ausgebucht (Warteliste)</option>
              <option value="cancelled">Abgesagt</option>
            </Select>
          </Field>
        </div>

        <Field label="Lehrer" hint="Mehrfachauswahl möglich.">
          <div className="flex flex-wrap gap-2">
            {meta.teachers.map((t) => {
              const on = teacherIds.includes(t.id);
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => toggleTeacher(t.id)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    on
                      ? 'border-[var(--color-salsa)] bg-[var(--color-salsa)] text-white'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {t.displayName}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Kapazität (gesamt)" hint="Eine Kapazität pro Kurs; Rollen werden nicht separat gepflegt.">
            <TextInput
              type="number"
              min={1}
              max={500}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value) || 24)}
            />
          </Field>
          <Field label="Preis Normal (CHF)">
            <TextInput type="number" min={0} value={priceNormal} onChange={(e) => setPriceNormal(e.target.value)} />
          </Field>
          <Field label="Preis ermässigt (CHF)">
            <TextInput type="number" min={0} value={priceStudent} onChange={(e) => setPriceStudent(e.target.value)} />
          </Field>
        </div>

        {error && <ErrorNote>{error}</ErrorNote>}
      </div>
    </Modal>
  );
}
