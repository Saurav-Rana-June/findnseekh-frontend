import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { HomeRepositoryImpl } from '../../features/home/data/repositories/home.repository.impl';
import { RequestsRepositoryImpl } from '../../features/requests/data/repositories/requests.repository.impl';
import { TeachersRepositoryImpl } from '../../features/teachers/data/repositories/teachers.repository.impl';
import { PROTOTYPE_MODE } from './api.config';

describe('Global Prototype Mode', () => {
  it('returns mock dummy data without external APIs when prototypeMode is true', async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PROTOTYPE_MODE, useValue: true },
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
});

