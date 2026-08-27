import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { api, type Meta, type TermListItem } from '@/lib/api';
import { Loading } from '@/admin/ui';
import { TermsList } from '@/admin/TermsList';
import { TermEditor } from '@/admin/TermEditor';
import { DuplicateView } from '@/admin/DuplicateView';
import { EventsManager } from '@/admin/EventsManager';
import { DirectoryManager } from '@/admin/DirectoryManager';

type AdminUser = { id: string; email: string; displayName: string; role: string };

type View =
  | { name: 'list' }
  | { name: 'events' }
  | { name: 'directory' }
  | { name: 'editor'; termId: string }
  | { name: 'duplicate'; termId: string };

export function AdminApp({ user, onLogout }: { user: AdminUser; onLogout: () => void }) {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [terms, setTerms] = useState<TermListItem[] | null>(null);
  const [view, setView] = useState<View>({ name: 'list' });
  const [toast, setToast] = useState<string | null>(null);

  const reloadTerms = useCallback(async () => {
    const data = await api.get<{ terms: TermListItem[] }>('/api/admin/terms');
    setTerms(data.terms);
    return data.terms;
  }, []);

  const reloadMeta = useCallback(async () => {
    const data = await api.get<Meta>('/api/admin/meta');
    setMeta(data);
  }, []);

  useEffect(() => {
    reloadMeta().catch(() => setMeta(null));
    reloadTerms().catch(() => setTerms([]));
  }, [reloadMeta, reloadTerms]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((cur) => (cur === msg ? null : cur)), 4000);
  }, []);

  const readonly = user.role === 'teacher_readonly';

  return (
    <div className="min-h-screen bg-neutral-50 text-black">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <button
            onClick={() => setView({ name: 'list' })}
            className="text-left text-base font-bold tracking-tight"
          >
            Salsaflow <span className="text-[var(--color-salsa)]">Redaktion</span>
          </button>
          <div className="flex items-center gap-3 text-sm text-neutral-600">
            <span className="hidden sm:inline">{user.displayName}</span>
            <button onClick={onLogout} className="rounded-md px-2.5 py-1 hover:bg-neutral-100">
              Abmelden
            </button>
          </div>
        </div>
        <nav aria-label="Redaktionsbereiche" className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-5">
          <NavTab
            current={view.name === 'list' || view.name === 'editor' || view.name === 'duplicate'}
            onClick={() => setView({ name: 'list' })}
          >
            Kurse &amp; Staffeln
          </NavTab>
          <NavTab current={view.name === 'events'} onClick={() => setView({ name: 'events' })}>
            Events &amp; Workshops
          </NavTab>
          <NavTab current={view.name === 'directory'} onClick={() => setView({ name: 'directory' })}>
            Lehrer &amp; Studios
          </NavTab>
        </nav>
      </header>

      {toast && (
        <div className="fixed inset-x-0 top-3 z-[60] flex justify-center px-4">
          <div className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white shadow-lg">
            {toast}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-5 py-8">
        {!meta || !terms ? (
          <Loading label="Kursplan wird geladen..." />
        ) : view.name === 'events' ? (
          <EventsManager readonly={readonly} showToast={showToast} />
        ) : view.name === 'directory' ? (
          <DirectoryManager readonly={readonly} showToast={showToast} onChanged={reloadMeta} />
        ) : view.name === 'list' ? (
          <TermsList
            terms={terms}
            readonly={readonly}
            onOpen={(termId) => setView({ name: 'editor', termId })}
            onDuplicate={(termId) => setView({ name: 'duplicate', termId })}
            reloadTerms={reloadTerms}
            showToast={showToast}
          />
        ) : view.name === 'editor' ? (
          <TermEditor
            termId={view.termId}
            meta={meta}
            readonly={readonly}
            onBack={() => setView({ name: 'list' })}
            reloadTerms={reloadTerms}
            reloadMeta={reloadMeta}
            showToast={showToast}
          />
        ) : (
          <DuplicateView
            sourceTermId={view.termId}
            meta={meta}
            readonly={readonly}
            onCancel={() => setView({ name: 'list' })}
            onDone={async (newTermId) => {
              await reloadTerms();
              setView({ name: 'editor', termId: newTermId });
            }}
            showToast={showToast}
          />
        )}
      </main>
    </div>
  );
}

function NavTab({
  current,
  onClick,
  children,
}: {
  current: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-current={current ? 'page' : undefined}
      className={`min-h-11 whitespace-nowrap border-b-2 px-3 text-sm font-semibold ${
        current
          ? 'border-[var(--color-salsa)] text-[var(--color-salsa)]'
          : 'border-transparent text-neutral-600 hover:text-black'
      }`}
    >
      {children}
    </button>
  );
}
