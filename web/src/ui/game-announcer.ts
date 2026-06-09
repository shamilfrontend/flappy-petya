const ANNOUNCER_ID = 'game-announcer';

export function announceGameMessage(message: string): void {
  const announcer = document.getElementById(ANNOUNCER_ID);
  if (!announcer) {
    return;
  }

  announcer.textContent = '';
  requestAnimationFrame(() => {
    announcer.textContent = message;
  });
}
