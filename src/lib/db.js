/**
 * Minimal IndexedDB wrapper for saved projects.
 * A project: { id, name, createdAt, updatedAt, entries: [ShoppingEntry] }.
 */

const DB_NAME = 'diy-calc-suite';
const DB_VERSION = 1;
const STORE = 'projects';

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
  dbPromise.catch(() => {
    dbPromise = null;
  });
  return dbPromise;
}

/** Run a request against the projects store and resolve with its result. */
async function withStore(mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(req ? req.result : undefined);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function getAllProjects() {
  try {
    const all = await withStore('readonly', (s) => s.getAll());
    return (all || []).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  } catch (err) {
    console.error('Failed to read projects', err);
    return [];
  }
}

export async function putProject(project) {
  try {
    await withStore('readwrite', (s) => s.put(project));
    return true;
  } catch (err) {
    console.error('Failed to save project', err);
    return false;
  }
}

export async function deleteProject(id) {
  try {
    await withStore('readwrite', (s) => s.delete(id));
    return true;
  } catch (err) {
    console.error('Failed to delete project', err);
    return false;
  }
}

export async function clearProjects() {
  try {
    await withStore('readwrite', (s) => s.clear());
    return true;
  } catch (err) {
    console.error('Failed to clear projects', err);
    return false;
  }
}
