import { SkillCategoryIcon } from '../../../../shared/components/custom-skill-category-card/custom-skill-category-card';
import { TeacherAvatarSpec } from '../../../../shared/components/teacher-avatar/teacher-avatar';
import { TeachingMode } from '../../../../shared/components/custom-teacher-card/custom-teacher-card';

export type SkillCategoryId = SkillCategoryIcon;

export interface TeacherReview {
  readonly id: string;
  readonly studentName: string;
  readonly rating: number;
  readonly date: string;
  readonly comment: string;
}

export interface TeacherFaq {
  readonly question: string;
  readonly answer: string;
}

export interface TeacherListing {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly level: string;
  readonly priceAmount: number;
  readonly currency: string;
  readonly priceUnit: string;
  readonly teachingMode: TeachingMode;
  readonly city?: string | null;
  readonly area?: string | null;
  readonly categoryName?: string;
}

export interface Teacher {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly categoryId: SkillCategoryId;
  readonly specialty: string;
  readonly bio?: string;
  readonly about?: string;
  readonly skills: readonly string[];
  readonly location: string;
  readonly city: string;
  readonly state: string;
  readonly experienceYears: number;
  readonly rating?: { readonly value: number; readonly count: number };
  readonly avatar: TeacherAvatarSpec;
  readonly teachingMode: TeachingMode;
  readonly hourlyRate?: number;
  readonly verified?: boolean;
  readonly languages?: readonly string[];
  readonly qualifications?: readonly string[];
  readonly reviews?: readonly TeacherReview[];
  readonly faqs?: readonly TeacherFaq[];
  readonly listings?: readonly TeacherListing[];
}

export type TeacherSortOption =
  | 'recommended'
  | 'rating'
  | 'experience'
  | 'price-asc'
  | 'price-desc';

export interface TeacherFilterQuery {
  readonly query?: string;
  readonly location?: string;
  readonly category?: string;
  readonly mode?: TeachingMode | 'all';
  readonly minExperience?: number;
  readonly sortBy?: TeacherSortOption;
}

export interface TeacherEnquiryPayload {
  readonly teachingMode?: TeachingMode;
  readonly preferredDate?: string;
  readonly message?: string;
  readonly skillListingId?: number;
}

export interface TeacherEnquiryResult {
  readonly id: number;
  readonly teacherId: number;
  readonly studentId?: number | null;
  readonly teachingMode: string;
  readonly preferredDate?: string | null;
  readonly message: string;
  readonly status: string;
  readonly createdAt: string;
}


