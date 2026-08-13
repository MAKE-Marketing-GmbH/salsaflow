/**
 * Drives the shipped build-thread-caps + package.json build entry.
 * Run: node scripts/build-thread-caps.test.mjs
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  applyBuildThreadCaps,
  DEFAULT_GOMAXPROCS,
  DEFAULT_UV_THREADPOOL_SIZE,
} from './build-thread-caps.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// 1) Empty env gets durable defaults from the shipped function
{
  const env = {};
  applyBuildThreadCaps(env);
  assert.equal(env.GOMAXPROCS, DEFAULT_GOMAXPROCS);
  assert.equal(env.UV_THREADPOOL_SIZE, DEFAULT_UV_THREADPOOL_SIZE);
}

// 2) Whitespace-only counts as unset
{
  const env = { GOMAXPROCS: '  ', UV_THREADPOOL_SIZE: '' };
  applyBuildThreadCaps(env);
  assert.equal(env.GOMAXPROCS, DEFAULT_GOMAXPROCS);
  assert.equal(env.UV_THREADPOOL_SIZE, DEFAULT_UV_THREADPOOL_SIZE);
}

// 3) Explicit override is preserved (operator still can raise/lower)
{
  const env = { GOMAXPROCS: '4', UV_THREADPOOL_SIZE: '8' };
  applyBuildThreadCaps(env);
  assert.equal(env.GOMAXPROCS, '4');
  assert.equal(env.UV_THREADPOOL_SIZE, '8');
}

// 4) package.json build entry is the durable wrapper (no ad-hoc GOMAXPROCS=… chain)
{
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.equal(
    pkg.scripts.build,
    'node scripts/build-prod.mjs',
    'build script must invoke the durable production entry',
  );
  assert.ok(
    fs.existsSync(path.join(root, 'scripts', 'build-prod.mjs')),
    'scripts/build-prod.mjs must exist',
  );
  const prodSrc = fs.readFileSync(path.join(root, 'scripts', 'build-prod.mjs'), 'utf8');
  assert.match(prodSrc, /applyBuildThreadCaps/);
  assert.match(prodSrc, /vite/);
  assert.match(prodSrc, /prerender\.mjs/);
}

console.log('build-thread-caps.test.mjs: OK');
