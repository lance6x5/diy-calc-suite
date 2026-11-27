// Anonymous visit counter backed by the open-source Abacus service
// (https://github.com/JasonLovesDoggo/abacus). No signup, no key, no cookies.
// Only the first page load of a browser session is counted (/hit); later loads
// just read the total (/get). Nothing from the app or the user is sent: no
// query params, no extra headers, no credentials. Every failure resolves to
// null so the footer simply shows nothing.

export const COUNTER_URL = 'https://abacus.jasoncameron.dev';
export const COUNTER_KEY = 'lance6x5.github.io/diy-calc-suite';
export const SESSION_FLAG = 'diy-calc-suite:visit-counted';
const TIMEOUT_MS = 4000;
const DEV_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

/** True when the browser asks not to be tracked (Do Not Track or Global Privacy Control). */
export function prefersNoTracking(nav) {
  if (!nav) return false;
  return nav.doNotTrack === '1' || nav.globalPrivacyControl === true;
}

function readFlag(storage) {
  try {
    return storage?.getItem(SESSION_FLAG) === '1';
  } catch {
    return false;
  }
}

function writeFlag(storage) {
  try {
    storage?.setItem(SESSION_FLAG, '1');
  } catch {
    // Storage blocked (private mode, quota): the next load may count again.
  }
}

/** Format a count as e.g. "12,345 visits". */
export function formatVisits(value, locale) {
  const n = new Intl.NumberFormat(locale).format(value);
  return `${n} ${value === 1 ? 'visit' : 'visits'}`;
}

async function request(fetchImpl, action) {
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), TIMEOUT_MS) : null;
  try {
    const res = await fetchImpl(`${COUNTER_URL}/${action}/${COUNTER_KEY}`, {
      method: 'GET',
      cache: 'no-store',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: controller?.signal
    });
    if (!res || !res.ok) return null;
    const data = await res.json();
    const value = Number(data?.value);
    return Number.isFinite(value) && value >= 0 ? value : null;
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Count this visit (once per session) and return the total, or null on any
 * failure. Dependencies are injectable for tests; defaults use browser globals.
 * @returns {Promise<{ value: number, label: string } | null>}
 */
export async function loadVisitCount({
  fetchImpl = globalThis.fetch,
  storage = safeSessionStorage(),
  location = globalThis.location,
  nav = globalThis.navigator
} = {}) {
  try {
    if (typeof fetchImpl !== 'function') return null;
    if (DEV_HOSTS.has(location?.hostname)) return null;
    if (nav && nav.onLine === false) return null;

    const shouldHit = !prefersNoTracking(nav) && !readFlag(storage);
    const value = await request(fetchImpl, shouldHit ? 'hit' : 'get');
    if (value == null) return null;
    if (shouldHit) writeFlag(storage);
    return { value, label: formatVisits(value) };
  } catch {
    return null;
  }
}

function safeSessionStorage() {
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
}
