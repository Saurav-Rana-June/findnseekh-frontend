import { computed, inject, Injectable, signal } from '@angular/core';
import { APP_STORAGE_KEYS } from '../constants/app.constants';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private readonly storage = inject(StorageService);

  private readonly _accessToken = signal<string | null>(
    this.storage.getItem(APP_STORAGE_KEYS.accessToken),
  );
  private readonly _refreshToken = signal<string | null>(
    this.storage.getItem(APP_STORAGE_KEYS.refreshToken),
  );

  readonly accessToken = this._accessToken.asReadonly();
  readonly refreshToken = this._refreshToken.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this._accessToken()));

  setTokens(accessToken: string, refreshToken?: string | null): void {
    this._accessToken.set(accessToken);
    this.storage.setItem(APP_STORAGE_KEYS.accessToken, accessToken);

    if (refreshToken !== undefined) {
      this._refreshToken.set(refreshToken);
      if (refreshToken) {
        this.storage.setItem(APP_STORAGE_KEYS.refreshToken, refreshToken);
      } else {
        this.storage.removeItem(APP_STORAGE_KEYS.refreshToken);
      }
    }
  }

  clearSession(): void {
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this.storage.removeItem(APP_STORAGE_KEYS.accessToken);
    this.storage.removeItem(APP_STORAGE_KEYS.refreshToken);
  }
}

