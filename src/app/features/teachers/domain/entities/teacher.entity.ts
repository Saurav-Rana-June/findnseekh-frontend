import { TeacherAvatarSpec } from '../../../../shared/components/teacher-avatar/teacher-avatar';
import { TeachingMode } from '../../../../shared/components/custom-teacher-card/custom-teacher-card';

export type SkillCategoryId =
  | 'music'
  | 'dance'
  | 'photography'
  | 'art-craft'
  | 'fitness-yoga'
  | 'cooking'
  | 'technology'
  | 'languages';

export interface Teacher {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly categoryId: SkillCategoryId;
  readonly specialty: string;
  readonly bio?: string;
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

