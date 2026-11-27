/** localStorage wrapper for small settings. Every call is guarded with try/catch. */

const PREFIX = 'diy-calc-suite:';

export function loadSetting(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveSetting(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn('Could not save setting', key, err);
  }
}

export function clearSettings() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.warn('Could not clear settings', err);
  }
}
