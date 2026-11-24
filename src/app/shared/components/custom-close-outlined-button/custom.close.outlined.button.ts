import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/**
 * Globally reusable outlined circular close / back icon button.
 * Used across modals, dismissible cards, and page headers for consistent close/back navigation.
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
      [attr.aria-label]="computedAriaLabel()"
      [attr.title]="computedAriaLabel()"
      [disabled]="disabled()"
      (click)="handleClick($event)"
    >
      @if (icon() === 'back') {
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      } @else {
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
      }
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
      width: var(--cp-close-size, var(--close-btn-size, 36px));
      height: var(--cp-close-size, var(--close-btn-size, 36px));
      padding: 0;
      border: 1px solid var(--color-border, #e4e7e0);
      border-radius: var(--radius-pill, 999px);
      background: var(--color-white, #ffffff);
      color: var(--color-muted, #6b7280);
      cursor: pointer;
      transition:
        background-color var(--dur-fast, 150ms) var(--ease, ease),
        color var(--dur-fast, 150ms) var(--ease, ease),
        border-color var(--dur-fast, 150ms) var(--ease, ease),
        transform var(--dur-fast, 150ms) var(--ease, ease);
    }

    .cp-close-btn:hover:not(:disabled) {
      background: var(--color-primary-50, #eef4f0);
      border-color: var(--color-primary-200, #bcd3c6);
      color: var(--color-primary, #174e38);
    }

    .cp-close-btn:active:not(:disabled) {
      transform: scale(0.96);
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
  readonly icon = input<'close' | 'back'>('close');
  readonly ariaLabel = input<string>('');
  readonly size = input<string>('36px');
  readonly disabled = input<boolean>(false);
  readonly clicked = output<MouseEvent>();

  protected readonly computedAriaLabel = computed(() => {
    const custom = this.ariaLabel();
    if (custom) {
      return custom;
    }
    return this.icon() === 'back' ? 'Go back' : 'Close';
  });

  protected handleClick(event: MouseEvent): void {
    if (this.disabled()) {
      return;
    }
    this.clicked.emit(event);
  }
}

