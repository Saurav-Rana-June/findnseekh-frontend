export type UserRole = 'student' | 'teacher';
export type TeachingMode = 'online' | 'offline' | 'both';

export interface AuthUser {
  readonly id: number;
  readonly email: string;
  readonly fullName: string;
  readonly phone?: string | null;
  readonly isActive: boolean;
  readonly roles: readonly string[];
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly tokenType: string;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface RegisterPayload {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export interface UserProfileUpdatePayload {
  readonly name?: string;
  readonly phone?: string | null;
}

export interface TeacherProfile {
  readonly id: number;
  readonly userId: number;
  readonly bio: string | null;
  readonly qualification?: string | null;
  readonly experienceYears: number;
  readonly city: string | null;
  readonly state: string | null;
  readonly teachingMode: TeachingMode;
  readonly isVerified: boolean;
}

export interface TeacherProfileUpdatePayload {
  readonly bio?: string | null;
  readonly qualification?: string | null;
  readonly experienceYears?: number;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly teachingMode?: TeachingMode;
  readonly phone?: string | null;
}
