import { loadImage } from './load-image';

function getWebpSource(pngSrc: string): string {
  return pngSrc.replace(/\.png$/i, '.webp');
}

export async function loadImageWithFallback(pngSrc: string): Promise<HTMLImageElement> {
  const webpSrc = getWebpSource(pngSrc);

  try {
    return await loadImage(webpSrc);
  } catch {
    return loadImage(pngSrc);
  }
}
