import {
  FeaturedTeacher,
  HomeOverview,
  HowItWorksStep,
  LocationSuggestion,
  SkillCategory,
  SkillCategoryIcon,
  SkillSuggestion,
  TeacherAvatarSpec,
} from '../../domain/entities/home.entity';

export interface CategoryDto {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly description: string | null;
  readonly is_active: boolean;
}

export interface PopularSkillDto {
  readonly name: string;
  readonly category: string;
  readonly category_slug: string;
  readonly count?: number;
}

export interface LocationSuggestionDto {
  readonly city: string;
  readonly state: string | null;
  readonly display: string;
  readonly teacher_count?: number;
}

export interface TeacherCardDto {
  readonly id: number;
  readonly user_id: number;
  readonly name: string;
  readonly specialty: string;
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

export interface HomeOverviewDto {
  readonly categories: readonly CategoryDto[];
  readonly popular_skills: readonly PopularSkillDto[];
  readonly locations: readonly LocationSuggestionDto[];
  readonly featured_teachers: readonly TeacherCardDto[];
  readonly stats?: Record<string, unknown>;
}

export const DEFAULT_AVATARS: readonly TeacherAvatarSpec[] = [
  { skin: '#C68B63', hair: '#1F2937', hairStyle: 'long', outfit: '#174E38', background: '#DCE9E1' },
  { skin: '#A8714B', hair: '#2B1D16', hairStyle: 'short', outfit: '#5B8F76', background: '#DCE9E1' },
  { skin: '#D9A07A', hair: '#2B1D16', hairStyle: 'bun', outfit: '#1F6048', background: '#DCE9E1' },
  { skin: '#A8714B', hair: '#2B1D16', hairStyle: 'short', outfit: '#174E38', background: '#DCE9E1' },
  { skin: '#E0AC85', hair: '#3A2A20', hairStyle: 'long', outfit: '#7FA894', background: '#DCE9E1' },
  { skin: '#9C6642', hair: '#1F2937', hairStyle: 'short', outfit: '#2E4A3F', background: '#DCE9E1' },
];

export function normalizeCategorySlug(slugOrName: string): SkillCategoryIcon {
  const normalized = (slugOrName || '').toLowerCase().trim();
  if (normalized.includes('music')) return 'music';
  if (normalized.includes('dance')) return 'dance';
  if (normalized.includes('photograph')) return 'photography';
  if (normalized.includes('art') || normalized.includes('craft')) return 'art-craft';
  if (normalized.includes('fitness') || normalized.includes('yoga')) return 'fitness-yoga';
  if (normalized.includes('cook') || normalized.includes('baking')) return 'cooking';
  if (
    normalized.includes('tech') ||
    normalized.includes('code') ||
    normalized.includes('program')
  ) {
    return 'technology';
  }
  if (normalized.includes('lang') || normalized.includes('english')) return 'languages';
  return 'music';
}

export function getTeacherAvatarSpec(index: number, name?: string): TeacherAvatarSpec {
  if (name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % DEFAULT_AVATARS.length;
    return DEFAULT_AVATARS[idx];
  }
  return DEFAULT_AVATARS[index % DEFAULT_AVATARS.length];
}

const CATEGORY_DESCRIPTIONS: Record<SkillCategoryIcon, string> = {
  music: 'Vocals, guitar, keys, tabla and more.',
  dance: 'Classical, Bollywood, hip-hop and freestyle.',
  photography: 'Compose, shoot and edit like a pro.',
  'art-craft': 'Drawing, painting, pottery and DIY.',
  'fitness-yoga': 'Yoga, strength and mindful movement.',
  cooking: 'Home recipes, baking and regional cuisines.',
  technology: 'Coding, design tools and digital skills.',
  languages: 'Spoken English, Hindi, French and more.',
};

export function toSkillCategory(dto: CategoryDto): SkillCategory {
  const icon = normalizeCategorySlug(dto.slug || dto.name);
  return {
    id: icon,
    title: dto.name,
    description: dto.description || CATEGORY_DESCRIPTIONS[icon] || '',
  };
}

export function toSkillSuggestion(dto: PopularSkillDto): SkillSuggestion {
  return {
    label: dto.name,
    category: normalizeCategorySlug(dto.category_slug || dto.category),
  };
}

export function toLocationSuggestion(dto: LocationSuggestionDto): LocationSuggestion {
  return {
    city: dto.city,
    region: dto.state || '',
  };
}

export function toFeaturedTeacher(dto: TeacherCardDto, index: number): FeaturedTeacher {
  const mode = dto.teaching_mode === 'online' || dto.teaching_mode === 'offline' ? dto.teaching_mode : 'both';
  const categoryId = normalizeCategorySlug(dto.specialty || '');

  return {
    id: String(dto.user_id || dto.id),
    name: dto.name,
    category: dto.specialty || 'General',
    categoryId,
    specialty: dto.specialty,
    location: dto.location || [dto.city, dto.state].filter(Boolean).join(', ') || 'Flexible',
    experienceYears: dto.experience_years || 1,
    rating: {
      value: Number(dto.rating) || 4.8,
      count: dto.reviews_count || 12,
    },
    avatar: getTeacherAvatarSpec(index, dto.name),
    skills: dto.skills || [],
    teachingMode: mode,
    hourlyRate: Number(dto.hourly_rate) || 500,
    bio: dto.bio || undefined,
    verified: dto.is_verified,
  };
}

const DEFAULT_STEPS: readonly HowItWorksStep[] = [
  {
    stepNumber: 1,
    icon: 'discover',
    title: 'Discover',
    description: 'Search for the skill you want to learn in your city.',
  },
  {
    stepNumber: 2,
    icon: 'explore',
    title: 'Explore',
    description: 'Browse teachers and their profiles to compare experience.',
  },
  {
    stepNumber: 3,
    icon: 'connect',
    title: 'Connect',
    description: 'Find the right teacher and start learning.',
  },
];

export function toHomeOverview(dto: HomeOverviewDto): HomeOverview {
  const categories = (dto.categories || []).map(toSkillCategory);
  const popularSkills = (dto.popular_skills || []).map(toSkillSuggestion);
  const locationSuggestions = (dto.locations || []).map(toLocationSuggestion);
  const featuredTeachers = (dto.featured_teachers || []).map(toFeaturedTeacher);

  // Derive skill suggestions from popular skills and categories
  const skillSuggestions: SkillSuggestion[] = popularSkills.length > 0 ? popularSkills : [];

  return {
    popularSkills,
    locationSuggestions,
    skillSuggestions,
    categories,
    featuredTeachers,
    steps: DEFAULT_STEPS,
  };
}

