import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeacherEnquiryPayload, TeacherEnquiryResult } from '../entities/teacher.entity';
import { TeachersRepository } from '../repositories/teachers.repository';

@Injectable()
export class SendTeacherEnquiryUseCase {
  private readonly repository = inject(TeachersRepository);

  execute(
    teacherId: string | number,
    payload: TeacherEnquiryPayload,
  ): Observable<TeacherEnquiryResult> {
    return this.repository.sendEnquiry(teacherId, payload);
  }
}
