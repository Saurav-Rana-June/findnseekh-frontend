import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

export type CustomButtonVariant =
  | 'primary'
  | 'outline'
  | 'ghost'
  | 'cream'
  | 'secondary'
  | 'danger'
  | 'custom';

export type CustomButtonSize = 'sm' | 'md' | 'lg';
export type CustomButtonShape = 'pill' | 'rounded' | 'square';
export type CustomButtonType = 'button' | 'submit' | 'reset';
export type CustomButtonIcon = 'none' | 'search' | 'arrow-right' | 'arrow-left' | 'plus' | 'user' | 'check';

/**
 * Globally reusable, dynamic primary button component supporting button, link,
 * and RouterLink modes along with variant, size, shape, icon, and CSS-token overrides.
 */
@Component({
  selector: 'app-custom-primary-button',
  imports: [RouterLink, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-full-width]': 'fullWidth()',
    '[style.--cp-btn-bg]': 'bgColor()',
    '[style.--cp-btn-color]': 'textColor()',
    '[style.--cp-btn-border]': 'borderColor()',
    '[style.--cp-btn-hover-bg]': 'hoverBgColor()',
    '[style.--cp-btn-hover-color]': 'hoverTextColor()',
    '[style.--cp-btn-hover-border]': 'hoverBorderColor()',
    '[style.--cp-btn-min-height]': 'minHeight()',
    '[style.--cp-btn-padding-x]': 'paddingInline()',
    '[style.--cp-btn-font-size]': 'fontSize()',
    '[style.--cp-btn-font-weight]': 'fontWeight()',
    '[style.--cp-btn-radius]': 'borderRadius()',
    '[style.--cp-btn-gap]': 'gap()',
  },
  template: `
    <ng-template #btnContent>
      @if (loading()) {
        <span class="cp-btn__spinner" aria-hidden="true"></span>
      } @else if (leadingIcon() !== 'none') {
        <ng-container *ngTemplateOutlet="iconTpl; context: { $implicit: leadingIcon() }" />
      }

      <ng-content select="[btn-leading]" />

      @if (label()) {
        <span class="cp-btn__label">{{ label() }}</span>
      }
      <ng-content />

      @if (srOnlyLabel()) {
        <span class="cp-btn__sr-only">{{ srOnlyLabel() }}</span>
      }

      <ng-content select="[btn-trailing]" />

      @if (trailingIcon() !== 'none') {
        <ng-container *ngTemplateOutlet="iconTpl; context: { $implicit: trailingIcon() }" />
      }
    </ng-template>

    <ng-template #iconTpl let-iconName>
      @switch (iconName) {
        @case ('search') {
          <svg
            class="cp-btn__icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        }
        @case ('arrow-right') {
          <svg
            class="cp-btn__icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        }
        @case ('arrow-left') {
          <svg
            class="cp-btn__icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
        }
        @case ('plus') {
          <svg
            class="cp-btn__icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        }
        @case ('user') {
          <svg
            class="cp-btn__icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
        }
        @case ('check') {
          <svg
            class="cp-btn__icon"
            width="18"
            height="18"
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
      }
    </ng-template>

    @if (routerLink(); as linkTarget) {
      <a
        class="cp-btn"
        [routerLink]="isDisabled() ? null : linkTarget"
        [queryParams]="queryParams()"
        [attr.data-variant]="variant()"
        [attr.data-size]="size()"
        [attr.data-shape]="shape()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-disabled]="isDisabled() ? 'true' : null"
        [attr.tabindex]="isDisabled() ? -1 : null"
        [class.is-disabled]="isDisabled()"
        [style]="customStyles()"
        (click)="handleClick($event)"
      >
        <ng-container *ngTemplateOutlet="btnContent" />
      </a>
    } @else if (href(); as hrefTarget) {
      <a
        class="cp-btn"
        [attr.href]="isDisabled() ? null : hrefTarget"
        [attr.target]="target()"
        [attr.rel]="target() === '_blank' ? 'noopener noreferrer' : null"
        [attr.data-variant]="variant()"
        [attr.data-size]="size()"
        [attr.data-shape]="shape()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-disabled]="isDisabled() ? 'true' : null"
        [attr.tabindex]="isDisabled() ? -1 : null"
        [class.is-disabled]="isDisabled()"
        [style]="customStyles()"
        (click)="handleClick($event)"
      >
        <ng-container *ngTemplateOutlet="btnContent" />
      </a>
    } @else {
      <button
        class="cp-btn"
        [attr.type]="type()"
        [attr.data-variant]="variant()"
        [attr.data-size]="size()"
        [attr.data-shape]="shape()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-busy]="loading() ? 'true' : null"
        [disabled]="isDisabled()"
        [class.is-disabled]="isDisabled()"
        [style]="customStyles()"
        (click)="handleClick($event)"
      >
        <ng-container *ngTemplateOutlet="btnContent" />
      </button>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      max-width: 100%;
    }

    :host(.is-full-width) {
      display: flex;
      width: 100%;
    }

    .cp-btn {
      --_height: var(--control-height-md, 44px);
      --_px: var(--control-padding-x-md, 22px);
      --_fs: var(--control-font-md, 0.95rem);
      --_fw: 600;
      --_gap: var(--control-gap, 8px);
      --_radius: var(--radius-pill, 999px);
      --_bg: var(--color-primary, #174e38);
      --_color: var(--color-cream, #f8f8f2);
      --_border: transparent;
      --_hover-bg: var(--color-primary-hover, #123e2d);
      --_hover-color: var(--_color);
      --_hover-border: var(--_border);
      --_hover-shadow: none;

      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      gap: var(--cp-btn-gap, var(--_gap));
      min-height: var(--cp-btn-min-height, var(--_height));
      padding: 0 var(--cp-btn-padding-x, var(--_px));
      border: 1.5px solid var(--cp-btn-border, var(--_border));
      border-radius: var(--cp-btn-radius, var(--_radius));
      background: var(--cp-btn-bg, var(--_bg));
      color: var(--cp-btn-color, var(--_color));
      font: inherit;
      font-size: var(--cp-btn-font-size, var(--_fs));
      font-weight: var(--cp-btn-font-weight, var(--_fw));
      line-height: 1;
      text-decoration: none;
      white-space: nowrap;
      cursor: pointer;
      transition:
        background-color var(--dur-fast, 150ms) var(--ease, ease),
        color var(--dur-fast, 150ms) var(--ease, ease),
        border-color var(--dur-fast, 150ms) var(--ease, ease),
        box-shadow var(--dur, 260ms) var(--ease, ease),
        transform var(--dur-fast, 150ms) var(--ease, ease);
    }

    .cp-btn[data-size='sm'] {
      --_height: var(--control-height-sm, 36px);
      --_px: var(--control-padding-x-sm, 16px);
      --_fs: var(--control-font-sm, 0.86rem);
    }

    .cp-btn[data-size='lg'] {
      --_height: var(--control-height-lg, 54px);
      --_px: var(--control-padding-x-lg, 30px);
      --_fs: var(--control-font-lg, 1rem);
    }

    .cp-btn[data-shape='rounded'] {
      --_radius: var(--radius-sm, 10px);
    }

    .cp-btn[data-shape='square'] {
      --_radius: 4px;
    }

    .cp-btn[data-variant='primary'] {
      --_bg: var(--color-primary, #174e38);
      --_color: var(--color-cream, #f8f8f2);
      --_hover-bg: var(--color-primary-hover, #123e2d);
      --_hover-shadow: 0 8px 20px rgba(23, 78, 56, 0.28);
    }

    .cp-btn[data-variant='outline'] {
      --_bg: var(--color-white, #ffffff);
      --_border: var(--color-border-strong, #d3d8ce);
      --_color: var(--color-primary, #174e38);
      --_hover-bg: var(--color-primary, #174e38);
      --_hover-border: var(--color-primary, #174e38);
      --_hover-color: var(--color-cream, #f8f8f2);
    }

    .cp-btn[data-variant='ghost'] {
      --_bg: transparent;
      --_color: var(--color-text, #1f2937);
      --_hover-bg: var(--color-primary-50, #eef4f0);
      --_hover-color: var(--color-primary, #174e38);
    }

    .cp-btn[data-variant='cream'] {
      --_bg: var(--color-cream, #f8f8f2);
      --_color: var(--color-primary, #174e38);
      --_hover-bg: var(--color-white, #ffffff);
      --_hover-shadow: 0 10px 26px rgba(0, 0, 0, 0.22);
    }

    .cp-btn[data-variant='secondary'] {
      --_bg: var(--color-surface, #f8fafc);
      --_border: var(--color-border, #e4e7e0);
      --_color: var(--color-text, #1f2937);
      --_hover-bg: var(--color-primary-50, #eef4f0);
    }

    .cp-btn[data-variant='danger'] {
      --_bg: var(--color-danger, #dc2626);
      --_color: #ffffff;
      --_hover-bg: #b91c1c;
    }

    .cp-btn:hover:not(.is-disabled) {
      background: var(--cp-btn-hover-bg, var(--_hover-bg));
      color: var(--cp-btn-hover-color, var(--_hover-color));
      border-color: var(--cp-btn-hover-border, var(--_hover-border));
      box-shadow: var(--_hover-shadow);
    }

    .cp-btn:active:not(.is-disabled) {
      transform: translateY(1px);
    }

    .cp-btn.is-disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .cp-btn__icon {
      flex-shrink: 0;
      width: var(--icon-size-lg, 20px);
      height: var(--icon-size-lg, 20px);
    }

    .cp-btn__spinner {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid currentColor;
      border-top-color: transparent;
      animation: cp-btn-spin 700ms linear infinite;
    }

    .cp-btn__sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @keyframes cp-btn-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class CustomPrimaryButton {
  readonly label = input<string>('');
  readonly srOnlyLabel = input<string>('');
  readonly ariaLabel = input<string | null>(null);
  readonly variant = input<CustomButtonVariant>('primary');
  readonly size = input<CustomButtonSize>('md');
  readonly shape = input<CustomButtonShape>('pill');
  readonly type = input<CustomButtonType>('button');
  readonly routerLink = input<string | readonly unknown[] | null>(null);
  readonly queryParams = input<Params | null>(null);
  readonly href = input<string | null>(null);
  readonly target = input<'_self' | '_blank'>('_self');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly leadingIcon = input<CustomButtonIcon>('none');
  readonly trailingIcon = input<CustomButtonIcon>('none');

  readonly bgColor = input<string | null>(null);
  readonly textColor = input<string | null>(null);
  readonly borderColor = input<string | null>(null);
  readonly hoverBgColor = input<string | null>(null);
  readonly hoverTextColor = input<string | null>(null);
  readonly hoverBorderColor = input<string | null>(null);
  readonly minHeight = input<string | null>(null);
  readonly paddingInline = input<string | null>(null);
  readonly fontSize = input<string | null>(null);
  readonly fontWeight = input<string | number | null>(null);
  readonly borderRadius = input<string | null>(null);
  readonly gap = input<string | null>(null);
  readonly customStyles = input<Record<string, string | number> | null>(null);

  readonly clicked = output<MouseEvent>();

  protected readonly isDisabled = computed(() => this.disabled() || this.loading());

  protected handleClick(event: MouseEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.clicked.emit(event);
  }
}

