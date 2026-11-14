import { HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS, SKIP_AUTH } from '../../../../core/config/api.config';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ApiHttpService } from '../../../../core/services/api-http.service';
import {
  AuthUserDto,
  LoginRequestDto,
  RegisterRequestDto,
  StudentProfileDto,
  StudentProfileUpdateRequestDto,
  TeacherProfileDto,
  TeacherProfileUpdateRequestDto,
  TokenResponseDto,
  UserUpdateRequestDto,
} from '../models/auth.dto';

@Injectable()
export class AuthApiService {
  private readonly api = inject(ApiHttpService);

  login(payload: LoginRequestDto): Observable<ApiResponse<TokenResponseDto>> {
    return this.api.post<ApiResponse<TokenResponseDto>, LoginRequestDto>(
      API_ENDPOINTS.auth.login,
      payload,
      { context: new HttpContext().set(SKIP_AUTH, true) },
    );
  }

  register(payload: RegisterRequestDto): Observable<ApiResponse<AuthUserDto>> {
    return this.api.post<ApiResponse<AuthUserDto>, RegisterRequestDto>(
      API_ENDPOINTS.auth.register,
      payload,
      { context: new HttpContext().set(SKIP_AUTH, true) },
    );
  }

  getCurrentUser(): Observable<ApiResponse<AuthUserDto>> {
    return this.api.get<ApiResponse<AuthUserDto>>(API_ENDPOINTS.auth.me);
  }

  updateCurrentUser(payload: UserUpdateRequestDto): Observable<ApiResponse<AuthUserDto>> {
    return this.api.put<ApiResponse<AuthUserDto>, UserUpdateRequestDto>(
      API_ENDPOINTS.auth.me,
      payload,
    );
  }

  becomeTeacher(): Observable<ApiResponse<TeacherProfileDto>> {
    return this.api.post<ApiResponse<TeacherProfileDto>, Record<string, never>>(
      API_ENDPOINTS.auth.becomeTeacher,
      {},
    );
  }

  updateTeacherProfile(
    payload: TeacherProfileUpdateRequestDto,
  ): Observable<ApiResponse<TeacherProfileDto>> {
    return this.api.put<ApiResponse<TeacherProfileDto>, TeacherProfileUpdateRequestDto>(
      API_ENDPOINTS.auth.teacherProfileMe,
      payload,
    );
  }

  getStudentProfile(): Observable<ApiResponse<StudentProfileDto>> {
    return this.api.get<ApiResponse<StudentProfileDto>>(API_ENDPOINTS.auth.studentProfileMe);
  }

  updateStudentProfile(
    payload: StudentProfileUpdateRequestDto,
  ): Observable<ApiResponse<StudentProfileDto>> {
    return this.api.put<ApiResponse<StudentProfileDto>, StudentProfileUpdateRequestDto>(
      API_ENDPOINTS.auth.studentProfileMe,
      payload,
    );
  }

  logout(): Observable<ApiResponse<null>> {
    return this.api.post<ApiResponse<null>, Record<string, never>>(API_ENDPOINTS.auth.logout, {});
  }
}
