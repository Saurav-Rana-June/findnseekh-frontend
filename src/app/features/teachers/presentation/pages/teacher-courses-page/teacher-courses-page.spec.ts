import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { GetTeacherByIdUseCase } from '../../../domain/use-cases/get-teacher-by-id.use-case';
import { SendTeacherEnquiryUseCase } from '../../../domain/use-cases/send-teacher-enquiry.use-case';
import { TeacherCoursesPage } from './teacher-courses-page';

const MOCK_TEACHER = {
  id: 'ananya-verma',
  name: 'Ananya Verma',
  category: 'Music',
  categoryId: 'music' as const,
  specialty: 'Hindustani Classical Vocals',
  bio: 'Trained in Kirana gharana.',
  about: 'Over 9 years of teaching classical khayal and thumri.',
  skills: ['Classical Vocals', 'Harmonium', 'Ragas'],
  location: 'Dehradun, Uttarakhand',
  city: 'Dehradun',
  state: 'Uttarakhand',
  experienceYears: 9,
  hourlyRate: 700,
  teachingMode: 'both' as const,
  verified: true,
  rating: { value: 4.8, count: 64 },
  avatar: {
    skin: '#C68B63',
    hair: '#1F2937',
    hairStyle: 'long' as const,
    outfit: '#174E38',
    background: '#DCE9E1',
  },
  listings: [
    {
      id: 101,
      title: 'Classical Vocals Beginner',
      description: 'Foundations of khayal singing and sargam exercises.',
      level: 'beginner',
      priceAmount: 700,
      currency: 'INR',
      priceUnit: 'session',
      teachingMode: 'both' as const,
      city: 'Dehradun',
      area: 'Uttarakhand',
    },
    {
      id: 102,
      title: 'Harmonium Accompaniment',
      description: 'Learn harmonium accompaniment for classical and semi-classical pieces.',
      level: 'intermediate',
      priceAmount: 850,
      currency: 'INR',
      priceUnit: 'session',
      teachingMode: 'both' as const,
      city: 'Dehradun',
      area: 'Uttarakhand',
    },
    {
      id: 103,
      title: 'Advanced Raga Masterclass',
      description: 'Intensive exploration of advanced ragas and complex bandish.',
      level: 'advanced',
      priceAmount: 1100,
      currency: 'INR',
      priceUnit: 'session',
      teachingMode: 'online' as const,
      city: 'Dehradun',
      area: 'Uttarakhand',
    },
    {
      id: 104,
      title: '1-on-1 Personalized Mentorship',
      description: 'Custom vocal training tailored to individual performance goals.',
      level: 'all_levels',
      priceAmount: 950,
      currency: 'INR',
      priceUnit: 'session',
      teachingMode: 'both' as const,
      city: 'Dehradun',
      area: 'Uttarakhand',
    },
  ],
};

describe('TeacherCoursesPage', () => {
  let fixture: ComponentFixture<TeacherCoursesPage>;
  let component: TeacherCoursesPage;
  let router: Router;

  const mockGetTeacher = {
    execute: vi.fn().mockReturnValue(of(MOCK_TEACHER)),
  };

  const mockSendEnquiry = {
    execute: vi.fn().mockReturnValue(of({ success: true })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherCoursesPage],
      providers: [
        provideRouter([]),
        { provide: GetTeacherByIdUseCase, useValue: mockGetTeacher },
        { provide: SendTeacherEnquiryUseCase, useValue: mockSendEnquiry },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['id', 'ananya-verma']])),
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(TeacherCoursesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads and renders all teacher courses', () => {
    expect(component.courses().length).toBe(4);
    const hostEl: HTMLElement = fixture.nativeElement;
    expect(hostEl.textContent).toContain('All Courses & Classes');
    expect(hostEl.textContent).toContain('4 Courses Available');

    const courseCards = hostEl.querySelectorAll('app-custom-course-card');
    expect(courseCards.length).toBe(4);
  });

  it('navigates back to teacher profile on back click', () => {
    const backBtn: HTMLElement = fixture.nativeElement.querySelector(
      '.courses-page-top-nav app-custom-close-outlined-button button',
    );
    backBtn.click();
    expect(router.navigate).toHaveBeenCalledWith(['/teachers', 'ananya-verma']);
  });
});
