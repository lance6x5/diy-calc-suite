import { describe, it, expect } from 'vitest';
import { ceilSafe, ceilTo, num, safeDiv } from './math.js';
import { toDisplay, fromDisplay } from './units.js';
import { lineCost, totalCost, aggregateEntries, parseBackup, buildEntry } from './shopping.js';

describe('math helpers', () => {
  it('ceilSafe ignores float noise', () => {
    expect(ceilSafe(3.0000000000001)).toBe(3);
    expect(ceilSafe(3.01)).toBe(4);
  });
  it('ceilTo rounds up to step', () => {
    expect(ceilTo(1.01, 0.25)).toBe(1.25);
    expect(ceilTo(0.94, 0.1)).toBe(1);
  });
  it('num and safeDiv sanitise', () => {
    expect(num('x')).toBe(0);
    expect(num(-2)).toBe(0);
    expect(safeDiv(1, 0)).toBe(0);
  });
});

describe('units', () => {
  it('round-trips conversions', () => {
    expect(toDisplay(10, 'length', 'metric')).toBeCloseTo(3.048);
    expect(fromDisplay(toDisplay(7, 'area', 'metric'), 'area', 'metric')).toBeCloseTo(7);
    expect(toDisplay(10, 'length', 'imperial')).toBe(10);
  });
});

describe('shopping helpers', () => {
  const items = [
    { label: 'A', qty: 2, unit: 'x', priceKey: 'a' },
    { label: 'B', qty: 3, unit: 'x', priceKey: 'b' }
  ];
  it('prices lines and totals', () => {
    expect(lineCost(items[0], { a: 5 })).toBe(10);
    expect(lineCost(items[1], { a: 5 })).toBeNull();
    expect(totalCost(items, { a: 5, b: 1 })).toBe(13);
    expect(totalCost(items, {})).toBeNull();
  });
  it('builds entries without zero-qty items', () => {
    const e = buildEntry({
      id: '1', calculatorId: 'paint', title: 'Paint', units: 'imperial',
      presented: { summary: [], items: [...items, { label: 'C', qty: 0, unit: 'x' }] },
      prices: { a: 5 }, inputs: {}, now: 1
    });
    expect(e.items).toHaveLength(2);
    expect(e.items[0].cost).toBe(10);
  });
  it('aggregates matching items', () => {
    const agg = aggregateEntries([
      { items: [{ label: 'A', unit: 'x', qty: 2, cost: 4 }] },
      { items: [{ label: 'A', unit: 'x', qty: 1, cost: null }, { label: 'B', unit: 'y', qty: 1, cost: null }] }
    ]);
    expect(agg).toEqual([
      { label: 'A', unit: 'x', qty: 3, cost: 4 },
      { label: 'B', unit: 'y', qty: 1, cost: null }
    ]);
  });
  it('validates backups', () => {
    expect(() => parseBackup({})).toThrow();
    const b = parseBackup({ app: 'diy-calc-suite', units: 'metric', projects: [{ id: 'p', name: 'X' }, { bad: 1 }] });
    expect(b.units).toBe('metric');
    expect(b.projects).toHaveLength(1);
    expect(b.projects[0].entries).toEqual([]);
  });
});
