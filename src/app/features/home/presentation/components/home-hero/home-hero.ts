import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import {
  ComboFieldComponent,
  ComboOption,
} from '../../../../../shared/components/combo-field/combo-field';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';
import { CustomStatusPill } from '../../../../../shared/components/custom-status-pill/custom.status.pill';
import {
  SkillSuggestion,
  TeacherAvatarSpec,
  TeacherSearchQuery,
} from '../../../domain/entities/home.entity';
import { HeroMapVisual } from '../hero-map-visual/hero-map-visual';

@Component({
  selector: 'app-home-hero',
  imports: [ComboFieldComponent, CustomPrimaryButton, CustomStatusPill, HeroMapVisual],
  templateUrl: './home-hero.html',
  styleUrl: './home-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHero {
  readonly popularSkills = input.required<readonly SkillSuggestion[]>();
  readonly locationOptions = input.required<readonly ComboOption[]>();
  readonly skillOptions = input.required<readonly ComboOption[]>();
  readonly heroAvatars = input.required<{
    readonly vocal: TeacherAvatarSpec | null;
    readonly dancer: TeacherAvatarSpec | null;
    readonly yogi: TeacherAvatarSpec | null;
  }>();
  readonly initialQuery = input<TeacherSearchQuery>({ location: '', skill: '' });

  readonly searchSubmitted = output<TeacherSearchQuery>();
  readonly popularSkillSelected = output<string>();

  protected readonly location = signal('');
  protected readonly skill = signal('');

  constructor() {
    effect(() => {
      const query = this.initialQuery();
      this.location.set(query.location);
      this.skill.set(query.skill);
    });
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.searchSubmitted.emit({
      location: this.location(),
      skill: this.skill(),
    });
  }

  protected onPopularSkillClick(label: string): void {
    this.skill.set(label);
    this.popularSkillSelected.emit(label);
  }
}
