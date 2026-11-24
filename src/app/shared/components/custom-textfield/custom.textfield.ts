import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type CustomTextFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'search'
  | 'tel'
  | 'url'
  | 'number';

export type CustomTextFieldSize = 'sm' | 'md' | 'lg';
export type CustomTextFieldIcon =
  | 'none'
  | 'mail'
  | 'lock'
  | 'user'
  | 'search'
  | 'phone'
  | 'location'
  | 'academic'
  | 'spark';

let nextTextFieldId = 0;

/**
 * Globally reusable, dynamic text field component supporting Reactive Forms
 * (ControlValueAccessor), signal bindings, icons, validation states, and CSS overrides.
 */
@Component({
  selector: 'app-custom-textfield',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomTextField),
      multi: true,
    },
  ],
  host: {
    '[class.is-full-width]': 'fullWidth()',
    '[style.--cp-tf-bg]': 'bgColor()',
    '[style.--cp-tf-color]': 'textColor()',
    '[style.--cp-tf-label-color]': 'labelColor()',
    '[style.--cp-tf-placeholder-color]': 'placeholderColor()',
    '[style.--cp-tf-border]': 'borderColor()',
    '[style.--cp-tf-focus-border]': 'focusBorderColor()',
    '[style.--cp-tf-focus-ring]': 'focusRingColor()',
    '[style.--cp-tf-icon-color]': 'iconColor()',
    '[style.--cp-tf-radius]': 'borderRadius()',
    '[style.--cp-tf-min-height]': 'minHeight()',
    '[style.--cp-tf-px]': 'paddingInline()',
    '[style.--cp-tf-font-size]': 'fontSize()',
  },
  template: `
    <div class="cp-tf" [attr.data-size]="size()" [style]="customStyles()">
      @if (label()) {
        <label class="cp-tf__label" [attr.for]="resolvedFieldId()">
          {{ label() }}
          @if (required()) {
            <span class="cp-tf__required" aria-hidden="true">*</span>
          }
        </label>
      }

      <div
        class="cp-tf__control"
        [class.is-invalid]="invalid()"
        [class.is-disabled]="isDisabled()"
      >
        @if (leadingIcon() !== 'none') {
          @switch (leadingIcon()) {
            @case ('mail') {
              <svg
                class="cp-tf__icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            }
            @case ('lock') {
              <svg
                class="cp-tf__icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
            @case ('user') {
              <svg
                class="cp-tf__icon"
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
            @case ('search') {
              <svg
                class="cp-tf__icon"
                width="18"
                height="18"
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
            @case ('phone') {
              <svg
                class="cp-tf__icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                />
              </svg>
            }
            @case ('location') {
              <svg
                class="cp-tf__icon"
                width="18"
                height="18"
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
            @case ('academic') {
              <svg
                class="cp-tf__icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            }
            @case ('spark') {
              <svg
                class="cp-tf__icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path d="m12 3-1.9 5.8L4 10.7l5.1 2L12 19l1.9-6.3 5.1-2-6.1-1.9Z" />
              </svg>
            }
          }
        }

        <ng-content select="[textfield-leading]" />

        <input
          #inputEl
          class="cp-tf__input"
          [id]="resolvedFieldId()"
          [attr.name]="name() || null"
          [type]="type()"
          [value]="resolvedValue()"
          [placeholder]="placeholder()"
          [autocomplete]="autocomplete()"
          [readonly]="readonly()"
          [disabled]="isDisabled()"
          [attr.aria-invalid]="invalid() ? 'true' : null"
          [attr.aria-describedby]="describedById()"
          (input)="handleInput($event)"
          (blur)="handleBlur($event)"
          (focus)="focused.emit($event)"
        />

        <ng-content select="[textfield-trailing]" />
      </div>

      @if (errorMessage()) {
        <p [id]="errorId" class="cp-tf__error">{{ errorMessage() }}</p>
      } @else if (hint()) {
        <p [id]="hintId" class="cp-tf__hint">{{ hint() }}</p>
      }

      <ng-content select="[textfield-helper]" />
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
      max-width: 100%;
    }

    :host(.is-full-width) {
      display: block;
      width: 100%;
    }

    .cp-tf {
      --_min-height: var(--field-min-height-md, 48px);
      --_px: var(--field-padding-x-md, 14px);
      --_fs: var(--field-font-md, 0.95rem);
      --_radius: var(--radius-md, 16px);

      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    .cp-tf[data-size='sm'] {
      --_min-height: var(--field-min-height-sm, 40px);
      --_px: var(--field-padding-x-sm, 12px);
      --_fs: var(--field-font-sm, 0.88rem);
      --_radius: var(--radius-sm, 10px);
    }

    .cp-tf[data-size='lg'] {
      --_min-height: var(--field-min-height-lg, 54px);
      --_px: var(--field-padding-x-lg, 16px);
      --_fs: var(--field-font-lg, 1rem);
    }

    .cp-tf__label {
      font-size: var(--field-label-font, 0.85rem);
      font-weight: 600;
      color: var(--cp-tf-label-color, var(--color-text, #1f2937));
    }

    .cp-tf__required {
      color: var(--color-danger, #dc2626);
      margin-left: 2px;
    }

    .cp-tf__control {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 var(--cp-tf-px, var(--_px));
      min-height: var(--cp-tf-min-height, var(--_min-height));
      border: 1px solid var(--cp-tf-border, var(--color-border-strong, #d3d8ce));
      border-radius: var(--cp-tf-radius, var(--_radius));
      background: var(--cp-tf-bg, var(--color-white, #ffffff));
      transition:
        border-color var(--dur-fast, 150ms) var(--ease, ease),
        box-shadow var(--dur-fast, 150ms) var(--ease, ease);
    }

    .cp-tf__control:focus-within:not(.is-disabled) {
      border-color: var(--cp-tf-focus-border, var(--color-primary, #174e38));
      box-shadow: 0 0 0 3px var(--cp-tf-focus-ring, var(--color-primary-100, #dce9e1));
    }

    .cp-tf__control.is-invalid {
      border-color: var(--color-danger, #dc2626);
    }

    .cp-tf__control.is-disabled {
      opacity: 0.65;
      background: var(--color-surface, #f8fafc);
      cursor: not-allowed;
    }

    .cp-tf__icon {
      flex-shrink: 0;
      width: var(--icon-size-md, 18px);
      height: var(--icon-size-md, 18px);
      color: var(--cp-tf-icon-color, var(--color-primary, #174e38));
    }

    .cp-tf__input {
      width: 100%;
      min-width: 0;
      border: 0;
      padding: 0;
      background: transparent;
      font: inherit;
      font-size: var(--cp-tf-font-size, var(--_fs));
      color: var(--cp-tf-color, var(--color-text, #1f2937));
    }

    .cp-tf__input::placeholder {
      color: var(--cp-tf-placeholder-color, var(--color-muted, #6b7280));
    }

    .cp-tf__input:focus-visible {
      outline: none;
    }

    .cp-tf__input:disabled {
      cursor: not-allowed;
    }

    .cp-tf__error {
      font-size: 0.8rem;
      color: var(--color-danger, #dc2626);
    }

    .cp-tf__hint {
      font-size: 0.8rem;
      color: var(--color-muted, #6b7280);
    }
  `,
})
export class CustomTextField implements ControlValueAccessor {
  readonly fieldId = input<string>('');
  readonly name = input<string>('');
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<CustomTextFieldType>('text');
  readonly size = input<CustomTextFieldSize>('md');
  readonly autocomplete = input<string>('off');
  readonly readonly = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly autofocus = input<boolean>(false);
  readonly fullWidth = input<boolean>(true);
  readonly leadingIcon = input<CustomTextFieldIcon>('none');
  readonly value = input<string | undefined>(undefined);

  readonly bgColor = input<string | null>(null);
  readonly textColor = input<string | null>(null);
  readonly labelColor = input<string | null>(null);
  readonly placeholderColor = input<string | null>(null);
  readonly borderColor = input<string | null>(null);
  readonly focusBorderColor = input<string | null>(null);
  readonly focusRingColor = input<string | null>(null);
  readonly iconColor = input<string | null>(null);
  readonly borderRadius = input<string | null>(null);
  readonly minHeight = input<string | null>(null);
  readonly paddingInline = input<string | null>(null);
  readonly fontSize = input<string | null>(null);
  readonly customStyles = input<Record<string, string | number> | null>(null);

  readonly valueChange = output<string>();
  readonly blurred = output<FocusEvent>();
  readonly focused = output<FocusEvent>();

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  private readonly fallbackId = `cp-textfield-${++nextTextFieldId}`;
  protected readonly errorId = `${this.fallbackId}-error`;
  protected readonly hintId = `${this.fallbackId}-hint`;

  private readonly internalValue = signal('');
  private readonly formDisabled = signal(false);

  protected readonly resolvedFieldId = computed(() => this.fieldId() || this.fallbackId);
  protected readonly resolvedValue = computed(() => this.value() ?? this.internalValue());
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly describedById = computed(() => {
    if (this.errorMessage()) {
      return this.errorId;
    }
    if (this.hint()) {
      return this.hintId;
    }
    return null;
  });

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      if (this.isBrowser && this.autofocus()) {
        queueMicrotask(() => {
          this.inputEl()?.nativeElement.focus();
        });
      }
    });
  }

  writeValue(value: string | null): void {
    this.internalValue.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  protected handleInput(event: Event): void {
    const nextValue = (event.target as HTMLInputElement).value;
    this.internalValue.set(nextValue);
    this.onChange(nextValue);
    this.valueChange.emit(nextValue);
  }

  protected handleBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
  }
}

