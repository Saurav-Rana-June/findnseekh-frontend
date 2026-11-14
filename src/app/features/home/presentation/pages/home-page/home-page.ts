import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTE_PATHS } from '../../../../../core/constants/app.constants';
import {
  FeaturedTeacher,
  SkillCategory,
  TeacherSearchQuery,
} from '../../../domain/entities/home.entity';
import { BecomeTeacherCta } from '../../components/become-teacher-cta/become-teacher-cta';
import { ExploreSkillsSection } from '../../components/explore-skills-section/explore-skills-section';
import { FeaturedTeachersSection } from '../../components/featured-teachers-section/featured-teachers-section';
import { HomeHero } from '../../components/home-hero/home-hero';
import { HowItWorksSection } from '../../components/how-it-works-section/how-it-works-section';
import { HomeStore } from '../../state/home.store';

@Component({
  selector: 'app-home-page',
  imports: [
    HomeHero,
    ExploreSkillsSection,
    FeaturedTeachersSection,
    HowItWorksSection,
    BecomeTeacherCta,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly store = inject(HomeStore);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly hasActiveFilter = computed(() => {
    const { location, skill } = this.store.searchQuery();
    return location.trim().length > 0 || skill.trim().length > 0;
  });

  protected onSearchSubmitted(query: TeacherSearchQuery): void {
    const queryParams: Record<string, string> = {};
    if (query.skill?.trim()) {
      queryParams['skill'] = query.skill.trim();
    }
    if (query.location?.trim()) {
      queryParams['location'] = query.location.trim();
    }

    this.router.navigate(['/' + APP_ROUTE_PATHS.teachers], { queryParams });
  }

  protected onPopularSkillSelected(skill: string): void {
    this.router.navigate(['/' + APP_ROUTE_PATHS.teachers], {
      queryParams: { skill: skill.trim() },
    });
  }

  protected onCategorySelected(category: SkillCategory): void {
    this.router.navigate(['/' + APP_ROUTE_PATHS.teachers], {
      queryParams: { category: category.id },
    });
  }

  protected onBrowseAllClicked(): void {
    this.router.navigate(['/' + APP_ROUTE_PATHS.teachers]);
  }

  protected onViewProfileClicked(teacher: FeaturedTeacher): void {
    this.router.navigate(['/' + APP_ROUTE_PATHS.teachers], {
      queryParams: { skill: teacher.specialty },
    });
  }
}
