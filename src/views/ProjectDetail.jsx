import { useEffect, useState } from 'react';
import ConfirmButton from '../components/ConfirmButton.jsx';
import { aggregateEntries } from '../lib/shopping.js';
import { fmt, money } from '../lib/math.js';

/** Printable shopping list for one project. */
export default function ProjectDetail({ project, onSave, onDelete }) {
  const [name, setName] = useState(project?.name || '');
  useEffect(() => setName(project?.name || ''), [project?.id, project?.name]);

  if (!project) {
    return (
      <section>
        <h2>Project not found</h2>
        <p>
          <a href="#/projects">Back to projects</a>
        </p>
      </section>
    );
  }

  const combined = aggregateEntries(project.entries);
  const total = combined.reduce((s, it) => (it.cost != null ? (s || 0) + it.cost : s), null);
  const removeEntry = (id) => onSave({ ...project, entries: project.entries.filter((e) => e.id !== id) });

  return (
    <section aria-labelledby="h-project" className="project-detail">
      <p className="no-print">
        <a href="#/projects">← All projects</a>
      </p>
      <h2 id="h-project">{project.name}</h2>
      <p className="print-only">Shopping list · printed {new Date().toLocaleDateString()}</p>

      <div className="card row no-print inline-form">
        <div className="field grow">
          <label htmlFor="rename">Project name</label>
          <input id="rename" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="button" disabled={!name.trim() || name === project.name} onClick={() => onSave({ ...project, name: name.trim() })}>
          Rename
        </button>
        <button type="button" className="primary" onClick={() => window.print()}>
          Print shopping list
        </button>
        <ConfirmButton label="Delete project" prompt="Delete this project?" onConfirm={() => onDelete(project.id)} />
      </div>

      {project.entries.length === 0 ? (
        <p className="card empty">
          This project is empty. Open a calculator and use "Save to project".
        </p>
      ) : (
        <>
          <div className="card">
            <h3>Shopping list</h3>
            <table className="list-table">
              <thead>
                <tr>
                  <th scope="col" className="check-col">
                    <span className="sr-only">Got it</span>
                  </th>
                  <th scope="col">Item</th>
                  <th scope="col" className="num">Qty</th>
                  <th scope="col" className="num">Est. cost</th>
                </tr>
              </thead>
              <tbody>
                {combined.map((it) => (
                  <tr key={`${it.label}|${it.unit}`}>
                    <td className="check-col">
                      <span className="box" aria-hidden="true">☐</span>
                    </td>
                    <td>{it.label}</td>
                    <td className="num">
                      {fmt(it.qty)} {it.unit}
                    </td>
                    <td className="num">{it.cost != null ? money(it.cost) : '—'}</td>
                  </tr>
                ))}
              </tbody>
              {total != null ? (
                <tfoot>
                  <tr>
                    <td />
                    <th scope="row" colSpan={2}>
                      Estimated total (priced items)
                    </th>
                    <td className="num">
                      <strong>{money(total)}</strong>
                    </td>
                  </tr>
                </tfoot>
              ) : null}
            </table>
          </div>

          <h3>Calculations in this project</h3>
          {project.entries.map((e) => (
            <article key={e.id} className="card entry">
              <div className="section-head">
                <h4>
                  {e.title}
                  {e.note ? ` — ${e.note}` : ''}
                </h4>
                <span className="no-print">
                  <ConfirmButton label="Remove" prompt="Remove this calculation?" confirmLabel="Yes, remove" onConfirm={() => removeEntry(e.id)} />
                </span>
              </div>
              <dl className="summary compact">
                {e.summary.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>
                      {fmt(s.value)} {s.unit}
                    </dd>
                  </div>
                ))}
              </dl>
              <ul className="entry-items">
                {e.items.map((it) => (
                  <li key={it.label}>
                    {fmt(it.qty)} {it.unit} — {it.label}
                    {it.exact != null ? ` (exact ${fmt(it.exact, 3)})` : ''}
                    {it.cost != null ? ` · ${money(it.cost)}` : ''}
                  </li>
                ))}
              </ul>
              <p className="hint">
                Saved {new Date(e.createdAt).toLocaleString()} · {e.units}
              </p>
            </article>
          ))}
        </>
      )}
      <p className="disclaimer print-only">Results are estimates. Confirm quantities with your supplier.</p>
    </section>
  );
}
