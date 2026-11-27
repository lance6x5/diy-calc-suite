/**
 * Unit helpers. All calculator state is stored in IMPERIAL units; these helpers
 * convert values to/from the user's chosen display system.
 */

/** Dimension kinds: imperial label, metric label, and factor (metric = imperial * factor). */
export const DIMS = {
  length: { imperial: 'ft', metric: 'm', factor: 0.3048 },
  small: { imperial: 'in', metric: 'cm', factor: 2.54 },
  area: { imperial: 'sq ft', metric: 'm²', factor: 0.09290304 },
  volume: { imperial: 'cu ft', metric: 'm³', factor: 0.028316846592 },
  coverage: { imperial: 'sq ft/gal', metric: 'm²/L', factor: 0.09290304 / 3.785411784 },
  bag: { imperial: 'cu ft', metric: 'L', factor: 28.316846592 },
  none: { imperial: '', metric: '', factor: 1 }
};

export const CU_FT_PER_CU_YD = 27;
export const LITERS_PER_GALLON = 3.785411784;
export const KG_PER_LB = 0.45359237;

/** Convert an imperial value to the display system. */
export function toDisplay(value, dim, units) {
  const d = DIMS[dim] || DIMS.none;
  return units === 'metric' ? value * d.factor : value;
}

/** Convert a display-system value back to imperial. */
export function fromDisplay(value, dim, units) {
  const d = DIMS[dim] || DIMS.none;
  return units === 'metric' ? value / d.factor : value;
}

/** Unit label for a dimension in the given system. */
export function unitLabel(dim, units) {
  const d = DIMS[dim] || DIMS.none;
  return units === 'metric' ? d.metric : d.imperial;
}
