import { AuthTokens, AuthUser, LoginCredentials } from '../../domain/entities/auth.entity';

export interface LoginRequestDto {
  readonly email: string;
  readonly password: string;
}

export interface AuthUserDto {
  readonly id: string;
  readonly email: string;
  readonly full_name: string;
  readonly role: string;
}

export interface TokenResponseDto {
  readonly access_token: string;
  readonly refresh_token?: string;
  readonly token_type: string;
  readonly user: AuthUserDto;
}

export function toLoginRequestDto(credentials: LoginCredentials): LoginRequestDto {
  return {
    email: credentials.email.trim(),
    password: credentials.password,
  };
}

export function toAuthUser(dto: AuthUserDto): AuthUser {
  return {
    id: dto.id,
    email: dto.email,
    fullName: dto.full_name,
    role: dto.role,
  };
}

export function toAuthTokens(dto: TokenResponseDto): AuthTokens {
  return {
    accessToken: dto.access_token,
    refreshToken: dto.refresh_token,
  };
}

