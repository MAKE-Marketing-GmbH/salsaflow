#!/usr/bin/env node
/**
 * Holt die neuesten Reels von @salsaflowdc und schreibt den Datenblock in
 * src/public/social/instagram-feed.ts neu.
 *
 *   node scripts/refresh-instagram-feed.mjs            # schreibt die Datei
 *   node scripts/refresh-instagram-feed.mjs --dry-run  # zeigt nur, was käme
 *
 * Best effort, mit Absicht. Instagram schützt die Profilseite gegen Server-Abrufe.
 * Gemessen am 14.08.2026 von diesem Rechner aus:
 *   - www.instagram.com/salsaflowdc/          -> HTTP 302 auf /accounts/login
 *   - Googlebot-UA                            -> HTTP 429
 *   - api/v1/users/web_profile_info           -> HTTP 400
 *   - r.jina.ai-Spiegel                       -> HTTP 200, aber Login-Wand ohne Posts
 * In allen vier Fällen bricht dieses Skript mit Exit 1 ab und lässt die Datei in Ruhe.
 * Das ist der erwartete Ausgang ohne Login-Cookie, kein Defekt.
 *
 * Läuft es doch durch (anderes Netz, Cookie in IG_COOKIE, Proxy), übernimmt es die
 * Shortcodes in der Reihenfolge der Profilseite, also neueste zuerst. Titel schreibt es
 * NICHT: die Caption steht nicht im ausgelieferten HTML. Für neue Shortcodes setzt es
 * einen Platzhalter-Titel, den ein Mensch danach ersetzen muss. Titel und Poster
 * bekannter Shortcodes bleiben erhalten.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const feedFile = path.join(root, 'src/public/social/instagram-feed.ts');
const BEGIN = '// --- BEGIN INSTAGRAM-FEED-DATEN (refresh-instagram-feed.mjs schreibt ab hier) ---';
const END = '// --- END INSTAGRAM-FEED-DATEN ---';
const PROFIL = 'https://www.instagram.com/salsaflowdc/';
const SPIEGEL = 'https://r.jina.ai/https://www.instagram.com/salsaflowdc/';
const MAX_POSTS = 6;
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const dryRun = process.argv.includes('--dry-run');

function fehler(zeile, hinweis) {
  process.stderr.write(`\nAbbruch: ${zeile}\n${hinweis}\n\nDie Datei bleibt unverändert.\n`);
  process.exit(1);
}

async function holen(url) {
  const kopf = { 'User-Agent': UA, 'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8' };
  if (process.env.IG_COOKIE) kopf.Cookie = process.env.IG_COOKIE;
  try {
    const antwort = await fetch(url, { headers: kopf, redirect: 'follow', signal: AbortSignal.timeout(30000) });
    return { status: antwort.status, text: await antwort.text(), url: antwort.url };
  } catch (fehlerObjekt) {
    return { status: 0, text: '', url, netzfehler: fehlerObjekt.message };
  }
}

/** Zieht Shortcodes in Reihenfolge des Auftretens. Die Profilseite listet neueste zuerst. */
function shortcodesLesen(html) {
  const treffer = [];
  const muster = [
    /"shortcode"\s*:\s*"([A-Za-z0-9_-]{8,20})"/g,
    /(?:href|url)="?\\?\/(reel|p)\/([A-Za-z0-9_-]{8,20})\//g,
    /instagram\.com\/(reel|p)\/([A-Za-z0-9_-]{8,20})\//g,
  ];
  for (const regel of muster) {
    for (const fund of html.matchAll(regel)) {
      const code = fund.length > 2 ? fund[2] : fund[1];
      const typ = fund.length > 2 ? (fund[1] === 'reel' ? 'reel' : 'post') : 'reel';
      if (!treffer.some((eintrag) => eintrag.shortcode === code)) treffer.push({ shortcode: code, type: typ });
    }
  }
  return treffer.slice(0, MAX_POSTS);
}

/** Liest die alten Einträge, damit Titel und Poster einen Refresh überleben. */
function altbestandLesen(quelle) {
  const block = quelle.slice(quelle.indexOf(BEGIN), quelle.indexOf(END));
  const alt = new Map();
  for (const treffer of block.matchAll(/\{([\s\S]*?)\},?\n/g)) {
    const eintrag = treffer[1];
    const feld = (name) => eintrag.match(new RegExp(`${name}:\\s*'([^']*)'`))?.[1];
    const zahl = (name) => eintrag.match(new RegExp(`${name}:\\s*(\\d+)`))?.[1];
    const code = feld('shortcode');
    if (code) {
      alt.set(code, {
        titel: feld('titel'),
        titelEn: feld('titelEn'),
        poster: feld('poster'),
        posterWidth: zahl('posterWidth'),
        posterHeight: zahl('posterHeight'),
      });
    }
  }
  return alt;
}

function blockSchreiben(posts, alt) {
  const zeilen = posts.map(({ shortcode, type }) => {
    const bekannt = alt.get(shortcode) ?? {};
    const titel = bekannt.titel ?? 'TITEL ERGAENZEN';
    const titelEn = bekannt.titelEn ?? titel;
    const posterZeilen = bekannt.poster
      ? [
          `    poster: '${bekannt.poster}',`,
          bekannt.posterWidth ? `    posterWidth: ${bekannt.posterWidth},` : null,
          bekannt.posterHeight ? `    posterHeight: ${bekannt.posterHeight},` : null,
        ].filter(Boolean)
      : [];
    return [
      '  {',
      `    shortcode: '${shortcode}',`,
      `    url: 'https://www.instagram.com/${type}/${shortcode}/',`,
      `    titel: '${titel.replaceAll("'", "\\'")}',`,
      `    titelEn: '${titelEn.replaceAll("'", "\\'")}',`,
      `    type: '${type}',`,
      ...posterZeilen,
      '  },',
    ].join('\n');
  });
  return `${BEGIN}\nconst FEED: FeedPost[] = [\n${zeilen.join('\n')}\n];\n${END}`;
}

const quelle = await fs.readFile(feedFile, 'utf8');
if (!quelle.includes(BEGIN) || !quelle.includes(END)) {
  fehler('Die Marker BEGIN/END fehlen in instagram-feed.ts.', 'Setze beide Kommentarzeilen wieder um den FEED-Block.');
}

let posts = [];
const versuche = [];
for (const url of [PROFIL, SPIEGEL]) {
  const antwort = await holen(url);
  versuche.push(`  ${url}\n    -> ${antwort.netzfehler ? `Netzfehler: ${antwort.netzfehler}` : `HTTP ${antwort.status}, ${antwort.text.length} Zeichen`}`);
  if (antwort.status === 200) {
    posts = shortcodesLesen(antwort.text);
    if (posts.length) break;
  }
}

if (!posts.length) {
  fehler(
    'Instagram hat keine Beiträge geliefert.',
    `Versucht:\n${versuche.join('\n')}\n\n` +
      'Instagram sperrt Abrufe ohne Login aus. Zwei Auswege:\n' +
      '  1. IG_COOKIE="sessionid=..." setzen und erneut starten.\n' +
      '  2. Von Hand pflegen: Profil im Browser öffnen, Shortcodes aus den Reel-URLs\n' +
      '     kopieren und in src/public/social/instagram-feed.ts eintragen.',
  );
}

const alt = altbestandLesen(quelle);
const neu = quelle
  .replace(quelle.slice(quelle.indexOf(BEGIN), quelle.indexOf(END) + END.length), blockSchreiben(posts, alt))
  .replace(/FEED_STAND = \{[^}]*\}/, `FEED_STAND = { datum: '${new Date().toISOString().slice(0, 10)}', quelle: 'profil-abruf' as 'redaktion' | 'profil-abruf' }`);

process.stdout.write(`Gefunden: ${posts.length} Beiträge\n${posts.map((p) => `  ${p.type} ${p.shortcode}${alt.has(p.shortcode) ? '' : '  << Titel fehlt, bitte ergänzen'}`).join('\n')}\n`);

if (dryRun) {
  process.stdout.write('\n--dry-run: nichts geschrieben.\n');
} else {
  await fs.writeFile(feedFile, neu);
  process.stdout.write(`\nGeschrieben: ${feedFile}\nPrüfe danach: npx tsc -p tsconfig.json --noEmit\n`);
}
