import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LocationPermissionStatus, LocationService } from '../../../core/services/location.service';
import { LocationPermissionModal } from './location-permission-modal';

describe('LocationPermissionModal', () => {
  const shouldPromptSignal = signal(false);
  const statusSignal = signal<LocationPermissionStatus>('idle');
  const errorMessageSignal = signal<string | null>(null);

  const locationServiceMock = {
    shouldPrompt: shouldPromptSignal.asReadonly(),
    status: statusSignal.asReadonly(),
    errorMessage: errorMessageSignal.asReadonly(),
    requestLocation: vi.fn(),
    dismissPrompt: vi.fn(),
  };

  beforeEach(async () => {
    shouldPromptSignal.set(false);
    statusSignal.set('idle');
    errorMessageSignal.set(null);
    locationServiceMock.requestLocation.mockReset();
    locationServiceMock.dismissPrompt.mockReset();

    await TestBed.configureTestingModule({
      imports: [LocationPermissionModal],
      providers: [{ provide: LocationService, useValue: locationServiceMock }],
    }).compileComponents();
  });

  it('does not render modal when shouldPrompt is false', () => {
    const fixture = TestBed.createComponent(LocationPermissionModal);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders modal and triggers Allow Location and Not Now actions', () => {
    shouldPromptSignal.set(true);
    statusSignal.set('prompting');

    const fixture = TestBed.createComponent(LocationPermissionModal);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('[role="dialog"]')).not.toBeNull();
    expect(host.textContent).toContain('Find teachers near you');

    const buttons = Array.from(host.querySelectorAll('button'));
    const allowBtn = buttons.find((b) => b.textContent?.includes('Allow Location'));
    const dismissBtn = buttons.find((b) => b.textContent?.includes('Not Now'));

    allowBtn?.click();
    expect(locationServiceMock.requestLocation).toHaveBeenCalledTimes(1);

    dismissBtn?.click();
    expect(locationServiceMock.dismissPrompt).toHaveBeenCalledTimes(1);
  });
});

