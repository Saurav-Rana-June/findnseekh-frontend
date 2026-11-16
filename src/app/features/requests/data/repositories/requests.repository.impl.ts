import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { PROTOTYPE_MODE } from '../../../../core/config/api.config';
import { LearningRequest } from '../../domain/entities/learning-request.entity';
import { RequestsRepository } from '../../domain/repositories/requests.repository';
import {
  LearningRequestPublicDto,
  toLearningRequestEntity,
} from '../models/learning-request.dto';
import { RequestsApiService } from '../services/requests-api.service';

const MOCK_SENT_REQUESTS: LearningRequest[] = [
  {
    id: 1,
    skillListingId: 101,
    skillTitle: 'Hindustani Classical Vocals',
    studentId: 1,
    studentName: 'Aarav Sharma',
    teacherId: 101,
    teacherName: 'Ananya Verma',
    message:
      'Hello Ananya ji, I would love to learn classical khayal and improve my vocal control. Are weekend morning slots available?',
    status: 'accepted',
    teacherResponse:
      'Hello Aarav! Yes, Saturday 10:00 AM works perfectly. Looking forward to our first session.',
    respondedAt: '2026-11-15T11:00:00Z',
    createdAt: '2026-11-15T09:30:00Z',
  },
  {
    id: 2,
    skillListingId: 102,
    skillTitle: 'Hatha & Vinyasa Yoga',
    studentId: 1,
    studentName: 'Aarav Sharma',
    teacherId: 102,
    teacherName: 'Simran Kaur',
    message:
      'Looking for alignment-focused morning yoga classes for flexibility and posture correction.',
    status: 'pending',
    createdAt: '2026-11-16T08:15:00Z',
  },
  {
    id: 3,
    skillListingId: 105,
    skillTitle: 'Acoustic & Electric Guitar',
    studentId: 1,
    studentName: 'Aarav Sharma',
    teacherId: 105,
    teacherName: 'Rohan Mehta',
    message:
      'Interested in learning fingerstyle techniques and chord progressions for blues music.',
    status: 'cancelled',
    createdAt: '2026-11-10T14:20:00Z',
  },
];

const MOCK_RECEIVED_REQUESTS: LearningRequest[] = [
  {
    id: 4,
    skillListingId: 201,
    skillTitle: 'Full-Stack Web Development (Python & Angular)',
    studentId: 12,
    studentName: 'Sneha Patel',
    teacherId: 1,
    teacherName: 'Aarav Sharma',
    message:
      'Hi Sir! I want to prepare for technical interviews and build a full-stack project. Can we schedule a trial class?',
    status: 'pending',
    createdAt: '2026-11-16T07:45:00Z',
  },
  {
    id: 5,
    skillListingId: 201,
    skillTitle: 'Full-Stack Web Development (Python & Angular)',
    studentId: 15,
    studentName: 'Rahul Verma',
    teacherId: 1,
    teacherName: 'Aarav Sharma',
    message:
      'Need weekly mentoring on REST API design, Clean Architecture, and FastAPI fundamentals.',
    status: 'accepted',
    teacherResponse:
      'Accepted! Let us set up our weekly Sunday slot at 4:00 PM.',
    respondedAt: '2026-11-14T12:00:00Z',
    createdAt: '2026-11-14T11:00:00Z',
  },
  {
    id: 6,
    skillListingId: 201,
    skillTitle: 'Full-Stack Web Development (Python & Angular)',
    studentId: 18,
    studentName: 'Priya Nair',
    teacherId: 1,
    teacherName: 'Aarav Sharma',
    message: 'Looking for in-person classes only at my office in Bandra.',
    status: 'rejected',
    teacherResponse:
      'Apologies, I am currently only conducting online video sessions.',
    respondedAt: '2026-11-12T17:00:00Z',
    createdAt: '2026-11-12T16:30:00Z',
  },
];

@Injectable()
export class RequestsRepositoryImpl extends RequestsRepository {
  private readonly apiService = inject(RequestsApiService, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);
  private readonly prototypeMode = inject(PROTOTYPE_MODE, { optional: true }) ?? false;

  private mockSent = [...MOCK_SENT_REQUESTS];
  private mockReceived = [...MOCK_RECEIVED_REQUESTS];

  override getSentRequests(): Observable<readonly LearningRequest[]> {
    if (this.prototypeMode) {
      return of([...this.mockSent]);
    }

    if (isPlatformBrowser(this.platformId) && this.apiService) {
      return this.apiService.getSentRequests().pipe(
        map((res) => (res.data || []).map((item: LearningRequestPublicDto) => toLearningRequestEntity(item))),
        catchError(() => of([])),
      );
    }
    return of([]);
  }

  override getReceivedRequests(): Observable<readonly LearningRequest[]> {
    if (this.prototypeMode) {
      return of([...this.mockReceived]);
    }

    if (isPlatformBrowser(this.platformId) && this.apiService) {
      return this.apiService.getReceivedRequests().pipe(
        map((res) => (res.data || []).map((item: LearningRequestPublicDto) => toLearningRequestEntity(item))),
        catchError(() => of([])),
      );
    }
    return of([]);
  }

  override getRequestById(id: number): Observable<LearningRequest | null> {
    if (this.prototypeMode) {
      const found =
        this.mockSent.find((r) => r.id === id) ||
        this.mockReceived.find((r) => r.id === id) ||
        null;
      return of(found);
    }

    if (isPlatformBrowser(this.platformId) && this.apiService) {
      return this.apiService.getRequestById(id).pipe(
        map((res) => (res.data ? toLearningRequestEntity(res.data) : null)),
        catchError(() => of(null)),
      );
    }
    return of(null);
  }

  override acceptRequest(id: number): Observable<LearningRequest> {
    if (this.prototypeMode) {
      const target = this.mockReceived.find((r) => r.id === id);
      const updated: LearningRequest = target
        ? {
            ...target,
            status: 'accepted',
            respondedAt: new Date().toISOString(),
            teacherResponse: 'Request accepted.',
          }
        : {
            id,
            skillListingId: 1,
            skillTitle: 'Skill',
            studentId: 10,
            studentName: 'Student',
            teacherId: 1,
            teacherName: 'Teacher',
            message: 'Enquiry',
            status: 'accepted',
            createdAt: new Date().toISOString(),
          };
      this.mockReceived = this.mockReceived.map((r) => (r.id === id ? updated : r));
      return of(updated);
    }

    if (isPlatformBrowser(this.platformId) && this.apiService) {
      return this.apiService.acceptRequest(id).pipe(
        map((res) => toLearningRequestEntity(res.data)),
      );
    }
    throw new Error('Cannot accept request during SSR');
  }

  override rejectRequest(id: number): Observable<LearningRequest> {
    if (this.prototypeMode) {
      const target = this.mockReceived.find((r) => r.id === id);
      const updated: LearningRequest = target
        ? {
            ...target,
            status: 'rejected',
            respondedAt: new Date().toISOString(),
            teacherResponse: 'Request declined.',
          }
        : {
            id,
            skillListingId: 1,
            skillTitle: 'Skill',
            studentId: 10,
            studentName: 'Student',
            teacherId: 1,
            teacherName: 'Teacher',
            message: 'Enquiry',
            status: 'rejected',
            createdAt: new Date().toISOString(),
          };
      this.mockReceived = this.mockReceived.map((r) => (r.id === id ? updated : r));
      return of(updated);
    }

    if (isPlatformBrowser(this.platformId) && this.apiService) {
      return this.apiService.rejectRequest(id).pipe(
        map((res) => toLearningRequestEntity(res.data)),
      );
    }
    throw new Error('Cannot reject request during SSR');
  }

  override cancelRequest(id: number): Observable<LearningRequest> {
    if (this.prototypeMode) {
      const target = this.mockSent.find((r) => r.id === id);
      const updated: LearningRequest = target
        ? { ...target, status: 'cancelled' }
        : {
            id,
            skillListingId: 1,
            skillTitle: 'Skill',
            studentId: 1,
            studentName: 'Student',
            teacherId: 2,
            teacherName: 'Teacher',
            message: 'Enquiry',
            status: 'cancelled',
            createdAt: new Date().toISOString(),
          };
      this.mockSent = this.mockSent.map((r) => (r.id === id ? updated : r));
      return of(updated);
    }

    if (isPlatformBrowser(this.platformId) && this.apiService) {
      return this.apiService.cancelRequest(id).pipe(
        map((res) => toLearningRequestEntity(res.data)),
      );
    }
    throw new Error('Cannot cancel request during SSR');
  }
}
