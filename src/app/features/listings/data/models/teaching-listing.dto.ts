import { TeachingMode } from '../../../../shared/components/custom-teacher-card/custom-teacher-card';
import {
  TeachingLevel,
  TeachingListing,
  TeachingListingStatus,
} from '../../domain/entities/teaching-listing.entity';

export interface SkillListingCreateDto {
  readonly title: string;
  readonly description: string;
  readonly category_id: number;
  readonly level?: string;
  readonly price_amount?: number;
  readonly currency?: string;
  readonly price_unit?: string;
  readonly teaching_mode?: string;
  readonly city?: string | null;
  readonly area?: string | null;
}

export interface SkillListingUpdateDto {
  readonly title?: string;
  readonly description?: string;
  readonly category_id?: number;
  readonly level?: string;
  readonly price_amount?: number;
  readonly currency?: string;
  readonly price_unit?: string;
  readonly teaching_mode?: string;
  readonly city?: string | null;
  readonly area?: string | null;
}

export interface SkillListingStatusDto {
  readonly status: string;
}

export interface SkillListingReadDto {
  readonly id: number;
  readonly teacher_id: number;
  readonly category_id: number;
  readonly category_name?: string | null;
  readonly title: string;
  readonly description: string;
  readonly level: string;
  readonly price_amount: number | string;
  readonly currency: string;
  readonly price_unit: string;
  readonly teaching_mode: string;
  readonly city?: string | null;
  readonly area?: string | null;
  readonly status: string;
  readonly created_at: string;
  readonly updated_at?: string;
}

export const CATEGORY_NAMES_BY_ID: Readonly<Record<number, string>> = {
  1: 'Music & Vocals',
  2: 'Dance & Movement',
  3: 'Yoga & Fitness',
  4: 'Arts & Craft',
  5: 'Cooking & Culinary',
  6: 'Technology & Coding',
  7: 'Languages & Communication',
  8: 'Photography & Film',
};

export function toTeachingListingEntity(dto: SkillListingReadDto): TeachingListing {
  const levelNormalized = (dto.level?.toLowerCase() || 'beginner') as TeachingLevel;
  const validLevel: TeachingLevel =
    levelNormalized === 'beginner' ||
    levelNormalized === 'intermediate' ||
    levelNormalized === 'advanced' ||
    levelNormalized === 'all_levels'
      ? levelNormalized
      : 'beginner';

  const modeNormalized = (dto.teaching_mode?.toLowerCase() || 'both') as TeachingMode;
  const validMode: TeachingMode =
    modeNormalized === 'online' || modeNormalized === 'offline' || modeNormalized === 'both'
      ? modeNormalized
      : 'both';

  const statusNormalized = (dto.status?.toLowerCase() || 'draft') as TeachingListingStatus;
  const validStatus: TeachingListingStatus =
    statusNormalized === 'draft' ||
    statusNormalized === 'published' ||
    statusNormalized === 'paused' ||
    statusNormalized === 'archived'
      ? statusNormalized
      : 'draft';

  const price = typeof dto.price_amount === 'string' ? parseFloat(dto.price_amount) : Number(dto.price_amount);

  return {
    id: dto.id,
    teacherId: dto.teacher_id,
    categoryId: dto.category_id,
    categoryName: dto.category_name || CATEGORY_NAMES_BY_ID[dto.category_id] || 'General Skill',
    title: dto.title,
    description: dto.description,
    level: validLevel,
    priceAmount: isNaN(price) ? 0 : price,
    currency: dto.currency || 'INR',
    priceUnit: dto.price_unit || 'session',
    teachingMode: validMode,
    city: dto.city ?? null,
    area: dto.area ?? null,
    status: validStatus,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}
