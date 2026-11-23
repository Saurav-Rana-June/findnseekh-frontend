import {
  LearningRequest,
  LearningRequestStatus,
} from '../../domain/entities/learning-request.entity';

export interface LearningRequestPublicDto {
  readonly id: number;
  readonly skill_listing_id: number;
  readonly skill_title: string;
  readonly student_id: number;
  readonly student_name: string;
  readonly teacher_id: number;
  readonly teacher_name: string;
  readonly message: string;
  readonly status: string;
  readonly teacher_response?: string | null;
  readonly responded_at?: string | null;
  readonly created_at: string;
}

export interface LearningRequestCreateDto {
  readonly skill_listing_id: number;
  readonly message: string;
}

export interface LearningRequestReadDto {
  readonly id: number;
  readonly skill_listing_id: number;
  readonly student_id: number;
  readonly teacher_id: number;
  readonly message: string;
  readonly status: string;
  readonly teacher_response?: string | null;
  readonly responded_at?: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export function toLearningRequestEntity(
  dto: LearningRequestPublicDto | LearningRequestReadDto,
  defaults?: { skillTitle?: string; studentName?: string; teacherName?: string },
): LearningRequest {
  const publicDto = dto as LearningRequestPublicDto;
  const statusLower = dto.status.toLowerCase();
  const validStatus: LearningRequestStatus =
    statusLower === 'accepted' || statusLower === 'rejected' || statusLower === 'cancelled'
      ? statusLower
      : 'pending';

  return {
    id: dto.id,
    skillListingId: dto.skill_listing_id,
    skillTitle: publicDto.skill_title || defaults?.skillTitle || 'Lesson Enquiry',
    studentId: dto.student_id,
    studentName: publicDto.student_name || defaults?.studentName || 'Student',
    teacherId: dto.teacher_id,
    teacherName: publicDto.teacher_name || defaults?.teacherName || 'Instructor',
    message: dto.message,
    status: validStatus,
    teacherResponse: dto.teacher_response ?? null,
    respondedAt: dto.responded_at ?? null,
    createdAt: dto.created_at,
  };
}

