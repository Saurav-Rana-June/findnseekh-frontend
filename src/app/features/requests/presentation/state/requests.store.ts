import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import {
  LearningRequest,
  LearningRequestStatus,
} from '../../domain/entities/learning-request.entity';
import { AcceptRequestUseCase } from '../../domain/use-cases/accept-request.use-case';
import { CancelRequestUseCase } from '../../domain/use-cases/cancel-request.use-case';
import { GetReceivedRequestsUseCase } from '../../domain/use-cases/get-received-requests.use-case';
import { GetSentRequestsUseCase } from '../../domain/use-cases/get-sent-requests.use-case';
import { RejectRequestUseCase } from '../../domain/use-cases/reject-request.use-case';

export type RequestTab = 'sent' | 'received';
export type RequestFilterOption = 'all' | LearningRequestStatus;

@Injectable()
export class RequestsStore {
  private readonly getSent = inject(GetSentRequestsUseCase);
  private readonly getReceived = inject(GetReceivedRequestsUseCase);
  private readonly acceptReq = inject(AcceptRequestUseCase);
  private readonly rejectReq = inject(RejectRequestUseCase);
  private readonly cancelReq = inject(CancelRequestUseCase);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _sentRequests = signal<readonly LearningRequest[]>([]);
  private readonly _receivedRequests = signal<readonly LearningRequest[]>([]);
  private readonly _activeTab = signal<RequestTab>('sent');
  private readonly _statusFilter = signal<RequestFilterOption>('all');
  private readonly _isLoading = signal<boolean>(false);
  private readonly _actionLoadingId = signal<number | null>(null);
  private readonly _error = signal<string | null>(null);
  private readonly _successMessage = signal<string | null>(null);

  readonly sentRequests = this._sentRequests.asReadonly();
  readonly receivedRequests = this._receivedRequests.asReadonly();
  readonly activeTab = this._activeTab.asReadonly();
  readonly statusFilter = this._statusFilter.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly actionLoadingId = this._actionLoadingId.asReadonly();
  readonly error = this._error.asReadonly();
  readonly successMessage = this._successMessage.asReadonly();

  readonly pendingSentCount = computed(
    () => this._sentRequests().filter((r) => r.status === 'pending').length,
  );

  readonly pendingReceivedCount = computed(
    () => this._receivedRequests().filter((r) => r.status === 'pending').length,
  );

  readonly filteredSentRequests = computed(() => {
    const list = this._sentRequests();
    const filter = this._statusFilter();
    if (filter === 'all') return list;
    return list.filter((r) => r.status === filter);
  });

  readonly filteredReceivedRequests = computed(() => {
    const list = this._receivedRequests();
    const filter = this._statusFilter();
    if (filter === 'all') return list;
    return list.filter((r) => r.status === filter);
  });

  setActiveTab(tab: RequestTab): void {
    this._activeTab.set(tab);
    this._error.set(null);
  }

  setStatusFilter(filter: RequestFilterOption): void {
    this._statusFilter.set(filter);
  }

  loadAll(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.getSent
      .execute()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._isLoading.set(false)),
      )
      .subscribe({
        next: (items) => this._sentRequests.set(items),
        error: () => this._error.set('Failed to load sent requests.'),
      });

    this.getReceived
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => this._receivedRequests.set(items),
        error: () => {},
      });
  }

  accept(id: number): void {
    this._actionLoadingId.set(id);
    this._error.set(null);

    this.acceptReq
      .execute(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._actionLoadingId.set(null)),
      )
      .subscribe({
        next: (updated) => {
          this._receivedRequests.update((list) =>
            list.map((r) => (r.id === id ? { ...r, status: 'accepted' as const } : r)),
          );
          this.showSuccess('Learning request accepted!');
        },
        error: (err) => {
          this._error.set(err?.error?.message || err?.message || 'Failed to accept request.');
        },
      });
  }

  reject(id: number): void {
    this._actionLoadingId.set(id);
    this._error.set(null);

    this.rejectReq
      .execute(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._actionLoadingId.set(null)),
      )
      .subscribe({
        next: (updated) => {
          this._receivedRequests.update((list) =>
            list.map((r) => (r.id === id ? { ...r, status: 'rejected' as const } : r)),
          );
          this.showSuccess('Learning request declined.');
        },
        error: (err) => {
          this._error.set(err?.error?.message || err?.message || 'Failed to decline request.');
        },
      });
  }

  cancel(id: number): void {
    this._actionLoadingId.set(id);
    this._error.set(null);

    this.cancelReq
      .execute(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._actionLoadingId.set(null)),
      )
      .subscribe({
        next: (updated) => {
          this._sentRequests.update((list) =>
            list.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r)),
          );
          this.showSuccess('Your learning request has been cancelled.');
        },
        error: (err) => {
          this._error.set(err?.error?.message || err?.message || 'Failed to cancel request.');
        },
      });
  }

  private showSuccess(message: string): void {
    this._successMessage.set(message);
    setTimeout(() => {
      this._successMessage.set(null);
    }, 3500);
  }
}

