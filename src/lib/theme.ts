export type ThemeChoice = 'system' | 'light' | 'dark';

const KEY = 'chilicon-theme';

/** Applies the choice to <html>. "system" removes the attribute so prefers-color-scheme decides. */
export const applyTheme = (t: ThemeChoice) => {
  const root = document.documentElement;
  if (t === 'system') delete root.dataset.theme;
  else root.dataset.theme = t;
};

export const saveTheme = (t: ThemeChoice) => {
  try {
    localStorage.setItem(KEY, t);
  } catch {
    // Storage can be blocked (private mode); the choice then lasts for this visit only
  }
};

/** ?theme= wins (screenshots), then the viewer's saved choice, then the system */
export const initialTheme = (search: string): ThemeChoice => {
  const q = new URLSearchParams(search).get('theme');
  if (q === 'light' || q === 'dark' || q === 'system') return q;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  } catch {
    // ignore
  }
  return 'system';
};
