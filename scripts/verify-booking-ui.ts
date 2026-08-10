// Gate: Buchungs-UI-Texte duerfen die Tanz-Rollen nie invertieren.
// Hintergrund: Sol-Fund 2026-07-22 — leader/follower-Labels waren vertauscht.
// @ts-expect-error -- tsconfig.node.json (scripts) hat kein --jsx; i18n.tsx wird nur zur Laufzeit via tsx gezogen.
import { BOOKING_UI } from '../src/lib/i18n.js';

const checks: { name: string; ok: boolean }[] = [];
const check = (name: string, ok: boolean) => checks.push({ name, ok: !!ok });

check('de: leader heisst Mann', BOOKING_UI.de.leader === 'Mann');
check('de: follower heisst Frau', BOOKING_UI.de.follower === 'Frau');
check('en: leader heisst Man', BOOKING_UI.en.leader === 'Man');
check('en: follower heisst Woman', BOOKING_UI.en.follower === 'Woman');
// Helper-Text muss dieselbe Richtung behaupten (Follower=Frauen, Leader=Maenner).
check('de: roleHelper nennt Frauen als Follower', /Frauen als Follower/.test(BOOKING_UI.de.roleHelper));
check('de: roleHelper nennt Maenner als Leader', /Männer als Leader/.test(BOOKING_UI.de.roleHelper));

const failed = checks.filter((c) => !c.ok);
for (const c of checks) console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}`);
console.log(`VERDICT: ${failed.length === 0 ? 'PASS' : 'FAIL'} (${checks.length - failed.length}/${checks.length})`);
process.exit(failed.length === 0 ? 0 : 1);
