import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ComboOption } from '../../../../shared/components/combo-field/combo-field';
import {
  FeaturedTeacher,
  HomeOverview,
  HowItWorksStep,
  SkillCategory,
  SkillSuggestion,
  TeacherSearchQuery,
} from '../../domain/entities/home.entity';
import { GetHomeOverviewUseCase } from '../../domain/use-cases/get-home-overview.use-case';

@Injectable()
export class HomeStore {
  private readonly getHomeOverview = inject(GetHomeOverviewUseCase);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _overview = signal<HomeOverview>({
    popularSkills: [],
    locationSuggestions: [],
    skillSuggestions: [],
    categories: [],
    featuredTeachers: [],
    steps: [],
  });

  private readonly _searchQuery = signal<TeacherSearchQuery>({
    location: '',
    skill: '',
  });

  readonly popularSkills = computed<readonly SkillSuggestion[]>(
    () => this._overview().popularSkills,
  );
  readonly categories = computed<readonly SkillCategory[]>(() => this._overview().categories);
  readonly steps = computed<readonly HowItWorksStep[]>(() => this._overview().steps);
  readonly searchQuery = this._searchQuery.asReadonly();

  readonly locationOptions = computed<readonly ComboOption[]>(() =>
    this._overview().locationSuggestions.map((loc) => ({
      value: loc.city,
      hint: loc.region,
    })),
  );

  readonly skillOptions = computed<readonly ComboOption[]>(() => {
    const categories = this._overview().categories;
    const categoryName = (id: string) => categories.find((c) => c.id === id)?.title ?? '';

    return [
      ...categories.map((c) => ({ value: c.title, hint: 'Category' })),
      ...this._overview().skillSuggestions.map((s) => ({
        value: s.label,
        hint: categoryName(s.category),
      })),
    ];
  });

  readonly heroAvatars = computed(() => {
    const [vocal, , dancer, , yogi] = this._overview().featuredTeachers;
    return {
      vocal: vocal?.avatar ?? null,
      dancer: dancer?.avatar ?? null,
      yogi: yogi?.avatar ?? null,
    };
  });

  readonly featuredTeachers = computed<readonly FeaturedTeacher[]>(() => {
    const teachers = this._overview().featuredTeachers;
    const { location, skill } = this._searchQuery();
    const locTerm = location.trim().toLowerCase();
    const skillTerm = skill.trim().toLowerCase();

    if (!locTerm && !skillTerm) {
      return teachers;
    }

    return teachers.filter((teacher) => {
      const matchesLocation = !locTerm || teacher.location.toLowerCase().includes(locTerm);
      const matchesSkill =
        !skillTerm ||
        teacher.category.toLowerCase().includes(skillTerm) ||
        teacher.specialty.toLowerCase().includes(skillTerm) ||
        teacher.name.toLowerCase().includes(skillTerm);
      return matchesLocation && matchesSkill;
    });
  });

  constructor() {
    this.loadOverview();
  }

  loadOverview(): void {
    this.getHomeOverview
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((overview) => {
        this._overview.set(overview);
      });
  }

  updateSearch(query: TeacherSearchQuery): void {
    this._searchQuery.set(query);
  }

  selectSkill(skill: string): void {
    this._searchQuery.update((current) => ({
      ...current,
      skill,
    }));
  }

  clearSearch(): void {
    this._searchQuery.set({ location: '', skill: '' });
  }
}
