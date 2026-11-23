import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/config/api.config';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ApiHttpService, QueryParamsInput } from '../../../../core/services/api-http.service';
import { CategoryDto } from '../../../home/data/models/home.dto';
import {
  SkillListingCreateDto,
  SkillListingReadDto,
  SkillListingStatusDto,
  SkillListingUpdateDto,
} from '../models/teaching-listing.dto';

export type SkillListingSearchParams = QueryParamsInput;

@Injectable({ providedIn: 'root' })
export class ListingsApiService {
  private readonly api = inject(ApiHttpService);

  getCategories(): Observable<ApiResponse<readonly CategoryDto[]>> {
    return this.api.get<ApiResponse<readonly CategoryDto[]>>(API_ENDPOINTS.categories.list);
  }

  getCategoryById(id: number | string): Observable<ApiResponse<CategoryDto>> {
    return this.api.get<ApiResponse<CategoryDto>>(API_ENDPOINTS.categories.detail(id));
  }

  browsePublishedListings(page = 1, pageSize = 20): Observable<ApiResponse<SkillListingReadDto[]>> {
    return this.api.get<ApiResponse<SkillListingReadDto[]>>(API_ENDPOINTS.skills.list, {
      params: { page, page_size: pageSize },
    });
  }

  searchPublishedListings(
    params: SkillListingSearchParams,
  ): Observable<ApiResponse<SkillListingReadDto[]>> {
    return this.api.get<ApiResponse<SkillListingReadDto[]>>(API_ENDPOINTS.skills.search, { params });
  }

  getTeacherPublishedListings(userId: number | string): Observable<ApiResponse<SkillListingReadDto[]>> {
    return this.api.get<ApiResponse<SkillListingReadDto[]>>(API_ENDPOINTS.skills.byTeacher(userId));
  }

  getCategoryPublishedListings(
    categoryId: number | string,
  ): Observable<ApiResponse<SkillListingReadDto[]>> {
    return this.api.get<ApiResponse<SkillListingReadDto[]>>(
      API_ENDPOINTS.skills.byCategory(categoryId),
    );
  }

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
