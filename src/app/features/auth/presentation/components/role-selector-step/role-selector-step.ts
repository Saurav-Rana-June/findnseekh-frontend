import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';
import { UserRole } from '../../../domain/entities/auth.entity';

interface RoleOption {
  readonly id: UserRole;
  readonly title: string;
  readonly description: string;
  readonly badge: string;
}

const ROLE_OPTIONS: readonly RoleOption[] = [
  {
    id: 'student',
    title: 'I want to Learn',
    description: 'Discover skilled local & online teachers and send learning requests.',
    badge: 'Student',
  },
  {
    id: 'teacher',
    title: 'I want to Teach',
    description: 'Create your teacher profile, publish skill listings, and connect with learners.',
    badge: 'Teacher',
  },
];

@Component({
  selector: 'app-role-selector-step',
  imports: [CustomPrimaryButton],
  templateUrl: './role-selector-step.html',
  styleUrl: './role-selector-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleSelectorStepComponent {
  readonly selectedRole = input<UserRole>('student');
  readonly roleSelected = output<UserRole>();
  readonly continueRequested = output<void>();

  protected readonly roleOptions = ROLE_OPTIONS;

  protected selectRole(role: UserRole): void {
    this.roleSelected.emit(role);
  }
}

