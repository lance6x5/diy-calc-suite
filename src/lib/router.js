import { useEffect, useState } from 'react';

/** Read the current hash route as a path like "/paint" (defaults to "/paint"). */
function currentPath() {
  const h = window.location.hash.replace(/^#/, '');
  return h && h.startsWith('/') ? h : '/paint';
}

/** React hook returning the current hash path, updating on navigation. */
export function useHashPath() {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const onChange = () => setPath(currentPath());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return path;
}

export function navigate(path) {
  window.location.hash = path;
}

/** Generate a reasonably unique id. */
export function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}
