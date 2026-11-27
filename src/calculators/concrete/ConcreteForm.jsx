import { useId } from 'react';
import NumberField from '../../components/NumberField.jsx';
import SelectField from '../../components/SelectField.jsx';
import { SHAPES } from './calc.js';

const SHAPE_LABELS = { slab: 'Slab', footing: 'Footing (cylinder)', steps: 'Steps' };

/** Inputs for the concrete calculator: shape picker + shape-specific fields. */
export default function ConcreteForm({ inputs, update, units }) {
  const name = useId();
  const metric = units === 'metric';
  const sub = (key) => (patch) => update({ [key]: { ...inputs[key], ...patch } });
  const slab = inputs.slab || {};
  const footing = inputs.footing || {};
  const steps = inputs.steps || {};

  return (
    <>
      <fieldset>
        <legend>Shape</legend>
        <div className="radio-row">
          {SHAPES.map((s) => (
            <label key={s} className="radio">
              <input type="radio" name={name} value={s} checked={inputs.shape === s} onChange={() => update({ shape: s })} />
              {SHAPE_LABELS[s]}
            </label>
          ))}
        </div>
      </fieldset>

      {inputs.shape === 'slab' ? (
        <fieldset>
          <legend>Slab</legend>
          <div className="row">
            <NumberField label="Length" dim="length" units={units} value={slab.length} onChange={(v) => sub('slab')({ length: v })} />
            <NumberField label="Width" dim="length" units={units} value={slab.width} onChange={(v) => sub('slab')({ width: v })} />
          </div>
          <NumberField label="Thickness" dim="small" units={units} value={slab.thickness} onChange={(v) => sub('slab')({ thickness: v })} />
        </fieldset>
      ) : null}

      {inputs.shape === 'footing' ? (
        <fieldset>
          <legend>Footing (cylinder / sonotube)</legend>
          <div className="row">
            <NumberField label="Diameter" dim="small" units={units} value={footing.diameter} onChange={(v) => sub('footing')({ diameter: v })} />
            <NumberField label="Depth" dim="small" units={units} value={footing.depth} onChange={(v) => sub('footing')({ depth: v })} />
          </div>
          <NumberField label="Number of footings" step={1} value={footing.count} onChange={(v) => sub('footing')({ count: Math.round(v) })} />
        </fieldset>
      ) : null}

      {inputs.shape === 'steps' ? (
        <fieldset>
          <legend>Steps (solid)</legend>
          <div className="row">
            <NumberField label="Step width" dim="length" units={units} value={steps.width} onChange={(v) => sub('steps')({ width: v })} />
            <NumberField label="Number of steps" step={1} value={steps.count} onChange={(v) => sub('steps')({ count: Math.round(v) })} />
          </div>
          <div className="row">
            <NumberField label="Rise (height) per step" dim="small" units={units} value={steps.rise} onChange={(v) => sub('steps')({ rise: v })} />
            <NumberField label="Run (depth) per step" dim="small" units={units} value={steps.run} onChange={(v) => sub('steps')({ run: v })} />
          </div>
        </fieldset>
      ) : null}

      <fieldset>
        <legend>Purchase</legend>
        <div className="row">
          <NumberField label="Extra for waste/spillage" suffix="%" value={inputs.waste} onChange={(v) => update({ waste: v })} />
          <SelectField
            label="Buy as"
            value={inputs.buyAs}
            onChange={(v) => update({ buyAs: v })}
            options={[
              { value: '40', label: metric ? '18 kg (40 lb) bags' : '40 lb bags' },
              { value: '60', label: metric ? '27 kg (60 lb) bags' : '60 lb bags' },
              { value: '80', label: metric ? '36 kg (80 lb) bags' : '80 lb bags' },
              { value: 'bulk', label: 'Ready-mix delivery' }
            ]}
          />
        </div>
      </fieldset>
    </>
  );
}
