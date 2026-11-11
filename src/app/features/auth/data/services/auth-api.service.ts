import { HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS, SKIP_AUTH } from '../../../../core/config/api.config';
import { ApiHttpService } from '../../../../core/services/api-http.service';
import { AuthUserDto, LoginRequestDto, TokenResponseDto } from '../models/auth.dto';

@Injectable()
export class AuthApiService {
  private readonly api = inject(ApiHttpService);

  login(payload: LoginRequestDto): Observable<TokenResponseDto> {
    return this.api.post<TokenResponseDto, LoginRequestDto>(API_ENDPOINTS.auth.login, payload, {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
  }

  getCurrentUser(): Observable<AuthUserDto> {
    return this.api.get<AuthUserDto>(API_ENDPOINTS.auth.me);
  }

  logout(): Observable<void> {
    return this.api.post<void, Record<string, never>>(API_ENDPOINTS.auth.logout, {});
  }
}

