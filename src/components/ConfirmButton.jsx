import { useEffect, useRef, useState } from 'react';

/**
 * Two-step destructive button: first click asks "Are you sure?", second confirms.
 */
export default function ConfirmButton({ label, prompt = 'Are you sure?', confirmLabel = 'Yes, delete', onConfirm, className = 'danger' }) {
  const [armed, setArmed] = useState(false);
  const confirmRef = useRef(null);

  useEffect(() => {
    if (armed) confirmRef.current?.focus();
  }, [armed]);

  if (!armed) {
    return (
      <button type="button" className={className} onClick={() => setArmed(true)}>
        {label}
      </button>
    );
  }
  return (
    <span className="confirm" role="group" aria-label={prompt}>
      <span>{prompt}</span>
      <button
        type="button"
        ref={confirmRef}
        className="danger"
        onClick={() => {
          setArmed(false);
          onConfirm();
        }}
      >
        {confirmLabel}
      </button>
      <button type="button" onClick={() => setArmed(false)}>
        Cancel
      </button>
    </span>
  );
}
