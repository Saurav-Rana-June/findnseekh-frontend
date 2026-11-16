import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { finalize, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { PROTOTYPE_MODE } from '../../../../core/config/api.config';
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

const MOCK_PROTOTYPE_USER: AuthUser = {
  id: 1,
  email: 'demo@findnseekh.com',
  fullName: 'Aarav Sharma',
  phone: '+91 98765 43210',
  roles: ['student', 'teacher'],
  isActive: true,
};

const MOCK_PROTOTYPE_STUDENT_PROFILE: StudentProfile = {
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

const MOCK_PROTOTYPE_TEACHER_PROFILE: TeacherProfile = {
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

@Injectable()
export class AuthRepositoryImpl extends AuthRepository {
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSessionService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly prototypeMode = inject(PROTOTYPE_MODE, { optional: true }) ?? false;

  override login(credentials: LoginCredentials): Observable<AuthUser> {
    if (this.prototypeMode) {
      this.authSession.setTokens('prototype-mock-jwt-token');
      return of({
        ...MOCK_PROTOTYPE_USER,
        email: credentials.email.trim().toLowerCase(),
      });
    }

    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('Login unavailable during server rendering.'));
    }
    return this.authApi.login(toLoginRequestDto(credentials)).pipe(
      tap((response) => {
        const tokens = toAuthTokens(response.data);
        this.authSession.setTokens(tokens.accessToken);
      }),
      switchMap(() => this.getCurrentUser()),
    );
  }

  override register(payload: RegisterPayload): Observable<AuthUser> {
    if (this.prototypeMode) {
      this.authSession.setTokens('prototype-mock-jwt-token');
      return of({
        ...MOCK_PROTOTYPE_USER,
        email: payload.email.trim().toLowerCase(),
        fullName: payload.name.trim(),
      });
    }

    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('Registration unavailable during server rendering.'));
    }
    return this.authApi
      .register(toRegisterRequestDto(payload))
      .pipe(switchMap(() => this.login({ email: payload.email, password: payload.password })));
  }

  override getCurrentUser(): Observable<AuthUser> {
    if (this.prototypeMode) {
      return of(MOCK_PROTOTYPE_USER);
    }

    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('Current user unavailable during server rendering.'));
    }
    return this.authApi.getCurrentUser().pipe(map((response) => toAuthUser(response.data)));
  }

  override becomeTeacher(): Observable<TeacherProfile> {
    if (this.prototypeMode) {
      return of(MOCK_PROTOTYPE_TEACHER_PROFILE);
    }

    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('Become teacher unavailable during server rendering.'));
    }
    return this.authApi.becomeTeacher().pipe(map((response) => toTeacherProfile(response.data)));
  }

  override getTeacherProfile(): Observable<TeacherProfile> {
    if (this.prototypeMode) {
      return of(MOCK_PROTOTYPE_TEACHER_PROFILE);
    }

    if (!isPlatformBrowser(this.platformId)) {
      return of(null as any);
    }
    return this.authApi
      .getTeacherProfile()
      .pipe(map((response) => toTeacherProfile(response.data)));
  }

  override updateTeacherProfile(
    payload: TeacherProfileUpdatePayload,
  ): Observable<TeacherProfile> {
    if (this.prototypeMode) {
      return of({
        ...MOCK_PROTOTYPE_TEACHER_PROFILE,
        bio: payload.bio ?? MOCK_PROTOTYPE_TEACHER_PROFILE.bio,
        qualification: payload.qualification ?? MOCK_PROTOTYPE_TEACHER_PROFILE.qualification,
        skills: payload.skills ?? MOCK_PROTOTYPE_TEACHER_PROFILE.skills,
        experienceYears: payload.experienceYears ?? MOCK_PROTOTYPE_TEACHER_PROFILE.experienceYears,
        city: payload.city ?? MOCK_PROTOTYPE_TEACHER_PROFILE.city,
        state: payload.state ?? MOCK_PROTOTYPE_TEACHER_PROFILE.state,
        teachingMode: payload.teachingMode ?? MOCK_PROTOTYPE_TEACHER_PROFILE.teachingMode,
        phone: payload.phone ?? MOCK_PROTOTYPE_TEACHER_PROFILE.phone,
      });
    }

    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('Profile update unavailable during server rendering.'));
    }
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
    if (this.prototypeMode) {
      return of(MOCK_PROTOTYPE_STUDENT_PROFILE);
    }

    if (!isPlatformBrowser(this.platformId)) {
      return of(null as any);
    }
    return this.authApi
      .getStudentProfile()
      .pipe(map((response) => toStudentProfile(response.data)));
  }

  override updateStudentProfile(
    payload: StudentProfileUpdatePayload,
  ): Observable<StudentProfile> {
    if (this.prototypeMode) {
      return of({
        ...MOCK_PROTOTYPE_STUDENT_PROFILE,
        phone: payload.phone ?? MOCK_PROTOTYPE_STUDENT_PROFILE.phone,
        city: payload.city ?? MOCK_PROTOTYPE_STUDENT_PROFILE.city,
        state: payload.state ?? MOCK_PROTOTYPE_STUDENT_PROFILE.state,
        learningMode: payload.learningMode ?? MOCK_PROTOTYPE_STUDENT_PROFILE.learningMode,
        learningLevel: payload.learningLevel ?? MOCK_PROTOTYPE_STUDENT_PROFILE.learningLevel,
        learningGoals: payload.learningGoals ?? MOCK_PROTOTYPE_STUDENT_PROFILE.learningGoals,
        skillsToLearn: payload.skillsToLearn ?? MOCK_PROTOTYPE_STUDENT_PROFILE.skillsToLearn,
      });
    }

    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('Profile update unavailable during server rendering.'));
    }
    return this.authApi
      .updateStudentProfile(toStudentProfileUpdateRequestDto(payload))
      .pipe(map((response) => toStudentProfile(response.data)));
  }

  override logout(): Observable<void> {
    if (this.prototypeMode) {
      this.authSession.clearSession();
      return of(undefined);
    }

    if (!isPlatformBrowser(this.platformId)) {
      return of(undefined);
    }
    return this.authApi.logout().pipe(
      map(() => undefined),
      finalize(() => {
        this.authSession.clearSession();
      }),
    );
  }
}
