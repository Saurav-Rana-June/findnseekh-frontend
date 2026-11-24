import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type SkillCategoryIcon =
  | 'music'
  | 'dance'
  | 'photography'
  | 'art-craft'
  | 'fitness-yoga'
  | 'cooking'
  | 'technology'
  | 'languages';

export interface SkillCategoryCardData {
  readonly id: SkillCategoryIcon;
  readonly title: string;
  readonly description: string;
}

/**
 * Reusable skill / category discovery card with icon art, title, and description.
 * Used on home Explore Skills and anywhere categories are browsed.
 */
@Component({
  selector: 'app-custom-skill-category-card',
  templateUrl: './custom-skill-category-card.html',
  styleUrl: './custom-skill-category-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'skill-cat-card-host',
  },
})
export class CustomSkillCategoryCard {
  readonly category = input.required<SkillCategoryCardData>();
  readonly clicked = output<SkillCategoryCardData>();

  protected onClick(): void {
    this.clicked.emit(this.category());
  }
}