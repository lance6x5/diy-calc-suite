/** Small numeric helpers shared by calculators. */

const EPS = 1e-9;

/** Coerce to a finite, non-negative number (bad input becomes 0). */
export function num(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Ceil that tolerates floating-point noise (3.0000000001 -> 3). */
export function ceilSafe(x) {
  const c = Math.ceil(x - EPS);
  return c === 0 ? 0 : c; // normalise -0
}

/** Round up to the next multiple of `step` (e.g. 0.25 cubic yards). */
export function ceilTo(x, step) {
  return Math.round(ceilSafe(x / step) * step * 1e6) / 1e6;
}

/** Divide, returning 0 instead of Infinity/NaN when the divisor is 0. */
export function safeDiv(a, b) {
  return b > 0 ? a / b : 0;
}

/** Format a number for display with up to `digits` decimals. */
export function fmt(n, digits = 2) {
  if (!Number.isFinite(n)) return '0';
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

/** Format a currency amount. */
export function money(n) {
  if (!Number.isFinite(n)) return '';
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}
