import { describe, it, expect } from 'vitest';
import { calculate, present, defaults, LAYOUT_WASTE } from './calc.js';

describe('flooring calculate', () => {
  it('computes boxes and pieces with 10% waste', () => {
    const r = calculate(defaults);
    expect(r.areaWithWaste).toBeCloseTo(220, 6);
    expect(r.pieceArea).toBe(1);
    expect(r.pieces).toBe(220);
    expect(r.boxes).toBe(11);
  });

  it('diagonal default waste is 15%', () => {
    expect(LAYOUT_WASTE.diagonal).toBe(15);
    const r = calculate({ ...defaults, waste: LAYOUT_WASTE.diagonal });
    expect(r.areaWithWaste).toBeCloseTo(230, 6);
    expect(r.boxes).toBe(12); // 11.5 -> 12
  });

  it('planks: 6x48 in', () => {
    const r = calculate({ ...defaults, pieceLength: 48, pieceWidth: 6 });
    expect(r.pieceArea).toBe(2);
    expect(r.pieces).toBe(110);
  });

  it('handles zero box coverage', () => {
    expect(calculate({ ...defaults, boxCoverage: 0 }).boxes).toBe(0);
  });

  it('presents a box item', () => {
    expect(present(calculate(defaults), 'metric').items[0].qty).toBe(11);
  });
});
