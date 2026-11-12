import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, map, of, switchMap } from 'rxjs';
import { ApiError } from '../../../../core/models/api-error.model';
import { AuthSessionService } from '../../../../core/services/auth-session.service';
import {
  AuthUser,
  LoginCredentials,
  RegisterPayload,
  TeacherProfile,
  TeacherProfileUpdatePayload,
  UserRole,
} from '../../domain/entities/auth.entity';
import { BecomeTeacherUseCase } from '../../domain/use-cases/become-teacher.use-case';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { RegisterUseCase } from '../../domain/use-cases/register.use-case';
import { UpdateTeacherProfileUseCase } from '../../domain/use-cases/update-teacher-profile.use-case';

@Injectable()
export class AuthStore {
  /** Set to `false` when connecting to the live backend API. */
  private readonly prototypeMode = true;

  private readonly loginUseCase = inject(LoginUseCase);
  private readonly registerUseCase = inject(RegisterUseCase);
  private readonly becomeTeacherUseCase = inject(BecomeTeacherUseCase);
  private readonly updateTeacherProfileUseCase = inject(UpdateTeacherProfileUseCase);
  private readonly authSession = inject(AuthSessionService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _user = signal<AuthUser | null>(null);
  private readonly _teacherProfile = signal<TeacherProfile | null>(null);
  private readonly _isTeacherProfileCompleted = signal(false);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly teacherProfile = this._teacherProfile.asReadonly();
  readonly needsTeacherProfileCompletion = computed(
    () => Boolean(this._user()?.roles.includes('teacher')) && !this._isTeacherProfileCompleted(),
  );
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  login(credentials: LoginCredentials, onSuccess?: (user: AuthUser) => void): void {
    this._error.set(null);

    if (this.prototypeMode) {
      const mockUser: AuthUser = {
        id: 1,
        email: credentials.email.trim().toLowerCase(),
        fullName: 'Demo User',
        isActive: true,
        roles: ['student'],
      };
      this.authSession.setTokens('prototype-mock-jwt-token');
      this._user.set(mockUser);
      onSuccess?.(mockUser);
      return;
    }

    this._isLoading.set(true);

    this.loginUseCase
      .execute(credentials)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._isLoading.set(false)),
      )
      .subscribe({
        next: (user) => {
          this._user.set(user);
          onSuccess?.(user);
        },
        error: (err: ApiError) => {
          this._error.set(err.message);
        },
      });
  }

  register(
    payload: RegisterPayload,
    role: UserRole,
    onSuccess?: (user: AuthUser) => void,
  ): void {
    this._error.set(null);

    if (this.prototypeMode) {
      const mockUser: AuthUser = {
        id: 1,
        email: payload.email.trim().toLowerCase(),
        fullName: payload.name.trim(),
        isActive: true,
        roles: role === 'teacher' ? ['student', 'teacher'] : ['student'],
      };
      if (role === 'teacher') {
        this._isTeacherProfileCompleted.set(false);
        this._teacherProfile.set({
          id: 1,
          userId: 1,
          bio: null,
          experienceYears: 0,
          city: null,
          state: null,
          teachingMode: 'both',
          isVerified: false,
        });
      }
      this.authSession.setTokens('prototype-mock-jwt-token');
      this._user.set(mockUser);
      onSuccess?.(mockUser);
      return;
    }

    this._isLoading.set(true);

    this.registerUseCase
      .execute(payload)
      .pipe(
        switchMap((user) => {
          if (role === 'teacher') {
            return this.becomeTeacherUseCase.execute().pipe(
              map((profile) => {
                this._teacherProfile.set(profile);
                return {
                  ...user,
                  roles: user.roles.includes('teacher') ? user.roles : [...user.roles, 'teacher'],
                } satisfies AuthUser;
              }),
            );
          }
          return of(user);
        }),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._isLoading.set(false)),
      )
      .subscribe({
        next: (user) => {
          this._user.set(user);
          onSuccess?.(user);
        },
        error: (err: ApiError) => {
          this._error.set(err.message);
        },
      });
  }

  updateTeacherProfile(
    payload: TeacherProfileUpdatePayload,
    onSuccess?: (profile: TeacherProfile) => void,
  ): void {
    this._error.set(null);

    if (this.prototypeMode) {
      const mockProfile: TeacherProfile = {
        id: 1,
        userId: 1,
        bio: payload.bio ?? null,
        experienceYears: payload.experienceYears ?? 0,
        city: payload.city ?? null,
        state: payload.state ?? null,
        teachingMode: payload.teachingMode ?? 'both',
        isVerified: false,
      };
      this._teacherProfile.set(mockProfile);
      this._isTeacherProfileCompleted.set(true);
      onSuccess?.(mockProfile);
      return;
    }

    this._isLoading.set(true);

    this.updateTeacherProfileUseCase
      .execute(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._isLoading.set(false)),
      )
      .subscribe({
        next: (profile) => {
          this._teacherProfile.set(profile);
          this._isTeacherProfileCompleted.set(true);
          onSuccess?.(profile);
        },
        error: (err: ApiError) => {
          this._error.set(err.message);
        },
      });
  }

  clearError(): void {
    this._error.set(null);
  }
}
