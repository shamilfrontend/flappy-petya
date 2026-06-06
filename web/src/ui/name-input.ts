const DEFAULT_NAME = 'Игрок';
const MAX_NAME_LENGTH = 20;

export interface NameInputResult {
  name: string;
  confirmed: boolean;
}

export interface PromptOptions {
  submitLabel?: string;
}

const DEFAULT_SUBMIT_LABEL = 'Играть';

export class NameInputOverlay {
  private readonly root: HTMLDivElement;
  private readonly input: HTMLInputElement;
  private readonly submitBtn: HTMLButtonElement;
  private resolve: ((result: NameInputResult) => void) | null = null;

  constructor() {
    this.root = document.createElement('div');
    this.root.className = 'name-overlay';
    this.root.hidden = true;

    const dialog = document.createElement('div');
    dialog.className = 'name-dialog';

    const title = document.createElement('p');
    title.className = 'name-dialog__title';
    title.textContent = 'Введите имя';

    this.input = document.createElement('input');
    this.input.className = 'name-dialog__input';
    this.input.type = 'text';
    this.input.maxLength = MAX_NAME_LENGTH;
    this.input.placeholder = DEFAULT_NAME;
    this.input.autocomplete = 'off';
    this.input.enterKeyHint = 'go';

    this.submitBtn = document.createElement('button');
    this.submitBtn.className = 'name-dialog__button';
    this.submitBtn.type = 'button';
    this.submitBtn.textContent = 'Играть';

    dialog.append(title, this.input, this.submitBtn);
    this.root.append(dialog);
    document.body.append(this.root);

    this.submitBtn.addEventListener('click', () => this.confirm());
    this.input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.confirm();
      }
    });
  }

  prompt(defaultName = '', options: PromptOptions = {}): Promise<NameInputResult> {
    this.input.value = defaultName;
    this.submitBtn.textContent = options.submitLabel ?? DEFAULT_SUBMIT_LABEL;
    this.root.hidden = false;
    this.input.focus();
    this.input.select();

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  hide(): void {
    this.root.hidden = true;
  }

  private confirm(): void {
    const name = this.input.value.trim() || DEFAULT_NAME;
    this.hide();
    this.resolve?.({ name, confirmed: true });
    this.resolve = null;
  }
}
