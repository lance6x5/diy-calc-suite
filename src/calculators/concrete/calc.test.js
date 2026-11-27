import { describe, it, expect } from 'vitest';
import { calculate, present, slabVolume, footingVolume, stepsVolume, defaults } from './calc.js';

describe('concrete volumes', () => {
  it('slab volume', () => {
    expect(slabVolume({ length: 10, width: 10, thickness: 4 })).toBeCloseTo(33.333, 3);
  });
  it('footing (cylinder) volume', () => {
    // r = 0.5 ft, h = 3 ft, 4 footings: pi * 0.25 * 3 * 4 = 9.4248
    expect(footingVolume({ diameter: 12, depth: 36, count: 4 })).toBeCloseTo(9.4248, 3);
  });
  it('steps volume', () => {
    // 4 ft * (11/12) * (7/12) * 6 = 12.833
    expect(stepsVolume({ width: 4, rise: 7, run: 11, count: 3 })).toBeCloseTo(12.8333, 3);
  });
});

describe('concrete calculate', () => {
  it('applies waste and converts to yards and bags', () => {
    const r = calculate({ ...defaults, waste: 0 });
    expect(r.cuFt).toBeCloseTo(33.333, 3);
    expect(r.cuYd).toBeCloseTo(1.2346, 3);
    expect(r.bags['80']).toBe(56); // 33.33 / 0.6 = 55.6
    expect(r.bags['60']).toBe(75); // 74.07
    expect(r.bags['40']).toBe(112); // 111.1
  });
  it('waste increases volume', () => {
    expect(calculate(defaults).cuFt).toBeCloseTo(36.667, 3);
  });
  it('uses the selected shape', () => {
    expect(calculate({ ...defaults, shape: 'steps', waste: 0 }).cuFt).toBeCloseTo(12.8333, 3);
  });
});

describe('concrete present', () => {
  it('only lists the chosen purchase option as an item', () => {
    const p = present(calculate({ ...defaults, waste: 0 }), 'imperial');
    expect(p.items).toHaveLength(1);
    expect(p.items[0].key).toBe('bag80');
  });
  it('ready-mix rounds up to quarter yards', () => {
    const p = present(calculate({ ...defaults, waste: 0, buyAs: 'bulk' }), 'imperial');
    expect(p.items[0].qty).toBe(1.25);
  });
  it('metric ready-mix in m3 tenths', () => {
    const p = present(calculate({ ...defaults, waste: 0, buyAs: 'bulk' }), 'metric');
    expect(p.items[0].unit).toBe('m³');
    expect(p.items[0].qty).toBeCloseTo(1.0, 5); // 0.944 m3 -> 1.0
  });
});
