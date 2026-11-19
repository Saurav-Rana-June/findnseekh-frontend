import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CreateListingInput,
  TeachingListing,
} from '../../domain/entities/teaching-listing.entity';
import { CreateListingUseCase } from '../../domain/use-cases/create-listing.use-case';
import { DeleteListingUseCase } from '../../domain/use-cases/delete-listing.use-case';
import { GetMyListingsUseCase } from '../../domain/use-cases/get-my-listings.use-case';
import { UpdateListingStatusUseCase } from '../../domain/use-cases/update-listing-status.use-case';
import { UpdateListingUseCase } from '../../domain/use-cases/update-listing.use-case';
import { ListingsStore } from './listings.store';

const mockListings: TeachingListing[] = [
  {
    id: 1,
    teacherId: 10,
    categoryId: 6,
    categoryName: 'Technology & Coding',
    title: 'Python for Beginners',
    description: 'Learn python from basics',
    level: 'beginner',
    priceAmount: 600,
    currency: 'INR',
    priceUnit: 'session',
    teachingMode: 'online',
    status: 'published',
    createdAt: '2026-11-10T10:00:00Z',
  },
  {
    id: 2,
    teacherId: 10,
    categoryId: 1,
    categoryName: 'Music & Vocals',
    title: 'Acoustic Guitar',
    description: 'Fingerstyle guitar',
    level: 'intermediate',
    priceAmount: 500,
    currency: 'INR',
    priceUnit: 'session',
    teachingMode: 'both',
    status: 'draft',
    createdAt: '2026-11-11T10:00:00Z',
  },
  {
    id: 3,
    teacherId: 10,
    categoryId: 3,
    categoryName: 'Yoga & Fitness',
    title: 'Hatha Yoga',
    description: 'Morning stretching',
    level: 'all_levels',
    priceAmount: 400,
    currency: 'INR',
    priceUnit: 'session',
    teachingMode: 'offline',
    city: 'Mumbai',
    status: 'paused',
    createdAt: '2026-11-12T10:00:00Z',
  },
];

describe('ListingsStore', () => {
  let store: ListingsStore;
  let mockGetMyListings: { execute: ReturnType<typeof vi.fn> };
  let mockCreateListing: { execute: ReturnType<typeof vi.fn> };
  let mockUpdateListing: { execute: ReturnType<typeof vi.fn> };
  let mockUpdateListingStatus: { execute: ReturnType<typeof vi.fn> };
  let mockDeleteListing: { execute: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockGetMyListings = { execute: vi.fn().mockReturnValue(of(mockListings)) };
    mockCreateListing = {
      execute: vi.fn((input: CreateListingInput) =>
        of({
          id: 99,
          teacherId: 10,
          categoryId: input.categoryId,
          categoryName: 'Technology & Coding',
          title: input.title,
          description: input.description,
          level: input.level,
          priceAmount: input.priceAmount,
          currency: 'INR',
          priceUnit: 'session',
          teachingMode: input.teachingMode,
          status: input.status || 'draft',
          createdAt: new Date().toISOString(),
        } as TeachingListing),
      ),
    };
    mockUpdateListing = {
      execute: vi.fn((id: number, input: any) =>
        of({
          ...mockListings.find((l) => l.id === id)!,
          ...input,
        } as TeachingListing),
      ),
    };
    mockUpdateListingStatus = {
      execute: vi.fn((id: number, status: any) =>
        of({
          ...mockListings.find((l) => l.id === id)!,
          status,
        } as TeachingListing),
      ),
    };
    mockDeleteListing = {
      execute: vi.fn((id: number) =>
        of({
          ...mockListings.find((l) => l.id === id)!,
          status: 'archived',
        } as TeachingListing),
      ),
    };

    TestBed.configureTestingModule({
      providers: [
        ListingsStore,
        { provide: GetMyListingsUseCase, useValue: mockGetMyListings },
        { provide: CreateListingUseCase, useValue: mockCreateListing },
        { provide: UpdateListingUseCase, useValue: mockUpdateListing },
        { provide: UpdateListingStatusUseCase, useValue: mockUpdateListingStatus },
        { provide: DeleteListingUseCase, useValue: mockDeleteListing },
      ],
    });

    store = TestBed.inject(ListingsStore);
  });

  it('loads all listings and computes counts correctly', () => {
    store.loadAll();

    expect(store.listings().length).toBe(3);
    expect(store.totalCount()).toBe(3);
    expect(store.publishedCount()).toBe(1);
    expect(store.draftCount()).toBe(1);
    expect(store.pausedCount()).toBe(1);
    expect(store.isLoading()).toBe(false);
  });

  it('filters listings by status', () => {
    store.loadAll();

    store.setFilterStatus('published');
    expect(store.filteredListings().length).toBe(1);
    expect(store.filteredListings()[0].title).toBe('Python for Beginners');

    store.setFilterStatus('draft');
    expect(store.filteredListings().length).toBe(1);
    expect(store.filteredListings()[0].title).toBe('Acoustic Guitar');

    store.setFilterStatus('all');
    expect(store.filteredListings().length).toBe(3);
  });

  it('filters listings by search query', () => {
    store.loadAll();

    store.setSearchQuery('guitar');
    expect(store.filteredListings().length).toBe(1);
    expect(store.filteredListings()[0].title).toBe('Acoustic Guitar');

    store.setSearchQuery('technology');
    expect(store.filteredListings().length).toBe(1);
    expect(store.filteredListings()[0].title).toBe('Python for Beginners');

    store.setSearchQuery('');
    expect(store.filteredListings().length).toBe(3);
  });

  it('opens and closes create and edit modals', () => {
    expect(store.isFormModalOpen()).toBe(false);

    store.openCreateModal();
    expect(store.isFormModalOpen()).toBe(true);
    expect(store.activeListingForEdit()).toBeNull();

    store.openEditModal(mockListings[0]);
    expect(store.isFormModalOpen()).toBe(true);
    expect(store.activeListingForEdit()).toEqual(mockListings[0]);

    store.closeFormModal();
    expect(store.isFormModalOpen()).toBe(false);
    expect(store.activeListingForEdit()).toBeNull();
  });

  it('creates a new listing and prepends to the list', () => {
    store.loadAll();

    const input: CreateListingInput = {
      title: 'Full Stack Node',
      description: 'Node backend',
      categoryId: 6,
      level: 'intermediate',
      priceAmount: 800,
      teachingMode: 'online',
      status: 'published',
    };

    store.saveListing(input);
    expect(mockCreateListing.execute).toHaveBeenCalledWith(input);
    expect(store.listings().length).toBe(4);
    expect(store.listings()[0].title).toBe('Full Stack Node');
    expect(store.isFormModalOpen()).toBe(false);
  });

  it('updates an existing listing in-place', () => {
    store.loadAll();

    const input: CreateListingInput = {
      title: 'Python for Beginners & DS',
      description: 'Updated description',
      categoryId: 6,
      level: 'beginner',
      priceAmount: 700,
      teachingMode: 'online',
    };

    store.saveListing(input, 1);
    expect(mockUpdateListing.execute).toHaveBeenCalled();
    const updated = store.listings().find((l) => l.id === 1);
    expect(updated?.title).toBe('Python for Beginners & DS');
    expect(updated?.priceAmount).toBe(700);
    expect(store.isFormModalOpen()).toBe(false);
  });

  it('toggles listing status', () => {
    store.loadAll();

    store.toggleListingStatus(2, 'published');
    expect(mockUpdateListingStatus.execute).toHaveBeenCalledWith(2, 'published');
    const target = store.listings().find((l) => l.id === 2);
    expect(target?.status).toBe('published');
  });

  it('handles delete modal and removes listing', () => {
    store.loadAll();

    store.openDeleteModal(mockListings[2]);
    expect(store.isDeleteModalOpen()).toBe(true);
    expect(store.listingToDelete()).toEqual(mockListings[2]);

    store.confirmDelete();
    expect(mockDeleteListing.execute).toHaveBeenCalledWith(3);
    expect(store.listings().some((l) => l.id === 3)).toBe(false);
    expect(store.isDeleteModalOpen()).toBe(false);
  });
});
