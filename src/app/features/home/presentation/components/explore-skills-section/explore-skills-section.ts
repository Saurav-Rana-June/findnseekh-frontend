import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CustomSkillCategoryCard } from '../../../../../shared/components/custom-skill-category-card/custom-skill-category-card';
import { SkillCategory } from '../../../domain/entities/home.entity';

@Component({
  selector: 'app-explore-skills-section',
  imports: [CustomSkillCategoryCard],
  templateUrl: './explore-skills-section.html',
  styleUrl: './explore-skills-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreSkillsSection {
  readonly categories = input.required<readonly SkillCategory[]>();
  readonly categorySelected = output<SkillCategory>();
}

