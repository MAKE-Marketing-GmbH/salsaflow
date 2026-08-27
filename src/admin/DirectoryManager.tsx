import { useCallback, useEffect, useState } from 'react';
import { api, type AdminLocation, type AdminTeacher, type JsonValue } from '@/lib/api';
import { Badge, Banner, Button, Card, ErrorNote, Field, Loading, Modal, TextInput } from '@/admin/ui';

export function DirectoryManager({
  readonly,
  showToast,
  onChanged,
}: {
  readonly: boolean;
  showToast: (message: string) => void;
  onChanged: () => Promise<void>;
}) {
  const [teachers, setTeachers] = useState<AdminTeacher[] | null>(null);
  const [locations, setLocations] = useState<AdminLocation[] | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<AdminTeacher | 'new' | null>(null);
  const [editingLocation, setEditingLocation] = useState<AdminLocation | 'new' | null>(null);

  const reload = useCallback(async () => {
    const [teacherResult, locationResult] = await Promise.all([
      api.get<{ teachers: AdminTeacher[] }>('/api/admin/teachers'),
      api.get<{ locations: AdminLocation[] }>('/api/admin/locations'),
    ]);
    setTeachers(teacherResult.teachers);
    setLocations(locationResult.locations);
    await onChanged();
  }, [onChanged]);

  useEffect(() => {
    reload().catch(() => {
      setTeachers([]);
      setLocations([]);
    });
  }, [reload]);

  if (!teachers || !locations) return <Loading label="Lehrer und Studios werden geladen..." />;

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Lehrer &amp; Studios</h1>
        <p className="max-w-2xl text-sm text-neutral-600">
          Neue Lehrerinnen und Studios hier anlegen. Danach erscheinen sie in den Kursformularen
          und, sobald sie einem veröffentlichten Kurs zugeordnet sind, im öffentlichen Kursplan.
        </p>
      </div>

      <Banner tone="salsa">
        Teamseite und Gründerportraits bleiben redaktionell. Hier pflegt ihr die Namen, die im
        Kursplan stehen, und die Räume, in denen unterrichtet wird.
      </Banner>

      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Lehrerinnen und Lehrer</h2>
            <p className="text-sm text-neutral-600">Inaktive Namen bleiben in alten Kursen, fallen aber aus neuen Kursformularen raus.</p>
          </div>
          {!readonly && (
            <Button variant="primary" onClick={() => setEditingTeacher('new')}>
              + Neue Lehrperson
            </Button>
          )}
        </div>
        {teachers.length === 0 ? (
          <Banner>Noch keine Lehrperson. Lege oben die erste an — danach kannst du sie Kursen zuordnen.</Banner>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {teachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                readonly={readonly}
                onEdit={() => setEditingTeacher(teacher)}
                onChanged={async (message) => {
                  await reload();
                  showToast(message);
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Studios</h2>
            <p className="text-sm text-neutral-600">Ein Studio, das noch Kurse hat, lässt sich nicht löschen — zuerst die Kurse umhängen.</p>
          </div>
          {!readonly && (
            <Button variant="secondary" onClick={() => setEditingLocation('new')}>
              + Neues Studio
            </Button>
          )}
        </div>
        {locations.length === 0 ? (
          <Banner>Noch kein Studio. Ohne Studio lässt sich kein Kurs veröffentlichen.</Banner>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {locations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                readonly={readonly}
                onEdit={() => setEditingLocation(location)}
                onChanged={async (message) => {
                  await reload();
                  showToast(message);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {editingTeacher && (
        <TeacherForm
          existing={editingTeacher === 'new' ? null : editingTeacher}
          onClose={() => setEditingTeacher(null)}
          onSaved={async (message) => {
            setEditingTeacher(null);
            await reload();
            showToast(message);
          }}
        />
      )}
      {editingLocation && (
        <LocationForm
          existing={editingLocation === 'new' ? null : editingLocation}
          onClose={() => setEditingLocation(null)}
          onSaved={async (message) => {
            setEditingLocation(null);
            await reload();
            showToast(message);
          }}
        />
      )}
    </div>
  );
}

function TeacherCard({
  teacher,
  readonly,
  onEdit,
  onChanged,
}: {
  teacher: AdminTeacher;
  readonly: boolean;
  onEdit: () => void;
  onChanged: (message: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{teacher.displayName}</h3>
          <p className="text-sm text-neutral-600">
            {teacher.role || 'Lehrperson'} · {teacher.courseCount} {teacher.courseCount === 1 ? 'Kurs' : 'Kurse'}
          </p>
        </div>
        <Badge tone={teacher.isActive ? 'green' : 'neutral'}>{teacher.isActive ? 'Aktiv' : 'Inaktiv'}</Badge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={onEdit}>{readonly ? 'Ansehen' : 'Bearbeiten'}</Button>
        {!readonly && (
          <Button
            variant="ghost"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError(null);
              try {
                await api.patch(`/api/admin/teachers/${teacher.id}`, { isActive: !teacher.isActive });
                await onChanged(teacher.isActive ? 'Lehrperson deaktiviert.' : 'Lehrperson wieder aktiv.');
              } catch (reason) {
                setError(reason instanceof Error ? reason.message : 'Konnte nicht speichern.');
              } finally {
                setBusy(false);
              }
            }}
          >
            {teacher.isActive ? 'Deaktivieren' : 'Aktivieren'}
          </Button>
        )}
        {!readonly && teacher.courseCount === 0 && !confirmDelete && (
          <Button variant="ghost" onClick={() => setConfirmDelete(true)}>Löschen</Button>
        )}
      </div>
      {confirmDelete && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-neutral-50 p-3 text-sm">
          <span className="mr-auto text-neutral-600">Wirklich löschen?</span>
          <Button
            variant="danger"
            size="sm"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError(null);
              try {
                await api.del(`/api/admin/teachers/${teacher.id}`);
                await onChanged('Lehrperson gelöscht.');
              } catch (reason) {
                setError(reason instanceof Error ? reason.message : 'Konnte nicht löschen.');
                setBusy(false);
              }
            }}
          >
            Ja, löschen
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Abbrechen</Button>
        </div>
      )}
      {error && <ErrorNote>{error}</ErrorNote>}
    </Card>
  );
}

function LocationCard({
  location,
  readonly,
  onEdit,
  onChanged,
}: {
  location: AdminLocation;
  readonly: boolean;
  onEdit: () => void;
  onChanged: (message: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Card className="p-5">
      <h3 className="font-semibold">{location.name}</h3>
      <p className="text-sm text-neutral-600">
        {location.address} · {location.courseCount} {location.courseCount === 1 ? 'Kurs' : 'Kurse'}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={onEdit}>{readonly ? 'Ansehen' : 'Bearbeiten'}</Button>
        {!readonly && location.courseCount === 0 && !confirmDelete && (
          <Button variant="ghost" onClick={() => setConfirmDelete(true)}>Löschen</Button>
        )}
      </div>
      {confirmDelete && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-neutral-50 p-3 text-sm">
          <span className="mr-auto text-neutral-600">Studio wirklich löschen?</span>
          <Button
            variant="danger"
            size="sm"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError(null);
              try {
                await api.del(`/api/admin/locations/${location.id}`);
                await onChanged('Studio gelöscht.');
              } catch (reason) {
                setError(reason instanceof Error ? reason.message : 'Konnte nicht löschen.');
                setBusy(false);
              }
            }}
          >
            Ja, löschen
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Abbrechen</Button>
        </div>
      )}
      {error && <ErrorNote>{error}</ErrorNote>}
    </Card>
  );
}

function TeacherForm({
  existing,
  onClose,
  onSaved,
}: {
  existing: AdminTeacher | null;
  onClose: () => void;
  onSaved: (message: string) => Promise<void>;
}) {
  const [displayName, setDisplayName] = useState(existing?.displayName ?? '');
  const [role, setRole] = useState(existing?.role ?? '');
  const [photoUrl, setPhotoUrl] = useState(existing?.photoUrl ?? '');
  const [isActive, setIsActive] = useState(existing?.isActive ?? true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSave = displayName.trim().length >= 2;

  async function save() {
    if (!canSave) return;
    setBusy(true);
    setError(null);
    const payload: JsonValue = {
      displayName: displayName.trim(),
      role: role.trim() || null,
      photoUrl: photoUrl.trim() || null,
      isActive,
    };
    try {
      if (existing) await api.patch(`/api/admin/teachers/${existing.id}`, payload);
      else await api.post('/api/admin/teachers', payload);
      await onSaved(existing ? 'Lehrperson aktualisiert.' : 'Lehrperson angelegt.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Konnte nicht speichern.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      title={existing ? 'Lehrperson bearbeiten' : 'Neue Lehrperson'}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Abbrechen</Button>
          <Button variant="primary" disabled={busy || !canSave} onClick={save}>
            {busy ? 'Speichern...' : 'Speichern'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Name" required>
          <TextInput value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
        </Field>
        <Field label="Rolle" hint="Zum Beispiel Salsa, Bachata oder Guest.">
          <TextInput value={role} onChange={(event) => setRole(event.target.value)} />
        </Field>
        <Field label="Foto-Pfad oder URL" hint="Optional. Zum Beispiel /photos/team/teacher-12.webp">
          <TextInput value={photoUrl} onChange={(event) => setPhotoUrl(event.target.value)} />
        </Field>
        <label className="flex items-start gap-3 rounded-lg border border-neutral-200 p-4">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--color-salsa)]"
          />
          <span>
            <span className="block text-sm font-semibold">Aktiv für neue Kurse</span>
            <span className="block text-xs text-neutral-500">
              Ausgeschaltete Namen bleiben in bestehenden Kursen, erscheinen aber nicht mehr in der Auswahl.
            </span>
          </span>
        </label>
        {error && <ErrorNote>{error}</ErrorNote>}
      </div>
    </Modal>
  );
}

function LocationForm({
  existing,
  onClose,
  onSaved,
}: {
  existing: AdminLocation | null;
  onClose: () => void;
  onSaved: (message: string) => Promise<void>;
}) {
  const [name, setName] = useState(existing?.name ?? '');
  const [address, setAddress] = useState(existing?.address ?? 'Elisabethenanlage 7, 4051 Basel');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSave = name.trim().length >= 2 && address.trim().length >= 2;

  async function save() {
    if (!canSave) return;
    setBusy(true);
    setError(null);
    const payload: JsonValue = { name: name.trim(), address: address.trim() };
    try {
      if (existing) await api.patch(`/api/admin/locations/${existing.id}`, payload);
      else await api.post('/api/admin/locations', payload);
      await onSaved(existing ? 'Studio aktualisiert.' : 'Studio angelegt.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Konnte nicht speichern.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      title={existing ? 'Studio bearbeiten' : 'Neues Studio'}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Abbrechen</Button>
          <Button variant="primary" disabled={busy || !canSave} onClick={save}>
            {busy ? 'Speichern...' : 'Speichern'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Name" required hint="Zum Beispiel Studio Elisabethenanlage oder Studio 2.">
          <TextInput value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
        <Field label="Adresse" required>
          <TextInput value={address} onChange={(event) => setAddress(event.target.value)} />
        </Field>
        {error && <ErrorNote>{error}</ErrorNote>}
      </div>
    </Modal>
  );
}
