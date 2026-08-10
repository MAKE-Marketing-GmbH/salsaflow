import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Seo } from '@/lib/seo';
import { AdminApp } from '@/admin/AdminApp';

type AdminUser = {
  id: string;
  email: string;
  displayName: string;
  role: string;
};

// Login-Screen + nach Login die Admin-Verwaltung (Etappe 6: Staffeln + Kurse + Duplizieren).
export function App() {
  const [health, setHealth] = useState<'?' | 'ok' | 'down'>('?');
  const [email, setEmail] = useState('admin@salsaflow-dc.com');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<AdminUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => (r.ok ? setHealth('ok') : setHealth('down')))
      .catch(() => setHealth('down'));
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.user && setUser(d.user as AdminUser))
      .catch(() => {});
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Login fehlgeschlagen');
        return;
      }
      setUser(data.user as AdminUser);
      setPassword('');
    } catch {
      setError('Server nicht erreichbar');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  }

  // Nach erfolgreichem Login: die Admin-Verwaltung (eigene Vollbild-Oberflaeche).
  if (user) {
    return (
      <>
        <Seo page="admin" noindex />
        <AdminApp user={user} onLogout={logout} />
      </>
    );
  }

  return (
    <>
      <Seo page="admin" noindex />
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Salsaflow DC <span className="text-[var(--color-salsa)]">Admin</span>
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          Bitte anmelden. API-Status:{' '}
          <span
            className={cn(
              'font-medium',
              health === 'ok' && 'text-green-700',
              health === 'down' && 'text-[var(--color-salsa)]',
            )}
          >
            {health === '?' ? 'prüfe...' : health === 'ok' ? 'erreichbar' : 'offline'}
          </span>
        </p>
      </header>

      {(
        <form onSubmit={login} className="space-y-3 rounded-lg border border-neutral-200 p-5">
          <label className="block text-sm font-medium">
            E-Mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-medium">
            Passwort
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>
          {error && <p className="text-sm text-[var(--color-salsa)]">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-[var(--color-salsa)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>
      )}
      </main>
    </>
  );
}
