import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/config/api.config';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ApiHttpService } from '../../../../core/services/api-http.service';
import {
  SkillListingCreateDto,
  SkillListingReadDto,
  SkillListingStatusDto,
  SkillListingUpdateDto,
} from '../models/teaching-listing.dto';

@Injectable({ providedIn: 'root' })
export class ListingsApiService {
  private readonly api = inject(ApiHttpService);

  getMyListings(): Observable<ApiResponse<SkillListingReadDto[]>> {
    return this.api.get<ApiResponse<SkillListingReadDto[]>>(API_ENDPOINTS.skills.mySkills);
  }

  getListingById(id: number | string): Observable<ApiResponse<SkillListingReadDto>> {
    return this.api.get<ApiResponse<SkillListingReadDto>>(API_ENDPOINTS.skills.detail(id));
  }

  createListing(dto: SkillListingCreateDto): Observable<ApiResponse<SkillListingReadDto>> {
    return this.api.post<ApiResponse<SkillListingReadDto>, SkillListingCreateDto>(
      API_ENDPOINTS.skills.create,
      dto,
    );
  }

  updateListing(
    id: number | string,
    dto: SkillListingUpdateDto,
  ): Observable<ApiResponse<SkillListingReadDto>> {
    return this.api.put<ApiResponse<SkillListingReadDto>, SkillListingUpdateDto>(
      API_ENDPOINTS.skills.update(id),
      dto,
    );
  }

  updateListingStatus(
    id: number | string,
    status: string,
  ): Observable<ApiResponse<SkillListingReadDto>> {
    return this.api.patch<ApiResponse<SkillListingReadDto>, SkillListingStatusDto>(
      API_ENDPOINTS.skills.updateStatus(id),
      { status },
    );
  }

  deleteListing(id: number | string): Observable<ApiResponse<SkillListingReadDto>> {
    return this.api.delete<ApiResponse<SkillListingReadDto>>(API_ENDPOINTS.skills.delete(id));
  }
}
