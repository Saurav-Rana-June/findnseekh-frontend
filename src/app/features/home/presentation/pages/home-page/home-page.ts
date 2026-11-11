import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID } from '@angular/core';
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
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly hasActiveFilter = computed(() => {
    const { location, skill } = this.store.searchQuery();
    return location.trim().length > 0 || skill.trim().length > 0;
  });

  protected onSearchSubmitted(query: TeacherSearchQuery): void {
    this.store.updateSearch(query);
    this.scrollToTeachers();
  }

  protected onPopularSkillSelected(skill: string): void {
    this.store.selectSkill(skill);
    this.scrollToTeachers();
  }

  protected onCategorySelected(category: SkillCategory): void {
    this.store.selectSkill(category.title);
    this.scrollToTeachers();
  }

  protected onBrowseAllClicked(): void {
    this.store.clearSearch();
    this.scrollToTeachers();
  }

  protected onViewProfileClicked(teacher: FeaturedTeacher): void {
    this.store.selectSkill(teacher.specialty);
  }

  private scrollToTeachers(): void {
    if (!this.isBrowser) {
      return;
    }

    document.getElementById('featured-teachers')?.scrollIntoView({ behavior: 'smooth' });
  }
}
