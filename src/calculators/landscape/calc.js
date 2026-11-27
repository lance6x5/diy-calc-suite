/**
 * Mulch / gravel / soil calculator (pure). Area in sq ft, depth in inches,
 * bag size in cu ft.
 */
import { num, ceilSafe, ceilTo, safeDiv } from '../../lib/math.js';
import { toDisplay, unitLabel, CU_FT_PER_CU_YD } from '../../lib/units.js';

/** Typical retail bag sizes (cu ft) per material, used as defaults. */
export const MATERIALS = {
  mulch: { label: 'Mulch', bagSize: 2 },
  gravel: { label: 'Gravel', bagSize: 0.5 },
  soil: { label: 'Soil', bagSize: 1 }
};

export const defaults = {
  material: 'mulch',
  area: 100,
  depth: 3,
  bagSize: 2,
  buyAs: 'bags',
  prices: {}
};

export function calculate(i) {
  const cuFt = num(i.area) * (num(i.depth) / 12);
  const cuYd = cuFt / CU_FT_PER_CU_YD;
  const bagsExact = safeDiv(cuFt, num(i.bagSize));
  const bags = ceilSafe(bagsExact);
  const material = MATERIALS[i.material] ? i.material : 'mulch';
  return { material, cuFt, cuYd, bagsExact, bags, bagSize: num(i.bagSize), buyAs: i.buyAs === 'bulk' ? 'bulk' : 'bags' };
}

export function present(r, units) {
  const metric = units === 'metric';
  const name = MATERIALS[r.material].label;
  const bagLabel = `${name} bags (${+toDisplay(r.bagSize, 'bag', units).toFixed(1)} ${unitLabel('bag', units)})`;
  const m3 = toDisplay(r.cuFt, 'volume', units);
  const summary = [{ label: 'Volume', value: m3, unit: unitLabel('volume', units) }];
  if (!metric) summary.push({ label: 'Cubic yards', value: r.cuYd, unit: 'cu yd' });
  const bulk = metric
    ? { key: 'm3', label: `Bulk ${name.toLowerCase()} (0.1 m³ steps)`, qty: ceilTo(m3, 0.1), unit: 'm³', exact: m3, exactUnit: 'm³', priceKey: 'm3' }
    : { key: 'yard', label: `Bulk ${name.toLowerCase()} (¼ yd steps)`, qty: ceilTo(r.cuYd, 0.25), unit: 'cu yd', exact: r.cuYd, exactUnit: 'cu yd', priceKey: 'yard' };
  const bag = { key: 'bag', label: bagLabel, qty: r.bags, unit: 'bags', exact: r.bagsExact, exactUnit: 'bags', priceKey: 'bag' };
  const [chosen, other] = r.buyAs === 'bulk' ? [bulk, bag] : [bag, bulk];
  summary.push({ label: `Alternative: ${other.label}`, value: other.qty, unit: other.unit });
  return { summary, items: [chosen] };
}

export const formula = [
  'Volume (cu ft) = area × (depth in ÷ 12)',
  'Cubic yards = cubic feet ÷ 27',
  'Bags = cubic feet ÷ bag size (rounded up)',
  'Choose bagged or bulk under "Buy as"; the other option is listed for comparison'
];
