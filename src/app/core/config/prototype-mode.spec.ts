import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { AuthRepositoryImpl } from '../../features/auth/data/repositories/auth.repository.impl';
import { AuthStore } from '../../features/auth/presentation/state/auth.store';
import { HomeRepositoryImpl } from '../../features/home/data/repositories/home.repository.impl';
import { RequestsRepositoryImpl } from '../../features/requests/data/repositories/requests.repository.impl';
import { TeachersRepositoryImpl } from '../../features/teachers/data/repositories/teachers.repository.impl';
import { PROTOTYPE_MODE, PROTOTYPE_USER_ROLE, PrototypeUserRole } from './api.config';
import { LoginUseCase } from '../../features/auth/domain/use-cases/login.use-case';
import { RegisterUseCase } from '../../features/auth/domain/use-cases/register.use-case';
import { BecomeTeacherUseCase } from '../../features/auth/domain/use-cases/become-teacher.use-case';
import { GetStudentProfileUseCase } from '../../features/auth/domain/use-cases/get-student-profile.use-case';
import { UpdateStudentProfileUseCase } from '../../features/auth/domain/use-cases/update-student-profile.use-case';
import { UpdateTeacherProfileUseCase } from '../../features/auth/domain/use-cases/update-teacher-profile.use-case';
import { AuthApiService } from '../../features/auth/data/services/auth-api.service';

describe('Global Prototype Mode', () => {
  it('returns mock dummy data without external APIs when prototypeMode is true', async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PROTOTYPE_MODE, useValue: true },
        { provide: PROTOTYPE_USER_ROLE, useValue: PrototypeUserRole.STUDENT },
        HomeRepositoryImpl,
        TeachersRepositoryImpl,
        RequestsRepositoryImpl,
      ],
    });

    const homeRepo = TestBed.inject(HomeRepositoryImpl);
    const teachersRepo = TestBed.inject(TeachersRepositoryImpl);
    const requestsRepo = TestBed.inject(RequestsRepositoryImpl);

    const overview = await firstValueFrom(homeRepo.getOverview());
    expect(overview.categories.length).toBeGreaterThan(0);
    expect(overview.popularSkills.length).toBeGreaterThan(0);

    const teachers = await firstValueFrom(teachersRepo.getTeachers());
    expect(teachers.length).toBeGreaterThan(0);
    expect(teachers[0].name).toBeDefined();

    const sent = await firstValueFrom(requestsRepo.getSentRequests());
    expect(sent.length).toBeGreaterThan(0);
    expect(sent[0].studentName).toBe('Aarav Sharma');

    const received = await firstValueFrom(requestsRepo.getReceivedRequests());
    expect(received.length).toBeGreaterThan(0);
    expect(received[0].teacherName).toBe('Aarav Sharma');
  });

  it('adapts AuthStore and repository when prototypeUserRole is STUDENT', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PROTOTYPE_MODE, useValue: true },
        { provide: PROTOTYPE_USER_ROLE, useValue: PrototypeUserRole.STUDENT },
        { provide: AuthApiService, useValue: {} },
        { provide: LoginUseCase, useValue: { execute: () => of() } },
        { provide: RegisterUseCase, useValue: { execute: () => of() } },
        { provide: BecomeTeacherUseCase, useValue: { execute: () => of() } },
        { provide: GetStudentProfileUseCase, useValue: { execute: () => of() } },
        { provide: UpdateStudentProfileUseCase, useValue: { execute: () => of() } },
        { provide: UpdateTeacherProfileUseCase, useValue: { execute: () => of() } },
        AuthStore,
        AuthRepositoryImpl,
      ],
    });

    const authStore = TestBed.inject(AuthStore);
    const authRepo = TestBed.inject(AuthRepositoryImpl);

    expect(authStore.prototypeMode).toBe(true);
    expect(authStore.prototypeUserRole()).toBe(PrototypeUserRole.STUDENT);
    expect(authStore.isTeacher()).toBe(false);
    expect(authStore.user()?.roles).toContain('student');
    expect(authStore.user()?.roles).not.toContain('teacher');
    expect(authStore.teacherProfile()).toBeNull();
  });

  it('adapts AuthStore and repository when prototypeUserRole is TEACHER', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PROTOTYPE_MODE, useValue: true },
        { provide: PROTOTYPE_USER_ROLE, useValue: PrototypeUserRole.TEACHER },
        { provide: AuthApiService, useValue: {} },
        { provide: LoginUseCase, useValue: { execute: () => of() } },
        { provide: RegisterUseCase, useValue: { execute: () => of() } },
        { provide: BecomeTeacherUseCase, useValue: { execute: () => of() } },
        { provide: GetStudentProfileUseCase, useValue: { execute: () => of() } },
        { provide: UpdateStudentProfileUseCase, useValue: { execute: () => of() } },
        { provide: UpdateTeacherProfileUseCase, useValue: { execute: () => of() } },
        AuthStore,
        AuthRepositoryImpl,
      ],
    });

    const authStore = TestBed.inject(AuthStore);
    const authRepo = TestBed.inject(AuthRepositoryImpl);

    expect(authStore.prototypeMode).toBe(true);
    expect(authStore.prototypeUserRole()).toBe(PrototypeUserRole.TEACHER);
    expect(authStore.isTeacher()).toBe(true);
    expect(authStore.user()?.roles).toContain('teacher');
    expect(authStore.teacherProfile()).not.toBeNull();
  });
});
