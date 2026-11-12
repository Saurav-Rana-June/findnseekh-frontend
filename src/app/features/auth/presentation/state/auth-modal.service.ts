import { Injectable, signal } from '@angular/core';
import { UserRole } from '../../domain/entities/auth.entity';

/**
 * Coordinates opening/closing auth modals (Login & Register) from anywhere in the app.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthModalService {
  private readonly _isLoginOpen = signal(false);
  private readonly _isRegisterOpen = signal(false);
  private readonly _registerInitialRole = signal<UserRole>('student');

  readonly isLoginOpen = this._isLoginOpen.asReadonly();
  readonly isRegisterOpen = this._isRegisterOpen.asReadonly();
  readonly registerInitialRole = this._registerInitialRole.asReadonly();

  openLogin(): void {
    this._isRegisterOpen.set(false);
    this._isLoginOpen.set(true);
  }

  closeLogin(): void {
    this._isLoginOpen.set(false);
  }

  openRegister(role: UserRole = 'student'): void {
    this._isLoginOpen.set(false);
    this._registerInitialRole.set(role);
    this._isRegisterOpen.set(true);
  }

  closeRegister(): void {
    this._isRegisterOpen.set(false);
  }
}

