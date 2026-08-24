import { useCallback, useEffect, useState } from 'react';
import { api, type Meta, type TermListItem } from '@/lib/api';
import { Loading } from '@/admin/ui';
import { TermsList } from '@/admin/TermsList';
import { TermEditor } from '@/admin/TermEditor';
import { DuplicateView } from '@/admin/DuplicateView';
import { BalanceView } from '@/admin/BalanceView';
import { EventsManager } from '@/admin/EventsManager';

type AdminUser = { id: string; email: string; displayName: string; role: string };

type View =
  | { name: 'list' }
  | { name: 'events' }
  | { name: 'editor'; termId: string }
  | { name: 'duplicate'; termId: string }
  | { name: 'balance'; termId: string };

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

  useEffect(() => {
    api.get<Meta>('/api/admin/meta').then(setMeta).catch(() => setMeta(null));
    reloadTerms().catch(() => setTerms([]));
  }, [reloadTerms]);

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
          <button
            onClick={() => setView({ name: 'list' })}
            aria-current={view.name !== 'events' ? 'page' : undefined}
            className={`min-h-11 whitespace-nowrap border-b-2 px-3 text-sm font-semibold ${
              view.name !== 'events'
                ? 'border-[var(--color-salsa)] text-[var(--color-salsa)]'
                : 'border-transparent text-neutral-600 hover:text-black'
            }`}
          >
            Kurse &amp; Staffeln
          </button>
          <button
            onClick={() => setView({ name: 'events' })}
            aria-current={view.name === 'events' ? 'page' : undefined}
            className={`min-h-11 whitespace-nowrap border-b-2 px-3 text-sm font-semibold ${
              view.name === 'events'
                ? 'border-[var(--color-salsa)] text-[var(--color-salsa)]'
                : 'border-transparent text-neutral-600 hover:text-black'
            }`}
          >
            Events &amp; Workshops
          </button>
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
            onShowBalance={() => setView({ name: 'balance', termId: view.termId })}
            reloadTerms={reloadTerms}
            showToast={showToast}
          />
        ) : view.name === 'balance' ? (
          <BalanceView
            termId={view.termId}
            readonly={readonly}
            onBack={() => setView({ name: 'editor', termId: view.termId })}
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
