import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomDropdown, CustomDropdownOption } from './custom-dropdown';

describe('CustomDropdown', () => {
  let fixture: ComponentFixture<CustomDropdown>;
  let component: CustomDropdown;

  const TEST_OPTIONS: readonly CustomDropdownOption<string>[] = [
    { value: 'opt-1', label: 'Option One', hint: '1st' },
    { value: 'opt-2', label: 'Option Two', hint: '2nd' },
    { value: 'opt-3', label: 'Option Three', hint: '3rd' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomDropdown);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', TEST_OPTIONS);
    fixture.detectChanges();
  });

  it('renders trigger button with placeholder or selected option label', () => {
    const trigger = fixture.nativeElement.querySelector('.dropdown-trigger');
    expect(trigger).toBeTruthy();
    expect(trigger.textContent).toContain('Select...');

    fixture.componentRef.setInput('value', 'opt-2');
    fixture.detectChanges();
    expect(trigger.textContent).toContain('Option Two');
  });

  it('opens options list when clicked and closes on selection', () => {
    const trigger = fixture.nativeElement.querySelector('.dropdown-trigger');
    expect(fixture.nativeElement.querySelector('.dropdown-menu')).toBeNull();

    trigger.click();
    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('.dropdown-menu');
    expect(menu).toBeTruthy();

    const options = fixture.nativeElement.querySelectorAll('.dropdown-option');
    expect(options.length).toBe(3);

    let emittedValue: string | null = null;
    component.valueChange.subscribe((val) => (emittedValue = val));

    options[1].click();
    fixture.detectChanges();

    expect(emittedValue).toBe('opt-2');
    expect(fixture.nativeElement.querySelector('.dropdown-menu')).toBeNull();
  });
});

