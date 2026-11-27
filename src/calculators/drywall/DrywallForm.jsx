import { useId } from 'react';
import NumberField from '../../components/NumberField.jsx';
import SelectField from '../../components/SelectField.jsx';

/** Inputs for the drywall calculator. */
export default function DrywallForm({ inputs, update, units }) {
  const ceilingId = useId();
  const metric = units === 'metric';
  return (
    <>
      <fieldset>
        <legend>Room</legend>
        <div className="row">
          <NumberField label="Room length" dim="length" units={units} value={inputs.length} onChange={(v) => update({ length: v })} />
          <NumberField label="Room width" dim="length" units={units} value={inputs.width} onChange={(v) => update({ width: v })} />
        </div>
        <NumberField label="Wall height" dim="length" units={units} value={inputs.height} onChange={(v) => update({ height: v })} />
        <div className="check">
          <input id={ceilingId} type="checkbox" checked={!!inputs.ceiling} onChange={(e) => update({ ceiling: e.target.checked })} />
          <label htmlFor={ceilingId}>Include ceiling</label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Sheets</legend>
        <div className="row">
          <SelectField
            label="Sheet size"
            value={inputs.sheet}
            onChange={(v) => update({ sheet: v })}
            options={[
              { value: '4x8', label: metric ? '1.2 × 2.4 m (4×8 ft)' : '4 × 8 ft' },
              { value: '4x12', label: metric ? '1.2 × 3.6 m (4×12 ft)' : '4 × 12 ft' }
            ]}
          />
          <NumberField label="Waste factor" suffix="%" value={inputs.waste} onChange={(v) => update({ waste: v })} />
        </div>
        <NumberField
          label="Openings to subtract (doors/windows)"
          dim="area"
          units={units}
          value={inputs.openings}
          onChange={(v) => update({ openings: v })}
          hint="Many pros skip this and keep the offcuts as extra waste allowance."
        />
      </fieldset>
    </>
  );
}
