import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FeaturedTeacher } from '../../../domain/entities/home.entity';

@Component({
  selector: 'app-featured-teachers-section',
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

