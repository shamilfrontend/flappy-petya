import { MessageOverlay } from './message-overlay';

describe('MessageOverlay', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function getElements() {
    return {
      overlay: document.querySelector('.message-overlay') as HTMLDivElement,
      title: document.querySelector('.message-dialog__title') as HTMLParagraphElement,
      message: document.querySelector('.message-dialog__message') as HTMLParagraphElement,
      button: document.querySelector('.message-dialog__button') as HTMLButtonElement,
    };
  }

  it('shows overlay with message and hides on default action', () => {
    const overlay = new MessageOverlay();
    const { overlay: root, title, message, button } = getElements();

    overlay.show('Что-то пошло не так');

    expect(root.hidden).toBe(false);
    expect(root.getAttribute('role')).toBe('alertdialog');
    expect(title.textContent).toBe('Ошибка');
    expect(message.textContent).toBe('Что-то пошло не так');
    expect(button.textContent).toBe('OK');

    button.click();

    expect(root.hidden).toBe(true);
  });

  it('applies custom title and action label', () => {
    const overlay = new MessageOverlay();
    const { title, button } = getElements();

    overlay.show('Сообщение', {
      title: 'Внимание',
      actionLabel: 'Понятно',
    });

    expect(title.textContent).toBe('Внимание');
    expect(button.textContent).toBe('Понятно');
  });

  it('calls custom action handler without auto hide', () => {
    const overlay = new MessageOverlay();
    const onAction = vi.fn();
    const { overlay: root, button } = getElements();

    overlay.show('Сбой сети', {
      actionLabel: 'Обновить',
      onAction,
    });

    button.click();

    expect(onAction).toHaveBeenCalledOnce();
    expect(root.hidden).toBe(false);
  });

  it('hide closes overlay', () => {
    const overlay = new MessageOverlay();
    const { overlay: root } = getElements();

    overlay.show('Сообщение');
    overlay.hide();

    expect(root.hidden).toBe(true);
  });

  it('hide resets default action handler', () => {
    const overlay = new MessageOverlay();
    const { overlay: root, button } = getElements();

    overlay.show('Сообщение', {
      actionLabel: 'Обновить',
      onAction: vi.fn(),
    });
    overlay.hide();
    button.click();

    expect(root.hidden).toBe(true);
  });
});
