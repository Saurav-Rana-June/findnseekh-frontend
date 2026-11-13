import { TestBed } from '@angular/core/testing';
import { CustomStatusPill } from './custom.status.pill';

describe('CustomStatusPill', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomStatusPill],
    }).compileComponents();
  });

  it('renders static pill badge with icon when interactive is false', () => {
    const fixture = TestBed.createComponent(CustomStatusPill);
    fixture.componentRef.setInput('label', 'Skill teachers, right in your neighbourhood');
    fixture.componentRef.setInput('variant', 'soft');
    fixture.componentRef.setInput('icon', 'location');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const span = host.querySelector('span.cp-pill');
    expect(host.querySelector('button')).toBeNull();
    expect(span).not.toBeNull();
    expect(span?.getAttribute('data-variant')).toBe('soft');
    expect(span?.querySelector('svg')).not.toBeNull();
    expect(span?.textContent).toContain('Skill teachers, right in your neighbourhood');
  });

  it('renders interactive button pill with aria-pressed and emits clicked', () => {
    const fixture = TestBed.createComponent(CustomStatusPill);
    fixture.componentRef.setInput('label', 'Yoga');
    fixture.componentRef.setInput('variant', 'neutral');
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('interactive', true);
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    const clickedSpy = vi.fn();
    fixture.componentInstance.clicked.subscribe(clickedSpy);

    const button = (fixture.nativeElement as HTMLElement).querySelector('button.cp-pill');
    expect(button).not.toBeNull();
    expect(button?.getAttribute('data-variant')).toBe('neutral');
    expect(button?.getAttribute('data-size')).toBe('lg');
    expect(button?.getAttribute('aria-pressed')).toBe('true');

    button?.dispatchEvent(new MouseEvent('click'));
    expect(clickedSpy).toHaveBeenCalledTimes(1);
  });

  it('applies dynamic CSS custom properties on host', () => {
    const fixture = TestBed.createComponent(CustomStatusPill);
    fixture.componentRef.setInput('label', 'Music');
    fixture.componentRef.setInput('variant', 'surface');
    fixture.componentRef.setInput('bgColor', '#eef4f0');
    fixture.componentRef.setInput('textColor', '#174e38');
    fixture.componentRef.setInput('fontSize', '13px');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.style.getPropertyValue('--cp-pill-bg')).toBe('#eef4f0');
    expect(host.style.getPropertyValue('--cp-pill-color')).toBe('#174e38');
    expect(host.style.getPropertyValue('--cp-pill-font-size')).toBe('13px');
  });

  it('renders remove button when removable is true and emits removed event', () => {
    const fixture = TestBed.createComponent(CustomStatusPill);
    fixture.componentRef.setInput('label', 'Guitar');
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();

    const removedSpy = vi.fn();
    fixture.componentInstance.removed.subscribe(removedSpy);

    const removeBtn = (fixture.nativeElement as HTMLElement).querySelector('button.cp-pill__remove') as HTMLButtonElement | null;
    expect(removeBtn).not.toBeNull();
    expect(removeBtn?.getAttribute('aria-label')).toBe('Remove Guitar');

    removeBtn?.click();
    expect(removedSpy).toHaveBeenCalledTimes(1);
  });
});

