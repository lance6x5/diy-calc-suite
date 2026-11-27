import NumberField from '../../components/NumberField.jsx';

/** Inputs for the paint calculator: multiple walls, openings, coats, coverage. */
export default function PaintForm({ inputs, update, units }) {
  const walls = inputs.walls || [];
  const setWall = (idx, patch) => update({ walls: walls.map((w, i) => (i === idx ? { ...w, ...patch } : w)) });

  return (
    <>
      <fieldset>
        <legend>Walls</legend>
        {walls.map((w, idx) => (
          <div className="row wall-row" key={idx}>
            <NumberField label={`Wall ${idx + 1} length`} dim="length" units={units} value={w.length} onChange={(v) => setWall(idx, { length: v })} />
            <NumberField label={`Wall ${idx + 1} height`} dim="length" units={units} value={w.height} onChange={(v) => setWall(idx, { height: v })} />
            <button
              type="button"
              className="icon-btn"
              aria-label={`Remove wall ${idx + 1}`}
              onClick={() => update({ walls: walls.filter((_, i) => i !== idx) })}
            >
              ✕
            </button>
          </div>
        ))}
        <button type="button" onClick={() => update({ walls: [...walls, { length: 10, height: walls[walls.length - 1]?.height || 8 }] })}>
          + Add wall
        </button>
      </fieldset>

      <fieldset>
        <legend>Doors & windows to subtract</legend>
        <div className="row">
          <NumberField label="Doors" step={1} value={inputs.doors} onChange={(v) => update({ doors: Math.round(v) })} />
          <NumberField label="Area per door" dim="area" units={units} value={inputs.doorArea} onChange={(v) => update({ doorArea: v })} />
        </div>
        <div className="row">
          <NumberField label="Windows" step={1} value={inputs.windows} onChange={(v) => update({ windows: Math.round(v) })} />
          <NumberField label="Area per window" dim="area" units={units} value={inputs.windowArea} onChange={(v) => update({ windowArea: v })} />
        </div>
      </fieldset>

      <fieldset>
        <legend>Paint</legend>
        <div className="row">
          <NumberField label="Number of coats" step={1} value={inputs.coats} onChange={(v) => update({ coats: v })} />
          <NumberField
            label="Coverage per gallon"
            dim="coverage"
            units={units}
            value={inputs.coverage}
            onChange={(v) => update({ coverage: v })}
            hint="Typical: 350 sq ft per gallon (≈ 8.6 m²/L). Check the can."
          />
        </div>
      </fieldset>
    </>
  );
}
