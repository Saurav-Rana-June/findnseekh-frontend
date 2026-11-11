import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ApiError } from '../../../../core/models/api-error.model';
import { AuthUser, LoginCredentials } from '../../domain/entities/auth.entity';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';

@Injectable()
export class AuthStore {
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _user = signal<AuthUser | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  login(credentials: LoginCredentials, onSuccess?: (user: AuthUser) => void): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.loginUseCase
      .execute(credentials)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._isLoading.set(false)),
      )
      .subscribe({
        next: (user) => {
          this._user.set(user);
          onSuccess?.(user);
        },
        error: (err: ApiError) => {
          this._error.set(err.message);
        },
      });
  }

  clearError(): void {
    this._error.set(null);
  }
}

