import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';

@Component({
  selector: 'app-become-teacher-cta',
  imports: [CustomPrimaryButton],
  templateUrl: './become-teacher-cta.html',
  styleUrl: './become-teacher-cta.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecomeTeacherCta {}

