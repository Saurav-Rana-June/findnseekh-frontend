import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Teacher } from '../entities/teacher.entity';
import { TeachersRepository } from '../repositories/teachers.repository';

@Injectable()
export class GetTeacherByIdUseCase {
  private readonly repository = inject(TeachersRepository);

  execute(id: string): Observable<Teacher | null> {
    return this.repository.getTeacherById(id);
  }
}

