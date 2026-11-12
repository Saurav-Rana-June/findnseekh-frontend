import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUser, RegisterPayload } from '../entities/auth.entity';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class RegisterUseCase {
  private readonly authRepository = inject(AuthRepository);

  execute(payload: RegisterPayload): Observable<AuthUser> {
    return this.authRepository.register(payload);
  }
}

