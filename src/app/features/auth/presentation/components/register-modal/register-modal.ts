import { ChangeDetectionStrategy, Component, effect, input, output, viewChild } from '@angular/core';
import { CustomModal } from '../../../../../shared/components/custom-modal/custom.modal';
import { UserRole } from '../../../domain/entities/auth.entity';
import { RegisterFlowComponent } from '../register-flow/register-flow';

@Component({
  selector: 'app-register-modal',
  imports: [CustomModal, RegisterFlowComponent],
  templateUrl: './register-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterModalComponent {
  readonly open = input<boolean>(false);
  readonly initialRole = input<UserRole>('student');
  readonly closed = output<void>();
  readonly loginRequested = output<void>();

  private readonly registerFlow = viewChild(RegisterFlowComponent);

  constructor() {
    effect(() => {
      if (!this.open()) {
        this.registerFlow()?.reset();
      }
    });
  }

  protected close(): void {
    this.closed.emit();
  }

  protected switchToLogin(): void {
    this.closed.emit();
    this.loginRequested.emit();
  }
}

