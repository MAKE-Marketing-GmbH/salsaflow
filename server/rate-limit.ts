// Einfaches Mengenlimit pro IP, im Arbeitsspeicher.
//
// Warum es das braucht: Kontaktformular und Reservierung loesen je eine Mail an das Studio aus.
// Ohne Limit kann jemand das Postfach fluten; der Honeypot haelt nur naive Bots auf. Drei
// parallele Anfragen liefen im Test in 0,16 s durch.
//
// Warum im Speicher und nicht in einer Datenbank: Es gibt keine. Auf Vercel lebt der Zaehler
// pro Funktions-Instanz, ein verteilter Angreifer umgeht ihn also teilweise. Er stoppt aber
// genau den Fall, der real vorkommt — dieselbe Quelle schickt in kurzer Zeit viele Anfragen.
// Ein echtes Limit gehoert an den Rand (Vercel WAF); das hier ist die Untergrenze, nicht das Ziel.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Alte Eintraege wegwerfen, damit die Map nicht unbegrenzt waechst. */
function sweep(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

/**
 * @param key     Kennung des Aufrufers, ueblich die IP plus Routenname.
 * @param limit   Erlaubte Anfragen je Fenster.
 * @param windowMs Fensterlaenge in Millisekunden.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (bucket.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  bucket.count += 1;
  return { ok: true };
}

/** IP des Aufrufers aus den ueblichen Proxy-Kopfzeilen. Fallback haelt alle Unbekannten zusammen. */
export function clientKey(headers: { get(name: string): string | null }, route: string): string {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const real = headers.get('x-real-ip')?.trim();
  return `${route}:${forwarded || real || 'unknown'}`;
}
