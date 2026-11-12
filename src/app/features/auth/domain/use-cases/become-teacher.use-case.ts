import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeacherProfile } from '../entities/auth.entity';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class BecomeTeacherUseCase {
  private readonly authRepository = inject(AuthRepository);

  execute(): Observable<TeacherProfile> {
    return this.authRepository.becomeTeacher();
  }
}

