import { useState } from 'react';
import ConfirmButton from '../components/ConfirmButton.jsx';

/** List of saved projects with create and delete. */
export default function ProjectsView({ projects, onCreate, onDelete }) {
  const [name, setName] = useState('');

  return (
    <section aria-labelledby="h-projects">
      <h2 id="h-projects">Projects</h2>
      <p className="lede">Bundle calculator results into named shopping lists. Use "Save to project" on any calculator to add items.</p>
      <form
        className="card row inline-form"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!name.trim()) return;
          await onCreate(name.trim());
          setName('');
        }}
      >
        <div className="field grow">
          <label htmlFor="new-project">New project name</label>
          <input id="new-project" type="text" value={name} placeholder="e.g. Basement drywall" onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="submit" className="primary">
          Create project
        </button>
      </form>

      {projects.length === 0 ? (
        <p className="card empty">No projects yet.</p>
      ) : (
        <ul className="project-list">
          {projects.map((p) => (
            <li key={p.id} className="card project-item">
              <div>
                <a href={`#/projects/${p.id}`} className="project-name">
                  {p.name}
                </a>
                <div className="hint">
                  {p.entries.length} calculation{p.entries.length === 1 ? '' : 's'} · updated {new Date(p.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <ConfirmButton label="Delete" prompt={`Delete "${p.name}"?`} onConfirm={() => onDelete(p.id)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
