import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { APP_STORAGE_KEYS } from '../constants/app.constants';
import { StorageService } from './storage.service';

export type LocationPermissionStatus =
  | 'idle'
  | 'prompting'
  | 'loading'
  | 'granted'
  | 'denied'
  | 'unsupported'
  | 'error';

export interface UserCoordinates {
  readonly latitude: number;
  readonly longitude: number;
  readonly accuracy: number;
  readonly timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly storage = inject(StorageService);

  private readonly _status = signal<LocationPermissionStatus>('idle');
  private readonly _coordinates = signal<UserCoordinates | null>(null);
  private readonly _errorMessage = signal<string | null>(null);
  private readonly _shouldPrompt = signal(false);

  readonly status = this._status.asReadonly();
  readonly coordinates = this._coordinates.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();
  readonly shouldPrompt = this._shouldPrompt.asReadonly();

  async evaluateFirstVisitPrompt(): Promise<void> {
    if (!this.isBrowser) {
      return;
    }

    this.restoreSavedCoordinates();

    if (this.storage.getItem(APP_STORAGE_KEYS.locationPrompted) === 'true') {
      return;
    }

    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      this._status.set('unsupported');
      this.markPrompted();
      return;
    }

    const permissionState = await this.queryPermissionState();

    if (permissionState === 'granted') {
      this.markPrompted();
      this.requestLocation();
      return;
    }

    if (permissionState === 'denied') {
      this._status.set('denied');
      this.markPrompted();
      return;
    }

    this._status.set('prompting');
    this._shouldPrompt.set(true);
  }

  requestLocation(): void {
    if (!this.isBrowser || typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      this._status.set('unsupported');
      this._errorMessage.set('Location services are not supported in this browser.');
      this.markPrompted();
      return;
    }

    this._status.set('loading');
    this._errorMessage.set(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: UserCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        this._coordinates.set(coords);
        this.storage.setItem(APP_STORAGE_KEYS.userLocation, JSON.stringify(coords));
        this.markPrompted();
        this._status.set('granted');
        this._shouldPrompt.set(false);
      },
      (error) => {
        this.markPrompted();

        if (error.code === error.PERMISSION_DENIED) {
          this._status.set('denied');
          this._errorMessage.set(
            'Location permission was denied. You can still select your area manually.'
          );
          return;
        }

        this._status.set('error');
        this._errorMessage.set(
          'Unable to detect your location right now. You can select your area manually.'
        );
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }

  dismissPrompt(): void {
    this.markPrompted();
    this._shouldPrompt.set(false);
    this._errorMessage.set(null);
    if (this._status() === 'prompting') {
      this._status.set('idle');
    }
  }

  private async queryPermissionState(): Promise<PermissionState | null> {
    if (typeof navigator === 'undefined' || !('permissions' in navigator)) {
      return null;
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state;
    } catch {
      return null;
    }
  }

  private restoreSavedCoordinates(): void {
    const raw = this.storage.getItem(APP_STORAGE_KEYS.userLocation);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<UserCoordinates>;
      if (
        typeof parsed.latitude === 'number' &&
        typeof parsed.longitude === 'number' &&
        typeof parsed.accuracy === 'number' &&
        typeof parsed.timestamp === 'number'
      ) {
        this._coordinates.set({
          latitude: parsed.latitude,
          longitude: parsed.longitude,
          accuracy: parsed.accuracy,
          timestamp: parsed.timestamp,
        });
      }
    } catch {
      this.storage.removeItem(APP_STORAGE_KEYS.userLocation);
    }
  }

  private markPrompted(): void {
    this.storage.setItem(APP_STORAGE_KEYS.locationPrompted, 'true');
  }
}

