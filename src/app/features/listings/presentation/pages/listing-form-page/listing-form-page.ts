import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomDropdownOption } from '../../../../../shared/components/custom-dropdown/custom-dropdown';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';
import { CustomCloseOutlinedButton } from '../../../../../shared/components/custom-close-outlined-button/custom.close.outlined.button';
import { TeachingMode } from '../../../../../shared/components/custom-teacher-card/custom-teacher-card';
import { LoaderComponent } from '../../../../../shared/components/loader/loader';
import {
  CreateListingInput,
  TeachingLevel,
  TeachingListing,
  TeachingListingStatus,
} from '../../../domain/entities/teaching-listing.entity';
import { TeachingListingWizardComponent } from '../../components/teaching-listing-wizard/teaching-listing-wizard';
import { ListingsStore } from '../../state/listings.store';

@Component({
  selector: 'app-listing-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CustomPrimaryButton,
    CustomCloseOutlinedButton,
    LoaderComponent,
    TeachingListingWizardComponent,
  ],
  templateUrl: './listing-form-page.html',
  styleUrl: './listing-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListingFormPage implements OnInit {
  protected readonly store = inject(ListingsStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly currentStep = signal<1 | 2 | 3>(1);
  readonly listingId = signal<number | null>(null);
  readonly isEditMode = computed(() => this.listingId() !== null);
  readonly listingNotFound = signal<boolean>(false);

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

  constructor() {
    // When listings load in store, try to patch if in edit mode and form not patched yet
    effect(() => {
      const id = this.listingId();
      const listings = this.store.listings();
      const isLoading = this.store.isLoading();

      if (id && listings.length > 0 && !this.form.dirty) {
        const found = listings.find((l) => l.id === id);
        if (found) {
          this.patchForm(found);
          this.listingNotFound.set(false);
        } else if (!isLoading) {
          this.listingNotFound.set(true);
        }
      }
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.listingId.set(id);
        const existing = this.store.getListingById(id);
        if (existing) {
          this.patchForm(existing);
        } else {
          this.store.loadAll();
        }
      }
    }
  }

  patchForm(listing: TeachingListing): void {
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
  }

  onStepSelected(step: 1 | 2 | 3): void {
    if (step > this.currentStep()) {
      this.nextStep();
    } else {
      this.currentStep.set(step);
    }
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

  onLevelSelected(level: TeachingLevel): void {
    this.form.controls.level.setValue(level);
  }

  onModeSelected(mode: TeachingMode): void {
    this.form.controls.teachingMode.setValue(mode);
  }

  onCategorySelected(catId: number): void {
    this.form.controls.categoryId.setValue(catId);
  }

  onPriceUnitSelected(unit: string): void {
    this.form.controls.priceUnit.setValue(unit);
  }

  onCancel(): void {
    this.router.navigate(['/listings']);
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
      status: targetStatus || (this.isEditMode() ? undefined : 'published'),
    };

    const id = this.listingId() ?? undefined;
    this.store.saveListing(input, id, () => {
      this.router.navigate(['/listings']);
    });
  }
}
