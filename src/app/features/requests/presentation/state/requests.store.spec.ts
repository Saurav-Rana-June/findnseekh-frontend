import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { LearningRequest } from '../../domain/entities/learning-request.entity';
import { AcceptRequestUseCase } from '../../domain/use-cases/accept-request.use-case';
import { CancelRequestUseCase } from '../../domain/use-cases/cancel-request.use-case';
import { GetReceivedRequestsUseCase } from '../../domain/use-cases/get-received-requests.use-case';
import { GetSentRequestsUseCase } from '../../domain/use-cases/get-sent-requests.use-case';
import { RejectRequestUseCase } from '../../domain/use-cases/reject-request.use-case';
import { RequestsStore } from './requests.store';

const mockRequest: LearningRequest = {
  id: 1,
  skillListingId: 10,
  skillTitle: 'Maths Tutoring',
  studentId: 5,
  studentName: 'Aarav Gupta',
  teacherId: 2,
  teacherName: 'Sunita Sharma',
  message: 'Need help with Calculus',
  status: 'pending',
  createdAt: '2026-11-16T10:00:00Z',
};

describe('RequestsStore', () => {
  let store: RequestsStore;
  let getSentMock: { execute: ReturnType<typeof vi.fn> };
  let getReceivedMock: { execute: ReturnType<typeof vi.fn> };
  let acceptMock: { execute: ReturnType<typeof vi.fn> };
  let rejectMock: { execute: ReturnType<typeof vi.fn> };
  let cancelMock: { execute: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    getSentMock = { execute: vi.fn().mockReturnValue(of([mockRequest])) };
    getReceivedMock = { execute: vi.fn().mockReturnValue(of([])) };
    acceptMock = { execute: vi.fn().mockReturnValue(of({ ...mockRequest, status: 'accepted' })) };
    rejectMock = { execute: vi.fn().mockReturnValue(of({ ...mockRequest, status: 'rejected' })) };
    cancelMock = { execute: vi.fn().mockReturnValue(of({ ...mockRequest, status: 'cancelled' })) };

    TestBed.configureTestingModule({
      providers: [
        { provide: GetSentRequestsUseCase, useValue: getSentMock },
        { provide: GetReceivedRequestsUseCase, useValue: getReceivedMock },
        { provide: AcceptRequestUseCase, useValue: acceptMock },
        { provide: RejectRequestUseCase, useValue: rejectMock },
        { provide: CancelRequestUseCase, useValue: cancelMock },
        RequestsStore,
      ],
    });

    store = TestBed.inject(RequestsStore);
  });

  it('initializes with default values', () => {
    expect(store.activeTab()).toBe('sent');
    expect(store.statusFilter()).toBe('all');
    expect(store.isLoading()).toBe(false);
    expect(store.sentRequests().length).toBe(0);
    expect(store.receivedRequests().length).toBe(0);
  });

  it('loads all requests and updates signals', () => {
    store.loadAll();
    expect(getSentMock.execute).toHaveBeenCalled();
    expect(getReceivedMock.execute).toHaveBeenCalled();
    expect(store.sentRequests().length).toBe(1);
    expect(store.pendingSentCount()).toBe(1);
  });

  it('filters requests by status', () => {
    store.loadAll();
    expect(store.filteredSentRequests().length).toBe(1);

    store.setStatusFilter('accepted');
    expect(store.filteredSentRequests().length).toBe(0);

    store.setStatusFilter('pending');
    expect(store.filteredSentRequests().length).toBe(1);
  });

  it('switches active tab', () => {
    store.setActiveTab('received');
    expect(store.activeTab()).toBe('received');
  });

  it('cancels a pending request', () => {
    store.loadAll();
    store.cancel(1);
    expect(cancelMock.execute).toHaveBeenCalledWith(1);
    expect(store.sentRequests()[0].status).toBe('cancelled');
    expect(store.successMessage()).toContain('cancelled');
  });

  it('accepts a received request', () => {
    getReceivedMock.execute.mockReturnValue(of([mockRequest]));
    store.loadAll();
    store.accept(1);
    expect(acceptMock.execute).toHaveBeenCalledWith(1);
    expect(store.receivedRequests()[0].status).toBe('accepted');
  });

  it('rejects a received request', () => {
    getReceivedMock.execute.mockReturnValue(of([mockRequest]));
    store.loadAll();
    store.reject(1);
    expect(rejectMock.execute).toHaveBeenCalledWith(1);
    expect(store.receivedRequests()[0].status).toBe('rejected');
  });
});

