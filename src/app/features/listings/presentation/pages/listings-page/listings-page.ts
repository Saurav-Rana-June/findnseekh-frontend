import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../../auth/presentation/state/auth.store';
import { CustomCloseOutlinedButton } from '../../../../../shared/components/custom-close-outlined-button/custom.close.outlined.button';
import {
  CustomDropdown,
  CustomDropdownOption,
} from '../../../../../shared/components/custom-dropdown/custom-dropdown';
import { CustomModal } from '../../../../../shared/components/custom-modal/custom.modal';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';
import {
  CustomStatusPill,
  StatusPillVariant,
} from '../../../../../shared/components/custom-status-pill/custom.status.pill';
import { CustomTextField } from '../../../../../shared/components/custom-textfield/custom.textfield';
import { TeachingMode } from '../../../../../shared/components/custom-teacher-card/custom-teacher-card';
import { LoaderComponent } from '../../../../../shared/components/loader/loader';
import {
  CreateListingInput,
  TeachingLevel,
  TeachingListing,
  TeachingListingStatus,
} from '../../../domain/entities/teaching-listing.entity';
import { ListingFilterOption, ListingsStore } from '../../state/listings.store';

@Component({
  selector: 'app-listings-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CustomPrimaryButton,
    CustomStatusPill,
    CustomTextField,
    CustomDropdown,
    CustomModal,
    CustomCloseOutlinedButton,
    LoaderComponent,
  ],
  templateUrl: './listings-page.html',
  styleUrl: './listings-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListingsPage implements OnInit {
  protected readonly store = inject(ListingsStore);
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  readonly currentStep = signal<1 | 2 | 3>(1);
  readonly editingId = signal<number | null>(null);

  readonly isTeacher = computed(() =>
    Boolean(this.authStore.user()?.roles.includes('teacher')),
  );

  readonly categoryOptions: readonly CustomDropdownOption<number>[] = [
    { value: 1, label: 'Music & Vocals' },
    { value: 2, label: 'Dance & Movement' },
    { value: 3, label: 'Yoga & Fitness' },
    { value: 4, label: 'Arts & Craft' },
    { value: 5, label: 'Cooking & Culinary' },
    { value: 6, label: 'Technology & Coding' },
    { value: 7, label: 'Languages & Communication' },
    { value: 8, label: 'Photography & Film' },
  ];

  readonly priceUnitOptions: readonly CustomDropdownOption<string>[] = [
    { value: 'session', label: 'Per Session' },
    { value: 'hour', label: 'Per Hour' },
    { value: 'month', label: 'Per Month' },
  ];

  readonly levels: readonly { readonly value: TeachingLevel; readonly label: string }[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'all_levels', label: 'All Levels' },
  ];

  readonly teachingModes: readonly { readonly value: TeachingMode; readonly label: string; readonly icon: string }[] = [
    { value: 'online', label: 'Online Only', icon: '💻' },
    { value: 'offline', label: 'In-Person Only', icon: '📍' },
    { value: 'both', label: 'Both (Online & In-Person)', icon: '✨' },
  ];

  readonly form = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(140)],
    }),
    categoryId: new FormControl<number>(6, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    level: new FormControl<TeachingLevel>('beginner', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    teachingMode: new FormControl<TeachingMode>('both', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    city: new FormControl<string>('', { nonNullable: true }),
    area: new FormControl<string>('', { nonNullable: true }),
    priceAmount: new FormControl<number>(500, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    priceUnit: new FormControl<string>('session', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.store.loadAll();
  }

  onFilterChange(status: ListingFilterOption): void {
    this.store.setFilterStatus(status);
  }

  onSearchChange(query: string): void {
    this.store.setSearchQuery(query);
  }

  onBack(): void {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  openCreateModal(): void {
    this.editingId.set(null);
    this.currentStep.set(1);
    this.form.reset({
      title: '',
      categoryId: 6,
      level: 'beginner',
      description: '',
      teachingMode: 'both',
      city: '',
      area: '',
      priceAmount: 500,
      priceUnit: 'session',
    });
    this.store.openCreateModal();
  }

  openEditModal(listing: TeachingListing): void {
    this.editingId.set(listing.id);
    this.currentStep.set(1);
    this.form.reset({
      title: listing.title,
      categoryId: listing.categoryId,
      level: listing.level,
      description: listing.description,
      teachingMode: listing.teachingMode,
      city: listing.city || '',
      area: listing.area || '',
      priceAmount: listing.priceAmount,
      priceUnit: listing.priceUnit,
    });
    this.store.openEditModal(listing);
  }

  closeFormModal(): void {
    this.store.closeFormModal();
    this.editingId.set(null);
  }

  nextStep(): void {
    if (this.currentStep() === 1) {
      if (
        !this.form.controls.title.valid ||
        !this.form.controls.categoryId.valid ||
        !this.form.controls.description.valid
      ) {
        this.form.controls.title.markAsTouched();
        this.form.controls.description.markAsTouched();
        return;
      }
      this.currentStep.set(2);
    } else if (this.currentStep() === 2) {
      this.currentStep.set(3);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update((s) => (s - 1) as 1 | 2);
    }
  }

  setStep(step: 1 | 2 | 3): void {
    if (step > this.currentStep()) {
      this.nextStep();
    } else {
      this.currentStep.set(step);
    }
  }

  setLevel(level: TeachingLevel): void {
    this.form.controls.level.setValue(level);
  }

  setTeachingMode(mode: TeachingMode): void {
    this.form.controls.teachingMode.setValue(mode);
  }

  onCategorySelect(catId: number): void {
    this.form.controls.categoryId.setValue(catId);
  }

  onPriceUnitSelect(unit: string): void {
    this.form.controls.priceUnit.setValue(unit);
  }

  onSave(targetStatus?: TeachingListingStatus): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.getRawValue();
    const input: CreateListingInput = {
      title: val.title,
      description: val.description,
      categoryId: val.categoryId,
      level: val.level,
      priceAmount: Number(val.priceAmount) || 0,
      currency: 'INR',
      priceUnit: val.priceUnit,
      teachingMode: val.teachingMode,
      city: val.teachingMode !== 'online' ? val.city : null,
      area: val.teachingMode !== 'online' ? val.area : null,
      status: targetStatus || (this.editingId() ? undefined : 'published'),
    };

    const id = this.editingId() ?? undefined;
    this.store.saveListing(input, id);
  }

  onToggleStatus(listing: TeachingListing): void {
    const targetStatus: TeachingListingStatus =
      listing.status === 'published' ? 'paused' : 'published';
    this.store.toggleListingStatus(listing.id, targetStatus);
  }

  openDeleteModal(listing: TeachingListing): void {
    this.store.openDeleteModal(listing);
  }

  closeDeleteModal(): void {
    this.store.closeDeleteModal();
  }

  confirmDelete(): void {
    this.store.confirmDelete();
  }

  getStatusVariant(status: TeachingListingStatus): StatusPillVariant {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'paused':
        return 'neutral';
      case 'archived':
      default:
        return 'danger';
    }
  }

  getStatusLabel(status: TeachingListingStatus | ListingFilterOption): string {
    switch (status) {
      case 'all':
        return 'All';
      case 'published':
        return 'Published';
      case 'draft':
        return 'Draft';
      case 'paused':
        return 'Paused';
      case 'archived':
        return 'Archived';
      default:
        return 'Unknown';
    }
  }

  formatPrice(amount: number, unit: string): string {
    return `₹${amount.toLocaleString('en-IN')} / ${unit}`;
  }
}
