/**
 * Drywall calculator (pure). Room dimensions in feet, openings in sq ft.
 * Rules of thumb: ~1 screw per sq ft of board, ~1 gal of ready-mix joint
 * compound per 100 sq ft, ~370 ft of joint tape per 1,000 sq ft.
 */
import { num, ceilSafe } from '../../lib/math.js';
import { toDisplay, unitLabel, LITERS_PER_GALLON } from '../../lib/units.js';

export const SHEETS = { '4x8': 32, '4x12': 48 };
export const SCREWS_PER_SQFT = 1;
export const SCREWS_PER_LB = 300;
export const COMPOUND_GAL_PER_SQFT = 1 / 100;
export const BUCKET_GAL = 4.5;
export const TAPE_FT_PER_SQFT = 0.37;
export const TAPE_ROLL_FT = 500;

export const defaults = {
  length: 12,
  width: 12,
  height: 8,
  ceiling: true,
  sheet: '4x8',
  openings: 0,
  waste: 10,
  prices: {}
};

export function calculate(i) {
  const L = num(i.length);
  const W = num(i.width);
  const H = num(i.height);
  const wallArea = 2 * (L + W) * H;
  const ceilingArea = i.ceiling ? L * W : 0;
  const netArea = Math.max(0, wallArea + ceilingArea - num(i.openings));
  const sheetArea = SHEETS[i.sheet] || SHEETS['4x8'];
  const sheetsExact = (netArea * (1 + num(i.waste) / 100)) / sheetArea;
  const sheets = ceilSafe(sheetsExact);
  const screwsExact = sheets * sheetArea * SCREWS_PER_SQFT;
  const screwBoxes = ceilSafe(screwsExact / SCREWS_PER_LB);
  const compoundGal = netArea * COMPOUND_GAL_PER_SQFT;
  const buckets = ceilSafe(compoundGal / BUCKET_GAL);
  const tapeFt = netArea * TAPE_FT_PER_SQFT;
  const tapeRolls = ceilSafe(tapeFt / TAPE_ROLL_FT);
  return { wallArea, ceilingArea, netArea, sheetArea, sheetsExact, sheets, screwsExact, screwBoxes, compoundGal, buckets, tapeFt, tapeRolls, sheet: i.sheet in SHEETS ? i.sheet : '4x8' };
}

export function present(r, units) {
  const metric = units === 'metric';
  const au = unitLabel('area', units);
  const sheetLabel = metric ? (r.sheet === '4x12' ? '1.2 × 3.6 m (4×12 ft)' : '1.2 × 2.4 m (4×8 ft)') : `${r.sheet.replace('x', '×')} ft`;
  return {
    summary: [
      { label: 'Wall area', value: toDisplay(r.wallArea, 'area', units), unit: au },
      { label: 'Ceiling area', value: toDisplay(r.ceilingArea, 'area', units), unit: au },
      { label: 'Net area to cover', value: toDisplay(r.netArea, 'area', units), unit: au },
      { label: 'Screws (approx.)', value: r.screwsExact, unit: 'screws' },
      metric
        ? { label: 'Joint compound', value: r.compoundGal * LITERS_PER_GALLON, unit: 'L' }
        : { label: 'Joint compound', value: r.compoundGal, unit: 'gal' },
      metric
        ? { label: 'Joint tape', value: r.tapeFt * 0.3048, unit: 'm' }
        : { label: 'Joint tape', value: r.tapeFt, unit: 'ft' }
    ],
    items: [
      { key: 'sheet', label: `Drywall sheets ${sheetLabel}`, qty: r.sheets, unit: 'sheets', exact: r.sheetsExact, exactUnit: 'sheets', priceKey: 'sheet' },
      { key: 'screws', label: `Drywall screws, 1 lb box (~${SCREWS_PER_LB})`, qty: r.screwBoxes, unit: 'boxes', exact: r.screwsExact / SCREWS_PER_LB, exactUnit: 'boxes', priceKey: 'screws' },
      { key: 'compound', label: metric ? 'Joint compound, 17 L bucket' : 'Joint compound, 4.5 gal bucket', qty: r.buckets, unit: 'buckets', exact: r.compoundGal / BUCKET_GAL, exactUnit: 'buckets', priceKey: 'compound' },
      { key: 'tape', label: metric ? 'Joint tape, 150 m roll' : 'Joint tape, 500 ft roll', qty: r.tapeRolls, unit: 'rolls', exact: r.tapeFt / TAPE_ROLL_FT, exactUnit: 'rolls', priceKey: 'tape' }
    ]
  };
}

export const formula = [
  'Wall area = 2 × (length + width) × height',
  'Ceiling area = length × width (if included)',
  'Net area = walls + ceiling − openings',
  'Sheets = net area × (1 + waste %) ÷ sheet area (32 or 48 sq ft)',
  'Screws ≈ 1 per sq ft of board installed (~300 per 1 lb box)',
  'Joint compound ≈ 1 gal per 100 sq ft; tape ≈ 370 ft per 1,000 sq ft'
];
