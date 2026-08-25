#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const routesPath = path.join(root, 'src', 'routes.tsx');
const vercelPath = path.join(root, 'vercel.json');

function routeRedirects(source) {
  const redirects = source
    .split('\n')
    .map((line) => line.match(/\{\s*path:\s*'([^']+)'[^}]*redirectTo:\s*'([^']+)'[^}]*\}/))
    .filter(Boolean)
    .map((match) => ({ source: match[1], destination: match[2], permanent: true }));

  if (redirects.length === 0) throw new Error('Keine redirectTo-Routen in src/routes.tsx gefunden.');
  const sources = new Set();
  for (const redirect of redirects) {
    if (sources.has(redirect.source)) throw new Error(`Doppelter Redirect: ${redirect.source}`);
    sources.add(redirect.source);
  }
  return redirects;
}

const expected = routeRedirects(fs.readFileSync(routesPath, 'utf8'));
const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));

if (process.argv.includes('--write')) {
  config.redirects = expected;
  fs.writeFileSync(vercelPath, `${JSON.stringify(config, null, 2)}\n`);
  console.log(`vercel.json: ${expected.length} Redirects synchronisiert.`);
  process.exit(0);
}

const actual = config.redirects ?? [];
if (JSON.stringify(actual) !== JSON.stringify(expected)) {
  console.error(`vercel.json ist nicht synchron: ${actual.length} statt ${expected.length} kanonische Redirects.`);
  console.error('Fix: npm run sync:redirects');
  process.exit(1);
}

console.log(`vercel.json: ${expected.length} Redirects PASS.`);
