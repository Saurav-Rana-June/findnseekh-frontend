import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Globally reusable outlined circular close (X) icon button.
 * Used across modals and dismissible cards for a consistent close control.
 */
@Component({
  selector: 'app-custom-close-outlined-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--cp-close-size]': 'size()',
  },
  template: `
    <button
      type="button"
      class="cp-close-btn"
      [attr.aria-label]="ariaLabel()"
      [disabled]="disabled()"
      (click)="handleClick($event)"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
      </svg>
    </button>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
    }

    .cp-close-btn {
      display: grid;
      place-items: center;
      width: var(--cp-close-size, 36px);
      height: var(--cp-close-size, 36px);
      padding: 0;
      border: 1px solid var(--color-border, #e4e7e0);
      border-radius: var(--radius-pill, 999px);
      background: var(--color-white, #ffffff);
      color: var(--color-muted, #6b7280);
      cursor: pointer;
      transition:
        background-color var(--dur-fast, 150ms) var(--ease, ease),
        color var(--dur-fast, 150ms) var(--ease, ease),
        border-color var(--dur-fast, 150ms) var(--ease, ease);
    }

    .cp-close-btn:hover:not(:disabled) {
      background: var(--color-primary-50, #eef4f0);
      border-color: var(--color-primary-200, #bcd3c6);
      color: var(--color-primary, #174e38);
    }

    .cp-close-btn:focus-visible {
      outline: 2px solid var(--color-focus, #174e38);
      outline-offset: 2px;
    }

    .cp-close-btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  `,
})
export class CustomCloseOutlinedButton {
  readonly ariaLabel = input<string>('Close');
  readonly size = input<string>('36px');
  readonly disabled = input<boolean>(false);
  readonly clicked = output<MouseEvent>();

  protected handleClick(event: MouseEvent): void {
    if (this.disabled()) {
      return;
    }
    this.clicked.emit(event);
  }
}

