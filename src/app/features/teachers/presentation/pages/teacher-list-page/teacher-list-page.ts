import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ComboFieldComponent } from '../../../../../shared/components/combo-field/combo-field';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';
import { CustomStatusPill } from '../../../../../shared/components/custom-status-pill/custom.status.pill';
import {
  CustomTeacherCard,
  TeacherCardData,
  TeachingMode,
} from '../../../../../shared/components/custom-teacher-card/custom-teacher-card';
import { Teacher, TeacherSortOption } from '../../../domain/entities/teacher.entity';
import { TeachersStore } from '../../state/teachers.store';

@Component({
  selector: 'app-teacher-list-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    CustomTeacherCard,
    ComboFieldComponent,
    CustomPrimaryButton,
    CustomStatusPill,
  ],
  templateUrl: './teacher-list-page.html',
  styleUrl: './teacher-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherListPage implements OnInit {
  protected readonly store = inject(TeachersStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Local form inputs
  protected readonly localSkill = signal<string>('');
  protected readonly localLocation = signal<string>('');

  // Pagination / slice count
  protected readonly visibleCount = signal<number>(9);

  // Filters drawer toggle
  protected readonly showFilterDrawer = signal<boolean>(false);

  // Sliced teachers for display
  protected readonly displayedTeachers = computed(() => {
    return this.store.filteredTeachers().slice(0, this.visibleCount());
  });

  protected readonly modeOptions: readonly { readonly id: TeachingMode | 'all'; readonly label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'online', label: 'Online' },
    { id: 'offline', label: 'In person' },
  ];

  protected readonly experienceOptions: readonly { readonly years: number; readonly label: string }[] = [
    { years: 0, label: 'Any Experience' },
    { years: 3, label: '3+ Years' },
    { years: 5, label: '5+ Years' },
    { years: 8, label: '8+ Years' },
    { years: 10, label: '10+ Years' },
  ];

  protected readonly sortOptions: readonly { readonly value: TeacherSortOption; readonly label: string }[] = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
  ];

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const skill = params['skill'] ?? '';
        const location = params['location'] ?? '';
        const category = params['category'];
        const mode = params['mode'];

        this.localSkill.set(skill);
        this.localLocation.set(location);

        this.store.initFromQueryParams({
          skill,
          location,
          category,
          mode,
        });
      });
  }

  protected onSearchSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.visibleCount.set(9);
    this.store.setSearchQuery(this.localSkill());
    this.store.setLocationQuery(this.localLocation());
    this.updateUrlParams();
  }

  protected onCategorySelect(categoryId: string): void {
    this.visibleCount.set(9);
    this.store.setSelectedCategory(categoryId);
    this.updateUrlParams();
  }

  protected onModeSelect(mode: TeachingMode | 'all'): void {
    this.visibleCount.set(9);
    this.store.setSelectedMode(mode);
    this.updateUrlParams();
  }

  protected onExperienceSelect(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.visibleCount.set(9);
    this.store.setSelectedExperience(value);
  }

  protected onSortSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as TeacherSortOption;
    this.store.setSortBy(value);
  }

  protected onShowMore(): void {
    this.visibleCount.update((count) => count + 9);
  }

  protected toggleFilterDrawer(): void {
    this.showFilterDrawer.update((v) => !v);
  }

  protected onResetFilters(): void {
    this.localSkill.set('');
    this.localLocation.set('');
    this.visibleCount.set(9);
    this.showFilterDrawer.set(false);
    this.store.resetFilters();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  protected onClearSkill(): void {
    this.localSkill.set('');
    this.visibleCount.set(9);
    this.store.setSearchQuery('');
    this.updateUrlParams();
  }

  protected onClearLocation(): void {
    this.localLocation.set('');
    this.visibleCount.set(9);
    this.store.setLocationQuery('');
    this.updateUrlParams();
  }

  protected onViewTeacherProfile(teacher: TeacherCardData): void {
    this.router.navigate(['/teachers', teacher.id]);
  }

  private updateUrlParams(): void {
    const queryParams: Record<string, string | null> = {
      skill: this.store.searchQuery() || null,
      location: this.store.locationQuery() || null,
      category: this.store.selectedCategory() !== 'all' ? this.store.selectedCategory() : null,
      mode: this.store.selectedMode() !== 'all' ? this.store.selectedMode() : null,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
