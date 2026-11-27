import { describe, it, expect } from 'vitest';
import { calculate, present, defaults } from './calc.js';

describe('landscape calculate', () => {
  it('computes volume and bags', () => {
    const r = calculate(defaults);
    expect(r.cuFt).toBe(25);
    expect(r.cuYd).toBeCloseTo(0.9259, 3);
    expect(r.bags).toBe(13); // 12.5 -> 13
  });

  it('handles zero bag size', () => {
    expect(calculate({ ...defaults, bagSize: 0 }).bags).toBe(0);
  });

  it('bulk option rounds to quarter yards', () => {
    const p = present(calculate({ ...defaults, buyAs: 'bulk' }), 'imperial');
    expect(p.items[0].key).toBe('yard');
    expect(p.items[0].qty).toBe(1);
  });

  it('bag option labels metric litres', () => {
    const p = present(calculate(defaults), 'metric');
    expect(p.items[0].key).toBe('bag');
    expect(p.items[0].label).toContain('56.6 L');
  });
});
