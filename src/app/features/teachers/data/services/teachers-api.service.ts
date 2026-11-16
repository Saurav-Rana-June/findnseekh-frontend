import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/config/api.config';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ApiHttpService } from '../../../../core/services/api-http.service';
import {
  CategoryDto,
  LocationSuggestionDto,
  PopularSkillDto,
} from '../../../home/data/models/home.dto';
import { TeacherFilterQuery } from '../../domain/entities/teacher.entity';
import {
  TeacherDetailDto,
  TeacherEnquiryRequestDto,
  TeacherEnquiryResponseDto,
  TeacherPaginationDto,
} from '../models/teacher.dto';

@Injectable()
export class TeachersApiService {
  private readonly api = inject(ApiHttpService);

  getTeachers(filter?: TeacherFilterQuery): Observable<ApiResponse<TeacherPaginationDto>> {
    const params: Record<string, string | number> = {};

    if (filter?.query) {
      params['q'] = filter.query;
    }
    if (filter?.location) {
      params['city'] = filter.location;
    }
    if (filter?.category && filter.category !== 'all') {
      params['category'] = filter.category;
    }
    if (filter?.mode && filter.mode !== 'all') {
      params['mode'] = filter.mode;
    }
    if (filter?.minExperience && filter.minExperience > 0) {
      params['min_exp'] = filter.minExperience;
    }
    if (filter?.sortBy) {
      params['sort'] = filter.sortBy;
    }
    params['page'] = 1;
    params['page_size'] = 36;

    return this.api.get<ApiResponse<TeacherPaginationDto>>(API_ENDPOINTS.teachers.list, {
      params,
    });
  }

  getCategories(): Observable<ApiResponse<readonly CategoryDto[]>> {
    return this.api.get<ApiResponse<readonly CategoryDto[]>>(API_ENDPOINTS.categories.list);
  }

  getLocationSuggestions(
    query?: string,
    limit: number = 10,
  ): Observable<ApiResponse<readonly LocationSuggestionDto[]>> {
    return this.api.get<ApiResponse<readonly LocationSuggestionDto[]>>(
      API_ENDPOINTS.locations.suggestions,
      {
        params: { q: query, limit },
      },
    );
  }

  getSkillSuggestions(
    query?: string,
    limit: number = 10,
  ): Observable<ApiResponse<readonly PopularSkillDto[]>> {
    return this.api.get<ApiResponse<readonly PopularSkillDto[]>>(API_ENDPOINTS.skills.suggestions, {
      params: { query, limit },
    });
  }

  getPopularSkills(limit: number = 10): Observable<ApiResponse<readonly PopularSkillDto[]>> {
    return this.api.get<ApiResponse<readonly PopularSkillDto[]>>(API_ENDPOINTS.skills.popular, {
      params: { limit },
    });
  }

  getTeacherDetail(userId: string | number): Observable<ApiResponse<TeacherDetailDto>> {
    return this.api.get<ApiResponse<TeacherDetailDto>>(API_ENDPOINTS.teachers.detail(userId));
  }

  sendEnquiry(
    userId: string | number,
    body: TeacherEnquiryRequestDto,
  ): Observable<ApiResponse<TeacherEnquiryResponseDto>> {
    return this.api.post<ApiResponse<TeacherEnquiryResponseDto>>(
      API_ENDPOINTS.teachers.enquiry(userId),
      body,
    );
  }
}


