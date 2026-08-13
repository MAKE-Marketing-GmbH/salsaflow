#!/usr/bin/env node
/**
 * Production build entry with durable process/thread caps.
 *
 * esbuild (Go) can spawn one OS thread per CPU; under cgroup TasksMax pressure
 * that fails with errno=11 / "failed to create new OS thread". Cap GOMAXPROCS
 * and Node's libuv pool so plain `npm run build` stays reliable without manual
 * env gymnastics.
 *
 * Override if needed: GOMAXPROCS=4 UV_THREADPOOL_SIZE=8 npm run build
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyBuildThreadCaps } from './build-thread-caps.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bin = (name) => path.join(root, 'node_modules', '.bin', name);

applyBuildThreadCaps(process.env);

function run(cmd, args) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  });
  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(bin('tsc'), ['-p', 'tsconfig.json', '--noEmit']);
run(bin('tsc'), ['-p', 'tsconfig.node.json', '--noEmit']);
run(bin('vite'), ['build']);
run(process.execPath, [path.join(root, 'scripts', 'prerender.mjs')]);
