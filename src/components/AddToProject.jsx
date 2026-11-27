import { useId, useState } from 'react';

const NEW = '__new__';

/**
 * Lets the user add the current calculator result to an existing or new named
 * project (stored in IndexedDB by the parent).
 */
export default function AddToProject({ projects, onAdd }) {
  const id = useId();
  const [target, setTarget] = useState(projects[0]?.id || NEW);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');

  const selected = projects.some((p) => p.id === target) ? target : NEW;

  async function submit(e) {
    e.preventDefault();
    if (selected === NEW && !name.trim()) {
      setStatus('Enter a project name.');
      return;
    }
    const projectName = await onAdd({ projectId: selected === NEW ? null : selected, name: name.trim(), note: note.trim() });
    if (projectName) {
      setStatus(`Added to "${projectName}".`);
      setName('');
      setNote('');
    } else {
      setStatus('Could not save. Storage may be unavailable.');
    }
  }

  return (
    <form className="add-project no-print" onSubmit={submit} aria-labelledby={`${id}-h`}>
      <h3 id={`${id}-h`}>Save to project</h3>
      <div className="field">
        <label htmlFor={`${id}-p`}>Project</label>
        <select id={`${id}-p`} value={selected} onChange={(e) => setTarget(e.target.value)}>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
          <option value={NEW}>+ New project…</option>
        </select>
      </div>
      {selected === NEW ? (
        <div className="field">
          <label htmlFor={`${id}-n`}>New project name</label>
          <input id={`${id}-n`} type="text" value={name} placeholder="e.g. Basement drywall" onChange={(e) => setName(e.target.value)} />
        </div>
      ) : null}
      <div className="field">
        <label htmlFor={`${id}-note`}>Note (optional)</label>
        <input id={`${id}-note`} type="text" value={note} placeholder="e.g. North bedroom" onChange={(e) => setNote(e.target.value)} />
      </div>
      <button type="submit" className="primary">
        Add to shopping list
      </button>
      <p className="status" role="status">
        {status}
      </p>
    </form>
  );
}
