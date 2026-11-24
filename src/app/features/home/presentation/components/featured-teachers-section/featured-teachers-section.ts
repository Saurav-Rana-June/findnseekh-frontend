import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';
import { CustomTeacherCard } from '../../../../../shared/components/custom-teacher-card/custom-teacher-card';
import { FeaturedTeacher } from '../../../domain/entities/home.entity';

@Component({
  selector: 'app-featured-teachers-section',
  imports: [CustomTeacherCard, CustomPrimaryButton],
  templateUrl: './featured-teachers-section.html',
  styleUrl: './featured-teachers-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedTeachersSection {
  readonly teachers = input.required<readonly FeaturedTeacher[]>();
  readonly hasActiveFilter = input<boolean>(false);

  readonly browseAllClicked = output<void>();
  readonly viewProfileClicked = output<FeaturedTeacher>();

  protected readonly browseAllLabel = computed(() =>
    this.hasActiveFilter() ? 'Show all teachers' : 'Browse all teachers',
  );
}
