import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/config/api.config';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ApiHttpService } from '../../../../core/services/api-http.service';
import {
  CategoryDto,
  HomeOverviewDto,
  LocationSuggestionDto,
  PopularSkillDto,
  TeacherCardDto,
} from '../models/home.dto';

@Injectable()
export class HomeApiService {
  private readonly api = inject(ApiHttpService);

  getOverview(): Observable<ApiResponse<HomeOverviewDto>> {
    return this.api.get<ApiResponse<HomeOverviewDto>>(API_ENDPOINTS.home.overview);
  }

  getPopularSkills(limit: number = 8): Observable<ApiResponse<readonly PopularSkillDto[]>> {
    return this.api.get<ApiResponse<readonly PopularSkillDto[]>>(API_ENDPOINTS.skills.popular, {
      params: { limit },
    });
  }

  getSkillSuggestions(
    query?: string,
    limit: number = 10,
  ): Observable<ApiResponse<readonly PopularSkillDto[]>> {
    return this.api.get<ApiResponse<readonly PopularSkillDto[]>>(API_ENDPOINTS.skills.suggestions, {
      params: { query, limit },
    });
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

  getFeaturedTeachers(
    limit: number = 6,
    category?: string,
  ): Observable<ApiResponse<readonly TeacherCardDto[]>> {
    return this.api.get<ApiResponse<readonly TeacherCardDto[]>>(API_ENDPOINTS.teachers.featured, {
      params: { limit, category },
    });
  }

  getCategories(): Observable<ApiResponse<readonly CategoryDto[]>> {
    return this.api.get<ApiResponse<readonly CategoryDto[]>>(API_ENDPOINTS.categories.list);
  }
}

