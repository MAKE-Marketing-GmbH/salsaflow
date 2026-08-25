import assert from 'node:assert/strict';
import { issueSession, verifySession } from '../server/auth.js';
import { sessionCookieIsSecure } from '../server/app.js';

const originalAuthSecret = process.env.AUTH_SECRET;
const originalNodeEnv = process.env.NODE_ENV;
const originalVercel = process.env.VERCEL;

function restoreEnvironment() {
  if (originalAuthSecret === undefined) delete process.env.AUTH_SECRET;
  else process.env.AUTH_SECRET = originalAuthSecret;

  if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = originalNodeEnv;

  if (originalVercel === undefined) delete process.env.VERCEL;
  else process.env.VERCEL = originalVercel;
}

try {
  delete process.env.AUTH_SECRET;
  delete process.env.VERCEL;
  process.env.NODE_ENV = 'test';

  const localToken = issueSession('local-admin', 60);
  assert.deepEqual(verifySession(localToken), { sub: 'local-admin' });
  assert.equal(sessionCookieIsSecure(), false);

  process.env.NODE_ENV = 'production';
  assert.throws(
    () => issueSession('production-admin', 60),
    /AUTH_SECRET fehlt/,
    'production must fail closed without AUTH_SECRET',
  );
  assert.equal(sessionCookieIsSecure(), true);

  process.env.AUTH_SECRET = 'production-test-secret';
  const productionToken = issueSession('production-admin', 60);
  assert.deepEqual(verifySession(productionToken), { sub: 'production-admin' });

  process.env.NODE_ENV = 'test';
  process.env.VERCEL = '1';
  assert.equal(sessionCookieIsSecure(), true);
} finally {
  restoreEnvironment();
}

console.log('auth-security.test.ts: OK');
