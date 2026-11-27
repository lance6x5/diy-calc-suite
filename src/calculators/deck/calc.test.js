import { describe, it, expect } from 'vitest';
import { calculate, present, defaults } from './calc.js';

describe('deck calculate', () => {
  it('computes rows, boards and joists for defaults', () => {
    const r = calculate(defaults);
    // (144 + 0.125) / 5.625 = 25.62 rows
    expect(r.rowsExact).toBeCloseTo(25.6222, 3);
    expect(r.rows).toBe(26);
    // 25.62 rows * 16 ft / 16 ft boards * 1.1 = 28.18 -> 29
    expect(r.boardsExact).toBeCloseTo(28.184, 2);
    expect(r.boards).toBe(29);
    // 192 in / 16 = 12 spaces + 1 = 13 joists
    expect(r.joists).toBe(13);
    expect(r.joistLength).toBe(12);
  });

  it('supports 12 and 24 inch spacing', () => {
    expect(calculate({ ...defaults, joistSpacing: 12 }).joists).toBe(17);
    expect(calculate({ ...defaults, joistSpacing: 24 }).joists).toBe(9);
  });

  it('rounds partial joist spaces up', () => {
    // 10 ft = 120 in / 16 = 7.5 -> 8 spaces + 1
    expect(calculate({ ...defaults, length: 10 }).joists).toBe(9);
  });

  it('falls back to 16 in for invalid spacing', () => {
    expect(calculate({ ...defaults, joistSpacing: 7 }).spacing).toBe(16);
  });

  it('returns zeros for empty deck', () => {
    const r = calculate({ ...defaults, length: 0, width: 0 });
    expect(r.boards).toBe(0);
    expect(r.joists).toBe(0);
  });

  it('presents board and joist items', () => {
    const p = present(calculate(defaults), 'imperial');
    expect(p.items.map((i) => i.qty)).toEqual([29, 13]);
  });
});
