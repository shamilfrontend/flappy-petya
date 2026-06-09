import { MAX_PLAYER_NAME_LENGTH } from '../lib/storage/types';
import { NameInputOverlay } from './name-input';

describe('NameInputOverlay', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function getElements() {
    return {
      overlay: document.querySelector('.name-overlay') as HTMLDivElement,
      input: document.querySelector('.name-dialog__input') as HTMLInputElement,
      button: document.querySelector('.name-dialog__button') as HTMLButtonElement,
      error: document.querySelector('.name-dialog__error') as HTMLParagraphElement,
    };
  }

  it('shows overlay and resolves entered name on button click', async () => {
    const overlay = new NameInputOverlay();
    const { overlay: root, input, button } = getElements();

    const resultPromise = overlay.prompt('Alice');

    expect(root.hidden).toBe(false);
    expect(input.value).toBe('Alice');

    input.value = 'Петя';
    button.click();

    await expect(resultPromise).resolves.toEqual({
      name: 'Петя',
      confirmed: true,
    });
    expect(root.hidden).toBe(true);
  });

  it('keeps overlay open when input is blank', async () => {
    const overlay = new NameInputOverlay();
    const { overlay: root, input, button, error } = getElements();

    overlay.prompt('');
    input.value = '   ';
    button.click();

    expect(root.hidden).toBe(false);
    expect(error.hidden).toBe(false);
  });

  it('applies custom submit label', () => {
    const overlay = new NameInputOverlay();
    const { button } = getElements();

    overlay.prompt('Петя', { submitLabel: 'Сохранить' });

    expect(button.textContent).toBe('Сохранить');
  });

  it('confirms on Enter key', async () => {
    const overlay = new NameInputOverlay();
    const { input } = getElements();

    const resultPromise = overlay.prompt('');
    input.value = 'Bob';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    await expect(resultPromise).resolves.toEqual({
      name: 'Bob',
      confirmed: true,
    });
  });

  it('limits input length to MAX_PLAYER_NAME_LENGTH', () => {
    const overlay = new NameInputOverlay();
    const { input } = getElements();

    expect(input.maxLength).toBe(MAX_PLAYER_NAME_LENGTH);
    overlay.hide();
  });

  it('hide closes overlay without resolving pending prompt', () => {
    const overlay = new NameInputOverlay();
    const { overlay: root } = getElements();

    overlay.prompt('Alice');
    overlay.hide();

    expect(root.hidden).toBe(true);
  });
});
