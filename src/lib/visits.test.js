import { describe, it, expect, vi } from 'vitest';
import { loadVisitCount, formatVisits, COUNTER_URL, COUNTER_KEY, SESSION_FLAG } from './visits.js';

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k)
  };
}

function okFetch(value) {
  return vi.fn(async () => ({ ok: true, json: async () => ({ value }) }));
}

const prod = { hostname: 'lance6x5.github.io' };
const nav = { onLine: true };

describe('visit counter', () => {
  it('hits on the first load of a session, then only gets', async () => {
    const storage = memoryStorage();
    const fetchImpl = okFetch(12345);

    const first = await loadVisitCount({ fetchImpl, storage, location: prod, nav });
    expect(fetchImpl).toHaveBeenLastCalledWith(`${COUNTER_URL}/hit/${COUNTER_KEY}`, expect.objectContaining({ cache: 'no-store', credentials: 'omit' }));
    expect(first).toEqual({ value: 12345, label: formatVisits(12345) });
    expect(storage.getItem(SESSION_FLAG)).toBe('1');

    await loadVisitCount({ fetchImpl, storage, location: prod, nav });
    expect(fetchImpl).toHaveBeenLastCalledWith(`${COUNTER_URL}/get/${COUNTER_KEY}`, expect.any(Object));
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('returns null on network errors and non-OK responses', async () => {
    const storage = memoryStorage();
    const failing = vi.fn(async () => {
      throw new TypeError('offline');
    });
    expect(await loadVisitCount({ fetchImpl: failing, storage, location: prod, nav })).toBeNull();
    expect(storage.getItem(SESSION_FLAG)).toBeNull();

    const notFound = vi.fn(async () => ({ ok: false, status: 404, json: async () => ({ error: 'Key not found' }) }));
    expect(await loadVisitCount({ fetchImpl: notFound, storage, location: prod, nav })).toBeNull();
  });

  it('respects Do Not Track and Global Privacy Control (get only)', async () => {
    for (const privacyNav of [{ doNotTrack: '1' }, { globalPrivacyControl: true }]) {
      const storage = memoryStorage();
      const fetchImpl = okFetch(7);
      const result = await loadVisitCount({ fetchImpl, storage, location: prod, nav: privacyNav });
      expect(fetchImpl).toHaveBeenCalledWith(`${COUNTER_URL}/get/${COUNTER_KEY}`, expect.any(Object));
      expect(fetchImpl).not.toHaveBeenCalledWith(`${COUNTER_URL}/hit/${COUNTER_KEY}`, expect.anything());
      expect(result.value).toBe(7);
      expect(storage.getItem(SESSION_FLAG)).toBeNull();
    }
  });

  it('makes no request on localhost', async () => {
    const fetchImpl = okFetch(1);
    for (const hostname of ['localhost', '127.0.0.1']) {
      expect(await loadVisitCount({ fetchImpl, storage: memoryStorage(), location: { hostname }, nav })).toBeNull();
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('survives storage that throws', async () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      }
    };
    const result = await loadVisitCount({ fetchImpl: okFetch(3), storage: broken, location: prod, nav });
    expect(result.value).toBe(3);
  });

  it('formats counts with Intl.NumberFormat', () => {
    expect(formatVisits(12345, 'en-US')).toBe('12,345 visits');
    expect(formatVisits(1, 'en-US')).toBe('1 visit');
  });
});
