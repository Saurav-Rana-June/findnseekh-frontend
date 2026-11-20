import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseCardData, CustomCourseCard } from './custom-course-card';

describe('CustomCourseCard', () => {
  let fixture: ComponentFixture<CustomCourseCard>;
  let component: CustomCourseCard;

  const mockCourse: CourseCardData = {
    id: 101,
    title: 'Hindustani Classical Vocal Foundation',
    categoryName: 'Music',
    description: 'Learn swaras, alankars, and foundational ragas with gentle guidance.',
    level: 'beginner',
    priceAmount: 700,
    currency: 'INR',
    priceUnit: 'session',
    teachingMode: 'both',
    city: 'Dehradun',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomCourseCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomCourseCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('course', mockCourse);
    fixture.detectChanges();
  });

  it('renders course title, category, level, mode, price, and description matching listings page card UI', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.course-card__title')?.textContent).toContain(
      'Hindustani Classical Vocal Foundation',
    );
    expect(el.querySelector('.course-card__category')?.textContent).toContain('Music');
    expect(el.querySelector('.course-card__level')?.textContent).toContain('beginner');
    expect(el.querySelector('.course-card__mode')?.textContent).toContain('Online & In-Person');
    expect(el.querySelector('.course-card__price-amount')?.textContent).toContain('₹700 / session');
    expect(el.querySelector('.course-card__desc')?.textContent).toContain(
      'Learn swaras, alankars',
    );
    expect(el.querySelector('button')?.textContent).toContain('Send Enquiry');
  });

  it('emits enquire event when action button is clicked', () => {
    let emittedCourse: CourseCardData | null = null;
    component.enquire.subscribe((c) => (emittedCourse = c));

    const btn = fixture.nativeElement.querySelector('button');
    btn?.click();
    fixture.detectChanges();

    expect(emittedCourse).toEqual(mockCourse);
  });
});
