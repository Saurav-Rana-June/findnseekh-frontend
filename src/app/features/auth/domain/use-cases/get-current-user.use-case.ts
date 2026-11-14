import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUser } from '../entities/auth.entity';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class GetCurrentUserUseCase {
  private readonly repository = inject(AuthRepository);

  execute(): Observable<AuthUser> {
    return this.repository.getCurrentUser();
  }
}

