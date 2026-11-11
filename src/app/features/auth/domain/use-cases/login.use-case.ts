import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUser, LoginCredentials } from '../entities/auth.entity';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class LoginUseCase {
  private readonly authRepository = inject(AuthRepository);

  execute(credentials: LoginCredentials): Observable<AuthUser> {
    return this.authRepository.login(credentials);
  }
}

