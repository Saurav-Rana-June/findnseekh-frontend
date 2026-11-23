import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthSessionService } from '../../../../core/services/auth-session.service';
import { CreateLearningRequestUseCase } from '../../../requests/domain/use-cases/create-learning-request.use-case';
import { TeacherEnquiryPayload, TeacherEnquiryResult } from '../entities/teacher.entity';
import { TeachersRepository } from '../repositories/teachers.repository';
import { formatEnquiryMessage } from '../utils/enquiry-message.util';

@Injectable()
export class SendTeacherEnquiryUseCase {
  private readonly repository = inject(TeachersRepository);
  private readonly createLearningRequest = inject(CreateLearningRequestUseCase, { optional: true });
  private readonly authSession = inject(AuthSessionService);

  execute(
    teacherId: string | number,
    payload: TeacherEnquiryPayload,
  ): Observable<TeacherEnquiryResult> {
    const message = formatEnquiryMessage(payload);
    if (
      this.authSession.isAuthenticated() &&
      payload.skillListingId &&
      this.createLearningRequest
    ) {
      return this.createLearningRequest
        .execute({
          skillListingId: payload.skillListingId,
          message,
        })
        .pipe(
          map((request) => ({
            id: request.id,
            teacherId: Number(teacherId) || request.teacherId,
            studentId: request.studentId,
            teachingMode: payload.teachingMode || 'online',
            preferredDate: payload.preferredDate,
            message: request.message,
            status: request.status,
            createdAt: request.createdAt,
          })),
        );
    }

    return this.repository.sendEnquiry(teacherId, payload);
  }
}

