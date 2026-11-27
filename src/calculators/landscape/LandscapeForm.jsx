import NumberField from '../../components/NumberField.jsx';
import SelectField from '../../components/SelectField.jsx';
import { MATERIALS } from './calc.js';

/** Inputs for the mulch/gravel/soil calculator. */
export default function LandscapeForm({ inputs, update, units }) {
  return (
    <>
      <fieldset>
        <legend>Material</legend>
        <SelectField
          label="Material"
          value={inputs.material}
          onChange={(v) => update({ material: v, bagSize: MATERIALS[v].bagSize })}
          options={Object.entries(MATERIALS).map(([value, m]) => ({ value, label: m.label }))}
        />
      </fieldset>
      <fieldset>
        <legend>Bed size</legend>
        <div className="row">
          <NumberField label="Area" dim="area" units={units} value={inputs.area} onChange={(v) => update({ area: v })} />
          <NumberField label="Depth" dim="small" units={units} value={inputs.depth} onChange={(v) => update({ depth: v })} hint="Mulch: 2–4 in. Gravel paths: 2–3 in." />
        </div>
      </fieldset>
      <fieldset>
        <legend>Purchase</legend>
        <div className="row">
          <NumberField label="Bag size" dim="bag" units={units} value={inputs.bagSize} onChange={(v) => update({ bagSize: v })} />
          <SelectField
            label="Buy as"
            value={inputs.buyAs}
            onChange={(v) => update({ buyAs: v })}
            options={[
              { value: 'bags', label: 'Bags' },
              { value: 'bulk', label: 'Bulk delivery' }
            ]}
          />
        </div>
      </fieldset>
    </>
  );
}
