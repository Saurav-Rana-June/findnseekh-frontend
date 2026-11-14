import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentProfile, StudentProfileUpdatePayload } from '../entities/auth.entity';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class UpdateStudentProfileUseCase {
  private readonly authRepository = inject(AuthRepository);

  execute(payload: StudentProfileUpdatePayload): Observable<StudentProfile> {
    return this.authRepository.updateStudentProfile(payload);
  }
}

