export function registerGlobalErrorHandlers(): () => void {
  const onUnhandledRejection = (event: PromiseRejectionEvent): void => {
    console.error('Unhandled promise rejection', event.reason);
    event.preventDefault();
  };

  window.addEventListener('unhandledrejection', onUnhandledRejection);

  return () => {
    window.removeEventListener('unhandledrejection', onUnhandledRejection);
  };
}
