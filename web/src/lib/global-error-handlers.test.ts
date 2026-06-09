import { registerGlobalErrorHandlers } from './global-error-handlers';

describe('registerGlobalErrorHandlers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs and prevents default on unhandled promise rejection', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const unregister = registerGlobalErrorHandlers();
    const reason = new Error('network failed');
    const event = new Event('unhandledrejection') as PromiseRejectionEvent;
    Object.defineProperty(event, 'reason', { value: reason });
    const preventDefault = vi.spyOn(event, 'preventDefault');

    window.dispatchEvent(event);

    expect(consoleError).toHaveBeenCalledWith('Unhandled promise rejection', reason);
    expect(preventDefault).toHaveBeenCalled();

    unregister();
  });

  it('removes listener when cleanup is called', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const unregister = registerGlobalErrorHandlers();

    unregister();

    const event = new Event('unhandledrejection') as PromiseRejectionEvent;
    Object.defineProperty(event, 'reason', { value: new Error('ignored') });
    window.dispatchEvent(event);

    expect(consoleError).not.toHaveBeenCalled();
  });
});
