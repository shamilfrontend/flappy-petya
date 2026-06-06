const STORAGE_KEY = 'flappy-petr-player-name';

export function getSavedPlayerName(): string {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value?.trim() ?? '';
  } catch {
    return '';
  }
}

export function savePlayerName(name: string): void {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, trimmedName);
  } catch {
    // private mode or storage disabled
  }
}
