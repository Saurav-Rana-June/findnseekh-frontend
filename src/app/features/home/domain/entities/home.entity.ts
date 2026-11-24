import { SkillCategoryIcon } from '../../../../shared/components/custom-skill-category-card/custom-skill-category-card';
import { TeachingMode } from '../../../../shared/components/custom-teacher-card/custom-teacher-card';

export type { SkillCategoryIcon };

export interface SkillCategory {
  readonly id: SkillCategoryIcon;
  readonly title: string;
  readonly description: string;
}

export interface SkillSuggestion {
  readonly label: string;
  readonly category: SkillCategoryIcon;
}

export interface LocationSuggestion {
  readonly city: string;
  readonly region: string;
}

export type TeacherHairStyle = 'short' | 'long' | 'bun' | 'curly';

export interface TeacherAvatarSpec {
  readonly skin: string;
  readonly hair: string;
  readonly hairStyle: TeacherHairStyle;
  readonly outfit: string;
  readonly background: string;
}

export interface FeaturedTeacher {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly categoryId: SkillCategoryIcon;
  readonly specialty: string;
  readonly location: string;
  readonly experienceYears: number;
  readonly rating?: { readonly value: number; readonly count: number };
  readonly avatar: TeacherAvatarSpec;
  readonly skills?: readonly string[];
  readonly teachingMode?: TeachingMode;
  readonly hourlyRate?: number;
  readonly bio?: string;
  readonly verified?: boolean;
}

export interface HowItWorksStep {
  readonly stepNumber: number;
  readonly icon: 'discover' | 'explore' | 'connect';
  readonly title: string;
  readonly description: string;
}

export interface HomeOverview {
  readonly popularSkills: readonly SkillSuggestion[];
  readonly locationSuggestions: readonly LocationSuggestion[];
  readonly skillSuggestions: readonly SkillSuggestion[];
  readonly categories: readonly SkillCategory[];
  readonly featuredTeachers: readonly FeaturedTeacher[];
  readonly steps: readonly HowItWorksStep[];
}

export interface TeacherSearchQuery {
  readonly location: string;
  readonly skill: string;
}
