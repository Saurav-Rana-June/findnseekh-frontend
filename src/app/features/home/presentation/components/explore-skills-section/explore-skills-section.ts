import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SkillCategory } from '../../../domain/entities/home.entity';

@Component({
  selector: 'app-explore-skills-section',
  templateUrl: './explore-skills-section.html',
  styleUrl: './explore-skills-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreSkillsSection {
  readonly categories = input.required<readonly SkillCategory[]>();
  readonly categorySelected = output<SkillCategory>();
}

