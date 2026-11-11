import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="app-button"
      [attr.type]="type()"
      [attr.data-variant]="variant()"
      [disabled]="disabled() || loading()"
      (click)="handleClick($event)"
    >
      <ng-content />
    </button>
  `,
  styles: `
    .app-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2, 0.5rem);
      padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
      border-radius: var(--radius-md, 0.5rem);
      border: 1px solid transparent;
      font: inherit;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 150ms ease, opacity 150ms ease;
    }

    .app-button[data-variant='primary'] {
      background-color: var(--color-primary, #2563eb);
      color: #ffffff;
    }

    .app-button[data-variant='primary']:hover:not(:disabled) {
      background-color: var(--color-primary-hover, #1d4ed8);
    }

    .app-button[data-variant='secondary'] {
      background-color: var(--color-surface, #f8fafc);
      border-color: var(--color-border, #e2e8f0);
      color: var(--color-text-primary, #0f172a);
    }

    .app-button[data-variant='ghost'] {
      background-color: transparent;
      color: var(--color-text-primary, #0f172a);
    }

    .app-button[data-variant='danger'] {
      background-color: var(--color-danger, #dc2626);
      color: #ffffff;
    }

    .app-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<ButtonType>('button');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);

  readonly clicked = output<MouseEvent>();

  protected handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}

