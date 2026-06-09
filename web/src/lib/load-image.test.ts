function createMockImage(this: {
  listeners: Map<string, Array<() => void>>;
  source: string;
  addEventListener: (event: string, listener: () => void) => void;
}) {
  this.listeners = new Map();

  Object.defineProperty(this, 'src', {
    configurable: true,
    enumerable: true,
    get() {
      return this.source;
    },
    set(value: string) {
      this.source = value;
      queueMicrotask(() => {
        this.listeners.get('load')?.forEach((listener: () => void) => listener());
      });
    },
  });

  this.addEventListener = (event: string, listener: () => void) => {
    const handlers = this.listeners.get(event) ?? [];
    handlers.push(listener);
    this.listeners.set(event, handlers);
  };
}

function createHangingMockImage(this: {
  listeners: Map<string, Array<() => void>>;
  source: string;
  addEventListener: (event: string, listener: () => void) => void;
}) {
  this.listeners = new Map();

  Object.defineProperty(this, 'src', {
    configurable: true,
    enumerable: true,
    get() {
      return this.source;
    },
    set(value: string) {
      this.source = value;
    },
  });

  this.addEventListener = (event: string, listener: () => void) => {
    const handlers = this.listeners.get(event) ?? [];
    handlers.push(listener);
    this.listeners.set(event, handlers);
  };
}

function createFailingMockImage(this: {
  listeners: Map<string, Array<() => void>>;
  source: string;
  addEventListener: (event: string, listener: () => void) => void;
}) {
  this.listeners = new Map();

  Object.defineProperty(this, 'src', {
    configurable: true,
    enumerable: true,
    get() {
      return this.source;
    },
    set(value: string) {
      this.source = value;
      queueMicrotask(() => {
        this.listeners.get('error')?.forEach((listener: () => void) => listener());
      });
    },
  });

  this.addEventListener = (event: string, listener: () => void) => {
    const handlers = this.listeners.get(event) ?? [];
    handlers.push(listener);
    this.listeners.set(event, handlers);
  };
}

describe('loadImage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('resolves when image loads successfully', async () => {
    vi.stubGlobal('Image', createMockImage as unknown as typeof Image);
    const { loadImage } = await import('./load-image');

    const image = await loadImage('/static/goose.png');

    expect(image.src).toBe('/static/goose.png');
  });

  it('rejects when image fails to load', async () => {
    vi.stubGlobal('Image', createFailingMockImage as unknown as typeof Image);
    const { loadImage } = await import('./load-image');

    await expect(loadImage('/missing.png')).rejects.toThrow(
      'Failed to load /missing.png',
    );
  });

  it('rejects when image load times out', async () => {
    vi.stubGlobal('Image', createHangingMockImage as unknown as typeof Image);
    const { loadImage } = await import('./load-image');

    await expect(loadImage('/static/goose.png', 50)).rejects.toThrow(
      'Timed out loading /static/goose.png',
    );
  });

  it('resolves before timeout when image loads quickly', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('Image', createMockImage as unknown as typeof Image);
    const { IMAGE_LOAD_TIMEOUT_MS, loadImage } = await import('./load-image');

    await expect(loadImage('/static/goose.png')).resolves.toMatchObject({
      src: '/static/goose.png',
    });

    await vi.advanceTimersByTimeAsync(IMAGE_LOAD_TIMEOUT_MS);

    vi.useRealTimers();
  });
});
