const LOADER_ID = 'app-loader';
const HIDE_CLASS = 'app-loader--hidden';
const HIDE_FALLBACK_MS = 400;

export function hideAppLoader(): void {
  const loader = document.getElementById(LOADER_ID);
  if (!loader) {
    return;
  }

  loader.classList.add(HIDE_CLASS);
  loader.setAttribute('aria-busy', 'false');

  const removeLoader = (): void => {
    loader.remove();
  };

  loader.addEventListener('transitionend', removeLoader, { once: true });
  window.setTimeout(removeLoader, HIDE_FALLBACK_MS);
}
