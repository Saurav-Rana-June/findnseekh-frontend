import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  getItem(key: string): string | null {
    if (!this.isBrowser) {
      return null;
    }

    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Storage may be unavailable in private browsing or quota-restricted environments.
    }
  }

  removeItem(key: string): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore storage errors on restricted browsers.
    }
  }

  clear(): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      window.localStorage.clear();
    } catch {
      // Ignore storage errors on restricted browsers.
    }
  }
}

