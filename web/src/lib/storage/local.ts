const PLAYER_NAME_KEY = 'flappy-petya-player-name';

export function getLocalPlayerName(): string {
  try {
    const value = localStorage.getItem(PLAYER_NAME_KEY);
    return value?.trim() ?? '';
  } catch {
    return '';
  }
}

export function saveLocalPlayerName(name: string): void {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return;
  }

  try {
    localStorage.setItem(PLAYER_NAME_KEY, trimmedName);
  } catch {
    // private mode or storage disabled
  }
}
