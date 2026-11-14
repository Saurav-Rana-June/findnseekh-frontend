import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { TeachersRepository } from '../../../domain/repositories/teachers.repository';
import { GetTeacherByIdUseCase } from '../../../domain/use-cases/get-teacher-by-id.use-case';
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
};

describe('TeacherProfilePage', () => {
  let fixture: ComponentFixture<TeacherProfilePage>;
  let component: TeacherProfilePage;

  const mockRepo = {
    getTeacherById: vi.fn().mockReturnValue(of(MOCK_TEACHER)),
    getTeachers: vi.fn().mockReturnValue(of([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherProfilePage],
      providers: [
        provideRouter([]),
        { provide: TeachersRepository, useValue: mockRepo },
        GetTeacherByIdUseCase,
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
});

