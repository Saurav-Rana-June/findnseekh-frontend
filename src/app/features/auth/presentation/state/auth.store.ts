import { isPlatformBrowser } from '@angular/common';
import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, map, of, switchMap } from 'rxjs';
import { ApiError } from '../../../../core/models/api-error.model';
import { PROTOTYPE_MODE, PROTOTYPE_USER_ROLE, PrototypeUserRole } from '../../../../core/config/api.config';
import { AuthSessionService } from '../../../../core/services/auth-session.service';
import {
  AuthUser,
  LoginCredentials,
  RegisterPayload,
  StudentProfile,
  StudentProfileUpdatePayload,
  TeacherProfile,
  TeacherProfileUpdatePayload,
  UserRole,
} from '../../domain/entities/auth.entity';
import { BecomeTeacherUseCase } from '../../domain/use-cases/become-teacher.use-case';
import { GetCurrentUserUseCase } from '../../domain/use-cases/get-current-user.use-case';
import { GetStudentProfileUseCase } from '../../domain/use-cases/get-student-profile.use-case';
import { GetTeacherProfileUseCase } from '../../domain/use-cases/get-teacher-profile.use-case';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { LogoutUseCase } from '../../domain/use-cases/logout.use-case';
import { RegisterUseCase } from '../../domain/use-cases/register.use-case';
import { UpdateStudentProfileUseCase } from '../../domain/use-cases/update-student-profile.use-case';
import { UpdateTeacherProfileUseCase } from '../../domain/use-cases/update-teacher-profile.use-case';

@Injectable()
export class AuthStore {
  private readonly globalPrototypeMode = inject(PROTOTYPE_MODE, { optional: true }) ?? false;
  private readonly globalPrototypeUserRole =
    inject(PROTOTYPE_USER_ROLE, { optional: true }) ?? null;

  /** Set to `false` in production. Controlled globally by environment.prototypeMode. */
  prototypeMode = this.globalPrototypeMode;

  /** Active prototype user role; `null` = guest until login. */
  readonly prototypeUserRole = signal<PrototypeUserRole | null>(this.globalPrototypeUserRole);

  setPrototypeMode(enabled: boolean, role?: PrototypeUserRole): void {
    this.prototypeMode = enabled;
    if (role) {
      this.prototypeUserRole.set(role);
      this.syncPrototypeUserRole();
    }
  }

  setPrototypeUserRole(role: PrototypeUserRole): void {
    this.prototypeUserRole.set(role);
    this.syncPrototypeUserRole();
  }

  private syncPrototypeUserRole(): void {
    if (!this.prototypeMode) return;
    const isTeacher = this.prototypeUserRole() === PrototypeUserRole.TEACHER;
    const user = this._user();
    if (user) {
      this._user.set({
        ...user,
        fullName: isTeacher ? 'Aarav Sharma (Teacher)' : 'Aarav Sharma',
        roles: isTeacher ? ['student', 'teacher'] : ['student'],
      });
      if (isTeacher) {
        this.getTeacherProfile();
      } else {
        this._teacherProfile.set(null);
        this._isTeacherProfileCompleted.set(false);
      }
    }
  }

  private readonly loginUseCase = inject(LoginUseCase);
  private readonly registerUseCase = inject(RegisterUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase, { optional: true });
  private readonly getCurrentUserUseCase = inject(GetCurrentUserUseCase, { optional: true });
  private readonly becomeTeacherUseCase = inject(BecomeTeacherUseCase);
  private readonly getTeacherProfileUseCase = inject(GetTeacherProfileUseCase, { optional: true });
  private readonly updateTeacherProfileUseCase = inject(UpdateTeacherProfileUseCase);
  private readonly getStudentProfileUseCase = inject(GetStudentProfileUseCase);
  private readonly updateStudentProfileUseCase = inject(UpdateStudentProfileUseCase);
  private readonly authSession = inject(AuthSessionService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _user = signal<AuthUser | null>(null);
  private readonly _teacherProfile = signal<TeacherProfile | null>(null);
  private readonly _studentProfile = signal<StudentProfile | null>(null);
  private readonly _isTeacherProfileCompleted = signal(false);
  private readonly _isInitializing = signal(true);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly teacherProfile = this._teacherProfile.asReadonly();
  readonly studentProfile = this._studentProfile.asReadonly();
  readonly isInitializing = this._isInitializing.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly isAuthenticated = computed(() =>
    Boolean(this._user() && this.authSession.isAuthenticated()),
  );

  readonly isTeacher = computed(() =>
    Boolean(this._user()?.roles.includes('teacher')),
  );

  readonly needsTeacherProfileCompletion = computed(() => {
    const user = this._user();
    if (!user || !user.roles.includes('teacher')) {
      return false;
    }
    return !this._isTeacherProfileCompleted();
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initSession();
    } else {
      this._isInitializing.set(false);
    }
  }

  /**
   * Restores authenticated user session and associated profiles on app launch.
   */
  initSession(): void {
    if (this.prototypeMode) {
      if (!this._user() && this.prototypeUserRole() !== null) {
        const isTeacherRole = this.prototypeUserRole() === PrototypeUserRole.TEACHER;
        const mockUser: AuthUser = {
          id: 1,
          email: isTeacherRole ? 'teacher.demo@findnseekh.com' : 'student.demo@findnseekh.com',
          fullName: isTeacherRole ? 'Aarav Sharma (Teacher)' : 'Aarav Sharma',
          phone: '+91 98765 43210',
          roles: isTeacherRole ? ['student', 'teacher'] : ['student'],
          isActive: true,
        };
        this.authSession.setTokens('prototype-mock-jwt-token');
        this._user.set(mockUser);
        this.getStudentProfile();
        if (isTeacherRole) {
          this.getTeacherProfile();
        } else {
          this._teacherProfile.set(null);
          this._isTeacherProfileCompleted.set(false);
        }
      }
      this._isInitializing.set(false);
      return;
    }

    const token = this.authSession.accessToken();
    if (!token || !this.getCurrentUserUseCase) {
      this._isInitializing.set(false);
      return;
    }

    this.getCurrentUserUseCase
      .execute()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._isInitializing.set(false)),
      )
      .subscribe({
        next: (user) => {
          this._user.set(user);
          this.getStudentProfile();
          if (user.roles.includes('teacher')) {
            this.getTeacherProfile();
          }
        },
        error: () => {
          // Token is invalid, expired, or revoked
          this.authSession.clearSession();
          this._user.set(null);
          this._studentProfile.set(null);
          this._teacherProfile.set(null);
        },
      });
  }

  login(credentials: LoginCredentials, onSuccess?: (user: AuthUser) => void): void {
    this._error.set(null);

    if (this.prototypeMode) {
      const isTeacherRole = this.prototypeUserRole() === PrototypeUserRole.TEACHER;
      const mockUser: AuthUser = {
        id: 1,
        email: credentials.email.trim().toLowerCase(),
        fullName: isTeacherRole ? 'Aarav Sharma (Teacher)' : 'Aarav Sharma',
        isActive: true,
        roles: isTeacherRole ? ['student', 'teacher'] : ['student'],
      };
      this.authSession.setTokens('prototype-mock-jwt-token');
      this._user.set(mockUser);
      this.getStudentProfile();
      if (isTeacherRole) {
        this.getTeacherProfile();
      } else {
        this._teacherProfile.set(null);
        this._isTeacherProfileCompleted.set(false);
      }
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
          this.getStudentProfile();
          if (user.roles.includes('teacher')) {
            this.getTeacherProfile();
          }
          onSuccess?.(user);
        },
        error: (err: ApiError) => {
          this._error.set(err.message || 'Invalid email or password.');
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
                this._isTeacherProfileCompleted.set(false);
                return {
                  ...user,
                  roles: user.roles.includes('teacher')
                    ? user.roles
                    : [...user.roles, 'teacher' as const],
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
          this.getStudentProfile();
          onSuccess?.(user);
        },
        error: (err: ApiError) => {
          this._error.set(err.message || 'Registration failed.');
        },
      });
  }

  logout(onSuccess?: () => void): void {
    this._error.set(null);
    this._isLoading.set(true);

    const performLocalCleanup = () => {
      this._user.set(null);
      this._studentProfile.set(null);
      this._teacherProfile.set(null);
      this._isTeacherProfileCompleted.set(false);
      this.authSession.clearSession();
      this._isLoading.set(false);
      onSuccess?.();
    };

    if (this.prototypeMode || !this.logoutUseCase) {
      performLocalCleanup();
      return;
    }

    this.logoutUseCase
      .execute()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => of(undefined)),
        finalize(() => performLocalCleanup()),
      )
      .subscribe();
  }

  becomeTeacher(onSuccess?: (profile: TeacherProfile) => void): void {
    this._error.set(null);

    if (this.prototypeMode) {
      const current = this._user();
      if (current) {
        const roles = current.roles.includes('teacher')
          ? current.roles
          : [...current.roles, 'teacher' as UserRole];
        this._user.set({ ...current, roles });
      }
      const mockProfile: TeacherProfile = {
        id: 1,
        userId: 1,
        bio: null,
        qualification: null,
        skills: [],
        experienceYears: 0,
        city: null,
        state: null,
        teachingMode: 'both',
        isVerified: false,
      };
      this._teacherProfile.set(mockProfile);
      this._isTeacherProfileCompleted.set(false);
      onSuccess?.(mockProfile);
      return;
    }

    this._isLoading.set(true);

    this.becomeTeacherUseCase
      .execute()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._isLoading.set(false)),
      )
      .subscribe({
        next: (profile) => {
          this._teacherProfile.set(profile);
          const current = this._user();
          if (current && !current.roles.includes('teacher')) {
            this._user.set({ ...current, roles: [...current.roles, 'teacher'] });
          }
          this._isTeacherProfileCompleted.set(false);
          onSuccess?.(profile);
        },
        error: (err: ApiError) => {
          this._error.set(err.message || 'Failed to activate teacher role.');
        },
      });
  }

  getTeacherProfile(onSuccess?: (profile: TeacherProfile) => void): void {
    if (this.prototypeMode) {
      if (!this._teacherProfile()) {
        const mockProfile: TeacherProfile = {
          id: 1,
          userId: 1,
          bio: 'Passionate educator with over 7 years of teaching experience across classical and modern music.',
          qualification: 'M.A. Music & Certified Mentor',
          skills: ['Classical Vocals', 'Harmonium', 'Music Theory'],
          experienceYears: 7,
          city: 'Dehradun',
          state: 'Uttarakhand',
          teachingMode: 'both',
          isVerified: true,
          phone: '+91 98765 43210',
        };
        this._teacherProfile.set(mockProfile);
        this._isTeacherProfileCompleted.set(true);
      }
      onSuccess?.(this._teacherProfile()!);
      return;
    }

    if (!this.getTeacherProfileUseCase) {
      return;
    }

    this.getTeacherProfileUseCase
      .execute()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => of(null)),
      )
      .subscribe({
        next: (profile) => {
          if (profile) {
            this._teacherProfile.set(profile);
            const isCompleted = Boolean(
              profile.qualification && profile.skills && profile.skills.length > 0,
            );
            this._isTeacherProfileCompleted.set(isCompleted);
            onSuccess?.(profile);
          }
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
        qualification: payload.qualification ?? null,
        skills: payload.skills ?? ['Guitar', 'Music Theory'],
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
          if (profile.phone && this._user()) {
            this._user.update((u) => (u ? { ...u, phone: profile.phone! } : null));
          }
          onSuccess?.(profile);
        },
        error: (err: ApiError) => {
          this._error.set(err.message || 'Failed to update teacher profile.');
        },
      });
  }

  getStudentProfile(onSuccess?: (profile: StudentProfile) => void): void {
    this._error.set(null);

    if (this.prototypeMode) {
      if (!this._studentProfile()) {
        const mock: StudentProfile = {
          id: 1,
          userId: 1,
          phone: '+91 98765 43210',
          city: 'Bengaluru',
          state: 'Karnataka',
          learningMode: 'both',
          learningLevel: 'beginner',
          learningGoals: 'Looking to learn guitar and improve math fundamentals.',
          skillsToLearn: ['Mathematics', 'Guitar'],
        };
        this._studentProfile.set(mock);
      }
      onSuccess?.(this._studentProfile()!);
      return;
    }

    this.getStudentProfileUseCase
      .execute()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => of(null)),
      )
      .subscribe({
        next: (profile) => {
          if (profile) {
            this._studentProfile.set(profile);
            onSuccess?.(profile);
          }
        },
        error: (err: ApiError) => {
          this._error.set(err.message || 'Failed to fetch student profile.');
        },
      });
  }

  updateStudentProfile(
    payload: StudentProfileUpdatePayload,
    onSuccess?: (profile: StudentProfile) => void,
  ): void {
    this._error.set(null);

    if (this.prototypeMode) {
      const current = this._studentProfile();
      const updated: StudentProfile = {
        id: current?.id ?? 1,
        userId: current?.userId ?? 1,
        phone: payload.phone ?? current?.phone ?? null,
        city: payload.city ?? current?.city ?? null,
        state: payload.state ?? current?.state ?? null,
        learningMode: payload.learningMode ?? current?.learningMode ?? 'both',
        learningLevel: payload.learningLevel ?? current?.learningLevel ?? 'beginner',
        learningGoals: payload.learningGoals ?? current?.learningGoals ?? null,
        skillsToLearn: payload.skillsToLearn ?? current?.skillsToLearn ?? ['Mathematics', 'Guitar'],
      };
      this._studentProfile.set(updated);
      onSuccess?.(updated);
      return;
    }

    this._isLoading.set(true);

    this.updateStudentProfileUseCase
      .execute(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._isLoading.set(false)),
      )
      .subscribe({
        next: (profile) => {
          this._studentProfile.set(profile);
          if (profile.phone && this._user()) {
            this._user.update((u) => (u ? { ...u, phone: profile.phone! } : null));
          }
          onSuccess?.(profile);
        },
        error: (err: ApiError) => {
          this._error.set(err.message || 'Failed to update student profile.');
        },
      });
  }

  clearError(): void {
    this._error.set(null);
  }
}
