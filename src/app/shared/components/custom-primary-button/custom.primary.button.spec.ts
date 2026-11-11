import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CustomPrimaryButton } from './custom.primary.button';

describe('CustomPrimaryButton', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPrimaryButton],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders a native button with variant, size, icons, and emits clicked', () => {
    const fixture = TestBed.createComponent(CustomPrimaryButton);
    fixture.componentRef.setInput('label', 'Find Teachers');
    fixture.componentRef.setInput('variant', 'primary');
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('leadingIcon', 'search');
    fixture.detectChanges();

    const clickedSpy = vi.fn();
    fixture.componentInstance.clicked.subscribe(clickedSpy);

    const button = (fixture.nativeElement as HTMLElement).querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.getAttribute('data-variant')).toBe('primary');
    expect(button?.getAttribute('data-size')).toBe('lg');
    expect(button?.textContent).toContain('Find Teachers');
    expect(button?.querySelector('svg')).not.toBeNull();

    button?.click();
    expect(clickedSpy).toHaveBeenCalledTimes(1);
  });

  it('renders an anchor link when routerLink is provided', () => {
    const fixture = TestBed.createComponent(CustomPrimaryButton);
    fixture.componentRef.setInput('label', 'Sign Up');
    fixture.componentRef.setInput('routerLink', '/auth/login');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const anchor = host.querySelector('a');
    expect(host.querySelector('button')).toBeNull();
    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute('href')).toBe('/auth/login');
    expect(anchor?.textContent).toContain('Sign Up');
  });

  it('applies dynamic CSS custom properties and suppresses click when disabled or loading', () => {
    const fixture = TestBed.createComponent(CustomPrimaryButton);
    fixture.componentRef.setInput('label', 'View Profile');
    fixture.componentRef.setInput('variant', 'outline');
    fixture.componentRef.setInput('bgColor', '#ffffff');
    fixture.componentRef.setInput('textColor', '#174e38');
    fixture.componentRef.setInput('fullWidth', true);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const clickedSpy = vi.fn();
    fixture.componentInstance.clicked.subscribe(clickedSpy);

    const host = fixture.nativeElement as HTMLElement;
    const button = host.querySelector('button')!;

    expect(host.classList.contains('is-full-width')).toBe(true);
    expect(host.style.getPropertyValue('--cp-btn-bg')).toBe('#ffffff');
    expect(host.style.getPropertyValue('--cp-btn-color')).toBe('#174e38');
    expect(button.disabled).toBe(true);

    button.click();
    expect(clickedSpy).not.toHaveBeenCalled();
  });
});

