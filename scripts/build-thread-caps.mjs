/**
 * Durable defaults for the production build process/thread budget.
 * Used by scripts/build-prod.mjs so plain `npm run build` never relies on
 * the operator exporting GOMAXPROCS by hand.
 */
export const DEFAULT_GOMAXPROCS = '2';
export const DEFAULT_UV_THREADPOOL_SIZE = '4';

/**
 * Apply build thread/process caps onto an env object (mutates and returns it).
 * Existing non-empty values are preserved so operators can still override.
 *
 * @param {NodeJS.ProcessEnv | Record<string, string | undefined>} env
 * @returns {NodeJS.ProcessEnv | Record<string, string | undefined>}
 */
export function applyBuildThreadCaps(env) {
  if (!env.GOMAXPROCS || String(env.GOMAXPROCS).trim() === '') {
    env.GOMAXPROCS = DEFAULT_GOMAXPROCS;
  }
  if (!env.UV_THREADPOOL_SIZE || String(env.UV_THREADPOOL_SIZE).trim() === '') {
    env.UV_THREADPOOL_SIZE = DEFAULT_UV_THREADPOOL_SIZE;
  }
  return env;
}
