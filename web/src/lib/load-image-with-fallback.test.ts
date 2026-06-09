const loadImageMock = vi.hoisted(() => vi.fn());

vi.mock('./load-image', () => ({
  loadImage: loadImageMock,
}));

import { loadImageWithFallback } from './load-image-with-fallback';

describe('loadImageWithFallback', () => {
  beforeEach(() => {
    loadImageMock.mockReset();
  });

  it('loads webp when available', async () => {
    loadImageMock.mockResolvedValueOnce({ src: '/static/goose.webp' } as HTMLImageElement);

    const image = await loadImageWithFallback('/static/goose.png');

    expect(image.src).toBe('/static/goose.webp');
    expect(loadImageMock).toHaveBeenCalledWith('/static/goose.webp');
  });

  it('falls back to png when webp fails', async () => {
    loadImageMock
      .mockRejectedValueOnce(new Error('webp missing'))
      .mockResolvedValueOnce({ src: '/static/goose.png' } as HTMLImageElement);

    const image = await loadImageWithFallback('/static/goose.png');

    expect(image.src).toBe('/static/goose.png');
    expect(loadImageMock).toHaveBeenNthCalledWith(1, '/static/goose.webp');
    expect(loadImageMock).toHaveBeenNthCalledWith(2, '/static/goose.png');
  });
});
