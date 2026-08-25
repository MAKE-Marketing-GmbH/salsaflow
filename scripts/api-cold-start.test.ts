import assert from 'node:assert/strict';
import { z } from 'zod';

process.env.DATABASE_URL = '';

const { runtimeApp } = await import('../api/index.js');

const reset = Object.assign(new Error('TLS connection reset'), { code: 'ECONNRESET' });
const migrationFailure = new Error('Failed query: CREATE SCHEMA IF NOT EXISTS "drizzle"', { cause: reset });
let attempts = 0;
const reports: Error[] = [];
const waits: number[] = [];

const app = await runtimeApp({
  databaseUrl: 'postgres://cold-start.test/salsaflow',
  loadDatabaseApp: async () => {
    attempts += 1;
    throw migrationFailure;
  },
  wait: async (milliseconds) => {
    waits.push(milliseconds);
  },
  report: (error) => reports.push(error),
});

assert.equal(attempts, 2, 'transient database initialization must retry once');
assert.deepEqual(waits, [150], 'the retry must use the bounded cold-start delay');
assert.equal(reports.length, 1, 'the final database initialization failure must be reported once');
assert.equal(reports[0], migrationFailure, 'the reported failure must preserve the migration error');

const schedule = await app.fetch(new Request('http://local.test/api/public/schedule'));
assert.equal(schedule.status, 200, 'the public schedule must survive database initialization failure');
const scheduleBody = z.object({ courses: z.array(z.object({}).passthrough()).min(1) }).parse(await schedule.json());
assert.ok(scheduleBody.courses.length > 0);

const privateRoute = await app.fetch(new Request('http://local.test/api/admin/terms'));
assert.equal(privateRoute.status, 503, 'database-only routes must fail closed without a database');

const permanentFailure = new Error('Database schema is incompatible');
let permanentAttempts = 0;
const permanentReports: Error[] = [];
await runtimeApp({
  databaseUrl: 'postgres://cold-start.test/salsaflow',
  loadDatabaseApp: async () => {
    permanentAttempts += 1;
    throw permanentFailure;
  },
  wait: async () => {
    assert.fail('non-transient database failures must not be retried');
  },
  report: (error) => permanentReports.push(error),
});

assert.equal(permanentAttempts, 1, 'non-transient database initialization must fail after one attempt');
assert.deepEqual(permanentReports, [permanentFailure]);

console.log('api-cold-start.test.ts: OK');
