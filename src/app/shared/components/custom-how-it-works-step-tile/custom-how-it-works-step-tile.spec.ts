import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomHowItWorksStepTile } from './custom-how-it-works-step-tile';

describe('CustomHowItWorksStepTile', () => {
  let fixture: ComponentFixture<CustomHowItWorksStepTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomHowItWorksStepTile],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomHowItWorksStepTile);
    fixture.componentRef.setInput('step', {
      stepNumber: 1,
      icon: 'discover',
      title: 'Discover',
      description: 'Find skills near you.',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});