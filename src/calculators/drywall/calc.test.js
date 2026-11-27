import { describe, it, expect } from 'vitest';
import { calculate, present, defaults } from './calc.js';

describe('drywall calculate', () => {
  it('computes walls + ceiling with 4x8 sheets', () => {
    const r = calculate(defaults);
    expect(r.wallArea).toBe(384);
    expect(r.ceilingArea).toBe(144);
    expect(r.netArea).toBe(528);
    // 528 * 1.1 / 32 = 18.15 -> 19
    expect(r.sheetsExact).toBeCloseTo(18.15, 2);
    expect(r.sheets).toBe(19);
    expect(r.screwsExact).toBe(19 * 32);
    expect(r.screwBoxes).toBe(3);
    expect(r.compoundGal).toBeCloseTo(5.28, 2);
    expect(r.buckets).toBe(2);
    expect(r.tapeRolls).toBe(1);
  });

  it('excludes ceiling and uses 4x12 sheets', () => {
    const r = calculate({ ...defaults, ceiling: false, sheet: '4x12', waste: 0 });
    expect(r.netArea).toBe(384);
    expect(r.sheets).toBe(8);
  });

  it('subtracts openings', () => {
    const r = calculate({ ...defaults, openings: 28, waste: 0 });
    expect(r.netArea).toBe(500);
  });

  it('presents four purchase items', () => {
    const p = present(calculate(defaults), 'imperial');
    expect(p.items.map((i) => i.key)).toEqual(['sheet', 'screws', 'compound', 'tape']);
  });
});
