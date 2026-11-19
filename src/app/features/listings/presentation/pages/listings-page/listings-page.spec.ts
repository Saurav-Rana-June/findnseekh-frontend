import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthStore } from '../../../../auth/presentation/state/auth.store';
import { TeachingListing } from '../../../domain/entities/teaching-listing.entity';
import { ListingsStore } from '../../state/listings.store';
import { ListingsPage } from './listings-page';

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

describe('ListingsPage', () => {
  let component: ListingsPage;
  let fixture: ComponentFixture<ListingsPage>;
  let mockStore: {
    listings: ReturnType<typeof signal>;
    filteredListings: ReturnType<typeof signal>;
    filterStatus: ReturnType<typeof signal>;
    searchQuery: ReturnType<typeof signal>;
    isLoading: ReturnType<typeof signal>;
    isSaving: ReturnType<typeof signal>;
    actionLoadingId: ReturnType<typeof signal>;
    error: ReturnType<typeof signal>;
    successMessage: ReturnType<typeof signal>;
    totalCount: ReturnType<typeof signal>;
    publishedCount: ReturnType<typeof signal>;
    draftCount: ReturnType<typeof signal>;
    pausedCount: ReturnType<typeof signal>;
    isFormModalOpen: ReturnType<typeof signal>;
    activeListingForEdit: ReturnType<typeof signal>;
    isDeleteModalOpen: ReturnType<typeof signal>;
    listingToDelete: ReturnType<typeof signal>;
    loadAll: ReturnType<typeof vi.fn>;
    setFilterStatus: ReturnType<typeof vi.fn>;
    setSearchQuery: ReturnType<typeof vi.fn>;
    openCreateModal: ReturnType<typeof vi.fn>;
    openEditModal: ReturnType<typeof vi.fn>;
    closeFormModal: ReturnType<typeof vi.fn>;
    openDeleteModal: ReturnType<typeof vi.fn>;
    closeDeleteModal: ReturnType<typeof vi.fn>;
    saveListing: ReturnType<typeof vi.fn>;
    toggleListingStatus: ReturnType<typeof vi.fn>;
    confirmDelete: ReturnType<typeof vi.fn>;
  };
  let mockAuthStore: {
    user: ReturnType<typeof signal>;
  };

  beforeEach(async () => {
    mockStore = {
      listings: signal([mockListing]),
      filteredListings: signal([mockListing]),
      filterStatus: signal('all'),
      searchQuery: signal(''),
      isLoading: signal(false),
      isSaving: signal(false),
      actionLoadingId: signal(null),
      error: signal(null),
      successMessage: signal(null),
      totalCount: signal(1),
      publishedCount: signal(1),
      draftCount: signal(0),
      pausedCount: signal(0),
      isFormModalOpen: signal(false),
      activeListingForEdit: signal(null),
      isDeleteModalOpen: signal(false),
      listingToDelete: signal(null),
      loadAll: vi.fn(),
      setFilterStatus: vi.fn(),
      setSearchQuery: vi.fn(),
      openCreateModal: vi.fn(),
      openEditModal: vi.fn(),
      closeFormModal: vi.fn(),
      openDeleteModal: vi.fn(),
      closeDeleteModal: vi.fn(),
      saveListing: vi.fn(),
      toggleListingStatus: vi.fn(),
      confirmDelete: vi.fn(),
    };

    mockAuthStore = {
      user: signal({
        id: 1,
        email: 'teacher@example.com',
        fullName: 'Aarav Sharma',
        roles: ['student', 'teacher'],
      } as any),
    };

    await TestBed.configureTestingModule({
      imports: [ListingsPage],
      providers: [
        provideRouter([]),
        { provide: ListingsStore, useValue: mockStore },
        { provide: AuthStore, useValue: mockAuthStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component and triggers loadAll on init', () => {
    expect(component).toBeTruthy();
    expect(mockStore.loadAll).toHaveBeenCalled();
  });

  it('identifies teacher role correctly', () => {
    expect(component.isTeacher()).toBe(true);
  });

  it('delegates filter and search query updates to store', () => {
    component.onFilterChange('published');
    expect(mockStore.setFilterStatus).toHaveBeenCalledWith('published');

    component.onSearchChange('react');
    expect(mockStore.setSearchQuery).toHaveBeenCalledWith('react');
  });

  it('resets form and opens create modal', () => {
    component.openCreateModal();
    expect(component.editingId()).toBeNull();
    expect(component.currentStep()).toBe(1);
    expect(mockStore.openCreateModal).toHaveBeenCalled();
  });

  it('populates form and opens edit modal', () => {
    component.openEditModal(mockListing);
    expect(component.editingId()).toBe(101);
    expect(component.form.controls.title.value).toBe('Python for Beginners');
    expect(component.form.controls.priceAmount.value).toBe(600);
    expect(mockStore.openEditModal).toHaveBeenCalledWith(mockListing);
  });

  it('navigates through stepper steps with validation', () => {
    component.openCreateModal();
    expect(component.currentStep()).toBe(1);

    // Invalid step 1 doesn't advance
    component.form.controls.title.setValue('');
    component.nextStep();
    expect(component.currentStep()).toBe(1);

    // Valid step 1 advances to step 2
    component.form.controls.title.setValue('Python 101');
    component.form.controls.description.setValue('Basics of Python');
    component.nextStep();
    expect(component.currentStep()).toBe(2);

    // Step 2 advances to step 3
    component.nextStep();
    expect(component.currentStep()).toBe(3);

    // Step 3 prevStep goes back to step 2
    component.prevStep();
    expect(component.currentStep()).toBe(2);
  });

  it('delegates status toggle to store', () => {
    component.onToggleStatus(mockListing);
    expect(mockStore.toggleListingStatus).toHaveBeenCalledWith(101, 'paused');
  });

  it('delegates delete actions to store', () => {
    component.openDeleteModal(mockListing);
    expect(mockStore.openDeleteModal).toHaveBeenCalledWith(mockListing);

    component.confirmDelete();
    expect(mockStore.confirmDelete).toHaveBeenCalled();

    component.closeDeleteModal();
    expect(mockStore.closeDeleteModal).toHaveBeenCalled();
  });
});
