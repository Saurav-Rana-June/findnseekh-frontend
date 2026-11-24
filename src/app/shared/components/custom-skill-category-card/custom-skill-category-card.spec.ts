import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomSkillCategoryCard } from './custom-skill-category-card';

describe('CustomSkillCategoryCard', () => {
  let fixture: ComponentFixture<CustomSkillCategoryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSkillCategoryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSkillCategoryCard);
    fixture.componentRef.setInput('category', {
      id: 'music',
      title: 'Music',
      description: 'Instruments and vocals',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});