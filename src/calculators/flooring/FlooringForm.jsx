import { useId } from 'react';
import NumberField from '../../components/NumberField.jsx';
import { LAYOUT_WASTE } from './calc.js';

/** Inputs for the flooring/tile calculator. */
export default function FlooringForm({ inputs, update, units }) {
  const name = useId();
  return (
    <>
      <fieldset>
        <legend>Area</legend>
        <NumberField label="Floor area" dim="area" units={units} value={inputs.area} onChange={(v) => update({ area: v })} hint="Length × width; add up rectangles for L-shaped rooms." />
      </fieldset>
      <fieldset>
        <legend>Tile or plank size</legend>
        <div className="row">
          <NumberField label="Piece length" dim="small" units={units} value={inputs.pieceLength} onChange={(v) => update({ pieceLength: v })} />
          <NumberField label="Piece width" dim="small" units={units} value={inputs.pieceWidth} onChange={(v) => update({ pieceWidth: v })} />
        </div>
      </fieldset>
      <fieldset>
        <legend>Layout & waste</legend>
        <div className="radio-row">
          {Object.keys(LAYOUT_WASTE).map((l) => (
            <label key={l} className="radio">
              <input
                type="radio"
                name={name}
                value={l}
                checked={inputs.layout === l}
                onChange={() => update({ layout: l, waste: LAYOUT_WASTE[l] })}
              />
              {l === 'straight' ? 'Straight (10%)' : 'Diagonal (15%)'}
            </label>
          ))}
        </div>
        <div className="row">
          <NumberField label="Waste factor" suffix="%" value={inputs.waste} onChange={(v) => update({ waste: v })} />
          <NumberField label="Coverage per box" dim="area" units={units} value={inputs.boxCoverage} onChange={(v) => update({ boxCoverage: v })} />
        </div>
      </fieldset>
    </>
  );
}
