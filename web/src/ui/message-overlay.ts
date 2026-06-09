const DEFAULT_TITLE = 'Ошибка';
const DEFAULT_ACTION_LABEL = 'OK';

export interface MessageOverlayOptions {
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export class MessageOverlay {
  private readonly root: HTMLDivElement;
  private readonly titleEl: HTMLParagraphElement;
  private readonly messageEl: HTMLParagraphElement;
  private readonly actionBtn: HTMLButtonElement;

  constructor() {
    this.root = document.createElement('div');
    this.root.className = 'message-overlay';
    this.root.hidden = true;
    this.root.setAttribute('role', 'alertdialog');
    this.root.setAttribute('aria-live', 'assertive');

    const dialog = document.createElement('div');
    dialog.className = 'message-dialog';

    this.titleEl = document.createElement('p');
    this.titleEl.className = 'message-dialog__title';

    this.messageEl = document.createElement('p');
    this.messageEl.className = 'message-dialog__message';

    this.actionBtn = document.createElement('button');
    this.actionBtn.className = 'message-dialog__button';
    this.actionBtn.type = 'button';

    dialog.append(this.titleEl, this.messageEl, this.actionBtn);
    this.root.append(dialog);
    document.body.append(this.root);
  }

  show(message: string, options: MessageOverlayOptions = {}): void {
    this.titleEl.textContent = options.title ?? DEFAULT_TITLE;
    this.messageEl.textContent = message;
    this.actionBtn.textContent = options.actionLabel ?? DEFAULT_ACTION_LABEL;

    this.actionBtn.onclick = () => {
      if (options.onAction) {
        options.onAction();
        return;
      }

      this.hide();
    };

    this.root.hidden = false;
    this.actionBtn.focus();
  }

  hide(): void {
    this.root.hidden = true;
    this.actionBtn.onclick = () => {
      this.hide();
    };
  }
}
