export type LearningRequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface LearningRequest {
  readonly id: number;
  readonly skillListingId: number;
  readonly skillTitle: string;
  readonly studentId: number;
  readonly studentName: string;
  readonly teacherId: number;
  readonly teacherName: string;
  readonly message: string;
  readonly status: LearningRequestStatus;
  readonly teacherResponse?: string | null;
  readonly respondedAt?: string | null;
  readonly createdAt: string;
}

