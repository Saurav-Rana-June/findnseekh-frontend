import { inject, Injectable } from '@angular/core';
import { finalize, map, Observable, tap } from 'rxjs';
import { AuthSessionService } from '../../../../core/services/auth-session.service';
import { AuthUser, LoginCredentials } from '../../domain/entities/auth.entity';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { toAuthTokens, toAuthUser, toLoginRequestDto } from '../models/auth.dto';
import { AuthApiService } from '../services/auth-api.service';

@Injectable()
export class AuthRepositoryImpl extends AuthRepository {
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSessionService);

  override login(credentials: LoginCredentials): Observable<AuthUser> {
    return this.authApi.login(toLoginRequestDto(credentials)).pipe(
      tap((response) => {
        const tokens = toAuthTokens(response);
        this.authSession.setTokens(tokens.accessToken, tokens.refreshToken);
      }),
      map((response) => toAuthUser(response.user)),
    );
  }

  override getCurrentUser(): Observable<AuthUser> {
    return this.authApi.getCurrentUser().pipe(map(toAuthUser));
  }

  override logout(): Observable<void> {
    return this.authApi.logout().pipe(
      finalize(() => {
        this.authSession.clearSession();
      }),
    );
  }
}

