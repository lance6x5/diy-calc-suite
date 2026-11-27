import { useEffect, useId, useState } from 'react';
import { toDisplay, fromDisplay, unitLabel } from '../lib/units.js';

/** Format a number for an <input type="number"> (max 4 decimals, no trailing zeros). */
function toText(n) {
  return Number.isFinite(n) ? String(+n.toFixed(4)) : '';
}

/**
 * Labeled numeric input. `value` is always IMPERIAL; the field shows and accepts
 * values in the current unit system and converts on the way in/out.
 * Keeps its own text state so partial input like "1." is not clobbered.
 */
export default function NumberField({ label, value, onChange, dim = 'none', units = 'imperial', suffix, min = 0, step = 'any', hint }) {
  const id = useId();
  const imperial = Number(value) || 0;
  const [text, setText] = useState(() => toText(toDisplay(imperial, dim, units)));

  // Resync text when the canonical value or unit system changes externally.
  useEffect(() => {
    const parsed = parseFloat(text);
    const asImperial = Number.isFinite(parsed) ? fromDisplay(parsed, dim, units) : 0;
    if (text.trim() === '' && imperial === 0) return;
    if (Math.abs(asImperial - imperial) > 1e-6) setText(toText(toDisplay(imperial, dim, units)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imperial, units, dim]);

  const unit = suffix ?? unitLabel(dim, units);
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-unit">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={text}
          aria-describedby={hintId}
          onChange={(e) => {
            setText(e.target.value);
            const n = parseFloat(e.target.value);
            onChange(Number.isFinite(n) ? fromDisplay(n, dim, units) : 0);
          }}
        />
        {unit ? <span className="unit" aria-hidden="true">{unit}</span> : null}
      </div>
      {hint ? <small id={hintId} className="hint">{hint}</small> : null}
    </div>
  );
}
