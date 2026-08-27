import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  api,
  formatDate,
  type AdminEvent,
  type EventFormat,
  type EventStatus,
  type JsonValue,
} from '@/lib/api';
import { Badge, Banner, Button, Card, ErrorNote, Field, Loading, Modal, Select, TextInput } from '@/admin/ui';

const FORMAT_LABEL = {
  danceflow: 'Danceflow Night',
  workshop: 'Workshop',
  anniversary: 'Anniversary Weekend',
  floweekend: 'Flow Weekend',
  other: 'Anderes Event',
} satisfies Record<EventFormat, string>;
const STATUS_LABEL = {
  draft: 'Entwurf',
  published: 'Veröffentlicht',
  cancelled: 'Abgesagt',
} satisfies Record<EventStatus, string>;
const EVENT_FORMATS = ['danceflow', 'workshop', 'anniversary', 'floweekend', 'other'] as const;
const EVENT_STATUSES = ['draft', 'published', 'cancelled'] as const;

type EventFormValue = Omit<AdminEvent, 'id' | 'createdAt' | 'updatedAt'>;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function emptyEvent(): EventFormValue {
  return {
    slug: '',
    format: 'workshop',
    titleDe: '',
    titleEn: '',
    summaryDe: '',
    summaryEn: '',
    startDate: todayISO(),
    endDate: null,
    startTime: null,
    endTime: null,
    location: 'Elisabethenanlage 7, 4051 Basel',
    ticketUrl: null,
    detailUrl: null,
    imageUrl: null,
    imageAltDe: null,
    imageAltEn: null,
    featured: false,
    status: 'draft',
    sort: 0,
  };
}

function statusTone(status: EventStatus): 'green' | 'neutral' | 'amber' {
  if (status === 'published') return 'green';
  if (status === 'cancelled') return 'amber';
  return 'neutral';
}

export function EventsManager({ readonly, showToast }: { readonly: boolean; showToast: (message: string) => void }) {
  const [events, setEvents] = useState<AdminEvent[] | null>(null);
  const [editing, setEditing] = useState<AdminEvent | 'new' | null>(null);

  const reload = useCallback(async () => {
    const result = await api.get<{ events: AdminEvent[] }>('/api/admin/events');
    setEvents(result.events);
  }, []);

  useEffect(() => {
    reload().catch(() => setEvents([]));
  }, [reload]);

  if (!events) return <Loading label="Events werden geladen..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Events verwalten</h1>
          <p className="max-w-2xl text-sm text-neutral-600">
            Termine, Texte, Bilder und Ticketlinks an einem Ort pflegen. Nur veröffentlichte, zukünftige Events
            erscheinen automatisch im öffentlichen Eventkalender.
          </p>
        </div>
        {!readonly && (
          <Button variant="primary" size="lg" onClick={() => setEditing('new')}>
            + Neues Event
          </Button>
        )}
      </div>

      <Banner tone="salsa">
        Ein Event wird live angezeigt, sobald sein Status „Veröffentlicht“ ist und das End- bzw. Startdatum
        nicht in der Vergangenheit liegt. Entwürfe und abgesagte Events bleiben unsichtbar.
      </Banner>

      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">So kommt ein Event auf die Website</h2>
            <ol className="mt-3 grid gap-3 text-sm text-neutral-600 sm:grid-cols-3">
              <li><strong className="block text-neutral-900">1. Anlegen</strong>„Neues Event“ öffnen und Datum, Texte sowie Links eintragen.</li>
              <li><strong className="block text-neutral-900">2. Veröffentlichen</strong>Im Feld „Status“ die Option „Veröffentlicht“ wählen und speichern.</li>
              <li><strong className="block text-neutral-900">3. Prüfen</strong>Das Event erscheint im Eventkalender und als nächster Termin auf der Eventseite.</li>
            </ol>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="/events-workshops/eventkalender"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-neutral-300 bg-white px-4 text-sm font-semibold hover:bg-neutral-50"
            >
              Eventkalender öffnen
            </a>
            <a
              href="/events"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-neutral-300 bg-white px-4 text-sm font-semibold hover:bg-neutral-50"
            >
              Eventseite öffnen
            </a>
          </div>
        </div>
      </Card>

      {events.length === 0 ? (
        <Card className="p-8 text-center">
          <h2 className="text-lg font-semibold">Noch keine Events eingetragen</h2>
          <p className="mt-2 text-sm text-neutral-600">Lege den nächsten Workshop oder Community-Abend an.</p>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              readonly={readonly}
              onEdit={() => setEditing(event)}
              onDuplicate={() =>
                setEditing({
                  ...event,
                  id: '',
                  slug: `${event.slug}-kopie`,
                  titleDe: `${event.titleDe} – Kopie`,
                  titleEn: `${event.titleEn} – Copy`,
                  status: 'draft',
                  createdAt: '',
                  updatedAt: '',
                })
              }
              onDeleted={async () => {
                await reload();
                showToast('Event gelöscht.');
              }}
            />
          ))}
        </div>
      )}

      {editing && (
        <EventForm
          existing={editing === 'new' ? null : editing.id ? editing : null}
          initial={editing === 'new' ? emptyEvent() : editing}
          onClose={() => setEditing(null)}
          onSaved={async (status) => {
            await reload();
            setEditing(null);
            showToast(status === 'published' ? 'Event veröffentlicht.' : 'Event gespeichert.');
          }}
        />
      )}
    </div>
  );
}

function EventCard({
  event,
  readonly,
  onEdit,
  onDuplicate,
  onDeleted,
}: {
  event: AdminEvent;
  readonly: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onDeleted: () => Promise<void>;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      {event.imageUrl ? (
        <img
          src={event.imageUrl}
          alt={event.imageAltDe || ''}
          className="aspect-[16/7] w-full object-cover"
          width={960}
          height={420}
        />
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={statusTone(event.status)}>{STATUS_LABEL[event.status]}</Badge>
          <Badge tone="salsa">{FORMAT_LABEL[event.format]}</Badge>
          {event.featured && <Badge tone="amber">Featured</Badge>}
        </div>
        <h2 className="mt-3 text-lg font-semibold">{event.titleDe}</h2>
        <p className="mt-1 text-sm text-neutral-600">
          {formatDate(event.startDate)}
          {event.endDate && event.endDate !== event.startDate ? ` bis ${formatDate(event.endDate)}` : ''}
          {event.startTime ? ` · ${event.startTime}${event.endTime ? `–${event.endTime}` : ''}` : ''}
        </p>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600">{event.summaryDe}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <Button onClick={onEdit}>{readonly ? 'Ansehen' : 'Bearbeiten'}</Button>
          {!readonly && <Button variant="ghost" onClick={onDuplicate}>Duplizieren</Button>}
          {event.status === 'published' && (
            <a
              href="/events-workshops/eventkalender"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
            >
              Live prüfen
            </a>
          )}
          {!readonly && !confirmDelete && (
            <Button variant="ghost" onClick={() => setConfirmDelete(true)}>Löschen</Button>
          )}
        </div>
        {confirmDelete && (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-neutral-50 p-3 text-sm">
            <span className="mr-auto text-neutral-600">Event wirklich löschen?</span>
            <Button
              variant="danger"
              size="sm"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await api.del(`/api/admin/events/${event.id}`);
                  await onDeleted();
                } finally {
                  setBusy(false);
                }
              }}
            >
              Ja, löschen
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Abbrechen</Button>
          </div>
        )}
      </div>
    </Card>
  );
}

function EventForm({
  existing,
  initial,
  onClose,
  onSaved,
}: {
  existing: AdminEvent | null;
  initial: EventFormValue;
  onClose: () => void;
  onSaved: (status: EventStatus) => Promise<void>;
}) {
  const [value, setValue] = useState<EventFormValue>({ ...initial });
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dateError = value.endDate && value.endDate < value.startDate ? 'Das Enddatum liegt vor dem Startdatum.' : null;
  const timeError = value.startTime && value.endTime && value.endTime <= value.startTime ? 'Die Endzeit muss nach der Startzeit liegen.' : null;
  const canSave = value.titleDe.trim().length >= 2
    && value.summaryDe.trim().length >= 10
    && value.slug.length >= 2 && !dateError && !timeError;

  const payload = useMemo<JsonValue>(() => ({
    slug: value.slug.trim(),
    format: value.format,
    titleDe: value.titleDe.trim(),
    titleEn: value.titleEn.trim() || value.titleDe.trim(),
    summaryDe: value.summaryDe.trim(),
    summaryEn: value.summaryEn.trim() || value.summaryDe.trim(),
    startDate: value.startDate,
    location: value.location.trim(),
    endDate: value.endDate || null,
    startTime: value.startTime || null,
    endTime: value.endTime || null,
    ticketUrl: value.ticketUrl?.trim() || null,
    detailUrl: value.detailUrl?.trim() || null,
    imageUrl: value.imageUrl?.trim() || null,
    imageAltDe: value.imageAltDe?.trim() || null,
    imageAltEn: value.imageAltEn?.trim() || null,
    featured: value.featured,
    status: value.status,
    sort: value.sort,
  }), [value]);

  async function save() {
    if (!canSave) return;
    setBusy(true);
    setError(null);
    try {
      if (existing) await api.patch(`/api/admin/events/${existing.id}`, payload);
      else await api.post('/api/admin/events', payload);
      await onSaved(value.status);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Event konnte nicht gespeichert werden.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      title={existing ? 'Event bearbeiten' : 'Neues Event anlegen'}
      onClose={onClose}
      wide
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Abbrechen</Button>
          <Button variant="primary" disabled={busy || !canSave} onClick={save}>
            {busy ? 'Speichern...' : value.status === 'published' ? 'Speichern & veröffentlichen' : 'Entwurf speichern'}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Eventformat" required>
            <Select value={value.format} onChange={(event) => {
              const format = EVENT_FORMATS.find((option) => option === event.target.value) ?? 'other';
              setValue((v) => ({ ...v, format }));
            }}>
              {Object.entries(FORMAT_LABEL).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </Select>
          </Field>
          <Field label="Status" required hint="Nur veröffentlichte Events sind öffentlich sichtbar.">
            <Select value={value.status} onChange={(event) => {
              const status = EVENT_STATUSES.find((option) => option === event.target.value) ?? 'draft';
              setValue((v) => ({ ...v, status }));
            }}>
              {Object.entries(STATUS_LABEL).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </Select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Titel Deutsch" required>
            <TextInput
              value={value.titleDe}
              onChange={(event) => {
                const titleDe = event.target.value;
                setValue((v) => ({ ...v, titleDe, slug: slugTouched ? v.slug : slugify(titleDe) }));
              }}
            />
          </Field>
          <Field label="Titel Englisch" hint="Optional — leer übernimmt den deutschen Titel.">
            <TextInput value={value.titleEn} onChange={(event) => setValue((v) => ({ ...v, titleEn: event.target.value }))} />
          </Field>
        </div>

        <Field label="Slug" required hint="Wird automatisch aus dem deutschen Titel erzeugt.">
          <TextInput
            value={value.slug}
            onChange={(event) => {
              setSlugTouched(true);
              setValue((v) => ({ ...v, slug: slugify(event.target.value) }));
            }}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kurzbeschreibung Deutsch" required hint="Erscheint direkt auf der Eventkarte.">
            <textarea
              value={value.summaryDe}
              onChange={(event) => setValue((v) => ({ ...v, summaryDe: event.target.value }))}
              rows={5}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-[var(--color-salsa)] focus:outline-none"
            />
          </Field>
          <Field label="Kurzbeschreibung Englisch" hint="Optional — leer übernimmt den deutschen Text.">
            <textarea
              value={value.summaryEn}
              onChange={(event) => setValue((v) => ({ ...v, summaryEn: event.target.value }))}
              rows={5}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-[var(--color-salsa)] focus:outline-none"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Startdatum" required>
            <TextInput type="date" value={value.startDate} onChange={(event) => setValue((v) => ({ ...v, startDate: event.target.value }))} />
          </Field>
          <Field label="Enddatum">
            <TextInput type="date" value={value.endDate ?? ''} onChange={(event) => setValue((v) => ({ ...v, endDate: event.target.value || null }))} />
          </Field>
          <Field label="Startzeit">
            <TextInput type="time" value={value.startTime ?? ''} onChange={(event) => setValue((v) => ({ ...v, startTime: event.target.value || null }))} />
          </Field>
          <Field label="Endzeit">
            <TextInput type="time" value={value.endTime ?? ''} onChange={(event) => setValue((v) => ({ ...v, endTime: event.target.value || null }))} />
          </Field>
        </div>
        {(dateError || timeError) && <ErrorNote>{dateError || timeError}</ErrorNote>}

        <Field label="Ort" required>
          <TextInput value={value.location} onChange={(event) => setValue((v) => ({ ...v, location: event.target.value }))} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ticketlink" hint="Eventfrog oder eine andere Buchungsseite.">
            <TextInput type="url" placeholder="https://..." value={value.ticketUrl ?? ''} onChange={(event) => setValue((v) => ({ ...v, ticketUrl: event.target.value || null }))} />
          </Field>
          <Field label="Detailseite" hint="Zum Beispiel /events-workshops/floweekend">
            <TextInput value={value.detailUrl ?? ''} onChange={(event) => setValue((v) => ({ ...v, detailUrl: event.target.value || null }))} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Bildpfad oder Bild-URL" hint="Zum Beispiel /photos/events/event-05-v4.webp">
            <TextInput value={value.imageUrl ?? ''} onChange={(event) => setValue((v) => ({ ...v, imageUrl: event.target.value || null }))} />
          </Field>
          <Field label="Sortierung" hint="Kleinere Zahlen erscheinen zuerst.">
            <TextInput type="number" value={value.sort} onChange={(event) => setValue((v) => ({ ...v, sort: Number(event.target.value) || 0 }))} />
          </Field>
        </div>
        {value.imageUrl && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Bildbeschreibung Deutsch">
              <TextInput value={value.imageAltDe ?? ''} onChange={(event) => setValue((v) => ({ ...v, imageAltDe: event.target.value || null }))} />
            </Field>
            <Field label="Bildbeschreibung Englisch">
              <TextInput value={value.imageAltEn ?? ''} onChange={(event) => setValue((v) => ({ ...v, imageAltEn: event.target.value || null }))} />
            </Field>
          </div>
        )}

        <label className="flex items-start gap-3 rounded-lg border border-neutral-200 p-4">
          <input
            type="checkbox"
            checked={value.featured}
            onChange={(event) => setValue((v) => ({ ...v, featured: event.target.checked }))}
            className="mt-1 h-4 w-4 accent-[var(--color-salsa)]"
          />
          <span>
            <span className="block text-sm font-semibold">Als Highlight markieren</span>
            <span className="block text-xs text-neutral-500">Setzt das Highlight-Label auf der Eventkarte im Kalender. Die festen Format-Seiten (Danceflow, Floweekend, Anniversary) bleiben eigene Seiten.</span>
          </span>
        </label>
        {error && <ErrorNote>{error}</ErrorNote>}
      </div>
    </Modal>
  );
}
