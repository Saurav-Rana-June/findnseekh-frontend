import { TestBed } from '@angular/core/testing';
import { CustomModal } from './custom.modal';

describe('CustomModal', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomModal],
    }).compileComponents();
  });

  it('does not render dialog when closed', () => {
    const fixture = TestBed.createComponent(CustomModal);
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders title, subtitle, size, and custom style tokens when open', () => {
    const fixture = TestBed.createComponent(CustomModal);
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('title', 'Dynamic Modal');
    fixture.componentRef.setInput('subtitle', 'Configurable shell');
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('bgColor', '#f8f8f2');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const dialog = host.querySelector<HTMLElement>('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute('data-size')).toBe('lg');
    expect(host.style.getPropertyValue('--cp-modal-bg')).toBe('#f8f8f2');
    expect(host.textContent).toContain('Dynamic Modal');
    expect(host.textContent).toContain('Configurable shell');
  });

  it('emits closed on backdrop click when closeOnBackdrop is true and blocks it when false', () => {
    const fixture = TestBed.createComponent(CustomModal);
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('closeOnBackdrop', false);
    fixture.detectChanges();

    const closedSpy = vi.fn();
    fixture.componentInstance.closed.subscribe(closedSpy);

    const backdrop = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '.cp-modal-backdrop'
    )!;
    backdrop.click();
    expect(closedSpy).not.toHaveBeenCalled();

    fixture.componentRef.setInput('closeOnBackdrop', true);
    fixture.detectChanges();
    backdrop.click();
    expect(closedSpy).toHaveBeenCalledTimes(1);
  });
});

