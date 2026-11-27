/**
 * Pure helpers for pricing, building shopping-list entries, aggregating them,
 * and validating backups. Free of browser APIs so they can be unit tested.
 */

/** Price one presented line item. Returns null when no unit price is set. */
export function lineCost(item, prices) {
  if (!item.priceKey) return null;
  const p = Number(prices?.[item.priceKey]);
  return Number.isFinite(p) && p > 0 ? p * item.qty : null;
}

/** Sum the costs of priced items (null when nothing is priced). */
export function totalCost(items, prices) {
  let total = null;
  for (const it of items) {
    const c = lineCost(it, prices);
    if (c != null) total = (total || 0) + c;
  }
  return total;
}

/** Build a snapshot entry for a project from a calculator's presented output. */
export function buildEntry({ id, calculatorId, title, note, units, presented, prices, inputs, now }) {
  const items = presented.items.filter((it) => it.qty > 0).map((it) => ({
    label: it.label,
    qty: it.qty,
    unit: it.unit,
    exact: it.exact,
    exactUnit: it.exactUnit,
    unitPrice: it.priceKey && Number(prices?.[it.priceKey]) > 0 ? Number(prices[it.priceKey]) : null,
    cost: lineCost(it, prices)
  }));
  return {
    id,
    calculatorId,
    title,
    note: note || '',
    units,
    summary: presented.summary,
    items,
    inputs,
    createdAt: now
  };
}

/** Combine identical items (same label + unit) across project entries. */
export function aggregateEntries(entries) {
  const map = new Map();
  for (const e of entries || []) {
    for (const it of e.items || []) {
      const key = `${it.label}|${it.unit}`;
      const cur = map.get(key) || { label: it.label, unit: it.unit, qty: 0, cost: null };
      cur.qty += it.qty;
      if (it.cost != null) cur.cost = (cur.cost || 0) + it.cost;
      map.set(key, cur);
    }
  }
  return [...map.values()];
}

/** Validate and normalise an imported backup object. Throws on bad input. */
export function parseBackup(data) {
  if (!data || typeof data !== 'object' || data.app !== 'diy-calc-suite') {
    throw new Error('This file is not a Measure Twice backup.');
  }
  const projects = Array.isArray(data.projects)
    ? data.projects.filter((p) => p && typeof p.id === 'string' && typeof p.name === 'string')
    : [];
  projects.forEach((p) => {
    if (!Array.isArray(p.entries)) p.entries = [];
  });
  return {
    units: data.units === 'metric' ? 'metric' : 'imperial',
    inputs: data.inputs && typeof data.inputs === 'object' ? data.inputs : {},
    projects
  };
}
