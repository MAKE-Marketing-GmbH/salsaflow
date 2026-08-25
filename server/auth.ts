import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

// Self-contained Credential-Auth (ARCHITEKTUR.md 1.2 Fallback). Keine externe Auth-Abhaengigkeit,
// lokal verifizierbar. Passwort-Hash via Node-scrypt (keine native Build-Abhaengigkeit),
// Session als signiertes, statusloses Token (HMAC-SHA256) -> keine zusaetzliche Sessions-Tabelle.

const DEVELOPMENT_SECRET = 'dev-insecure-secret-bitte-aendern';
const SCRYPT_KEYLEN = 64;
export const SESSION_COOKIE = 'sf_session';

function signingSecret(): string {
  const configured = process.env.AUTH_SECRET?.trim();
  if (configured) return configured;
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET fehlt: Admin-Sessions sind in Produktion ohne eigenes Secret gesperrt.');
  }
  return DEVELOPMENT_SECRET;
}

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
  const sig = createHmac('sha256', signingSecret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

// Rohform des signierten Session-Tokens. Die Felder sind erst nach den Guards unten belastbar.
type SessionField = string | number | boolean | null | undefined;
type SessionPayload = { sub?: SessionField; exp?: SessionField };

function isNumber(value: SessionField): value is number {
  return typeof value === 'number';
}

function isNonEmptyString(value: SessionField): value is string {
  return typeof value === 'string' && value.length > 0;
}

export function verifySession(token: string | undefined | null): { sub: string } | null {
  if (!token) return null;
  const dot = token.indexOf('.');
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac('sha256', signingSecret()).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    // SAFETY: Der Payload wurde eine Zeile darueber per HMAC gegen SECRET geprueft, stammt also
    // von uns. JSON.parse liefert trotzdem nur `unknown`-Felder; beide werden unten geprueft.
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SessionPayload;
    if (!isNumber(data.exp) || data.exp * 1000 < Date.now()) return null;
    if (!isNonEmptyString(data.sub)) return null;
    return { sub: data.sub };
  } catch {
    return null;
  }
}
