import { describe, it, expect } from 'vitest';
import { calculate, present, gallonsAndQuarts, metricCans, defaults } from './calc.js';

describe('paint calculate', () => {
  it('computes areas and gallons for a single wall', () => {
    const r = calculate({ walls: [{ length: 10, height: 8 }], doors: 0, windows: 0, coats: 1, coverage: 350 });
    expect(r.grossArea).toBe(80);
    expect(r.netArea).toBe(80);
    expect(r.gallons).toBeCloseTo(80 / 350);
  });

  it('subtracts doors and windows and multiplies by coats', () => {
    const r = calculate(defaults);
    // 2*(12*8) + 2*(10*8) = 352; openings 20 + 30 = 50; net 302; x2 coats = 604
    expect(r.grossArea).toBe(352);
    expect(r.openingArea).toBe(50);
    expect(r.netArea).toBe(302);
    expect(r.paintedArea).toBe(604);
    expect(r.gallons).toBeCloseTo(604 / 350);
  });

  it('never goes below zero and handles zero coverage', () => {
    const r = calculate({ walls: [{ length: 2, height: 2 }], doors: 5, doorArea: 20, coats: 2, coverage: 0 });
    expect(r.netArea).toBe(0);
    expect(r.gallons).toBe(0);
  });

  it('ignores invalid input', () => {
    const r = calculate({ walls: [{ length: 'abc', height: -4 }], coats: 2, coverage: 350 });
    expect(r.grossArea).toBe(0);
  });
});

describe('gallonsAndQuarts', () => {
  it('splits into gallons and quarts', () => {
    expect(gallonsAndQuarts(1.25)).toEqual({ gallons: 1, quarts: 1, allGallons: 2 });
    expect(gallonsAndQuarts(1.3)).toEqual({ gallons: 1, quarts: 2, allGallons: 2 });
    expect(gallonsAndQuarts(2)).toEqual({ gallons: 2, quarts: 0, allGallons: 2 });
  });
  it('bumps 3+ quarts to another gallon', () => {
    expect(gallonsAndQuarts(1.6)).toEqual({ gallons: 2, quarts: 0, allGallons: 2 });
  });
  it('handles zero', () => {
    expect(gallonsAndQuarts(0)).toEqual({ gallons: 0, quarts: 0, allGallons: 0 });
  });
});

describe('metricCans', () => {
  it('uses 4 L and 1 L cans', () => {
    expect(metricCans(9.5)).toEqual({ cans4: 2, cans1: 2 });
    expect(metricCans(7.2)).toEqual({ cans4: 2, cans1: 0 });
    expect(metricCans(0)).toEqual({ cans4: 0, cans1: 0 });
  });
});

describe('paint present', () => {
  it('returns gallon and quart items in imperial', () => {
    const p = present(calculate(defaults), 'imperial');
    expect(p.items.map((i) => i.key)).toEqual(['gallon', 'quart']);
    // 1.73 gal -> 1 gal + 3 qt, which bumps to 2 gal + 0 qt
    expect(p.items[0].qty).toBe(2);
    expect(p.items[1].qty).toBe(0);
  });
  it('returns litre cans in metric', () => {
    const p = present(calculate(defaults), 'metric');
    expect(p.items.map((i) => i.key)).toEqual(['can4', 'can1']);
  });
});
