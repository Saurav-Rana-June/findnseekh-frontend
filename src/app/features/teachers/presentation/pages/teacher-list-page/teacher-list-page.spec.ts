import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { TeachersRepositoryImpl } from '../../../data/repositories/teachers.repository.impl';
import { TeachersRepository } from '../../../domain/repositories/teachers.repository';
import { GetTeachersUseCase } from '../../../domain/use-cases/get-teachers.use-case';
import { TeachersStore } from '../../state/teachers.store';
import { TeacherListPage } from './teacher-list-page';

describe('TeacherListPage', () => {
  let fixture: ComponentFixture<TeacherListPage>;
  let component: TeacherListPage;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherListPage],
      providers: [
        provideRouter([]),
        { provide: TeachersRepository, useClass: TeachersRepositoryImpl },
        GetTeachersUseCase,
        TeachersStore,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(TeacherListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders teacher list and initializes pagination on page 1', () => {
    expect(component).toBeTruthy();
    expect(component['currentPage']()).toBe(1);
    expect(component['pageSize']()).toBe(9);
    expect(component['displayedTeachers']().length).toBeLessThanOrEqual(9);

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.teachers-grid')).toBeTruthy();
    expect(el.querySelector('app-custom-pagination')).toBeTruthy();
  });

  it('updates displayed teachers when onPageChange is called', () => {
    const page1Teachers = component['displayedTeachers']();
    expect(page1Teachers.length).toBeGreaterThan(0);

    component['onPageChange'](2);
    fixture.detectChanges();

    expect(component['currentPage']()).toBe(2);
    const page2Teachers = component['displayedTeachers']();
    // Verify different items or pagination slice
    if (component['store'].filteredTeachers().length > 9) {
      expect(page2Teachers[0].id).not.toBe(page1Teachers[0].id);
    }
  });

  it('resets currentPage to 1 when filters or categories change', () => {
    component['onPageChange'](2);
    expect(component['currentPage']()).toBe(2);

    component['onCategorySelect']('music');
    expect(component['currentPage']()).toBe(1);

    component['onPageChange'](2);
    component['onModeSelect']('online');
    expect(component['currentPage']()).toBe(1);

    component['onPageChange'](2);
    component['onResetFilters']();
    expect(component['currentPage']()).toBe(1);
  });

  it('navigates to teacher profile on card viewProfile event', () => {
    const t = component['displayedTeachers']()[0];
    component['onViewTeacherProfile'](t);
    expect(router.navigate).toHaveBeenCalledWith(['/teachers', t.id]);
  });
});
