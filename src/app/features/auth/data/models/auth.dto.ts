import {
  AuthTokens,
  AuthUser,
  LearningLevel,
  LoginCredentials,
  RegisterPayload,
  StudentProfile,
  StudentProfileUpdatePayload,
  TeacherProfile,
  TeacherProfileUpdatePayload,
  TeachingMode,
} from '../../domain/entities/auth.entity';

export interface LoginRequestDto {
  readonly email: string;
  readonly password: string;
}

export interface RegisterRequestDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export interface UserUpdateRequestDto {
  readonly name?: string;
  readonly phone?: string | null;
}

export interface TeacherProfileUpdateRequestDto {
  readonly bio?: string | null;
  readonly qualification?: string | null;
  readonly skills?: readonly string[];
  readonly experience_years?: number;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly teaching_mode?: TeachingMode;
  readonly phone?: string | null;
}

export interface AuthUserDto {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly phone?: string | null;
  readonly is_active: boolean;
  readonly roles?: readonly string[];
}

export interface TokenResponseDto {
  readonly access_token: string;
  readonly token_type: string;
}

export interface TeacherProfileDto {
  readonly id: number;
  readonly user_id: number;
  readonly phone?: string | null;
  readonly bio: string | null;
  readonly qualification?: string | null;
  readonly skills?: readonly string[] | string | null;
  readonly experience_years: number;
  readonly city: string | null;
  readonly state: string | null;
  readonly teaching_mode: TeachingMode;
  readonly is_verified: boolean;
}

export interface StudentProfileDto {
  readonly id: number;
  readonly user_id: number;
  readonly phone?: string | null;
  readonly city: string | null;
  readonly state: string | null;
  readonly learning_mode: TeachingMode;
  readonly learning_level: LearningLevel;
  readonly learning_goals: string | null;
  readonly skills_to_learn?: readonly string[] | string | null;
}

export interface StudentProfileUpdateRequestDto {
  readonly phone?: string | null;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly learning_mode?: TeachingMode;
  readonly learning_level?: LearningLevel;
  readonly learning_goals?: string | null;
  readonly skills_to_learn?: string[];
}

export function toLoginRequestDto(credentials: LoginCredentials): LoginRequestDto {
  return {
    email: credentials.email.trim().toLowerCase(),
    password: credentials.password,
  };
}

export function toRegisterRequestDto(payload: RegisterPayload): RegisterRequestDto {
  return {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  };
}

export function toTeacherProfileUpdateRequestDto(
  payload: TeacherProfileUpdatePayload,
): TeacherProfileUpdateRequestDto {
  return {
    bio: payload.bio?.trim() || null,
    qualification: payload.qualification?.trim() || null,
    skills: payload.skills ? Array.from(payload.skills) : undefined,
    experience_years: payload.experienceYears ?? 0,
    city: payload.city?.trim() || null,
    state: payload.state?.trim() || null,
    teaching_mode: payload.teachingMode ?? 'both',
    phone: payload.phone?.trim() || null,
  };
}

export function toAuthUser(dto: AuthUserDto): AuthUser {
  return {
    id: dto.id,
    email: dto.email,
    fullName: dto.name,
    phone: dto.phone ?? null,
    isActive: dto.is_active,
    roles: dto.roles ?? ['student'],
  };
}

export function toAuthTokens(dto: TokenResponseDto): AuthTokens {
  return {
    accessToken: dto.access_token,
    tokenType: dto.token_type,
  };
}

export function toTeacherProfile(dto: TeacherProfileDto): TeacherProfile {
  let skills: readonly string[] | undefined;
  if (Array.isArray(dto.skills)) {
    skills = dto.skills;
  } else if (typeof dto.skills === 'string') {
    try {
      const parsed = JSON.parse(dto.skills);
      skills = Array.isArray(parsed) ? parsed : [dto.skills];
    } catch {
      skills = dto.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  return {
    id: dto.id,
    userId: dto.user_id,
    phone: dto.phone ?? null,
    bio: dto.bio,
    qualification: dto.qualification ?? null,
    skills: skills ?? [],
    experienceYears: dto.experience_years,
    city: dto.city,
    state: dto.state,
    teachingMode: dto.teaching_mode,
    isVerified: dto.is_verified,
  };
}

export function toStudentProfileUpdateRequestDto(
  payload: StudentProfileUpdatePayload,
): StudentProfileUpdateRequestDto {
  return {
    phone: payload.phone?.trim() || null,
    city: payload.city?.trim() || null,
    state: payload.state?.trim() || null,
    learning_mode: payload.learningMode ?? 'both',
    learning_level: payload.learningLevel ?? 'beginner',
    learning_goals: payload.learningGoals?.trim() || null,
    skills_to_learn: payload.skillsToLearn ? Array.from(payload.skillsToLearn) : undefined,
  };
}

export function toStudentProfile(dto: StudentProfileDto): StudentProfile {
  let skillsToLearn: readonly string[] | undefined;
  if (Array.isArray(dto.skills_to_learn)) {
    skillsToLearn = dto.skills_to_learn;
  } else if (typeof dto.skills_to_learn === 'string') {
    try {
      const parsed = JSON.parse(dto.skills_to_learn);
      skillsToLearn = Array.isArray(parsed) ? parsed : [dto.skills_to_learn];
    } catch {
      skillsToLearn = dto.skills_to_learn.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  return {
    id: dto.id,
    userId: dto.user_id,
    phone: dto.phone ?? null,
    city: dto.city,
    state: dto.state,
    learningMode: dto.learning_mode,
    learningLevel: dto.learning_level,
    learningGoals: dto.learning_goals,
    skillsToLearn: skillsToLearn ?? [],
  };
}
