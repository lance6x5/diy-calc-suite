import NumberField from './NumberField.jsx';
import { fmt, money } from '../lib/math.js';
import { lineCost, totalCost } from '../lib/shopping.js';

const SINGULAR = { boards: 'board', joists: 'joist', bags: 'bag', sheets: 'sheet', boxes: 'box', buckets: 'bucket', rolls: 'roll' };

/**
 * Shows a calculator's summary values plus purchasable items (rounded up, with
 * the exact value) and optional unit-price fields for cost estimates.
 */
export default function ResultsPanel({ presented, prices, onPriceChange }) {
  const total = totalCost(presented.items, prices);
  return (
    <div className="results">
      <h3>Results</h3>
      <dl className="summary" aria-live="polite">
        {presented.summary.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>
              {fmt(s.value)} {s.unit}
            </dd>
          </div>
        ))}
      </dl>

      <h3>Buy</h3>
      <ul className="buy-list">
        {presented.items.map((it) => {
          const cost = lineCost(it, prices);
          return (
            <li key={it.key} className="buy-item">
              <div className="buy-main">
                <span className="buy-qty">{fmt(it.qty)}</span> <span className="buy-unit">{it.unit}</span>
                <span className="buy-label">{it.label}</span>
              </div>
              {it.exact != null ? (
                <div className="buy-exact">
                  Exact: {fmt(it.exact, 3)} {it.exactUnit}
                </div>
              ) : null}
              {it.priceKey ? (
                <div className="buy-price">
                  <NumberField
                    label={`Price per ${SINGULAR[it.unit] || it.unit} (optional)`}
                    value={prices?.[it.priceKey] || 0}
                    suffix="$"
                    onChange={(v) => onPriceChange(it.priceKey, v)}
                  />
                  {cost != null ? <span className="buy-cost">{money(cost)}</span> : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      {total != null ? (
        <p className="total">
          Estimated cost: <strong>{money(total)}</strong>
        </p>
      ) : null}
    </div>
  );
}
