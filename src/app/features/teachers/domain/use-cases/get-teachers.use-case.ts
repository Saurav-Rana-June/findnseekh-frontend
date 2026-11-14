import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Teacher, TeacherFilterQuery } from '../entities/teacher.entity';
import { TeachersRepository } from '../repositories/teachers.repository';

@Injectable()
export class GetTeachersUseCase {
  private readonly repository = inject(TeachersRepository);

  execute(filter?: TeacherFilterQuery): Observable<readonly Teacher[]> {
    return this.repository.getTeachers(filter);
  }
}

