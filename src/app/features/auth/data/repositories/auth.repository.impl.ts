import { inject, Injectable } from '@angular/core';
import { finalize, map, Observable, switchMap, tap } from 'rxjs';
import { AuthSessionService } from '../../../../core/services/auth-session.service';
import {
  AuthUser,
  LoginCredentials,
  RegisterPayload,
  StudentProfile,
  StudentProfileUpdatePayload,
  TeacherProfile,
  TeacherProfileUpdatePayload,
} from '../../domain/entities/auth.entity';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import {
  toAuthTokens,
  toAuthUser,
  toLoginRequestDto,
  toRegisterRequestDto,
  toStudentProfile,
  toStudentProfileUpdateRequestDto,
  toTeacherProfile,
  toTeacherProfileUpdateRequestDto,
} from '../models/auth.dto';
import { AuthApiService } from '../services/auth-api.service';

@Injectable()
export class AuthRepositoryImpl extends AuthRepository {
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSessionService);

  override login(credentials: LoginCredentials): Observable<AuthUser> {
    return this.authApi.login(toLoginRequestDto(credentials)).pipe(
      tap((response) => {
        const tokens = toAuthTokens(response.data);
        this.authSession.setTokens(tokens.accessToken);
      }),
      switchMap(() => this.getCurrentUser()),
    );
  }

  override register(payload: RegisterPayload): Observable<AuthUser> {
    return this.authApi
      .register(toRegisterRequestDto(payload))
      .pipe(switchMap(() => this.login({ email: payload.email, password: payload.password })));
  }

  override getCurrentUser(): Observable<AuthUser> {
    return this.authApi.getCurrentUser().pipe(map((response) => toAuthUser(response.data)));
  }

  override becomeTeacher(): Observable<TeacherProfile> {
    return this.authApi.becomeTeacher().pipe(map((response) => toTeacherProfile(response.data)));
  }

  override updateTeacherProfile(
    payload: TeacherProfileUpdatePayload,
  ): Observable<TeacherProfile> {
    const profile$ = this.authApi
      .updateTeacherProfile(toTeacherProfileUpdateRequestDto(payload))
      .pipe(map((response) => toTeacherProfile(response.data)));

    const trimmedPhone = payload.phone?.trim();
    if (trimmedPhone) {
      return this.authApi
        .updateCurrentUser({ phone: trimmedPhone })
        .pipe(switchMap(() => profile$));
    }

    return profile$;
  }

  override getStudentProfile(): Observable<StudentProfile> {
    return this.authApi
      .getStudentProfile()
      .pipe(map((response) => toStudentProfile(response.data)));
  }

  override updateStudentProfile(
    payload: StudentProfileUpdatePayload,
  ): Observable<StudentProfile> {
    return this.authApi
      .updateStudentProfile(toStudentProfileUpdateRequestDto(payload))
      .pipe(map((response) => toStudentProfile(response.data)));
  }

  override logout(): Observable<void> {
    return this.authApi.logout().pipe(
      map(() => undefined),
      finalize(() => {
        this.authSession.clearSession();
      }),
    );
  }
}
