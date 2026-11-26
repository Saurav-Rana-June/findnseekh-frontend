import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { TeachersRepository } from '../../../domain/repositories/teachers.repository';
import { GetTeacherByIdUseCase } from '../../../domain/use-cases/get-teacher-by-id.use-case';
import { SendTeacherEnquiryUseCase } from '../../../domain/use-cases/send-teacher-enquiry.use-case';
import { TeacherProfilePage } from './teacher-profile-page';

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
  languages: ['English', 'Hindi'],
  qualifications: ['9+ years of teaching', 'Gold Medalist'],
  reviews: [
    {
      id: 'rev-1',
      studentName: 'Aarav Patel',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Amazing teacher! Extremely patient.',
    },
  ],
  faqs: [
    {
      question: 'What happens during trial?',
      answer: 'We evaluate your vocal range and goals.',
    },
  ],
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
  ],
};

describe('TeacherProfilePage', () => {
  let fixture: ComponentFixture<TeacherProfilePage>;
  let component: TeacherProfilePage;

  const mockRepo = {
    getTeacherById: vi.fn().mockReturnValue(of(MOCK_TEACHER)),
    getTeachers: vi.fn().mockReturnValue(of([])),
    sendEnquiry: vi.fn().mockReturnValue(
      of({
        id: 1,
        teacherId: 101,
        studentId: 2,
        teachingMode: 'online',
        preferredDate: '2026-11-20',
        message: 'Test message',
        status: 'pending',
        createdAt: '2026-11-16T00:00:00Z',
      }),
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherProfilePage],
      providers: [
        provideRouter([]),
        { provide: TeachersRepository, useValue: mockRepo },
        GetTeacherByIdUseCase,
        SendTeacherEnquiryUseCase,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['id', 'ananya-verma']])),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders teacher profile details correctly', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Ananya Verma');
    expect(el.textContent).toContain('Hindustani Classical Vocals');
    expect(el.textContent).toContain('Dehradun, Uttarakhand');
    expect(el.textContent).toContain('9 years');
    expect(el.textContent).toContain('₹700');
  });

  it('toggles FAQ item when question is clicked', () => {
    expect(component['openFaqIndex']()).toBe(0);
    component['toggleFaq'](0);
    expect(component['openFaqIndex']()).toBeNull();
    component['toggleFaq'](0);
    expect(component['openFaqIndex']()).toBe(0);
  });

  it('opens and closes booking modal', () => {
    expect(component['isBookingOpen']()).toBe(false);
    component['onOpenBooking']('trial');
    expect(component['isBookingOpen']()).toBe(true);
    expect(component['selectedSessionType']()).toBe('trial');

    component['onCloseBooking']();
    expect(component['isBookingOpen']()).toBe(false);
  });

  it('submits enquiry via SendTeacherEnquiryUseCase and triggers success state', () => {
    component['onOpenBooking']('enquiry');
    component['bookingMessage'].set('Hello Ananya, I would like to learn vocal ragas.');
    component['onConfirmBooking']();

    expect(mockRepo.sendEnquiry).toHaveBeenCalledWith('ananya-verma', {
      teachingMode: 'online',
      preferredDate: component['preferredDate'](),
      message: 'Hello Ananya, I would like to learn vocal ragas.',
      skillListingId: 101,
    });
    expect(component['bookingSuccess']()).toBe(true);
  });

  it('toggles reviews expansion between top 2 and all reviews', () => {
    expect(component['displayedReviews']().length).toBe(1);
    expect(component['isAllReviewsExpanded']()).toBe(false);

    const teacherWith3Reviews = {
      ...MOCK_TEACHER,
      reviews: [
        { id: 'r1', studentName: 'Aarav', rating: 5, date: '1w', comment: 'Great' },
        { id: 'r2', studentName: 'Pooja', rating: 5, date: '2w', comment: 'Awesome' },
        { id: 'r3', studentName: 'Rohan', rating: 4, date: '3w', comment: 'Good' },
      ],
    };
    component['teacher'].set(teacherWith3Reviews);
    fixture.detectChanges();

    expect(component['displayedReviews']().length).toBe(2);
    component['onToggleAllReviews']();
    expect(component['isAllReviewsExpanded']()).toBe(true);
    expect(component['displayedReviews']().length).toBe(3);

    component['onToggleAllReviews']();
    expect(component['isAllReviewsExpanded']()).toBe(false);
    expect(component['displayedReviews']().length).toBe(2);
  });
});

