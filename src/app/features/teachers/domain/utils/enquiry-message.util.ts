import { TeacherEnquiryPayload } from '../entities/teacher.entity';

export function formatEnquiryMessage(payload: TeacherEnquiryPayload): string {
  const base = (payload.message || 'I am interested in starting lessons.').trim();
  const mode = (payload.teachingMode || 'online').toUpperCase();
  if (payload.preferredDate) {
    return `[${mode} - ${payload.preferredDate}] ${base}`.slice(0, 1000);
  }
  return `[${mode}] ${base}`.slice(0, 1000);
}