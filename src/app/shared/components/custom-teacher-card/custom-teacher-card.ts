import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CustomPrimaryButton } from '../custom-primary-button/custom.primary.button';
import {
  TeacherAvatarComponent,
  TeacherAvatarSpec,
} from '../teacher-avatar/teacher-avatar';

export type TeachingMode = 'online' | 'offline' | 'both';

export interface TeacherCardData {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly categoryId?: string;
  readonly specialty: string;
  readonly location: string;
  readonly experienceYears: number;
  readonly rating?: { readonly value: number; readonly count: number };
  readonly avatar: TeacherAvatarSpec;
  readonly skills?: readonly string[];
  readonly teachingMode?: TeachingMode;
  readonly hourlyRate?: number;
  readonly bio?: string;
  readonly verified?: boolean;
}

/**
 * Reusable Teacher Card component matching FindnSeekh design system.
 * Features rounded avatar photo with floating mode badge, verified badge,
 * ratings, specialty, bio snippet, skill chips, location/exp, and action footer.
 */
@Component({
  selector: 'app-custom-teacher-card',
  imports: [TeacherAvatarComponent, CustomPrimaryButton],
  templateUrl: './custom-teacher-card.html',
  styleUrl: './custom-teacher-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 't-card-host',
    '[attr.data-elevation]': 'elevation()',
  },
})
export class CustomTeacherCard {
  readonly teacher = input.required<TeacherCardData>();
  readonly elevation = input<'none' | 'sm' | 'md'>('sm');
  readonly showCategory = input<boolean>(false);
  readonly showRating = input<boolean>(true);
  readonly showSpecialty = input<boolean>(true);
  readonly showBio = input<boolean>(true);
  readonly showSkills = input<boolean>(true);
  readonly showLocation = input<boolean>(true);
  readonly showExperience = input<boolean>(true);
  readonly showMode = input<boolean>(true);
  readonly showPrice = input<boolean>(true);
  readonly primaryCtaLabel = input<string>('View profile');
  readonly experienceFormat = input<'full' | 'short'>('full');

  readonly viewProfile = output<TeacherCardData>();
  readonly connect = output<TeacherCardData>();

  protected readonly modeLabel = computed(() => {
    const mode = this.teacher().teachingMode;
    if (!mode) return null;
    switch (mode) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'In person';
      case 'both':
        return 'Online & in person';
      default:
        return null;
    }
  });

  protected readonly displayedSkills = computed(() => {
    const skills = this.teacher().skills;
    if (!skills || skills.length === 0) return [];
    return skills.slice(0, 3);
  });

  protected readonly remainingSkillsCount = computed(() => {
    const skills = this.teacher().skills;
    if (!skills || skills.length <= 3) return 0;
    return skills.length - 3;
  });

  protected onViewProfile(): void {
    this.viewProfile.emit(this.teacher());
  }

  protected onConnect(): void {
    this.connect.emit(this.teacher());
  }
}
