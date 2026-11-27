import { useMemo } from 'react';
import ResultsPanel from './ResultsPanel.jsx';
import AddToProject from './AddToProject.jsx';
import ConfirmButton from './ConfirmButton.jsx';

/**
 * Generic shell for any calculator module: renders its form, results,
 * formula explanation and "save to project" controls.
 */
export default function CalculatorView({ calc, inputs, setInputs, units, projects, onAddToProject }) {
  const update = (patch) => setInputs({ ...inputs, ...patch });
  const result = useMemo(() => calc.calculate(inputs), [calc, inputs]);
  const presented = useMemo(() => calc.present(result, units), [calc, result, units]);
  const Form = calc.Form;

  return (
    <section aria-labelledby={`h-${calc.id}`}>
      <div className="section-head">
        <h2 id={`h-${calc.id}`}>{calc.title}</h2>
        <ConfirmButton
          label="Reset inputs"
          prompt="Reset this calculator?"
          confirmLabel="Yes, reset"
          className="subtle"
          onConfirm={() => setInputs(structuredClone(calc.defaults))}
        />
      </div>
      <p className="lede">{calc.description}</p>
      <div className="calc-grid">
        <form className="card inputs" onSubmit={(e) => e.preventDefault()} aria-label={`${calc.title} inputs`}>
          <Form inputs={inputs} update={update} units={units} />
        </form>
        <div className="card">
          <ResultsPanel
            presented={presented}
            prices={inputs.prices}
            onPriceChange={(key, v) => update({ prices: { ...inputs.prices, [key]: v } })}
          />
          <AddToProject projects={projects} onAdd={(opts) => onAddToProject({ ...opts, calc, presented, inputs })} />
        </div>
      </div>
      <details className="card formula">
        <summary>How this is calculated</summary>
        <ul>
          {calc.formula.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="hint">All math is done in imperial units internally and converted for display when Metric is selected.</p>
      </details>
    </section>
  );
}
