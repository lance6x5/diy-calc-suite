/**
 * Concrete calculator (pure). Shapes: slab, footing (cylinder), steps.
 * Inputs are imperial (feet for large dimensions, inches for small ones).
 */
import { num, ceilSafe, ceilTo, safeDiv } from '../../lib/math.js';
import { toDisplay, unitLabel, CU_FT_PER_CU_YD, KG_PER_LB } from '../../lib/units.js';

/** Approximate yield (cu ft) of pre-mixed bags. */
export const BAG_YIELDS = { 40: 0.3, 60: 0.45, 80: 0.6 };

export const SHAPES = ['slab', 'footing', 'steps'];

export const defaults = {
  shape: 'slab',
  slab: { length: 10, width: 10, thickness: 4 },
  footing: { diameter: 12, depth: 36, count: 4 },
  steps: { width: 4, rise: 7, run: 11, count: 3 },
  waste: 10,
  buyAs: '80',
  prices: {}
};

export function slabVolume({ length, width, thickness }) {
  return num(length) * num(width) * (num(thickness) / 12);
}

export function footingVolume({ diameter, depth, count }) {
  const r = num(diameter) / 24; // inches -> ft radius
  return Math.PI * r * r * (num(depth) / 12) * Math.floor(num(count));
}

/** Solid stair: step k (1..n) is k risers tall and one run deep. */
export function stepsVolume({ width, rise, run, count }) {
  const n = Math.floor(num(count));
  return num(width) * (num(run) / 12) * (num(rise) / 12) * ((n * (n + 1)) / 2);
}

export function calculate(i) {
  const shape = SHAPES.includes(i.shape) ? i.shape : 'slab';
  const base =
    shape === 'footing' ? footingVolume(i.footing || {}) : shape === 'steps' ? stepsVolume(i.steps || {}) : slabVolume(i.slab || {});
  const cuFt = base * (1 + num(i.waste) / 100);
  const cuYd = cuFt / CU_FT_PER_CU_YD;
  const bags = {};
  const bagsExact = {};
  for (const [lb, y] of Object.entries(BAG_YIELDS)) {
    bagsExact[lb] = safeDiv(cuFt, y);
    bags[lb] = ceilSafe(bagsExact[lb]);
  }
  const buyAs = i.buyAs === 'bulk' || BAG_YIELDS[i.buyAs] ? String(i.buyAs) : '80';
  return { shape, baseCuFt: base, cuFt, cuYd, bags, bagsExact, buyAs };
}

export function present(r, units) {
  const metric = units === 'metric';
  const vu = unitLabel('volume', units);
  const m3 = toDisplay(r.cuFt, 'volume', units);
  const summary = [
    { label: 'Volume (no waste)', value: toDisplay(r.baseCuFt, 'volume', units), unit: vu },
    { label: 'Volume incl. waste', value: m3, unit: vu }
  ];
  if (!metric) summary.push({ label: 'Cubic yards incl. waste', value: r.cuYd, unit: 'cu yd' });
  const bulk = metric
    ? { key: 'm3', label: 'Ready-mix (0.1 m³ steps)', qty: ceilTo(m3, 0.1), unit: 'm³', exact: m3, exactUnit: 'm³', priceKey: 'm3' }
    : { key: 'yard', label: 'Ready-mix (¼ yd steps)', qty: ceilTo(r.cuYd, 0.25), unit: 'cu yd', exact: r.cuYd, exactUnit: 'cu yd', priceKey: 'yard' };
  const bagItems = Object.keys(BAG_YIELDS).map((lb) => ({
    key: `bag${lb}`,
    label: metric ? `${lb} lb (${Math.round(lb * KG_PER_LB)} kg) bags` : `${lb} lb bags`,
    qty: r.bags[lb],
    unit: 'bags',
    exact: r.bagsExact[lb],
    exactUnit: 'bags',
    priceKey: `bag${lb}`
  }));
  // Only the chosen purchase option becomes a shopping item; the others are shown for comparison.
  const all = [bulk, ...bagItems];
  const chosenKey = r.buyAs === 'bulk' ? bulk.key : `bag${r.buyAs}`;
  for (const it of all) {
    if (it.key !== chosenKey) summary.push({ label: `Alternative: ${it.label}`, value: it.qty, unit: it.unit });
  }
  return { summary, items: all.filter((it) => it.key === chosenKey) };
}

export const formula = [
  'Slab = length × width × (thickness in ÷ 12)',
  'Footing (cylinder) = π × (diameter ÷ 2)² × depth × count',
  'Steps = width × run × rise × n(n+1)/2 (each step k is k risers tall)',
  'Total = volume × (1 + waste %); cubic yards = cubic feet ÷ 27',
  'Bags = total cu ft ÷ bag yield (40 lb ≈ 0.30, 60 lb ≈ 0.45, 80 lb ≈ 0.60 cu ft)',
  'Choose ready-mix or one bag size under "Buy as"; the other options are listed for comparison'
];
