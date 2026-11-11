import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';
import { CustomStatusPill } from '../../../../../shared/components/custom-status-pill/custom.status.pill';
import { FeaturedTeacher } from '../../../domain/entities/home.entity';
import { TeacherAvatarComponent } from '../teacher-avatar/teacher-avatar';

@Component({
  selector: 'app-featured-teachers-section',
  imports: [TeacherAvatarComponent, CustomPrimaryButton, CustomStatusPill],
  templateUrl: './featured-teachers-section.html',
  styleUrl: './featured-teachers-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedTeachersSection {
  readonly teachers = input.required<readonly FeaturedTeacher[]>();
  readonly hasActiveFilter = input<boolean>(false);

  readonly browseAllClicked = output<void>();
  readonly viewProfileClicked = output<FeaturedTeacher>();
}
