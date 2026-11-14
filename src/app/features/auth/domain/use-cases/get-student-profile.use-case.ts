import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentProfile } from '../entities/auth.entity';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class GetStudentProfileUseCase {
  private readonly authRepository = inject(AuthRepository);

  execute(): Observable<StudentProfile> {
    return this.authRepository.getStudentProfile();
  }
}

