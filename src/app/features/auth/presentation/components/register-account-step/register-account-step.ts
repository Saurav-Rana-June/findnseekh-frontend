import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';
import { CustomTextField } from '../../../../../shared/components/custom-textfield/custom.textfield';
import { RegisterPayload, UserRole } from '../../../domain/entities/auth.entity';
import { PasswordFieldComponent } from '../password-field/password-field';

function nonBlankValidator(control: AbstractControl<string>): ValidationErrors | null {
  return control.value && control.value.trim().length === 0 ? { blank: true } : null;
}

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value as string | undefined;
  const confirmPassword = group.get('confirmPassword')?.value as string | undefined;
  if (!password || !confirmPassword) {
    return null;
  }
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register-account-step',
  imports: [ReactiveFormsModule, CustomTextField, CustomPrimaryButton, PasswordFieldComponent],
  templateUrl: './register-account-step.html',
  styleUrl: './register-account-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterAccountStepComponent {
  readonly role = input<UserRole>('student');
  readonly isLoading = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);

  readonly submitted = output<RegisterPayload>();
  readonly backRequested = output<void>();

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, nonBlankValidator, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator },
  );

  protected get nameError(): string {
    const control = this.form.controls.name;
    if (!control.touched) {
      return '';
    }
    if (control.hasError('required') || control.hasError('blank')) {
      return 'Full name is required.';
    }
    if (control.hasError('maxlength')) {
      return 'Name cannot exceed 100 characters.';
    }
    return '';
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
      return 'Password must be at least 8 characters.';
    }
    return '';
  }

  protected get confirmPasswordError(): string {
    const control = this.form.controls.confirmPassword;
    if (!control.touched) {
      return '';
    }
    if (control.hasError('required')) {
      return 'Please confirm your password.';
    }
    if (this.form.hasError('passwordMismatch')) {
      return 'Passwords do not match.';
    }
    return '';
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.form.getRawValue();
    this.submitted.emit({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
  }
}

