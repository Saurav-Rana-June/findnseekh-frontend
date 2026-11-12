import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';
import { CustomTextField } from '../../../../../shared/components/custom-textfield/custom.textfield';
import { TeacherProfileUpdatePayload, TeachingMode } from '../../../domain/entities/auth.entity';

interface TeachingModeOption {
  readonly value: TeachingMode;
  readonly label: string;
}

const TEACHING_MODES: readonly TeachingModeOption[] = [
  { value: 'both', label: 'Online & In-person' },
  { value: 'online', label: 'Online only' },
  { value: 'offline', label: 'In-person only' },
];

@Component({
  selector: 'app-teacher-profile-step',
  imports: [ReactiveFormsModule, CustomTextField, CustomPrimaryButton],
  templateUrl: './teacher-profile-step.html',
  styleUrl: './teacher-profile-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherProfileStepComponent {
  readonly isLoading = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);

  readonly submitted = output<TeacherProfileUpdatePayload>();
  readonly skipped = output<void>();

  private readonly fb = inject(FormBuilder);

  protected readonly teachingModes = TEACHING_MODES;

  protected readonly form = this.fb.nonNullable.group({
    bio: ['', [Validators.maxLength(1000)]],
    experienceYears: [0, [Validators.min(0), Validators.max(80)]],
    teachingMode: ['both' as TeachingMode, [Validators.required]],
    city: ['', [Validators.maxLength(100)]],
    state: ['', [Validators.maxLength(100)]],
    phone: ['', [Validators.maxLength(20)]],
  });

  protected setTeachingMode(mode: TeachingMode): void {
    this.form.controls.teachingMode.setValue(mode);
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.submitted.emit({
      bio: raw.bio.trim() || null,
      experienceYears: Number(raw.experienceYears) || 0,
      teachingMode: raw.teachingMode,
      city: raw.city.trim() || null,
      state: raw.state.trim() || null,
      phone: raw.phone.trim() || null,
    });
  }
}

