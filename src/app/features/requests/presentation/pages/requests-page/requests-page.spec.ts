import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthStore } from '../../../../auth/presentation/state/auth.store';
import { LearningRequest } from '../../../domain/entities/learning-request.entity';
import { RequestsStore } from '../../state/requests.store';
import { RequestsPage } from './requests-page';

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

describe('RequestsPage', () => {
  let component: RequestsPage;
  let fixture: ComponentFixture<RequestsPage>;
  let mockStore: {
    sentRequests: ReturnType<typeof signal>;
    receivedRequests: ReturnType<typeof signal>;
    filteredSentRequests: ReturnType<typeof signal>;
    filteredReceivedRequests: ReturnType<typeof signal>;
    activeTab: ReturnType<typeof signal>;
    statusFilter: ReturnType<typeof signal>;
    isLoading: ReturnType<typeof signal>;
    actionLoadingId: ReturnType<typeof signal>;
    error: ReturnType<typeof signal>;
    successMessage: ReturnType<typeof signal>;
    pendingSentCount: ReturnType<typeof signal>;
    pendingReceivedCount: ReturnType<typeof signal>;
    loadAll: ReturnType<typeof vi.fn>;
    setActiveTab: ReturnType<typeof vi.fn>;
    setStatusFilter: ReturnType<typeof vi.fn>;
    accept: ReturnType<typeof vi.fn>;
    reject: ReturnType<typeof vi.fn>;
    cancel: ReturnType<typeof vi.fn>;
  };
  let mockAuthStore: {
    user: ReturnType<typeof signal>;
  };

  beforeEach(async () => {
    mockStore = {
      sentRequests: signal([mockRequest]),
      receivedRequests: signal([]),
      filteredSentRequests: signal([mockRequest]),
      filteredReceivedRequests: signal([]),
      activeTab: signal('sent'),
      statusFilter: signal('all'),
      isLoading: signal(false),
      actionLoadingId: signal(null),
      error: signal(null),
      successMessage: signal(null),
      pendingSentCount: signal(1),
      pendingReceivedCount: signal(0),
      loadAll: vi.fn(),
      setActiveTab: vi.fn(),
      setStatusFilter: vi.fn(),
      accept: vi.fn(),
      reject: vi.fn(),
      cancel: vi.fn(),
    };

    mockAuthStore = {
      user: signal({
        id: 5,
        email: 'student@example.com',
        fullName: 'Aarav Gupta',
        roles: ['student', 'teacher'],
        createdAt: '2026-01-01',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [RequestsPage],
      providers: [
        provideRouter([]),
        { provide: RequestsStore, useValue: mockStore },
        { provide: AuthStore, useValue: mockAuthStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestsPage);
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

  it('delegates tab and filter changes to store', () => {
    component.onTabChange('received');
    expect(mockStore.setActiveTab).toHaveBeenCalledWith('received');

    component.onFilterChange('pending');
    expect(mockStore.setStatusFilter).toHaveBeenCalledWith('pending');
  });

  it('delegates actions to store', () => {
    component.onAccept(1);
    expect(mockStore.accept).toHaveBeenCalledWith(1);

    component.onReject(1);
    expect(mockStore.reject).toHaveBeenCalledWith(1);

    component.onCancel(1);
    expect(mockStore.cancel).toHaveBeenCalledWith(1);
  });

  it('returns correct status pill variant and label', () => {
    expect(component.getStatusVariant('pending')).toBe('warning');
    expect(component.getStatusVariant('accepted')).toBe('success');
    expect(component.getStatusVariant('rejected')).toBe('danger');
    expect(component.getStatusVariant('cancelled')).toBe('neutral');

    expect(component.getStatusLabel('pending')).toBe('Pending');
    expect(component.getStatusLabel('accepted')).toBe('Accepted');
    expect(component.getStatusLabel('rejected')).toBe('Declined');
    expect(component.getStatusLabel('cancelled')).toBe('Cancelled');
  });
});
