import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type LoaderSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-loader" [attr.data-size]="size()" role="status" aria-live="polite">
      <span class="app-loader__spinner" aria-hidden="true"></span>
      @if (label()) {
        <span class="app-loader__label">{{ label() }}</span>
      }
    </div>
  `,
  styles: `
    .app-loader {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2, 0.5rem);
      color: var(--color-text-secondary, #475569);
    }

    .app-loader__spinner {
      display: inline-block;
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid var(--color-border, #e2e8f0);
      border-top-color: var(--color-primary, #2563eb);
      border-radius: 9999px;
      animation: app-spin 0.7s linear infinite;
    }

    .app-loader[data-size='sm'] .app-loader__spinner {
      width: 1rem;
      height: 1rem;
    }

    .app-loader[data-size='lg'] .app-loader__spinner {
      width: 2rem;
      height: 2rem;
      border-width: 3px;
    }

    @keyframes app-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class LoaderComponent {
  readonly label = input<string>('Loading...');
  readonly size = input<LoaderSize>('md');
}

