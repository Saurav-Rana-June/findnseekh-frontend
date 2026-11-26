import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { GetTeacherByIdUseCase } from '../../../domain/use-cases/get-teacher-by-id.use-case';
import { SendTeacherEnquiryUseCase } from '../../../domain/use-cases/send-teacher-enquiry.use-case';
import { TeacherReviewsPage } from './teacher-reviews-page';

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
  reviews: [
    {
      id: 'rev-1',
      studentName: 'Aarav Patel',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Amazing teacher! Extremely patient and gives personalized feedback.',
    },
    {
      id: 'rev-2',
      studentName: 'Pooja Sharma',
      rating: 5,
      date: '1 month ago',
      comment: 'I have seen huge improvement in my technique within just 4 sessions.',
    },
    {
      id: 'rev-3',
      studentName: 'Rohan Verma',
      rating: 4.8,
      date: '2 months ago',
      comment: 'Great guidance and step-by-step methodology.',
    },
    {
      id: 'rev-4',
      studentName: 'Ananya Iyer',
      rating: 4.0,
      date: '2 months ago',
      comment: 'Lessons are always engaging and tailored to my pace.',
    },
  ],
};

describe('TeacherReviewsPage', () => {
  let fixture: ComponentFixture<TeacherReviewsPage>;
  let component: TeacherReviewsPage;
  let router: Router;

  const mockGetTeacher = {
    execute: vi.fn().mockReturnValue(of(MOCK_TEACHER)),
  };

  const mockSendEnquiry = {
    execute: vi.fn().mockReturnValue(of({ success: true })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherReviewsPage],
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

    fixture = TestBed.createComponent(TeacherReviewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component and renders reviews list', () => {
    expect(component).toBeTruthy();
    expect(component.allReviews().length).toBe(4);
    expect(component['filteredReviews']().length).toBe(4);

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('All Student Reviews');
    expect(el.textContent).toContain('Aarav Patel');
    expect(el.textContent).toContain('Pooja Sharma');
  });

  it('filters reviews by rating correctly', () => {
    component['setFilter']('5');
    fixture.detectChanges();
    // 3 reviews are 5.0 (rev-1, rev-2) or floor(4.8) = 4, let's test filter
    const fiveStar = component['filteredReviews']();
    expect(fiveStar.every((r) => Math.floor(r.rating) === 5)).toBe(true);

    component['setFilter']('4');
    fixture.detectChanges();
    const fourStar = component['filteredReviews']();
    expect(fourStar.every((r) => Math.floor(r.rating) === 4)).toBe(true);

    component['setFilter']('all');
    fixture.detectChanges();
    expect(component['filteredReviews']().length).toBe(4);
  });

  it('navigates back to teacher profile when onBackToProfile is called', () => {
    component['onBackToProfile']();
    expect(router.navigate).toHaveBeenCalledWith(['/teachers', 'ananya-verma']);
  });

  it('opens and closes booking modal', () => {
    expect(component['isBookingOpen']()).toBe(false);
    component['onOpenBooking']();
    expect(component['isBookingOpen']()).toBe(true);

    component['onCloseBooking']();
    expect(component['isBookingOpen']()).toBe(false);
  });

  it('submits enquiry via SendTeacherEnquiryUseCase', () => {
    component['onOpenBooking']();
    component['bookingMessage'].set('Looking forward to learning from you.');
    component['onSubmitBooking']();

    expect(mockSendEnquiry.execute).toHaveBeenCalledWith('ananya-verma', {
      teachingMode: 'online',
      preferredDate: component['preferredDate'](),
      message: 'Looking forward to learning from you.',
    });
    expect(component['bookingSuccess']()).toBe(true);
  });
});
