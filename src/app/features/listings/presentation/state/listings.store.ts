import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import {
  CreateListingInput,
  TeachingListing,
  TeachingListingStatus,
  UpdateListingInput,
} from '../../domain/entities/teaching-listing.entity';
import { CreateListingUseCase } from '../../domain/use-cases/create-listing.use-case';
import { DeleteListingUseCase } from '../../domain/use-cases/delete-listing.use-case';
import { GetMyListingsUseCase } from '../../domain/use-cases/get-my-listings.use-case';
import { UpdateListingStatusUseCase } from '../../domain/use-cases/update-listing-status.use-case';
import { UpdateListingUseCase } from '../../domain/use-cases/update-listing.use-case';

export type ListingFilterOption = 'all' | TeachingListingStatus;

@Injectable()
export class ListingsStore {
  private readonly getMyListingsUseCase = inject(GetMyListingsUseCase);
  private readonly createListingUseCase = inject(CreateListingUseCase);
  private readonly updateListingUseCase = inject(UpdateListingUseCase);
  private readonly updateListingStatusUseCase = inject(UpdateListingStatusUseCase);
  private readonly deleteListingUseCase = inject(DeleteListingUseCase);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _listings = signal<readonly TeachingListing[]>([]);
  private readonly _filterStatus = signal<ListingFilterOption>('all');
  private readonly _searchQuery = signal<string>('');
  private readonly _isLoading = signal<boolean>(false);
  private readonly _isSaving = signal<boolean>(false);
  private readonly _actionLoadingId = signal<number | null>(null);
  private readonly _error = signal<string | null>(null);
  private readonly _successMessage = signal<string | null>(null);

  // Modal state (destructive delete confirmation only)
  private readonly _isDeleteModalOpen = signal<boolean>(false);
  private readonly _listingToDelete = signal<TeachingListing | null>(null);

  // Readonly signals
  readonly listings = this._listings.asReadonly();
  readonly filterStatus = this._filterStatus.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isSaving = this._isSaving.asReadonly();
  readonly actionLoadingId = this._actionLoadingId.asReadonly();
  readonly error = this._error.asReadonly();
  readonly successMessage = this._successMessage.asReadonly();
  readonly isDeleteModalOpen = this._isDeleteModalOpen.asReadonly();
  readonly listingToDelete = this._listingToDelete.asReadonly();

  // Counts
  readonly totalCount = computed(() => this._listings().length);
  readonly publishedCount = computed(
    () => this._listings().filter((l) => l.status === 'published').length,
  );
  readonly draftCount = computed(
    () => this._listings().filter((l) => l.status === 'draft').length,
  );
  readonly pausedCount = computed(
    () => this._listings().filter((l) => l.status === 'paused').length,
  );

  // Filtered & searched listings
  readonly filteredListings = computed(() => {
    let list = this._listings();
    const filter = this._filterStatus();
    if (filter !== 'all') {
      list = list.filter((l) => l.status === filter);
    }

    const q = this._searchQuery().trim().toLowerCase();
    if (!q) {
      return list;
    }

    return list.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        (l.categoryName && l.categoryName.toLowerCase().includes(q)) ||
        (l.city && l.city.toLowerCase().includes(q)),
    );
  });

  loadAll(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.getMyListingsUseCase
      .execute()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._isLoading.set(false)),
      )
      .subscribe({
        next: (items) => this._listings.set(items),
        error: (err) => {
          this._error.set(err?.message || 'Failed to load your teaching listings.');
        },
      });
  }

  setFilterStatus(filter: ListingFilterOption): void {
    this._filterStatus.set(filter);
  }

  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  getListingById(id: number): TeachingListing | undefined {
    return this._listings().find((l) => l.id === id);
  }

  openDeleteModal(listing: TeachingListing): void {
    this._listingToDelete.set(listing);
    this._isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this._isDeleteModalOpen.set(false);
    this._listingToDelete.set(null);
  }

  saveListing(
    input: CreateListingInput,
    id?: number,
    onSuccess?: (listing: TeachingListing) => void,
  ): void {
    this._isSaving.set(true);
    this._error.set(null);

    if (id) {
      // Update existing listing
      const updateData: UpdateListingInput = {
        title: input.title,
        description: input.description,
        categoryId: input.categoryId,
        level: input.level,
        priceAmount: input.priceAmount,
        currency: input.currency,
        priceUnit: input.priceUnit,
        teachingMode: input.teachingMode,
        city: input.city,
        area: input.area,
      };

      this.updateListingUseCase
        .execute(id, updateData)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this._isSaving.set(false)),
        )
        .subscribe({
          next: (updated) => {
            this._listings.update((list) =>
              list.map((item) => (item.id === id ? updated : item)),
            );
            this.showSuccess('Teaching listing updated successfully.');
            onSuccess?.(updated);
          },
          error: (err) => {
            this._error.set(err?.message || 'Failed to update teaching listing.');
          },
        });
    } else {
      // Create new listing
      this.createListingUseCase
        .execute(input)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this._isSaving.set(false)),
        )
        .subscribe({
          next: (created) => {
            this._listings.update((list) => [created, ...list]);
            this.showSuccess(
              created.status === 'published'
                ? 'Teaching listing published successfully!'
                : 'Teaching listing saved as draft.',
            );
            onSuccess?.(created);
          },
          error: (err) => {
            this._error.set(err?.message || 'Failed to create teaching listing.');
          },
        });
    }
  }

  toggleListingStatus(id: number, targetStatus: TeachingListingStatus): void {
    this._actionLoadingId.set(id);
    this._error.set(null);

    this.updateListingStatusUseCase
      .execute(id, targetStatus)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._actionLoadingId.set(null)),
      )
      .subscribe({
        next: (updated) => {
          this._listings.update((list) =>
            list.map((item) => (item.id === id ? updated : item)),
          );
          const actionWord =
            targetStatus === 'published'
              ? 'published'
              : targetStatus === 'paused'
                ? 'paused'
                : 'updated';
          this.showSuccess(`Listing is now ${actionWord}.`);
        },
        error: (err) => {
          this._error.set(err?.message || 'Failed to update listing status.');
        },
      });
  }

  confirmDelete(): void {
    const candidate = this._listingToDelete();
    if (!candidate) return;

    const id = candidate.id;
    this._actionLoadingId.set(id);
    this._error.set(null);

    this.deleteListingUseCase
      .execute(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this._actionLoadingId.set(null);
          this.closeDeleteModal();
        }),
      )
      .subscribe({
        next: () => {
          this._listings.update((list) => list.filter((item) => item.id !== id));
          this.showSuccess('Teaching listing removed.');
        },
        error: (err) => {
          this._error.set(err?.message || 'Failed to delete listing.');
        },
      });
  }

  clearFeedback(): void {
    this._error.set(null);
    this._successMessage.set(null);
  }

  private showSuccess(message: string): void {
    this._successMessage.set(message);
    setTimeout(() => {
      this._successMessage.set(null);
    }, 3500);
  }
}
