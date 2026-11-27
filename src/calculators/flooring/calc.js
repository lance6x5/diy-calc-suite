/**
 * Flooring / tile calculator (pure). Area in sq ft, piece size in inches,
 * box coverage in sq ft. Waste defaults: 10% straight, 15% diagonal.
 */
import { num, ceilSafe, safeDiv } from '../../lib/math.js';
import { toDisplay, unitLabel } from '../../lib/units.js';

export const LAYOUT_WASTE = { straight: 10, diagonal: 15 };

export const defaults = {
  area: 200,
  pieceLength: 12,
  pieceWidth: 12,
  layout: 'straight',
  waste: 10,
  boxCoverage: 20,
  prices: {}
};

export function calculate(i) {
  const area = num(i.area);
  const waste = num(i.waste) / 100;
  const areaWithWaste = area * (1 + waste);
  const pieceArea = (num(i.pieceLength) * num(i.pieceWidth)) / 144;
  const piecesExact = safeDiv(areaWithWaste, pieceArea);
  const pieces = ceilSafe(piecesExact);
  const boxesExact = safeDiv(areaWithWaste, num(i.boxCoverage));
  const boxes = ceilSafe(boxesExact);
  const piecesPerBox = safeDiv(num(i.boxCoverage), pieceArea);
  return { area, areaWithWaste, pieceArea, piecesExact, pieces, boxesExact, boxes, piecesPerBox };
}

export function present(r, units) {
  const au = unitLabel('area', units);
  return {
    summary: [
      { label: 'Floor area', value: toDisplay(r.area, 'area', units), unit: au },
      { label: 'Area incl. waste', value: toDisplay(r.areaWithWaste, 'area', units), unit: au },
      { label: 'Tiles / planks needed', value: r.pieces, unit: 'pieces' },
      { label: 'Pieces per box (approx.)', value: r.piecesPerBox, unit: 'pieces' }
    ],
    items: [{ key: 'box', label: 'Flooring boxes', qty: r.boxes, unit: 'boxes', exact: r.boxesExact, exactUnit: 'boxes', priceKey: 'box' }]
  };
}

export const formula = [
  'Area with waste = area × (1 + waste %) — 10% straight lay, 15% diagonal',
  'Piece area = piece length × piece width ÷ 144',
  'Pieces = area with waste ÷ piece area (rounded up)',
  'Boxes = area with waste ÷ coverage per box (rounded up)'
];
