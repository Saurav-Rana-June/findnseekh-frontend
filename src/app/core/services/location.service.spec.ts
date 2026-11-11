import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { APP_STORAGE_KEYS } from '../constants/app.constants';
import { LocationService } from './location.service';
import { StorageService } from './storage.service';

describe('LocationService', () => {
  let service: LocationService;
  let storeMap: Map<string, string>;
  let originalGeolocation: PropertyDescriptor | undefined;
  let originalPermissions: PropertyDescriptor | undefined;

  const mockGeolocation = {
    getCurrentPosition: vi.fn(),
  };

  beforeEach(() => {
    storeMap = new Map<string, string>();
    originalGeolocation = Object.getOwnPropertyDescriptor(navigator, 'geolocation');
    originalPermissions = Object.getOwnPropertyDescriptor(navigator, 'permissions');

    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: mockGeolocation,
    });
    Object.defineProperty(navigator, 'permissions', {
      configurable: true,
      value: {
        query: vi.fn(async () => ({ state: 'prompt' as PermissionState })),
      },
    });
    mockGeolocation.getCurrentPosition.mockReset();

    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: StorageService,
          useValue: {
            getItem: (key: string) => storeMap.get(key) ?? null,
            setItem: (key: string, value: string) => storeMap.set(key, value),
            removeItem: (key: string) => storeMap.delete(key),
            clear: () => storeMap.clear(),
          },
        },
      ],
    });

    service = TestBed.inject(LocationService);
  });

  afterEach(() => {
    if (originalGeolocation) {
      Object.defineProperty(navigator, 'geolocation', originalGeolocation);
    }
    if (originalPermissions) {
      Object.defineProperty(navigator, 'permissions', originalPermissions);
    }
  });

  it('prompts on first visit when permission state is prompt', async () => {
    await service.evaluateFirstVisitPrompt();

    expect(service.shouldPrompt()).toBe(true);
    expect(service.status()).toBe('prompting');
  });

  it('does not prompt when user has already been prompted before', async () => {
    storeMap.set(APP_STORAGE_KEYS.locationPrompted, 'true');

    await service.evaluateFirstVisitPrompt();

    expect(service.shouldPrompt()).toBe(false);
    expect(service.status()).toBe('idle');
  });

  it('stores coordinates and closes prompt when user allows location', () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce((success: PositionCallback) => {
      success({
        coords: {
          latitude: 28.6139,
          longitude: 77.209,
          accuracy: 25,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
          toJSON: () => ({}),
        },
        timestamp: 1700000000000,
        toJSON: () => ({}),
      });
    });

    service.requestLocation();

    expect(service.status()).toBe('granted');
    expect(service.shouldPrompt()).toBe(false);
    expect(service.coordinates()).toEqual({
      latitude: 28.6139,
      longitude: 77.209,
      accuracy: 25,
      timestamp: 1700000000000,
    });
    expect(storeMap.get(APP_STORAGE_KEYS.locationPrompted)).toBe('true');
    expect(storeMap.get(APP_STORAGE_KEYS.userLocation)).toContain('28.6139');
  });

  it('handles permission denied gracefully and marks prompted', () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce(
      (_success: PositionCallback, error?: PositionErrorCallback) => {
        error?.({
          code: 1,
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
          message: 'User denied Geolocation',
        });
      }
    );

    service.requestLocation();

    expect(service.status()).toBe('denied');
    expect(service.errorMessage()).toContain('Location permission was denied');
    expect(storeMap.get(APP_STORAGE_KEYS.locationPrompted)).toBe('true');
  });

  it('dismisses prompt and prevents re-prompting', () => {
    service.dismissPrompt();

    expect(service.shouldPrompt()).toBe(false);
    expect(storeMap.get(APP_STORAGE_KEYS.locationPrompted)).toBe('true');
  });
});

