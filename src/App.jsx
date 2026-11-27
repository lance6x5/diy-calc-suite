import { useCallback, useEffect, useState } from 'react';
import { CALCULATORS, getCalculator, mergeInputs } from './calculators/index.js';
import CalculatorView from './components/CalculatorView.jsx';
import ProjectsView from './views/ProjectsView.jsx';
import ProjectDetail from './views/ProjectDetail.jsx';
import DataView from './views/DataView.jsx';
import { useHashPath, navigate, uid } from './lib/router.js';
import { loadSetting, saveSetting, clearSettings } from './lib/storage.js';
import { getAllProjects, putProject, deleteProject, clearProjects } from './lib/db.js';
import { buildEntry } from './lib/shopping.js';

/** Build the full inputs map, merging any saved values over each calculator's defaults. */
function initialInputs(saved = {}) {
  return Object.fromEntries(CALCULATORS.map((c) => [c.id, mergeInputs(c.defaults, saved[c.id])]));
}

export default function App() {
  const path = useHashPath();
  const [units, setUnits] = useState(() => (loadSetting('units', 'imperial') === 'metric' ? 'metric' : 'imperial'));
  const [inputs, setInputs] = useState(() => initialInputs(loadSetting('inputs', {})));
  const [projects, setProjects] = useState([]);

  const refresh = useCallback(async () => setProjects(await getAllProjects()), []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  useEffect(() => saveSetting('units', units), [units]);
  useEffect(() => saveSetting('inputs', inputs), [inputs]);

  async function saveProject(p) {
    await putProject({ ...p, updatedAt: Date.now() });
    await refresh();
  }

  async function createProject(name) {
    const now = Date.now();
    const p = { id: uid(), name, createdAt: now, updatedAt: now, entries: [] };
    const ok = await putProject(p);
    await refresh();
    return ok ? p : null;
  }

  async function removeProject(id) {
    await deleteProject(id);
    await refresh();
    if (path.startsWith('/projects/')) navigate('/projects');
  }

  /** Add a calculator snapshot to a project (creating it if needed). Returns project name or null. */
  async function addToProject({ projectId, name, note, calc, presented, inputs: calcInputs }) {
    let project = projects.find((p) => p.id === projectId);
    if (!project) project = await createProject(name);
    if (!project) return null;
    const entry = buildEntry({
      id: uid(),
      calculatorId: calc.id,
      title: calc.title,
      note,
      units,
      presented,
      prices: calcInputs.prices,
      inputs: structuredClone(calcInputs),
      now: Date.now()
    });
    const ok = await putProject({ ...project, entries: [...project.entries, entry], updatedAt: Date.now() });
    await refresh();
    return ok ? project.name : null;
  }

  function buildBackup() {
    return { app: 'diy-calc-suite', version: 1, exportedAt: new Date().toISOString(), units, inputs, projects };
  }

  async function importBackup(backup) {
    for (const p of backup.projects) await putProject(p);
    setUnits(backup.units);
    setInputs(initialInputs(backup.inputs));
    await refresh();
  }

  async function resetAll() {
    await clearProjects();
    clearSettings();
    setUnits('imperial');
    setInputs(initialInputs());
    await refresh();
  }

  // ---- Routing ----
  const [, section, param] = path.split('/');
  const calc = getCalculator(section);
  let view;
  if (calc) {
    view = (
      <CalculatorView
        key={calc.id}
        calc={calc}
        inputs={inputs[calc.id]}
        setInputs={(v) => setInputs((all) => ({ ...all, [calc.id]: v }))}
        units={units}
        projects={projects}
        onAddToProject={addToProject}
      />
    );
  } else if (section === 'projects' && param) {
    view = <ProjectDetail project={projects.find((p) => p.id === param)} onSave={saveProject} onDelete={removeProject} />;
  } else if (section === 'projects') {
    view = <ProjectsView projects={projects} onCreate={createProject} onDelete={removeProject} />;
  } else if (section === 'data') {
    view = <DataView buildBackup={buildBackup} onImport={importBackup} onReset={resetAll} />;
  } else {
    view = (
      <section>
        <h2>Page not found</h2>
        <p>
          <a href="#/paint">Go to the Paint calculator</a>
        </p>
      </section>
    );
  }

  const tabs = [...CALCULATORS.map((c) => ({ id: c.id, label: c.title })), { id: 'projects', label: `Projects (${projects.length})` }, { id: 'data', label: 'Data' }];

  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Skip to content
      </a>
      <header className="app-header no-print">
        <div className="header-row">
          <a href="#/paint" className="brand">
            <img src={`${import.meta.env.BASE_URL}logo-mark.svg`} alt="" width="40" height="40" />
            <div className="brand-text">
              <h1>Measure Twice</h1>
              <span className="tagline">Cut once. Buy right.</span>
            </div>
          </a>
          <fieldset className="segmented">
            <legend className="sr-only">Units</legend>
            {['imperial', 'metric'].map((u) => (
              <label key={u} className={units === u ? 'on' : ''}>
                <input type="radio" name="units" value={u} checked={units === u} onChange={() => setUnits(u)} />
                {u === 'imperial' ? 'Imperial' : 'Metric'}
              </label>
            ))}
          </fieldset>
        </div>
        <nav aria-label="Calculators">
          <ul className="tabs">
            {tabs.map((t) => (
              <li key={t.id}>
                <a href={`#/${t.id}`} aria-current={section === t.id ? 'page' : undefined}>
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        {view}
      </main>
      <footer className="app-footer">
        <p className="disclaimer">
          <strong>Disclaimer:</strong> results are estimates based on common rules of thumb. Always confirm quantities, coverage and
          product specifications with your supplier before buying.
        </p>
        <p className="version">
          Measure Twice <span>v{__APP_VERSION__}</span> ·{' '}
          <a href="https://github.com/lance6x5/diy-calc-suite/blob/main/CHANGELOG.md">Changelog</a>
        </p>
      </footer>
    </>
  );
}
