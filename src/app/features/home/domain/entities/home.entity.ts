export type SkillCategoryIcon =
  | 'music'
  | 'dance'
  | 'photography'
  | 'art-craft'
  | 'fitness-yoga'
  | 'cooking'
  | 'technology'
  | 'languages';

export interface SkillCategory {
  readonly id: SkillCategoryIcon;
  readonly title: string;
  readonly description: string;
}

export type TeacherAvatarVariant =
  | 'ananya'
  | 'rohan'
  | 'kavya'
  | 'imran'
  | 'simran'
  | 'arjun';

export interface FeaturedTeacher {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly specialty: string;
  readonly location: string;
  readonly experienceYears: number;
  readonly rating?: number;
  readonly reviewCount?: number;
  readonly avatarVariant: TeacherAvatarVariant;
}

export interface HowItWorksStep {
  readonly stepNumber: number;
  readonly icon: 'discover' | 'explore' | 'connect';
  readonly title: string;
  readonly description: string;
}

export interface HomeOverview {
  readonly popularSkills: readonly string[];
  readonly categories: readonly SkillCategory[];
  readonly featuredTeachers: readonly FeaturedTeacher[];
  readonly steps: readonly HowItWorksStep[];
}

export interface TeacherSearchQuery {
  readonly location: string;
  readonly skill: string;
}

