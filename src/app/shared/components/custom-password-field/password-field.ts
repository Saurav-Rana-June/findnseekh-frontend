import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomPrimaryButton } from '../custom-primary-button/custom.primary.button';
import { CustomTextField } from '../custom-textfield/custom.textfield';

/**
 * Reusable password field wrapping `app-custom-textfield` with a show/hide toggle button.
 * Avoids duplicating password visibility state and eye-icon markup across auth forms.
 */
@Component({
  selector: 'app-password-field',
  imports: [CustomTextField, CustomPrimaryButton],
  templateUrl: './password-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordFieldComponent),
      multi: true,
    },
  ],
})
export class PasswordFieldComponent implements ControlValueAccessor {
  readonly fieldId = input<string>('');
  readonly label = input<string>('Password');
  readonly placeholder = input<string>('Enter your password');
  readonly autocomplete = input<string>('current-password');
  readonly required = input<boolean>(false);
  readonly autofocus = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly errorMessage = input<string>('');

  protected readonly showPassword = signal(false);
  protected readonly value = signal('');
  protected readonly disabled = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected toggleVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  protected handleValueChange(next: string): void {
    this.value.set(next);
    this.onChange(next);
  }

  protected handleBlur(): void {
    this.onTouched();
  }
}

