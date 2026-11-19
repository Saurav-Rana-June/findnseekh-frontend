import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { PROTOTYPE_MODE } from '../../../../core/config/api.config';
import {
  CreateListingInput,
  TeachingListing,
  TeachingListingStatus,
  UpdateListingInput,
} from '../../domain/entities/teaching-listing.entity';
import { ListingsRepository } from '../../domain/repositories/listings.repository';
import {
  CATEGORY_NAMES_BY_ID,
  toTeachingListingEntity,
} from '../models/teaching-listing.dto';
import { ListingsApiService } from '../services/listings-api.service';

const INITIAL_MOCK_LISTINGS: TeachingListing[] = [
  {
    id: 101,
    teacherId: 1,
    categoryId: 6,
    categoryName: 'Technology & Coding',
    title: 'Python for Beginners & Data Structures',
    description:
      'Master core Python programming, algorithmic thinking, and problem-solving through interactive weekly coding projects.',
    level: 'beginner',
    priceAmount: 600,
    currency: 'INR',
    priceUnit: 'session',
    teachingMode: 'online',
    city: null,
    area: null,
    status: 'published',
    createdAt: '2026-11-10T10:00:00Z',
  },
  {
    id: 102,
    teacherId: 1,
    categoryId: 6,
    categoryName: 'Technology & Coding',
    title: 'Full-Stack Web Development with React & Node.js',
    description:
      'Learn modern frontend and backend development with hands-on full-stack application building, APIs, and deployments.',
    level: 'intermediate',
    priceAmount: 850,
    currency: 'INR',
    priceUnit: 'session',
    teachingMode: 'both',
    city: 'Mumbai',
    area: 'Bandra West',
    status: 'published',
    createdAt: '2026-11-12T14:30:00Z',
  },
  {
    id: 103,
    teacherId: 1,
    categoryId: 6,
    categoryName: 'Technology & Coding',
    title: 'Machine Learning & AI Foundations with PyTorch',
    description:
      'In-depth practical machine learning covering linear algebra, regression, classification, and neural network architectures.',
    level: 'advanced',
    priceAmount: 1200,
    currency: 'INR',
    priceUnit: 'session',
    teachingMode: 'online',
    city: null,
    area: null,
    status: 'draft',
    createdAt: '2026-11-15T09:15:00Z',
  },
  {
    id: 104,
    teacherId: 1,
    categoryId: 1,
    categoryName: 'Music & Vocals',
    title: 'Acoustic Guitar Fingerstyle & Chords',
    description:
      'Step-by-step guitar instruction focusing on rhythm, fingerpicking patterns, and music theory for popular genres.',
    level: 'all_levels',
    priceAmount: 500,
    currency: 'INR',
    priceUnit: 'session',
    teachingMode: 'both',
    city: 'Mumbai',
    area: 'Andheri East',
    status: 'paused',
    createdAt: '2026-11-08T16:00:00Z',
  },
];

@Injectable()
export class ListingsRepositoryImpl implements ListingsRepository {
  private readonly apiService = inject(ListingsApiService);
  private readonly prototypeMode = inject(PROTOTYPE_MODE, { optional: true }) ?? false;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private mockListings: TeachingListing[] = [...INITIAL_MOCK_LISTINGS];

  getMyListings(): Observable<readonly TeachingListing[]> {
    if (this.prototypeMode) {
      const active = this.mockListings.filter((l) => l.status !== 'archived');
      return of(active);
    }

    return this.apiService.getMyListings().pipe(
      map((res) => (res.data || []).map(toTeachingListingEntity)),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }

  createListing(input: CreateListingInput): Observable<TeachingListing> {
    if (this.prototypeMode) {
      const newListing: TeachingListing = {
        id: Date.now(),
        teacherId: 1,
        categoryId: input.categoryId,
        categoryName: CATEGORY_NAMES_BY_ID[input.categoryId] || 'Skill Class',
        title: input.title.trim(),
        description: input.description.trim(),
        level: input.level,
        priceAmount: input.priceAmount,
        currency: input.currency || 'INR',
        priceUnit: input.priceUnit || 'session',
        teachingMode: input.teachingMode,
        city: input.city ?? null,
        area: input.area ?? null,
        status: input.status || 'draft',
        createdAt: new Date().toISOString(),
      };

      this.mockListings = [newListing, ...this.mockListings];
      return of(newListing);
    }

    return this.apiService
      .createListing({
        title: input.title,
        description: input.description,
        category_id: input.categoryId,
        level: input.level,
        price_amount: input.priceAmount,
        currency: input.currency || 'INR',
        price_unit: input.priceUnit || 'session',
        teaching_mode: input.teachingMode,
        city: input.city ?? null,
        area: input.area ?? null,
      })
      .pipe(
        map((res) => toTeachingListingEntity(res.data)),
        catchError((err) => throwError(() => err)),
      );
  }

  updateListing(id: number, input: UpdateListingInput): Observable<TeachingListing> {
    if (this.prototypeMode) {
      const index = this.mockListings.findIndex((l) => l.id === id);
      if (index === -1) {
        return throwError(() => new Error('Listing not found'));
      }

      const existing = this.mockListings[index];
      const updated: TeachingListing = {
        ...existing,
        title: input.title !== undefined ? input.title.trim() : existing.title,
        description: input.description !== undefined ? input.description.trim() : existing.description,
        categoryId: input.categoryId !== undefined ? input.categoryId : existing.categoryId,
        categoryName:
          input.categoryId !== undefined
            ? CATEGORY_NAMES_BY_ID[input.categoryId] || existing.categoryName
            : existing.categoryName,
        level: input.level !== undefined ? input.level : existing.level,
        priceAmount: input.priceAmount !== undefined ? input.priceAmount : existing.priceAmount,
        currency: input.currency !== undefined ? input.currency : existing.currency,
        priceUnit: input.priceUnit !== undefined ? input.priceUnit : existing.priceUnit,
        teachingMode: input.teachingMode !== undefined ? input.teachingMode : existing.teachingMode,
        city: input.city !== undefined ? input.city : existing.city,
        area: input.area !== undefined ? input.area : existing.area,
        updatedAt: new Date().toISOString(),
      };

      this.mockListings[index] = updated;
      return of(updated);
    }

    return this.apiService
      .updateListing(id, {
        title: input.title,
        description: input.description,
        category_id: input.categoryId,
        level: input.level,
        price_amount: input.priceAmount,
        currency: input.currency,
        price_unit: input.priceUnit,
        teaching_mode: input.teachingMode,
        city: input.city,
        area: input.area,
      })
      .pipe(
        map((res) => toTeachingListingEntity(res.data)),
        catchError((err) => throwError(() => err)),
      );
  }

  updateListingStatus(id: number, status: TeachingListingStatus): Observable<TeachingListing> {
    if (this.prototypeMode) {
      const index = this.mockListings.findIndex((l) => l.id === id);
      if (index === -1) {
        return throwError(() => new Error('Listing not found'));
      }

      const updated: TeachingListing = {
        ...this.mockListings[index],
        status,
        updatedAt: new Date().toISOString(),
      };

      this.mockListings[index] = updated;
      return of(updated);
    }

    return this.apiService
      .updateListingStatus(id, status)
      .pipe(
        map((res) => toTeachingListingEntity(res.data)),
        catchError((err) => throwError(() => err)),
      );
  }

  deleteListing(id: number): Observable<TeachingListing> {
    return this.updateListingStatus(id, 'archived');
  }
}
