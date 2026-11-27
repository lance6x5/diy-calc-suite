import { useRef, useState } from 'react';
import ConfirmButton from '../components/ConfirmButton.jsx';
import { parseBackup } from '../lib/shopping.js';

/** Export / import JSON backups and reset all data. */
export default function DataView({ buildBackup, onImport, onReset }) {
  const [status, setStatus] = useState('');
  const fileRef = useRef(null);

  function exportJson() {
    try {
      const data = buildBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `measure-twice-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(`Exported ${data.projects.length} project(s).`);
    } catch (err) {
      setStatus(`Export failed: ${err.message}`);
    }
  }

  async function importJson(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const backup = parseBackup(JSON.parse(await file.text()));
      await onImport(backup);
      setStatus(`Imported ${backup.projects.length} project(s) and settings.`);
    } catch (err) {
      setStatus(`Import failed: ${err.message}`);
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <section aria-labelledby="h-data">
      <h2 id="h-data">Your data</h2>
      <p className="lede">Everything is stored only in this browser. Export a backup to move it to another device.</p>

      <div className="card">
        <h3>Export</h3>
        <p>Download all projects, calculator inputs and settings as a JSON file.</p>
        <button type="button" className="primary" onClick={exportJson}>
          Export JSON
        </button>
      </div>

      <div className="card">
        <h3>Import</h3>
        <p>Load a backup file. Projects with the same id are replaced; others are added. Calculator inputs and units are restored.</p>
        <label htmlFor="import-file" className="file-label">
          Choose backup file (.json)
        </label>
        <input id="import-file" ref={fileRef} type="file" accept="application/json,.json" onChange={importJson} />
      </div>

      <div className="card">
        <h3>Reset</h3>
        <p>Delete all projects, saved inputs and settings from this browser. This cannot be undone.</p>
        <ConfirmButton
          label="Reset all data"
          prompt="Delete everything?"
          confirmLabel="Yes, delete everything"
          onConfirm={async () => {
            await onReset();
            setStatus('All data was reset.');
          }}
        />
      </div>

      <p role="status" className="status">
        {status}
      </p>
    </section>
  );
}
