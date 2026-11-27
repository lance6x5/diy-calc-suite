/**
 * Calculator registry. To add a calculator, create a folder with calc.js,
 * a Form component and index.js, then add it to this array.
 */
import paint from './paint/index.js';
import deck from './deck/index.js';
import concrete from './concrete/index.js';
import drywall from './drywall/index.js';
import flooring from './flooring/index.js';
import landscape from './landscape/index.js';

export const CALCULATORS = [paint, deck, concrete, drywall, flooring, landscape];

export function getCalculator(id) {
  return CALCULATORS.find((c) => c.id === id);
}

/** Merge saved inputs over defaults (one level deep for nested objects). */
export function mergeInputs(defaults, saved) {
  const out = structuredClone(defaults);
  if (!saved || typeof saved !== 'object') return out;
  for (const [k, v] of Object.entries(saved)) {
    const d = out[k];
    if (d && typeof d === 'object' && !Array.isArray(d) && v && typeof v === 'object' && !Array.isArray(v)) out[k] = { ...d, ...v };
    else if (k in out && v !== undefined && v !== null) out[k] = v;
  }
  return out;
}
