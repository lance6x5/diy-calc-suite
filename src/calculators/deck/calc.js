/**
 * Deck board & joist calculator (pure).
 * Inputs (imperial): deck length/width in ft, board width & gap in inches,
 * board length in ft, waste %, joist on-center spacing in inches (12/16/24).
 * Boards run parallel to the deck LENGTH; joists run across the deck WIDTH.
 */
import { num, ceilSafe, safeDiv } from '../../lib/math.js';
import { toDisplay, unitLabel } from '../../lib/units.js';

export const JOIST_SPACINGS = [12, 16, 24];

export const defaults = {
  length: 16,
  width: 12,
  boardWidth: 5.5,
  boardLength: 16,
  gap: 0.125,
  waste: 10,
  joistSpacing: 16,
  prices: {}
};

export function calculate(i) {
  const length = num(i.length);
  const width = num(i.width);
  const bw = num(i.boardWidth);
  const gap = num(i.gap);
  const boardLength = num(i.boardLength);
  const waste = num(i.waste) / 100;
  const spacing = JOIST_SPACINGS.includes(Number(i.joistSpacing)) ? Number(i.joistSpacing) : 16;

  const area = length * width;
  // Each row covers (board width + gap); the last row needs no trailing gap.
  const rowsExact = width > 0 ? safeDiv(width * 12 + gap, bw + gap) : 0;
  const rows = ceilSafe(rowsExact);
  const linearFeet = rowsExact * length;
  const boardsExact = safeDiv(linearFeet, boardLength) * (1 + waste);
  const boards = ceilSafe(boardsExact);

  // Joists every `spacing` inches along the length, plus one at the far end.
  const joistsExact = length > 0 ? (length * 12) / spacing + 1 : 0;
  const joists = length > 0 ? ceilSafe((length * 12) / spacing) + 1 : 0;

  return { area, rowsExact, rows, linearFeet, boardsExact, boards, joistsExact, joists, joistLength: width, spacing };
}

export function present(r, units) {
  const au = unitLabel('area', units);
  const lu = unitLabel('length', units);
  return {
    summary: [
      { label: 'Deck area', value: toDisplay(r.area, 'area', units), unit: au },
      { label: 'Board rows', value: r.rows, unit: 'rows' },
      { label: 'Decking (no waste)', value: toDisplay(r.linearFeet, 'length', units), unit: `linear ${lu}` },
      { label: 'Joist length (each)', value: toDisplay(r.joistLength, 'length', units), unit: lu }
    ],
    items: [
      { key: 'board', label: 'Deck boards', qty: r.boards, unit: 'boards', exact: r.boardsExact, exactUnit: 'boards', priceKey: 'board' },
      { key: 'joist', label: `Joists @ ${r.spacing} in O.C.`, qty: r.joists, unit: 'joists', exact: r.joistsExact, exactUnit: 'joists', priceKey: 'joist' }
    ]
  };
}

export const formula = [
  'Rows = (deck width + gap) ÷ (board width + gap), rounded up',
  'Linear length = rows (exact) × deck length',
  'Boards = linear length ÷ board length × (1 + waste %)',
  'Joists = deck length ÷ on-center spacing (rounded up) + 1 end joist',
  'Rim/band joists, beams, posts and fasteners are not included'
];
