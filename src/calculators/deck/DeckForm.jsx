import NumberField from '../../components/NumberField.jsx';
import SelectField from '../../components/SelectField.jsx';
import { JOIST_SPACINGS } from './calc.js';

/** Inputs for the deck calculator. */
export default function DeckForm({ inputs, update, units }) {
  const metric = units === 'metric';
  return (
    <>
      <fieldset>
        <legend>Deck size</legend>
        <div className="row">
          <NumberField label="Deck length (board direction)" dim="length" units={units} value={inputs.length} onChange={(v) => update({ length: v })} />
          <NumberField label="Deck width" dim="length" units={units} value={inputs.width} onChange={(v) => update({ width: v })} />
        </div>
      </fieldset>
      <fieldset>
        <legend>Boards</legend>
        <div className="row">
          <NumberField
            label="Board width (actual)"
            dim="small"
            units={units}
            value={inputs.boardWidth}
            onChange={(v) => update({ boardWidth: v })}
            hint="A nominal 5/4×6 or 2×6 board is 5.5 in wide."
          />
          <NumberField label="Board length" dim="length" units={units} value={inputs.boardLength} onChange={(v) => update({ boardLength: v })} />
        </div>
        <div className="row">
          <NumberField label="Gap between boards" dim="small" units={units} value={inputs.gap} onChange={(v) => update({ gap: v })} />
          <NumberField label="Waste factor" suffix="%" value={inputs.waste} onChange={(v) => update({ waste: v })} />
        </div>
      </fieldset>
      <fieldset>
        <legend>Joists</legend>
        <SelectField
          label="Joist on-center spacing"
          value={inputs.joistSpacing}
          onChange={(v) => update({ joistSpacing: Number(v) })}
          options={JOIST_SPACINGS.map((s) => ({ value: s, label: metric ? `${s} in (${Math.round(s * 2.54)} cm)` : `${s} in` }))}
        />
      </fieldset>
    </>
  );
}
