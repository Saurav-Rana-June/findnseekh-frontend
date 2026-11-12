import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeacherProfile, TeacherProfileUpdatePayload } from '../entities/auth.entity';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class UpdateTeacherProfileUseCase {
  private readonly authRepository = inject(AuthRepository);

  execute(payload: TeacherProfileUpdatePayload): Observable<TeacherProfile> {
    return this.authRepository.updateTeacherProfile(payload);
  }
}

