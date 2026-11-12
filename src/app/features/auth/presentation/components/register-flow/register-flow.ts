import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { APP_ROUTE_PATHS } from '../../../../../core/constants/app.constants';
import { CustomCloseOutlinedButton } from '../../../../../shared/components/custom-close-outlined-button/custom.close.outlined.button';
import { CustomStatusPill } from '../../../../../shared/components/custom-status-pill/custom.status.pill';
import {
  RegisterPayload,
  TeacherProfileUpdatePayload,
  UserRole,
} from '../../../domain/entities/auth.entity';
import { AuthStore } from '../../state/auth.store';
import { RegisterAccountStepComponent } from '../register-account-step/register-account-step';
import { RoleSelectorStepComponent } from '../role-selector-step/role-selector-step';
import { TeacherProfileStepComponent } from '../teacher-profile-step/teacher-profile-step';

export type RegisterStep = 'role' | 'account' | 'teacher-profile';

@Component({
  selector: 'app-register-flow',
  imports: [
    RouterLink,
    CustomStatusPill,
    CustomCloseOutlinedButton,
    RoleSelectorStepComponent,
    RegisterAccountStepComponent,
    TeacherProfileStepComponent,
  ],
  templateUrl: './register-flow.html',
  styleUrl: './register-flow.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFlowComponent {
  readonly initialRole = input<UserRole>('student');
  readonly startAtAccount = input<boolean>(false);
  readonly showCloseButton = input<boolean>(false);
  readonly modalMode = input<boolean>(false);

  readonly completed = output<void>();
  readonly closed = output<void>();
  readonly loginRequested = output<void>();

  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  private readonly _selectedRole = signal<UserRole | null>(null);
  private readonly _step = signal<RegisterStep | null>(null);

  protected readonly selectedRole = computed(() => this._selectedRole() ?? this.initialRole());
  protected readonly step = computed(
    () => this._step() ?? (this.startAtAccount() ? 'account' : 'role'),
  );

  protected readonly totalSteps = computed(() => (this.selectedRole() === 'teacher' ? 3 : 2));

  protected readonly currentStepNumber = computed(() => {
    switch (this.step()) {
      case 'role':
        return 1;
      case 'account':
        return 2;
      case 'teacher-profile':
        return 3;
    }
  });

  protected readonly stepHeading = computed(() => {
    switch (this.step()) {
      case 'role':
        return 'Join FindnSeekh';
      case 'account':
        return this.selectedRole() === 'teacher'
          ? 'Create your Teacher account'
          : 'Create your Student account';
      case 'teacher-profile':
        return 'Set up your Teacher profile';
    }
  });

  protected readonly stepSubtitle = computed(() => {
    switch (this.step()) {
      case 'role':
        return 'Choose how you want to get started. You can always switch later.';
      case 'account':
        return 'Enter your details to create your FindnSeekh account.';
      case 'teacher-profile':
        return 'Tell learners about your experience and how you prefer to teach.';
    }
  });

  protected readonly loginRoute = ['/', APP_ROUTE_PATHS.auth, APP_ROUTE_PATHS.login];

  reset(): void {
    this._selectedRole.set(null);
    this._step.set(null);
    this.authStore.clearError();
  }

  protected onRoleSelected(role: UserRole): void {
    this._selectedRole.set(role);
  }

  protected goToAccountStep(): void {
    this.authStore.clearError();
    this._step.set('account');
  }

  protected goToRoleStep(): void {
    this.authStore.clearError();
    this._step.set('role');
  }

  protected onAccountSubmitted(payload: RegisterPayload): void {
    const role = this.selectedRole();
    this.authStore.register(payload, role, () => {
      if (role === 'teacher') {
        this._step.set('teacher-profile');
      } else {
        this.finishFlow();
      }
    });
  }

  protected onTeacherProfileSubmitted(payload: TeacherProfileUpdatePayload): void {
    this.authStore.updateTeacherProfile(payload, () => {
      this.finishFlow();
    });
  }

  protected onTeacherProfileSkipped(): void {
    this.finishFlow();
  }

  protected onLoginLinkClick(event: Event): void {
    if (this.modalMode()) {
      event.preventDefault();
      this.loginRequested.emit();
    }
  }

  private finishFlow(): void {
    this.completed.emit();
    if (!this.modalMode()) {
      void this.router.navigate(['/', APP_ROUTE_PATHS.root]);
    }
  }
}

