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

  it('uses default name when input is blank', async () => {
    const overlay = new NameInputOverlay();
    const { input, button } = getElements();

    const resultPromise = overlay.prompt('');
    input.value = '   ';
    button.click();

    await expect(resultPromise).resolves.toEqual({
      name: 'Игрок',
      confirmed: true,
    });
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

  it('hide closes overlay without resolving pending prompt', () => {
    const overlay = new NameInputOverlay();
    const { overlay: root } = getElements();

    overlay.prompt('Alice');
    overlay.hide();

    expect(root.hidden).toBe(true);
  });
});
