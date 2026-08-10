import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

// Self-contained Credential-Auth (ARCHITEKTUR.md 1.2 Fallback). Keine externe Auth-Abhaengigkeit,
// lokal verifizierbar. Passwort-Hash via Node-scrypt (keine native Build-Abhaengigkeit),
// Session als signiertes, statusloses Token (HMAC-SHA256) -> keine zusaetzliche Sessions-Tabelle.

const SECRET = process.env.AUTH_SECRET || 'dev-insecure-secret-bitte-aendern';
const SCRYPT_KEYLEN = 64;
export const SESSION_COOKIE = 'sf_session';

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN);
  return `scrypt$${salt.toString('hex')}$${derived.toString('hex')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const salt = Buffer.from(parts[1], 'hex');
  const expected = Buffer.from(parts[2], 'hex');
  if (expected.length === 0) return false;
  const actual = scryptSync(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function issueSession(userId: string, ttlSeconds = 60 * 60 * 8): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = Buffer.from(JSON.stringify({ sub: userId, exp })).toString('base64url');
  const sig = createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySession(token: string | undefined | null): { sub: string } | null {
  if (!token) return null;
  const dot = token.indexOf('.');
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac('sha256', SECRET).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      sub?: unknown;
      exp?: unknown;
    };
    if (typeof data.exp !== 'number' || data.exp * 1000 < Date.now()) return null;
    if (typeof data.sub !== 'string' || data.sub.length === 0) return null;
    return { sub: data.sub };
  } catch {
    return null;
  }
}
