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
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbItem, CustomBreadcrumb } from '../../../../../shared/components/custom-breadcrumb/custom-breadcrumb';
import { ComboFieldComponent } from '../../../../../shared/components/combo-field/combo-field';
import { CustomDropdown, CustomDropdownOption } from '../../../../../shared/components/custom-dropdown/custom-dropdown';
import { CustomPagination } from '../../../../../shared/components/custom-pagination/custom.pagination';
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
    CustomBreadcrumb,
    CustomTeacherCard,
    ComboFieldComponent,
    CustomDropdown,
    CustomPagination,
    CustomPrimaryButton,
    CustomStatusPill,
  ],
  templateUrl: './teacher-list-page.html',
  styleUrl: './teacher-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherListPage implements OnInit {
  protected readonly breadcrumbs: readonly BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Teachers' },
  ];
  protected readonly store = inject(TeachersStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Local form inputs
  protected readonly localSkill = signal<string>('');
  protected readonly localLocation = signal<string>('');

  // Pagination state
  protected readonly currentPage = signal<number>(1);
  protected readonly pageSize = signal<number>(9);

  // Filters drawer toggle
  protected readonly showFilterDrawer = signal<boolean>(false);

  // Sliced teachers for current page display
  protected readonly displayedTeachers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.store.filteredTeachers().slice(start, start + this.pageSize());
  });

  protected readonly modeOptions: readonly { readonly id: TeachingMode | 'all'; readonly label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'online', label: 'Online' },
    { id: 'offline', label: 'In person' },
  ];

  protected readonly experienceOptions: readonly CustomDropdownOption<number>[] = [
    { value: 0, label: 'Any Experience', hint: 'All levels' },
    { value: 3, label: '3+ Years', hint: 'Intermediate' },
    { value: 5, label: '5+ Years', hint: 'Experienced' },
    { value: 8, label: '8+ Years', hint: 'Senior' },
    { value: 10, label: '10+ Years', hint: 'Master' },
  ];

  protected readonly sortOptions: readonly CustomDropdownOption<TeacherSortOption>[] = [
    { value: 'recommended', label: 'Recommended', hint: 'Best match' },
    { value: 'rating', label: 'Highest Rated', hint: 'Top score' },
    { value: 'experience', label: 'Most Experienced', hint: 'Years' },
    { value: 'price-asc', label: 'Price: Low to High', hint: 'Lowest' },
    { value: 'price-desc', label: 'Price: High to Low', hint: 'Highest' },
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
    this.currentPage.set(1);
    this.store.setSearchQuery(this.localSkill());
    this.store.setLocationQuery(this.localLocation());
    this.updateUrlParams();
  }

  protected onCategorySelect(categoryId: string): void {
    this.currentPage.set(1);
    this.store.setSelectedCategory(categoryId);
    this.updateUrlParams();
  }

  protected onModeSelect(mode: TeachingMode | 'all'): void {
    this.currentPage.set(1);
    this.store.setSelectedMode(mode);
    this.updateUrlParams();
  }

  protected onExperienceChange(value: number): void {
    this.currentPage.set(1);
    this.store.setSelectedExperience(value);
  }

  protected onSortChange(value: TeacherSortOption): void {
    this.currentPage.set(1);
    this.store.setSortBy(value);
  }

  protected onExperienceSelect(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.currentPage.set(1);
    this.store.setSelectedExperience(value);
  }

  protected onSortSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as TeacherSortOption;
    this.currentPage.set(1);
    this.store.setSortBy(value);
  }

  protected onPageChange(page: number): void {
    this.currentPage.set(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  protected toggleFilterDrawer(): void {
    this.showFilterDrawer.update((v) => !v);
  }

  protected onResetFilters(): void {
    this.localSkill.set('');
    this.localLocation.set('');
    this.currentPage.set(1);
    this.showFilterDrawer.set(false);
    this.store.resetFilters();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  protected onClearSkill(): void {
    this.localSkill.set('');
    this.currentPage.set(1);
    this.store.setSearchQuery('');
    this.updateUrlParams();
  }

  protected onClearLocation(): void {
    this.localLocation.set('');
    this.currentPage.set(1);
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
