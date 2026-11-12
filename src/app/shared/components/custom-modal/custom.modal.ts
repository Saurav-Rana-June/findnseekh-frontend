import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  PLATFORM_ID,
} from '@angular/core';
import { CustomCloseOutlinedButton } from '../custom-close-outlined-button/custom.close.outlined.button';

export type CustomModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type CustomModalAlign = 'center' | 'top';

let nextCustomModalId = 0;

/**
 * Globally reusable, dynamic modal shell supporting customizable sizing,
 * alignment, header/footer slots, dismissal rules, SSR safety, and CSS token overrides.
 */
@Component({
  selector: 'app-custom-modal',
  imports: [CustomCloseOutlinedButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscapeKey()',
    '[style.--cp-modal-backdrop]': 'backdropColor()',
    '[style.--cp-modal-z]': 'zIndex()',
    '[style.--cp-modal-max-width]': 'maxWidth()',
    '[style.--cp-modal-max-height]': 'maxHeight()',
    '[style.--cp-modal-padding]': 'padding()',
    '[style.--cp-modal-radius]': 'borderRadius()',
    '[style.--cp-modal-bg]': 'bgColor()',
    '[style.--cp-modal-border]': 'borderColor()',
    '[style.--cp-modal-title-color]': 'titleColor()',
    '[style.--cp-modal-subtitle-color]': 'subtitleColor()',
  },
  template: `
    @if (open()) {
      <div
        class="cp-modal-backdrop"
        [attr.data-align]="align()"
        role="presentation"
        (click)="onBackdropClick($event)"
      >
        <div
          class="cp-modal"
          role="dialog"
          aria-modal="true"
          [attr.data-size]="size()"
          [attr.aria-labelledby]="title() ? titleId : null"
          [style]="customStyles()"
        >
          @if (showHeader()) {
            <div class="cp-modal__header">
              <div class="cp-modal__heading">
                <ng-content select="[modal-header-extra]" />
                @if (title()) {
                  <h2 [id]="titleId" class="cp-modal__title">{{ title() }}</h2>
                }
                @if (subtitle()) {
                  <p class="cp-modal__subtitle">{{ subtitle() }}</p>
                }
              </div>

              @if (showCloseButton()) {
                <app-custom-close-outlined-button
                  [ariaLabel]="closeLabel()"
                  (clicked)="close()"
                />
              }
            </div>
          }

          <div class="cp-modal__body" [class.cp-modal__body--no-header]="!showHeader()">
            <ng-content />
          </div>

          @if (showFooter()) {
            <div class="cp-modal__footer">
              <ng-content select="[modal-footer]" />
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: `
    .cp-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: var(--cp-modal-z, 150);
      display: grid;
      place-items: center;
      padding: var(--gutter, 24px);
      background: var(--cp-modal-backdrop, rgba(15, 51, 36, 0.48));
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      animation: cp-modal-fade-in var(--dur-fast, 150ms) var(--ease, ease) both;
    }

    .cp-modal-backdrop[data-align='top'] {
      align-items: start;
      padding-top: clamp(32px, 8vh, 80px);
    }

    .cp-modal {
      --_max-width: 440px;

      width: 100%;
      max-width: var(--cp-modal-max-width, var(--_max-width));
      max-height: var(--cp-modal-max-height, calc(100dvh - 48px));
      overflow-y: auto;
      padding: var(--cp-modal-padding, 28px);
      border: 1px solid var(--cp-modal-border, var(--color-border, #e4e7e0));
      border-radius: var(--cp-modal-radius, var(--radius-lg, 24px));
      background: var(--cp-modal-bg, var(--color-white, #ffffff));
      box-shadow: var(--shadow-lg);
      will-change: transform, opacity;
      animation: cp-modal-pop-in var(--dur, 260ms) var(--ease, ease) both;
    }

    .cp-modal[data-size='sm'] {
      --_max-width: 380px;
    }

    .cp-modal[data-size='lg'] {
      --_max-width: 560px;
    }

    .cp-modal[data-size='xl'] {
      --_max-width: 720px;
    }

    .cp-modal[data-size='full'] {
      --_max-width: calc(100vw - 48px);
    }

    .cp-modal__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }

    .cp-modal__heading {
      min-width: 0;
    }

    .cp-modal__title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--cp-modal-title-color, var(--color-text, #1f2937));
    }

    .cp-modal__subtitle {
      margin-top: 6px;
      font-size: 0.92rem;
      color: var(--cp-modal-subtitle-color, var(--color-muted, #6b7280));
    }

    .cp-modal__body {
      margin-top: 22px;
    }

    .cp-modal__body--no-header {
      margin-top: 0;
    }

    .cp-modal__footer {
      margin-top: 22px;
      padding-top: 16px;
      border-top: 1px solid var(--color-border, #e4e7e0);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    @keyframes cp-modal-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes cp-modal-pop-in {
      from {
        opacity: 0;
        transform: translate3d(0, 10px, 0) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
      }
    }

    @media (max-width: 480px) {
      .cp-modal {
        padding: 22px 20px;
      }
    }
  `,
})
export class CustomModal {
  readonly open = input<boolean>(false);
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly closeLabel = input<string>('Close dialog');
  readonly size = input<CustomModalSize>('md');
  readonly align = input<CustomModalAlign>('center');
  readonly closeOnBackdrop = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);
  readonly showHeader = input<boolean>(true);
  readonly showCloseButton = input<boolean>(true);
  readonly showFooter = input<boolean>(false);
  readonly lockBodyScroll = input<boolean>(true);

  readonly maxWidth = input<string | null>(null);
  readonly maxHeight = input<string | null>(null);
  readonly padding = input<string | null>(null);
  readonly borderRadius = input<string | null>(null);
  readonly bgColor = input<string | null>(null);
  readonly borderColor = input<string | null>(null);
  readonly backdropColor = input<string | null>(null);
  readonly titleColor = input<string | null>(null);
  readonly subtitleColor = input<string | null>(null);
  readonly zIndex = input<number | null>(null);
  readonly customStyles = input<Record<string, string | number> | null>(null);

  readonly closed = output<void>();

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly titleId = `custom-modal-title-${++nextCustomModalId}`;

  constructor() {
    effect((onCleanup) => {
      if (!this.isBrowser || !this.open() || !this.lockBodyScroll()) {
        return;
      }

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      onCleanup(() => {
        document.body.style.overflow = previousOverflow;
      });
    });
  }

  protected close(): void {
    this.closed.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop() && event.target === event.currentTarget) {
      this.close();
    }
  }

  protected onEscapeKey(): void {
    if (this.open() && this.closeOnEscape()) {
      this.close();
    }
  }
}

