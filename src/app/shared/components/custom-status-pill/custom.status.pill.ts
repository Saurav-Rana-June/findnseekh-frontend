import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type StatusPillVariant =
  | 'soft'
  | 'neutral'
  | 'surface'
  | 'solid'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type StatusPillSize = 'sm' | 'md' | 'lg';
export type StatusPillIcon = 'none' | 'location' | 'spark' | 'check' | 'dot';

/**
 * Globally reusable, dynamic status pill / chip component supporting static
 * badges (eyebrow, card tags, status labels) and interactive filter pills.
 */
@Component({
  selector: 'app-custom-status-pill',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--cp-pill-bg]': 'bgColor()',
    '[style.--cp-pill-color]': 'textColor()',
    '[style.--cp-pill-border]': 'borderColor()',
    '[style.--cp-pill-hover-bg]': 'hoverBgColor()',
    '[style.--cp-pill-hover-color]': 'hoverTextColor()',
    '[style.--cp-pill-hover-border]': 'hoverBorderColor()',
    '[style.--cp-pill-radius]': 'borderRadius()',
    '[style.--cp-pill-padding]': 'padding()',
    '[style.--cp-pill-min-height]': 'minHeight()',
    '[style.--cp-pill-font-size]': 'fontSize()',
    '[style.--cp-pill-font-weight]': 'fontWeight()',
    '[style.--cp-pill-dot-color]': 'dotColor()',
  },
  template: `
    <ng-template #pillContent>
      @switch (icon()) {
        @case ('location') {
          <svg
            class="cp-pill__icon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        }
        @case ('spark') {
          <svg
            class="cp-pill__icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path d="m12 3-1.9 5.8L4 10.7l5.1 2L12 19l1.9-6.3 5.1-2-6.1-1.9Z" />
          </svg>
        }
        @case ('check') {
          <svg
            class="cp-pill__icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m5 12 5 5L20 7" />
          </svg>
        }
        @case ('dot') {
          <span class="cp-pill__dot" aria-hidden="true"></span>
        }
      }

      <ng-content select="[pill-leading]" />
      @if (label()) {
        <span>{{ label() }}</span>
      }
      <ng-content />
      <ng-content select="[pill-trailing]" />

      @if (removable()) {
        <button
          type="button"
          class="cp-pill__remove"
          [attr.aria-label]="removeAriaLabel() || 'Remove ' + label()"
          [disabled]="disabled()"
          (click)="handleRemove($event)"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      }
    </ng-template>

    @if (interactive() && !removable()) {
      <button
        type="button"
        class="cp-pill is-interactive"
        [attr.data-variant]="variant()"
        [attr.data-size]="size()"
        [attr.data-elevation]="elevation()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-pressed]="active()"
        [attr.title]="title()"
        [class.is-active]="active()"
        [disabled]="disabled()"
        [style]="customStyles()"
        (click)="handleClick($event)"
      >
        <ng-container *ngTemplateOutlet="pillContent" />
      </button>
    } @else {
      <span
        class="cp-pill"
        [attr.data-variant]="variant()"
        [attr.data-size]="size()"
        [attr.data-elevation]="elevation()"
        [attr.aria-label]="ariaLabel()"
        [attr.title]="title()"
        [style]="customStyles()"
      >
        <ng-container *ngTemplateOutlet="pillContent" />
      </span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      max-width: 100%;
    }

    .cp-pill {
      --_min-height: auto;
      --_padding: 6px 14px;
      --_fs: 0.82rem;
      --_fw: 600;
      --_ls: 0.01em;
      --_gap: 8px;
      --_radius: var(--radius-pill, 999px);
      --_bg: var(--color-primary-50, #eef4f0);
      --_border: var(--color-primary-100, #dce9e1);
      --_color: var(--color-primary, #174e38);
      --_hover-bg: var(--color-primary-50, #eef4f0);
      --_hover-border: var(--color-primary, #174e38);
      --_hover-color: var(--color-primary, #174e38);
      --_shadow: none;

      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--_gap);
      min-height: var(--cp-pill-min-height, var(--_min-height));
      padding: var(--cp-pill-padding, var(--_padding));
      border: 1px solid var(--cp-pill-border, var(--_border));
      border-radius: var(--cp-pill-radius, var(--_radius));
      background: var(--cp-pill-bg, var(--_bg));
      color: var(--cp-pill-color, var(--_color));
      box-shadow: var(--_shadow);
      font: inherit;
      font-size: var(--cp-pill-font-size, var(--_fs));
      font-weight: var(--cp-pill-font-weight, var(--_fw));
      letter-spacing: var(--_ls);
      line-height: 1.2;
      white-space: nowrap;
      transition:
        border-color var(--dur-fast, 150ms) var(--ease, ease),
        color var(--dur-fast, 150ms) var(--ease, ease),
        background-color var(--dur-fast, 150ms) var(--ease, ease);
    }

    .cp-pill[data-size='sm'] {
      --_padding: 4px 12px;
      --_fs: 0.78rem;
      --_fw: 600;
      --_ls: 0;
      --_gap: 6px;
    }

    .cp-pill[data-size='lg'] {
      --_min-height: 36px;
      --_padding: 0 16px;
      --_fs: 0.88rem;
      --_fw: 500;
      --_ls: 0;
    }

    .cp-pill[data-variant='soft'] {
      --_bg: var(--color-primary-50, #eef4f0);
      --_border: var(--color-primary-100, #dce9e1);
      --_color: var(--color-primary, #174e38);
    }

    .cp-pill[data-variant='neutral'] {
      --_bg: var(--color-white, #ffffff);
      --_border: var(--color-border-strong, #d3d8ce);
      --_color: var(--color-text, #1f2937);
    }

    .cp-pill[data-variant='surface'] {
      --_bg: var(--color-white, #ffffff);
      --_border: transparent;
      --_color: var(--color-primary, #174e38);
    }

    .cp-pill[data-variant='solid'] {
      --_bg: var(--color-primary, #174e38);
      --_border: var(--color-primary, #174e38);
      --_color: var(--color-cream, #f8f8f2);
    }

    .cp-pill[data-variant='success'] {
      --_bg: #ecfdf3;
      --_border: #abefc6;
      --_color: #067647;
    }

    .cp-pill[data-variant='warning'] {
      --_bg: #fffaeb;
      --_border: #fedf89;
      --_color: #b54708;
    }

    .cp-pill[data-variant='danger'] {
      --_bg: #fef3f2;
      --_border: #fecdca;
      --_color: #b42318;
    }

    .cp-pill[data-variant='info'] {
      --_bg: #eff8ff;
      --_border: #b2ddff;
      --_color: #175cd3;
    }

    .cp-pill[data-elevation='sm'] {
      --_shadow: var(--shadow-sm);
    }

    .cp-pill[data-elevation='md'] {
      --_shadow: var(--shadow-md);
    }

    .cp-pill.is-interactive {
      cursor: pointer;
    }

    .cp-pill.is-interactive:hover:not(:disabled),
    .cp-pill.is-active {
      border-color: var(--cp-pill-hover-border, var(--_hover-border));
      background: var(--cp-pill-hover-bg, var(--_hover-bg));
      color: var(--cp-pill-hover-color, var(--_hover-color));
    }

    .cp-pill.is-interactive:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .cp-pill__icon {
      flex-shrink: 0;
    }

    .cp-pill__dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
      background: var(--cp-pill-dot-color, currentColor);
    }

    .cp-pill__remove {
      display: inline-grid;
      place-items: center;
      width: 1.125rem;
      height: 1.125rem;
      padding: 0;
      margin-left: 0.375rem;
      margin-right: -0.25rem;
      border: none;
      border-radius: var(--radius-pill, 999px);
      background: transparent;
      color: inherit;
      opacity: 0.65;
      cursor: pointer;
      transition:
        opacity var(--dur-fast, 150ms) var(--ease, ease),
        background-color var(--dur-fast, 150ms) var(--ease, ease),
        transform var(--dur-fast, 150ms) var(--ease, ease);

      &:hover:not(:disabled) {
        opacity: 1;
        background: rgba(0, 0, 0, 0.12);
      }

      &:active:not(:disabled) {
        transform: scale(0.92);
      }

      &:focus-visible {
        outline: 2px solid var(--color-focus, #174e38);
        outline-offset: 1px;
      }

      &:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }
    }
  `,
})
export class CustomStatusPill {
  readonly label = input<string>('');
  readonly variant = input<StatusPillVariant>('soft');
  readonly size = input<StatusPillSize>('md');
  readonly interactive = input<boolean>(false);
  readonly removable = input<boolean>(false);
  readonly removeAriaLabel = input<string | null>(null);
  readonly active = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly icon = input<StatusPillIcon>('none');
  readonly dotColor = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly title = input<string | null>(null);
  readonly elevation = input<'none' | 'sm' | 'md'>('none');

  readonly bgColor = input<string | null>(null);
  readonly textColor = input<string | null>(null);
  readonly borderColor = input<string | null>(null);
  readonly hoverBgColor = input<string | null>(null);
  readonly hoverTextColor = input<string | null>(null);
  readonly hoverBorderColor = input<string | null>(null);
  readonly borderRadius = input<string | null>(null);
  readonly padding = input<string | null>(null);
  readonly minHeight = input<string | null>(null);
  readonly fontSize = input<string | null>(null);
  readonly fontWeight = input<string | number | null>(null);
  readonly customStyles = input<Record<string, string | number> | null>(null);

  readonly clicked = output<MouseEvent>();
  readonly removed = output<MouseEvent>();

  protected handleClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }

  protected handleRemove(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled()) {
      this.removed.emit(event);
    }
  }
}

