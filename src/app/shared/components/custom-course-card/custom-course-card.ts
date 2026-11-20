import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import {
  CustomButtonVariant,
  CustomPrimaryButton,
} from '../custom-primary-button/custom.primary.button';
import {
  CustomStatusPill,
  StatusPillVariant,
} from '../custom-status-pill/custom.status.pill';
import { TeachingMode } from '../custom-teacher-card/custom-teacher-card';

export interface CourseCardData {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly level: string;
  readonly priceAmount: number;
  readonly currency?: string;
  readonly priceUnit?: string;
  readonly teachingMode: TeachingMode;
  readonly city?: string | null;
  readonly area?: string | null;
  readonly categoryName?: string;
  readonly status?: string;
}

/**
 * Reusable Course / Class Card component matching FindnSeekh design system
 * and the card UI used on the Teaching Listings page.
 * Features title, bulleted metadata (category, level, mode, location), description,
 * formatted price on left, and action button on right.
 */
@Component({
  selector: 'app-custom-course-card',
  standalone: true,
  imports: [CustomPrimaryButton, CustomStatusPill],
  templateUrl: './custom-course-card.html',
  styleUrl: './custom-course-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'course-card-host',
    '[class.is-selected]': 'isSelected()',
  },
})
export class CustomCourseCard {
  readonly course = input.required<CourseCardData>();
  readonly isSelected = input<boolean>(false);
  readonly actionLabel = input<string>('Enquire for this Class');
  readonly selectedLabel = input<string>('✓ Class Selected');
  readonly actionVariant = input<CustomButtonVariant>('outline');
  readonly showAction = input<boolean>(true);
  readonly badgeLabel = input<string>('');
  readonly badgeVariant = input<StatusPillVariant>('surface');

  readonly enquire = output<CourseCardData>();

  protected readonly modeFormatted = computed(() => {
    const m = this.course().teachingMode;
    switch (m) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'In-Person';
      case 'both':
      default:
        return 'Online & In-Person';
    }
  });

  protected readonly levelFormatted = computed(() => {
    const lvl = this.course().level || 'All Levels';
    return lvl.replace(/_/g, ' ');
  });

  protected readonly priceFormatted = computed(() => {
    const c = this.course();
    const curr = c.currency === 'USD' ? '$' : '₹';
    const unit = c.priceUnit ? ` / ${c.priceUnit}` : '';
    return `${curr}${c.priceAmount}${unit}`;
  });

  protected onActionClick(): void {
    this.enquire.emit(this.course());
  }
}
