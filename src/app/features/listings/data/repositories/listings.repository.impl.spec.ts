import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { PROTOTYPE_MODE } from '../../../../core/config/api.config';
import { CreateListingInput, UpdateListingInput } from '../../domain/entities/teaching-listing.entity';
import { SkillListingReadDto, toTeachingListingEntity } from '../models/teaching-listing.dto';
import { ListingsApiService } from '../services/listings-api.service';
import { ListingsRepositoryImpl } from './listings.repository.impl';

describe('ListingsRepositoryImpl (Prototype Mode)', () => {
  let repository: ListingsRepositoryImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ListingsRepositoryImpl,
        { provide: PROTOTYPE_MODE, useValue: true },
        { provide: ListingsApiService, useValue: {} },
      ],
    });

    repository = TestBed.inject(ListingsRepositoryImpl);
  });

  it('fetches initial active mock listings', () => {
    repository.getMyListings().subscribe((listings) => {
      expect(listings.length).toBeGreaterThan(0);
      expect(listings.some((l) => l.title.includes('Python'))).toBe(true);
    });
  });

  it('creates a new listing in memory and prepends it', () => {
    const input: CreateListingInput = {
      title: 'Advanced Machine Learning',
      description: 'Hands on deep learning',
      categoryId: 6,
      level: 'advanced',
      priceAmount: 1500,
      teachingMode: 'online',
      status: 'draft',
    };

    repository.createListing(input).subscribe((created) => {
      expect(created.id).toBeDefined();
      expect(created.title).toBe(input.title);
      expect(created.status).toBe('draft');
      expect(created.categoryName).toBe('Technology & Coding');
    });

    repository.getMyListings().subscribe((listings) => {
      expect(listings[0].title).toBe('Advanced Machine Learning');
    });
  });

  it('updates an existing listing fields', () => {
    const updateInput: UpdateListingInput = {
      title: 'Python for Beginners & DS (Updated)',
      priceAmount: 750,
    };

    repository.updateListing(101, updateInput).subscribe((updated) => {
      expect(updated.id).toBe(101);
      expect(updated.title).toBe('Python for Beginners & DS (Updated)');
      expect(updated.priceAmount).toBe(750);
    });
  });

  it('updates listing status (publish / pause / archive)', () => {
    repository.updateListingStatus(103, 'published').subscribe((updated) => {
      expect(updated.id).toBe(103);
      expect(updated.status).toBe('published');
    });
  });

  it('soft deletes a listing by setting status to archived', () => {
    repository.deleteListing(104).subscribe((deleted) => {
      expect(deleted.id).toBe(104);
      expect(deleted.status).toBe('archived');
    });

    repository.getMyListings().subscribe((listings) => {
      expect(listings.some((l) => l.id === 104)).toBe(false);
    });
  });
});

describe('toTeachingListingEntity', () => {
  it('correctly maps DTO to Entity with defaults', () => {
    const dto: SkillListingReadDto = {
      id: 201,
      teacher_id: 5,
      category_id: 1,
      title: 'Vocal Warmups',
      description: 'Daily vocal coaching',
      level: 'intermediate',
      price_amount: '450.00',
      currency: 'INR',
      price_unit: 'hour',
      teaching_mode: 'online',
      status: 'published',
      created_at: '2026-11-01T00:00:00Z',
    };

    const entity = toTeachingListingEntity(dto);
    expect(entity.id).toBe(201);
    expect(entity.teacherId).toBe(5);
    expect(entity.categoryName).toBe('Music & Vocals');
    expect(entity.priceAmount).toBe(450);
    expect(entity.priceUnit).toBe('hour');
    expect(entity.level).toBe('intermediate');
    expect(entity.teachingMode).toBe('online');
    expect(entity.status).toBe('published');
  });
});
