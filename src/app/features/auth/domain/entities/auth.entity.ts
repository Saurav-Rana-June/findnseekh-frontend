export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly role: string;
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken?: string;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

