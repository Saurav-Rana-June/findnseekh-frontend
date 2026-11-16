import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { LearningRequest } from '../../domain/entities/learning-request.entity';
import { RequestsRepository } from '../../domain/repositories/requests.repository';
import {
  LearningRequestPublicDto,
  toLearningRequestEntity,
} from '../models/learning-request.dto';
import { RequestsApiService } from '../services/requests-api.service';

@Injectable()
export class RequestsRepositoryImpl extends RequestsRepository {
  private readonly apiService = inject(RequestsApiService, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);

  override getSentRequests(): Observable<readonly LearningRequest[]> {
    if (isPlatformBrowser(this.platformId) && this.apiService) {
      return this.apiService.getSentRequests().pipe(
        map((res) => (res.data || []).map((item: LearningRequestPublicDto) => toLearningRequestEntity(item))),
        catchError(() => of([])),
      );
    }
    return of([]);
  }

  override getReceivedRequests(): Observable<readonly LearningRequest[]> {
    if (isPlatformBrowser(this.platformId) && this.apiService) {
      return this.apiService.getReceivedRequests().pipe(
        map((res) => (res.data || []).map((item: LearningRequestPublicDto) => toLearningRequestEntity(item))),
        catchError(() => of([])),
      );
    }
    return of([]);
  }

  override getRequestById(id: number): Observable<LearningRequest | null> {
    if (isPlatformBrowser(this.platformId) && this.apiService) {
      return this.apiService.getRequestById(id).pipe(
        map((res) => (res.data ? toLearningRequestEntity(res.data) : null)),
        catchError(() => of(null)),
      );
    }
    return of(null);
  }

  override acceptRequest(id: number): Observable<LearningRequest> {
    if (isPlatformBrowser(this.platformId) && this.apiService) {
      return this.apiService.acceptRequest(id).pipe(
        map((res) => toLearningRequestEntity(res.data)),
      );
    }
    throw new Error('Cannot accept request during SSR');
  }

  override rejectRequest(id: number): Observable<LearningRequest> {
    if (isPlatformBrowser(this.platformId) && this.apiService) {
      return this.apiService.rejectRequest(id).pipe(
        map((res) => toLearningRequestEntity(res.data)),
      );
    }
    throw new Error('Cannot reject request during SSR');
  }

  override cancelRequest(id: number): Observable<LearningRequest> {
    if (isPlatformBrowser(this.platformId) && this.apiService) {
      return this.apiService.cancelRequest(id).pipe(
        map((res) => toLearningRequestEntity(res.data)),
      );
    }
    throw new Error('Cannot cancel request during SSR');
  }
}
