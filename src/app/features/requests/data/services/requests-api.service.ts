import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/config/api.config';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ApiHttpService } from '../../../../core/services/api-http.service';
import {
  LearningRequestPublicDto,
  LearningRequestReadDto,
} from '../models/learning-request.dto';

@Injectable({ providedIn: 'root' })
export class RequestsApiService {
  private readonly api = inject(ApiHttpService);

  getSentRequests(): Observable<ApiResponse<LearningRequestPublicDto[]>> {
    return this.api.get<ApiResponse<LearningRequestPublicDto[]>>(API_ENDPOINTS.requests.sent);
  }

  getReceivedRequests(): Observable<ApiResponse<LearningRequestPublicDto[]>> {
    return this.api.get<ApiResponse<LearningRequestPublicDto[]>>(API_ENDPOINTS.requests.received);
  }

  getRequestById(id: number | string): Observable<ApiResponse<LearningRequestPublicDto>> {
    return this.api.get<ApiResponse<LearningRequestPublicDto>>(API_ENDPOINTS.requests.detail(id));
  }

  acceptRequest(id: number | string): Observable<ApiResponse<LearningRequestReadDto>> {
    return this.api.patch<ApiResponse<LearningRequestReadDto>, Record<string, never>>(
      API_ENDPOINTS.requests.accept(id),
      {},
    );
  }

  rejectRequest(id: number | string): Observable<ApiResponse<LearningRequestReadDto>> {
    return this.api.patch<ApiResponse<LearningRequestReadDto>, Record<string, never>>(
      API_ENDPOINTS.requests.reject(id),
      {},
    );
  }

  cancelRequest(id: number | string): Observable<ApiResponse<LearningRequestReadDto>> {
    return this.api.patch<ApiResponse<LearningRequestReadDto>, Record<string, never>>(
      API_ENDPOINTS.requests.cancel(id),
      {},
    );
  }
}
