import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ListingsApiService } from '../../../data/services/listings-api.service';
import { TeachingListing } from '../../../domain/entities/teaching-listing.entity';
import { ListingsStore } from '../../state/listings.store';
import { ListingFormPage } from './listing-form-page';

const mockListing: TeachingListing = {
  id: 101,
  teacherId: 1,
  categoryId: 6,
  categoryName: 'Technology & Coding',
  title: 'Python for Beginners',
  description: 'Python fundamentals',
  level: 'beginner',
  priceAmount: 600,
  currency: 'INR',
  priceUnit: 'session',
  teachingMode: 'online',
  status: 'published',
  createdAt: '2026-11-10T10:00:00Z',
};

describe('ListingFormPage', () => {
  let component: ListingFormPage;
  let fixture: ComponentFixture<ListingFormPage>;
  let router: Router;
  let mockStore: {
    listings: ReturnType<typeof signal>;
    isLoading: ReturnType<typeof signal>;
    isSaving: ReturnType<typeof signal>;
    error: ReturnType<typeof signal>;
    loadAll: ReturnType<typeof vi.fn>;
    getListingById: ReturnType<typeof vi.fn>;
    saveListing: ReturnType<typeof vi.fn>;
  };
  let mockParamMap: { get: ReturnType<typeof vi.fn> };

  const createComponent = async (idParam: string | null = null) => {
    mockParamMap = {
      get: vi.fn().mockReturnValue(idParam),
    };

    mockStore = {
      listings: signal([mockListing]),
      isLoading: signal(false),
      isSaving: signal(false),
      error: signal(null),
      loadAll: vi.fn(),
      getListingById: vi.fn((id: number) => (id === 101 ? mockListing : undefined)),
      saveListing: vi.fn(
        (input: any, id: any, onSuccess?: (listing: TeachingListing) => void) => {
          onSuccess?.(mockListing);
        },
      ),
    };

    await TestBed.configureTestingModule({
      imports: [ListingFormPage],
      providers: [
        provideRouter([]),
        { provide: ListingsStore, useValue: mockStore },
        {
          provide: ListingsApiService,
          useValue: {
            getCategories: vi.fn().mockReturnValue(of({ data: [] })),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: mockParamMap,
            },
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(ListingFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('Create Mode', () => {
    beforeEach(async () => {
      await createComponent(null);
    });

    it('initializes in create mode with default step 1', () => {
      expect(component.isEditMode()).toBe(false);
      expect(component.currentStep()).toBe(1);
      expect(component.form.controls.title.value).toBe('');
      expect(component.form.controls.priceAmount.value).toBe(500);
    });

    it('validates step 1 and advances to step 2 when valid', () => {
      // Step 1 fails when title and description are blank
      component.form.controls.title.setValue('');
      component.nextStep();
      expect(component.currentStep()).toBe(1);

      // Step 1 advances when required fields are filled
      component.form.controls.title.setValue('Data Science 101');
      component.form.controls.description.setValue('Comprehensive data science course');
      component.nextStep();
      expect(component.currentStep()).toBe(2);

      // Step 2 advances to step 3
      component.nextStep();
      expect(component.currentStep()).toBe(3);

      // Step 3 goes back with prevStep
      component.prevStep();
      expect(component.currentStep()).toBe(2);
    });

    it('navigates to listings on cancel', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/listings']);
    });

    it('saves new listing and navigates back to listings', () => {
      component.form.controls.title.setValue('React Mastery');
      component.form.controls.description.setValue('Master react hooks and redux');
      component.onSave('published');

      expect(mockStore.saveListing).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/listings']);
    });
  });

  describe('Edit Mode', () => {
    it('initializes in edit mode and patches form with existing listing', async () => {
      await createComponent('101');

      expect(component.isEditMode()).toBe(true);
      expect(component.listingId()).toBe(101);
      expect(component.form.controls.title.value).toBe('Python for Beginners');
      expect(component.form.controls.priceAmount.value).toBe(600);
      expect(mockStore.getListingById).toHaveBeenCalledWith(101);
    });

    it('submits update with listing id and navigates back to listings', async () => {
      await createComponent('101');

      component.form.controls.title.setValue('Advanced Python');
      component.onSave('published');

      expect(mockStore.saveListing).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Advanced Python' }),
        101,
        expect.any(Function),
      );
      expect(router.navigate).toHaveBeenCalledWith(['/listings']);
    });
  });
});
