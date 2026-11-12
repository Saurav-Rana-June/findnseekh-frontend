import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthModalService } from '../../../../auth/presentation/state/auth-modal.service';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';

@Component({
  selector: 'app-become-teacher-cta',
  imports: [CustomPrimaryButton],
  templateUrl: './become-teacher-cta.html',
  styleUrl: './become-teacher-cta.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecomeTeacherCta {
  private readonly authModal = inject(AuthModalService);

  protected openTeacherRegister(): void {
    this.authModal.openRegister('teacher');
  }
}

