import { Observable } from 'rxjs';
import {
  Teacher,
  TeacherEnquiryPayload,
  TeacherEnquiryResult,
  TeacherFilterQuery,
} from '../entities/teacher.entity';

export abstract class TeachersRepository {
  abstract getTeachers(filter?: TeacherFilterQuery): Observable<readonly Teacher[]>;
  abstract getTeacherById(id: string): Observable<Teacher | null>;
  abstract sendEnquiry(
    teacherId: string | number,
    payload: TeacherEnquiryPayload,
  ): Observable<TeacherEnquiryResult>;
}


