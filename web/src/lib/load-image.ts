export const IMAGE_LOAD_TIMEOUT_MS = 15_000;

export function loadImage(
  src: string,
  timeoutMs = IMAGE_LOAD_TIMEOUT_MS,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    function cleanup(): void {
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }

      if (typeof img.removeEventListener === 'function') {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
      }
    }

    function onLoad(): void {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      resolve(img);
    }

    function onError(): void {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      reject(new Error(`Failed to load ${src}`));
    }

    timer = setTimeout(() => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      img.src = '';
      reject(new Error(`Timed out loading ${src}`));
    }, timeoutMs);

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
    img.src = src;
  });
}
