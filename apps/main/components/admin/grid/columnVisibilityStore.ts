const STORAGE_PREFIX = 'itqa:admin-grid:hidden-columns:';

export type HiddenColumns = Record<string, boolean>;

const EMPTY: HiddenColumns = {};

const cache = new Map<string, HiddenColumns>();
const listeners = new Map<string, Set<() => void>>();

function storageId(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

export function getHiddenColumns(key: string): HiddenColumns {
  if (typeof window === 'undefined') return EMPTY;

  const cached = cache.get(key);
  if (cached) return cached;

  let hidden: HiddenColumns = EMPTY;
  try {
    const stored = window.localStorage.getItem(storageId(key));
    if (stored) hidden = JSON.parse(stored) as HiddenColumns;
  } catch {
    // Unreadable or malformed storage falls back to all columns visible.
  }

  cache.set(key, hidden);
  return hidden;
}

export function subscribeHiddenColumns(key: string, listener: () => void): () => void {
  const existing = listeners.get(key) ?? new Set<() => void>();
  existing.add(listener);
  listeners.set(key, existing);

  return () => {
    existing.delete(listener);
  };
}

export function toggleHiddenColumn(key: string, columnId: string): void {
  const current = getHiddenColumns(key);
  const next = { ...current, [columnId]: !current[columnId] };

  cache.set(key, next);
  try {
    window.localStorage.setItem(storageId(key), JSON.stringify(next));
  } catch {
    // Persistence is best-effort (private mode, quota); the grid still works.
  }

  listeners.get(key)?.forEach((listener) => listener());
}
