import { Observable } from 'rxjs';
import { Teacher, TeacherFilterQuery } from '../entities/teacher.entity';

export abstract class TeachersRepository {
  abstract getTeachers(filter?: TeacherFilterQuery): Observable<readonly Teacher[]>;
  abstract getTeacherById(id: string): Observable<Teacher | null>;
}

