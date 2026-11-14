import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomTeacherCard, TeacherCardData } from './custom-teacher-card';

const SAMPLE_TEACHER: TeacherCardData = {
  id: 'test-teacher',
  name: 'Aarav Sharma',
  category: 'Music',
  specialty: 'Classical Flute',
  location: 'Dehradun, Uttarakhand',
  experienceYears: 6,
  rating: { value: 4.8, count: 20 },
  hourlyRate: 500,
  teachingMode: 'both',
  skills: ['Bansuri', 'Classical Ragas', 'Breath Control'],
  avatar: {
    skin: '#C68B63',
    hair: '#1F2937',
    hairStyle: 'short',
    outfit: '#174E38',
    background: '#DCE9E1',
  },
};

describe('CustomTeacherCard', () => {
  let fixture: ComponentFixture<CustomTeacherCard>;
  let component: CustomTeacherCard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTeacherCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomTeacherCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('teacher', SAMPLE_TEACHER);
    fixture.detectChanges();
  });

  it('renders teacher name, specialty, location, experience, and price', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Aarav Sharma');
    expect(el.textContent).toContain('Classical Flute');
    expect(el.textContent).toContain('Dehradun, Uttarakhand');
    expect(el.textContent).toContain('6 years experience');
    expect(el.textContent).toContain('₹500');
  });

  it('emits viewProfile output when CTA is clicked', () => {
    let emittedTeacher: TeacherCardData | null = null;
    component.viewProfile.subscribe((t) => {
      emittedTeacher = t;
    });

    const ctaButton = fixture.nativeElement.querySelector('button');
    ctaButton?.click();

    expect(emittedTeacher).toEqual(SAMPLE_TEACHER);
  });
});
