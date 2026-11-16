import { isPlatformBrowser } from '@angular/common';
import { computed, DestroyRef, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ComboOption } from '../../../../shared/components/combo-field/combo-field';
import { TeachingMode } from '../../../../shared/components/custom-teacher-card/custom-teacher-card';
import { TeachersApiService } from '../../data/services/teachers-api.service';
import {
  Teacher,
  TeacherFilterQuery,
  TeacherSortOption,
} from '../../domain/entities/teacher.entity';
import { GetTeachersUseCase } from '../../domain/use-cases/get-teachers.use-case';

export interface CategoryOption {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
}

export const TEACHER_CATEGORIES: readonly CategoryOption[] = [
  { id: 'all', label: 'All categories' },
  { id: 'music', label: 'Music' },
  { id: 'dance', label: 'Dance' },
  { id: 'photography', label: 'Photography' },
  { id: 'art-craft', label: 'Art & Craft' },
  { id: 'fitness-yoga', label: 'Fitness & Yoga' },
  { id: 'cooking', label: 'Cooking' },
  { id: 'technology', label: 'Technology' },
  { id: 'languages', label: 'Languages' },
];

@Injectable()
export class TeachersStore {
  private readonly getTeachers = inject(GetTeachersUseCase);
  private readonly apiService = inject(TeachersApiService, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _allTeachers = signal<readonly Teacher[]>([]);
  private readonly _searchQuery = signal<string>('');
  private readonly _locationQuery = signal<string>('');
  private readonly _selectedCategory = signal<string>('all');
  private readonly _selectedMode = signal<TeachingMode | 'all'>('all');
  private readonly _selectedExperience = signal<number>(0);
  private readonly _sortBy = signal<TeacherSortOption>('recommended');
  private readonly _isLoading = signal<boolean>(false);
  private readonly _categories = signal<readonly CategoryOption[]>(TEACHER_CATEGORIES);
  private readonly _apiLocations = signal<readonly ComboOption[]>([]);
  private readonly _apiSkills = signal<readonly ComboOption[]>([]);

  readonly searchQuery = this._searchQuery.asReadonly();
  readonly locationQuery = this._locationQuery.asReadonly();
  readonly selectedCategory = this._selectedCategory.asReadonly();
  readonly selectedMode = this._selectedMode.asReadonly();
  readonly selectedExperience = this._selectedExperience.asReadonly();
  readonly sortBy = this._sortBy.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  get categories(): readonly CategoryOption[] {
    return this._categories();
  }

  readonly locationOptions = computed<readonly ComboOption[]>(() => {
    const set = new Map<string, string>();
    for (const opt of this._apiLocations()) {
      set.set(opt.value, opt.hint || '');
    }
    for (const t of this._allTeachers()) {
      if (t.city && !set.has(t.city)) {
        set.set(t.city, t.state);
      }
    }
    return Array.from(set.entries()).map(([city, state]) => ({
      value: city,
      hint: state,
    }));
  });

  readonly skillOptions = computed<readonly ComboOption[]>(() => {
    const cats = this.categories.filter((c) => c.id !== 'all');
    const skillSet = new Map<string, string>();

    for (const c of cats) {
      skillSet.set(c.label, 'Category');
    }
    for (const opt of this._apiSkills()) {
      if (!skillSet.has(opt.value)) {
        skillSet.set(opt.value, opt.hint || 'Skill');
      }
    }
    for (const t of this._allTeachers()) {
      for (const s of t.skills) {
        if (!skillSet.has(s)) {
          skillSet.set(s, t.category);
        }
      }
    }

    return Array.from(skillSet.entries()).map(([value, hint]) => ({
      value,
      hint,
    }));
  });

  readonly hasActiveFilters = computed(() => {
    return (
      this._searchQuery().trim().length > 0 ||
      this._locationQuery().trim().length > 0 ||
      this._selectedCategory() !== 'all' ||
      this._selectedMode() !== 'all' ||
      this._selectedExperience() > 0 ||
      this._sortBy() !== 'recommended'
    );
  });

  readonly activeFilterCount = computed(() => {
    let count = 0;
    if (this._searchQuery().trim().length > 0) count++;
    if (this._locationQuery().trim().length > 0) count++;
    if (this._selectedCategory() !== 'all') count++;
    if (this._selectedMode() !== 'all') count++;
    if (this._selectedExperience() > 0) count++;
    if (this._sortBy() !== 'recommended') count++;
    return count;
  });

  readonly filteredTeachers = computed<readonly Teacher[]>(() => {
    let result = [...this._allTeachers()];
    const query = this._searchQuery().trim().toLowerCase();
    const location = this._locationQuery().trim().toLowerCase();
    const category = this._selectedCategory();
    const mode = this._selectedMode();
    const minExp = this._selectedExperience();
    const sort = this._sortBy();

    if (query) {
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.specialty.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          t.skills.some((s) => s.toLowerCase().includes(query)),
      );
    }

    if (location) {
      result = result.filter(
        (t) =>
          t.location.toLowerCase().includes(location) ||
          t.city.toLowerCase().includes(location) ||
          t.state.toLowerCase().includes(location),
      );
    }

    if (category && category !== 'all') {
      result = result.filter(
        (t) => t.categoryId.toLowerCase() === category || t.category.toLowerCase() === category,
      );
    }

    if (mode && mode !== 'all') {
      result = result.filter((t) => t.teachingMode === mode || t.teachingMode === 'both');
    }

    if (minExp > 0) {
      result = result.filter((t) => t.experienceYears >= minExp);
    }

    switch (sort) {
      case 'rating':
        result.sort((a, b) => (b.rating?.value ?? 0) - (a.rating?.value ?? 0));
        break;
      case 'experience':
        result.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      case 'price-asc':
        result.sort((a, b) => (a.hourlyRate ?? 0) - (b.hourlyRate ?? 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.hourlyRate ?? 0) - (a.hourlyRate ?? 0));
        break;
      case 'recommended':
      default:
        break;
    }

    return result;
  });

  readonly totalCount = computed(() => this.filteredTeachers().length);

  constructor() {
    this.initMetadata();
    this.loadTeachers();
  }

  private initMetadata(): void {
    if (isPlatformBrowser(this.platformId) && this.apiService) {
      // 1. Fetch dynamic categories
      this.apiService
        .getCategories()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            if (res.data && res.data.length > 0) {
              const dynamicCats: CategoryOption[] = [
                { id: 'all', label: 'All categories' },
                ...res.data.map((c) => ({ id: c.slug, label: c.name })),
              ];
              this._categories.set(dynamicCats);
            }
          },
          error: () => {},
        });

      // 2. Fetch popular skills
      this.apiService
        .getPopularSkills(15)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            if (res.data && res.data.length > 0) {
              this._apiSkills.set(
                res.data.map((s) => ({
                  value: s.name,
                  hint: s.category || 'Skill',
                })),
              );
            }
          },
          error: () => {},
        });

      // 3. Fetch location suggestions
      this.apiService
        .getLocationSuggestions('', 10)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            if (res.data && res.data.length > 0) {
              this._apiLocations.set(
                res.data.map((l) => ({
                  value: l.city,
                  hint: l.state || '',
                })),
              );
            }
          },
          error: () => {},
        });
    }
  }

  loadTeachers(): void {
    this._isLoading.set(true);

    const filter: TeacherFilterQuery = {
      query: this._searchQuery() || undefined,
      location: this._locationQuery() || undefined,
      category: this._selectedCategory() !== 'all' ? this._selectedCategory() : undefined,
      mode: this._selectedMode() !== 'all' ? this._selectedMode() : undefined,
      minExperience: this._selectedExperience() > 0 ? this._selectedExperience() : undefined,
      sortBy: this._sortBy(),
    };

    this.getTeachers
      .execute(filter)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (teachers) => {
          this._allTeachers.set(teachers);
          this._isLoading.set(false);
        },
        error: () => {
          this._isLoading.set(false);
        },
      });
  }

  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
    this.loadTeachers();
  }

  setLocationQuery(location: string): void {
    this._locationQuery.set(location);
    this.loadTeachers();
  }

  setSelectedCategory(categoryId: string): void {
    this._selectedCategory.set(categoryId);
    this.loadTeachers();
  }

  setSelectedMode(mode: TeachingMode | 'all'): void {
    this._selectedMode.set(mode);
    this.loadTeachers();
  }

  setSelectedExperience(years: number): void {
    this._selectedExperience.set(years);
    this.loadTeachers();
  }

  setSortBy(sort: TeacherSortOption): void {
    this._sortBy.set(sort);
    this.loadTeachers();
  }

  resetFilters(): void {
    this._searchQuery.set('');
    this._locationQuery.set('');
    this._selectedCategory.set('all');
    this._selectedMode.set('all');
    this._selectedExperience.set(0);
    this._sortBy.set('recommended');
    this.loadTeachers();
  }

  initFromQueryParams(params: {
    skill?: string;
    location?: string;
    category?: string;
    mode?: string;
  }): void {
    if (params.skill !== undefined) {
      this._searchQuery.set(params.skill);
    }
    if (params.location !== undefined) {
      this._locationQuery.set(params.location);
    }
    if (params.category !== undefined) {
      const match = this.categories.find(
        (c) =>
          c.id.toLowerCase() === params.category?.toLowerCase() ||
          c.label.toLowerCase() === params.category?.toLowerCase(),
      );
      if (match) {
        this._selectedCategory.set(match.id);
      }
    }
    if (params.mode && ['online', 'offline', 'both'].includes(params.mode)) {
      this._selectedMode.set(params.mode as TeachingMode);
    }
    this.loadTeachers();
  }
}

