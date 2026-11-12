import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomModal } from '../../../../../shared/components/custom-modal/custom.modal';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';
import { CustomTextField } from '../../../../../shared/components/custom-textfield/custom.textfield';
import { AuthStore } from '../../state/auth.store';
import { PasswordFieldComponent } from '../../../../../shared/components/custom-password-field/password-field';

@Component({
  selector: 'app-login-modal',
  imports: [
    ReactiveFormsModule,
    CustomModal,
    CustomTextField,
    CustomPrimaryButton,
    PasswordFieldComponent,
  ],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalComponent {
  readonly open = input<boolean>(false);
  readonly closed = output<void>();
  readonly registerRequested = output<void>();

  protected readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    effect(() => {
      if (!this.open()) {
        this.form.reset({ email: '', password: '' });
        this.authStore.clearError();
      }
    });
  }

  protected get emailError(): string {
    const control = this.form.controls.email;
    if (!control.touched) {
      return '';
    }
    if (control.hasError('required')) {
      return 'Email address is required.';
    }
    if (control.hasError('email')) {
      return 'Enter a valid email address.';
    }
    return '';
  }

  protected get passwordError(): string {
    const control = this.form.controls.password;
    if (!control.touched) {
      return '';
    }
    if (control.hasError('required')) {
      return 'Password is required.';
    }
    if (control.hasError('minlength')) {
      return 'Password must be at least 6 characters.';
    }
    return '';
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.authStore.login({ email: email.trim(), password }, () => {
      this.close();
    });
  }

  protected close(): void {
    this.closed.emit();
  }

  protected switchToRegister(): void {
    this.closed.emit();
    this.registerRequested.emit();
  }
}
