import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class LogoutUseCase {
  private readonly repository = inject(AuthRepository);

  execute(): Observable<void> {
    return this.repository.logout();
  }
}

