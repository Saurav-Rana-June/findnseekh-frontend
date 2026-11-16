import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../../../auth/presentation/state/auth.store';
import { CustomAvatarComponent } from '../../../../../shared/components/custom-avatar/custom-avatar';
import { CustomPrimaryButton } from '../../../../../shared/components/custom-primary-button/custom.primary.button';
import {
  CustomStatusPill,
  StatusPillVariant,
} from '../../../../../shared/components/custom-status-pill/custom.status.pill';
import {
  LearningRequest,
  LearningRequestStatus,
} from '../../../domain/entities/learning-request.entity';
import {
  RequestFilterOption,
  RequestsStore,
  RequestTab,
} from '../../state/requests.store';

@Component({
  selector: 'app-requests-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CustomPrimaryButton,
    CustomAvatarComponent,
    CustomStatusPill,
  ],
  templateUrl: './requests-page.html',
  styleUrl: './requests-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsPage implements OnInit {
  protected readonly store = inject(RequestsStore);
  protected readonly authStore = inject(AuthStore);

  readonly isTeacher = computed(() =>
    Boolean(this.authStore.user()?.roles.includes('teacher')),
  );

  readonly currentRequests = computed(() => {
    return this.store.activeTab() === 'sent'
      ? this.store.filteredSentRequests()
      : this.store.filteredReceivedRequests();
  });

  ngOnInit(): void {
    this.store.loadAll();
  }

  onTabChange(tab: RequestTab): void {
    this.store.setActiveTab(tab);
  }

  onFilterChange(filter: RequestFilterOption): void {
    this.store.setStatusFilter(filter);
  }

  onAccept(id: number): void {
    this.store.accept(id);
  }

  onReject(id: number): void {
    this.store.reject(id);
  }

  onCancel(id: number): void {
    this.store.cancel(id);
  }

  getStatusVariant(status: LearningRequestStatus): StatusPillVariant {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'cancelled':
        return 'neutral';
      case 'pending':
      default:
        return 'warning';
    }
  }

  getStatusLabel(status: LearningRequestStatus): string {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Declined';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
      default:
        return 'Pending';
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }
}
