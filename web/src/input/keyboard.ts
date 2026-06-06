export interface KeyboardAction {
  jump: () => void;
  pause: () => void;
  canJump: () => boolean;
  canPause: () => boolean;
}

const JUMP_KEYS = new Set([' ', 'Enter']);
const PAUSE_KEYS = new Set(['p', 'P', 'Escape']);

export function bindGameKeyboard(actions: KeyboardAction): () => void {
  const onKeyDown = (event: KeyboardEvent): void => {
    if (JUMP_KEYS.has(event.key) && actions.canJump()) {
      event.preventDefault();
      actions.jump();
      return;
    }

    if (PAUSE_KEYS.has(event.key) && actions.canPause()) {
      event.preventDefault();
      actions.pause();
    }
  };

  window.addEventListener('keydown', onKeyDown);

  return () => {
    window.removeEventListener('keydown', onKeyDown);
  };
}
