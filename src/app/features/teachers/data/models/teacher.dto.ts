import {
  SkillCategoryId,
  Teacher,
  TeacherEnquiryPayload,
  TeacherEnquiryResult,
  TeacherFaq,
  TeacherReview,
} from '../../domain/entities/teacher.entity';
import { TeachingMode } from '../../../../shared/components/custom-teacher-card/custom-teacher-card';
import { getTeacherAvatarSpec } from '../../../home/data/models/home.dto';

export interface TeacherCardDto {
  readonly id: number;
  readonly user_id: number;
  readonly name: string;
  readonly specialty: string;
  readonly category?: string | null;
  readonly category_id?: string | null;
  readonly rating: number;
  readonly reviews_count: number;
  readonly experience_years: number;
  readonly city: string | null;
  readonly state: string | null;
  readonly location: string;
  readonly teaching_mode: string;
  readonly hourly_rate: number | string;
  readonly currency: string;
  readonly price_unit: string;
  readonly skills: readonly string[];
  readonly avatar: string | null;
  readonly is_verified: boolean;
  readonly is_new: boolean;
  readonly bio: string | null;
}

export interface TeacherPaginationDto {
  readonly total: number;
  readonly page: number;
  readonly page_size: number;
  readonly teachers: readonly TeacherCardDto[];
}

export interface TeacherReviewDto {
  readonly id: string;
  readonly student_name: string;
  readonly rating: number;
  readonly date: string;
  readonly comment: string;
}

export interface TeacherFaqDto {
  readonly question: string;
  readonly answer: string;
}

export interface TeacherListingItemDto {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly level: string;
  readonly price_amount: number;
  readonly currency: string;
  readonly price_unit: string;
  readonly teaching_mode: string;
  readonly city: string | null;
  readonly area: string | null;
}

export interface TeacherDetailDto extends TeacherCardDto {
  readonly about?: string | null;
  readonly languages?: readonly string[];
  readonly qualifications?: readonly string[];
  readonly reviews?: readonly TeacherReviewDto[];
  readonly faqs?: readonly TeacherFaqDto[];
  readonly listings?: readonly TeacherListingItemDto[];
}

export interface TeacherEnquiryRequestDto {
  readonly teaching_mode?: string;
  readonly preferred_date?: string | null;
  readonly message?: string | null;
  readonly skill_listing_id?: number | null;
}

export interface TeacherEnquiryResponseDto {
  readonly id: number;
  readonly teacher_id: number;
  readonly student_id?: number | null;
  readonly teaching_mode: string;
  readonly preferred_date?: string | null;
  readonly message: string;
  readonly status: string;
  readonly created_at: string;
}

export function normalizeSkillCategoryId(raw?: string | null): SkillCategoryId {
  const s = (raw || '').toLowerCase();
  if (s.includes('dance')) return 'dance';
  if (s.includes('photo')) return 'photography';
  if (s.includes('art') || s.includes('craft') || s.includes('pottery')) return 'art-craft';
  if (s.includes('yoga') || s.includes('fit')) return 'fitness-yoga';
  if (s.includes('cook') || s.includes('baking')) return 'cooking';
  if (s.includes('tech') || s.includes('code') || s.includes('program')) return 'technology';
  if (s.includes('lang') || s.includes('english') || s.includes('hindi')) return 'languages';
  return 'music';
}

export function toTeacherCardEntity(dto: TeacherCardDto, index: number = 0): Teacher {
  const mode: TeachingMode =
    dto.teaching_mode === 'online' || dto.teaching_mode === 'offline' ? dto.teaching_mode : 'both';
  const categoryId = normalizeSkillCategoryId(dto.category_id || dto.category || dto.specialty);

  return {
    id: String(dto.user_id || dto.id),
    name: dto.name,
    category: dto.category || dto.specialty || 'General',
    categoryId,
    specialty: dto.specialty,
    bio: dto.bio || undefined,
    about: dto.bio || undefined,
    skills: dto.skills || [],
    location: dto.location || [dto.city, dto.state].filter(Boolean).join(', ') || 'Flexible',
    city: dto.city || '',
    state: dto.state || '',
    experienceYears: dto.experience_years || 1,
    rating: {
      value: Number(dto.rating) || 4.8,
      count: dto.reviews_count || 12,
    },
    avatar: getTeacherAvatarSpec(index, dto.name),
    teachingMode: mode,
    hourlyRate: Number(dto.hourly_rate) || 500,
    verified: dto.is_verified,
  };
}

export function toTeacherDetailEntity(dto: TeacherDetailDto): Teacher {
  const card = toTeacherCardEntity(dto, 0);

  const reviews: TeacherReview[] = (dto.reviews || []).map((r) => ({
    id: r.id,
    studentName: r.student_name,
    rating: r.rating,
    date: r.date,
    comment: r.comment,
  }));

  const faqs: TeacherFaq[] = (dto.faqs || []).map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  return {
    ...card,
    about: dto.about || card.bio,
    languages: dto.languages && dto.languages.length > 0 ? dto.languages : ['English', 'Hindi'],
    qualifications:
      dto.qualifications && dto.qualifications.length > 0
        ? dto.qualifications
        : [`${card.experienceYears}+ years of teaching & professional practice`],
    reviews,
    faqs,
  };
}

export function toTeacherEnquiryResult(dto: TeacherEnquiryResponseDto): TeacherEnquiryResult {
  return {
    id: dto.id,
    teacherId: dto.teacher_id,
    studentId: dto.student_id,
    teachingMode: dto.teaching_mode,
    preferredDate: dto.preferred_date,
    message: dto.message,
    status: dto.status,
    createdAt: dto.created_at,
  };
}

