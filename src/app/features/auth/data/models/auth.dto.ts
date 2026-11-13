import {
  AuthTokens,
  AuthUser,
  LoginCredentials,
  RegisterPayload,
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
  readonly bio: string | null;
  readonly qualification?: string | null;
  readonly skills?: readonly string[] | string | null;
  readonly experience_years: number;
  readonly city: string | null;
  readonly state: string | null;
  readonly teaching_mode: TeachingMode;
  readonly is_verified: boolean;
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
