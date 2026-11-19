import { TeachingMode } from '../../../../shared/components/custom-teacher-card/custom-teacher-card';

export type TeachingListingStatus = 'draft' | 'published' | 'paused' | 'archived';
export type TeachingLevel = 'beginner' | 'intermediate' | 'advanced' | 'all_levels';

export interface TeachingListing {
  readonly id: number;
  readonly teacherId: number;
  readonly categoryId: number;
  readonly categoryName?: string;
  readonly title: string;
  readonly description: string;
  readonly level: TeachingLevel;
  readonly priceAmount: number;
  readonly currency: string;
  readonly priceUnit: string;
  readonly teachingMode: TeachingMode;
  readonly city?: string | null;
  readonly area?: string | null;
  readonly status: TeachingListingStatus;
  readonly createdAt: string;
  readonly updatedAt?: string;
}

export interface CreateListingInput {
  readonly title: string;
  readonly description: string;
  readonly categoryId: number;
  readonly level: TeachingLevel;
  readonly priceAmount: number;
  readonly currency?: string;
  readonly priceUnit?: string;
  readonly teachingMode: TeachingMode;
  readonly city?: string | null;
  readonly area?: string | null;
  readonly status?: TeachingListingStatus;
}

export interface UpdateListingInput {
  readonly title?: string;
  readonly description?: string;
  readonly categoryId?: number;
  readonly level?: TeachingLevel;
  readonly priceAmount?: number;
  readonly currency?: string;
  readonly priceUnit?: string;
  readonly teachingMode?: TeachingMode;
  readonly city?: string | null;
  readonly area?: string | null;
}
