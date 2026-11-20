import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
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
  let router: Router;
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
    isDeleteModalOpen: ReturnType<typeof signal>;
    listingToDelete: ReturnType<typeof signal>;
    loadAll: ReturnType<typeof vi.fn>;
    setFilterStatus: ReturnType<typeof vi.fn>;
    setSearchQuery: ReturnType<typeof vi.fn>;
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
      isDeleteModalOpen: signal(false),
      listingToDelete: signal(null),
      loadAll: vi.fn(),
      setFilterStatus: vi.fn(),
      setSearchQuery: vi.fn(),
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

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

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

  it('navigates to create listing page on create action', () => {
    component.onCreateNew();
    expect(router.navigate).toHaveBeenCalledWith(['/listings', 'new']);
  });

  it('navigates to edit listing page on edit action', () => {
    component.onEdit(mockListing);
    expect(router.navigate).toHaveBeenCalledWith(['/listings', 101, 'edit']);
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
