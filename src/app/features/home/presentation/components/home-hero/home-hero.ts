import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeacherSearchQuery } from '../../../domain/entities/home.entity';
import { HeroMapVisual } from '../hero-map-visual/hero-map-visual';

@Component({
  selector: 'app-home-hero',
  imports: [FormsModule, HeroMapVisual],
  templateUrl: './home-hero.html',
  styleUrl: './home-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHero {
  readonly popularSkills = input.required<readonly string[]>();
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

  protected onSubmit(): void {
    this.searchSubmitted.emit({
      location: this.location(),
      skill: this.skill(),
    });
  }

  protected onPopularSkillClick(skill: string): void {
    this.skill.set(skill);
    this.popularSkillSelected.emit(skill);
  }
}

