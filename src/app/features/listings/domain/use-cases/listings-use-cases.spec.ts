import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CreateListingInput,
  TeachingListing,
  UpdateListingInput,
} from '../entities/teaching-listing.entity';
import { ListingsRepository } from '../repositories/listings.repository';
import { CreateListingUseCase } from './create-listing.use-case';
import { DeleteListingUseCase } from './delete-listing.use-case';
import { GetMyListingsUseCase } from './get-my-listings.use-case';
import { UpdateListingStatusUseCase } from './update-listing-status.use-case';
import { UpdateListingUseCase } from './update-listing.use-case';

const mockListing: TeachingListing = {
  id: 1,
  teacherId: 10,
  categoryId: 6,
  title: 'Python Tutoring',
  description: 'Python fundamentals',
  level: 'beginner',
  priceAmount: 500,
  currency: 'INR',
  priceUnit: 'session',
  teachingMode: 'online',
  status: 'published',
  createdAt: '2026-11-01',
};

describe('Listings Use Cases', () => {
  let mockRepo: {
    getMyListings: ReturnType<typeof vi.fn>;
    createListing: ReturnType<typeof vi.fn>;
    updateListing: ReturnType<typeof vi.fn>;
    updateListingStatus: ReturnType<typeof vi.fn>;
    deleteListing: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRepo = {
      getMyListings: vi.fn().mockReturnValue(of([mockListing])),
      createListing: vi.fn().mockReturnValue(of(mockListing)),
      updateListing: vi.fn().mockReturnValue(of(mockListing)),
      updateListingStatus: vi.fn().mockReturnValue(of(mockListing)),
      deleteListing: vi.fn().mockReturnValue(of({ ...mockListing, status: 'archived' })),
    };

    TestBed.configureTestingModule({
      providers: [
        GetMyListingsUseCase,
        CreateListingUseCase,
        UpdateListingUseCase,
        UpdateListingStatusUseCase,
        DeleteListingUseCase,
        { provide: ListingsRepository, useValue: mockRepo },
      ],
    });
  });

  it('GetMyListingsUseCase calls repository.getMyListings', () => {
    const useCase = TestBed.inject(GetMyListingsUseCase);
    useCase.execute().subscribe((res) => {
      expect(res).toEqual([mockListing]);
      expect(mockRepo.getMyListings).toHaveBeenCalled();
    });
  });

  it('CreateListingUseCase calls repository.createListing', () => {
    const useCase = TestBed.inject(CreateListingUseCase);
    const input: CreateListingInput = {
      title: 'Python Tutoring',
      description: 'Python fundamentals',
      categoryId: 6,
      level: 'beginner',
      priceAmount: 500,
      teachingMode: 'online',
    };

    useCase.execute(input).subscribe((res) => {
      expect(res).toEqual(mockListing);
      expect(mockRepo.createListing).toHaveBeenCalledWith(input);
    });
  });

  it('UpdateListingUseCase calls repository.updateListing', () => {
    const useCase = TestBed.inject(UpdateListingUseCase);
    const input: UpdateListingInput = { priceAmount: 650 };

    useCase.execute(1, input).subscribe((res) => {
      expect(res).toEqual(mockListing);
      expect(mockRepo.updateListing).toHaveBeenCalledWith(1, input);
    });
  });

  it('UpdateListingStatusUseCase calls repository.updateListingStatus', () => {
    const useCase = TestBed.inject(UpdateListingStatusUseCase);
    useCase.execute(1, 'paused').subscribe((res) => {
      expect(res).toEqual(mockListing);
      expect(mockRepo.updateListingStatus).toHaveBeenCalledWith(1, 'paused');
    });
  });

  it('DeleteListingUseCase calls repository.deleteListing', () => {
    const useCase = TestBed.inject(DeleteListingUseCase);
    useCase.execute(1).subscribe((res) => {
      expect(res.status).toBe('archived');
      expect(mockRepo.deleteListing).toHaveBeenCalledWith(1);
    });
  });
});
