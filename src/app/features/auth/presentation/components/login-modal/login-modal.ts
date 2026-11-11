import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../../../../shared/components/modal/modal';
import { AutofocusDirective } from '../../../../../shared/directives/autofocus.directive';
import { AuthStore } from '../../state/auth.store';

@Component({
  selector: 'app-login-modal',
  imports: [ReactiveFormsModule, ModalComponent, AutofocusDirective],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalComponent {
  readonly open = input<boolean>(false);
  readonly closed = output<void>();

  protected readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);

  protected readonly showPassword = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    effect(() => {
      if (!this.open()) {
        this.form.reset({ email: '', password: '' });
        this.showPassword.set(false);
        this.authStore.clearError();
      }
    });
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
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
}

