/**
 * Paint calculator (pure). Inputs are imperial: feet, square feet, sq ft per gallon.
 */
import { num, ceilSafe, safeDiv } from '../../lib/math.js';
import { toDisplay, unitLabel, LITERS_PER_GALLON } from '../../lib/units.js';

export const defaults = {
  walls: [
    { length: 12, height: 8 },
    { length: 12, height: 8 },
    { length: 10, height: 8 },
    { length: 10, height: 8 }
  ],
  doors: 1,
  doorArea: 20,
  windows: 2,
  windowArea: 15,
  coats: 2,
  coverage: 350,
  prices: {}
};

/** Core calculation: areas in sq ft and paint in gallons. */
export function calculate(i) {
  const walls = Array.isArray(i.walls) ? i.walls : [];
  const grossArea = walls.reduce((s, w) => s + num(w.length) * num(w.height), 0);
  const openingArea = num(i.doors) * num(i.doorArea) + num(i.windows) * num(i.windowArea);
  const netArea = Math.max(0, grossArea - openingArea);
  const coats = num(i.coats);
  const paintedArea = netArea * coats;
  const gallons = safeDiv(paintedArea, num(i.coverage));
  return { grossArea, openingArea, netArea, coats, paintedArea, gallons };
}

/**
 * Split a gallon amount into whole gallons plus quarts (4 quarts = 1 gallon).
 * Leftover need of 3+ quarts is cheaper/easier as another gallon.
 */
export function gallonsAndQuarts(gallons) {
  if (gallons <= 0) return { gallons: 0, quarts: 0, allGallons: 0 };
  let whole = Math.floor(gallons + 1e-9);
  let quarts = ceilSafe((gallons - whole) * 4);
  if (quarts >= 3) {
    whole += 1;
    quarts = 0;
  }
  return { gallons: whole, quarts, allGallons: ceilSafe(gallons) };
}

/** Metric equivalent: 4 L cans plus 1 L cans. */
export function metricCans(liters) {
  if (liters <= 0) return { cans4: 0, cans1: 0 };
  let cans4 = Math.floor(liters / 4 + 1e-9);
  let cans1 = ceilSafe(liters - cans4 * 4);
  if (cans1 >= 3) {
    cans4 += 1;
    cans1 = 0;
  }
  return { cans4, cans1 };
}

/** Turn a result into display summary + purchasable line items. */
export function present(r, units) {
  const a = (v) => toDisplay(v, 'area', units);
  const au = unitLabel('area', units);
  const summary = [
    { label: 'Gross wall area', value: a(r.grossArea), unit: au },
    { label: 'Doors & windows', value: a(r.openingArea), unit: au },
    { label: 'Net paintable area', value: a(r.netArea), unit: au },
    { label: `Area × ${r.coats} coat(s)`, value: a(r.paintedArea), unit: au }
  ];
  if (units === 'metric') {
    const liters = r.gallons * LITERS_PER_GALLON;
    const { cans4, cans1 } = metricCans(liters);
    summary.push({ label: 'Paint needed (exact)', value: liters, unit: 'L' });
    return {
      summary,
      items: [
        { key: 'can4', label: 'Paint, 4 L can', qty: cans4, unit: 'can', exact: liters / 4, exactUnit: 'cans', priceKey: 'can4' },
        { key: 'can1', label: 'Paint, 1 L can', qty: cans1, unit: 'can', exact: null, exactUnit: '', priceKey: 'can1' }
      ]
    };
  }
  const gq = gallonsAndQuarts(r.gallons);
  summary.push({ label: 'Paint needed (exact)', value: r.gallons, unit: 'gal' });
  summary.push({ label: 'Or buy gallons only', value: gq.allGallons, unit: 'gal' });
  return {
    summary,
    items: [
      { key: 'gallon', label: 'Paint, gallon', qty: gq.gallons, unit: 'gal', exact: r.gallons, exactUnit: 'gal', priceKey: 'gallon' },
      { key: 'quart', label: 'Paint, quart', qty: gq.quarts, unit: 'qt', exact: null, exactUnit: '', priceKey: 'quart' }
    ]
  };
}

export const formula = [
  'Gross area = Σ (wall length × wall height)',
  'Openings = doors × door area + windows × window area',
  'Net area = gross area − openings (never below 0)',
  'Gallons = net area × coats ÷ coverage per gallon',
  'Purchase = whole gallons + leftover quarts (rounded up; 3 or more quarts becomes another gallon)',
  'Metric: litres = gallons × 3.785; bought as 4 L cans plus 1 L cans'
];
