import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../../auth/presentation/state/auth.store';
import { CustomModal } from '../../../../../shared/components/custom-modal/custom.modal';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';
import {
  CustomStatusPill,
  StatusPillVariant,
} from '../../../../../shared/components/custom-status-pill/custom.status.pill';
import { CustomTextField } from '../../../../../shared/components/custom-textfield/custom.textfield';
import { LoaderComponent } from '../../../../../shared/components/loader/loader';
import {
  TeachingListing,
  TeachingListingStatus,
} from '../../../domain/entities/teaching-listing.entity';
import { ListingFilterOption, ListingsStore } from '../../state/listings.store';

@Component({
  selector: 'app-listings-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CustomPrimaryButton,
    CustomStatusPill,
    CustomTextField,
    CustomModal,
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

  readonly isTeacher = computed(() =>
    Boolean(this.authStore.user()?.roles.includes('teacher')),
  );

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

  onCreateNew(): void {
    this.router.navigate(['/listings', 'new']);
  }

  openCreateModal(): void {
    this.onCreateNew();
  }

  onEdit(listing: TeachingListing): void {
    this.router.navigate(['/listings', listing.id, 'edit']);
  }

  openEditModal(listing: TeachingListing): void {
    this.onEdit(listing);
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
