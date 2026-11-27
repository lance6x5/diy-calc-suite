import { useId } from 'react';

/** Labeled <select>. `options` is an array of { value, label }. */
export default function SelectField({ label, value, onChange, options }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={String(value)} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
