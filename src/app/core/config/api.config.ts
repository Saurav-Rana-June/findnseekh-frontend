import { HttpContextToken } from '@angular/common/http';
import { InjectionToken, Provider } from '@angular/core';

export interface ApiConfig {
  readonly baseUrl: string;
  readonly timeoutMs: number;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');

/**
 * Set to `true` on requests that must not carry an Authorization header
 * (for example, login, registration, or token refresh).
 */
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export const API_ENDPOINTS = {
  auth: {
    login: '/users/login',
    register: '/users/register',
    logout: '/users/logout',
    me: '/users/me',
    becomeTeacher: '/users/become-teacher',
    teacherProfileMe: '/profile/teacher/me',
    studentProfileMe: '/profile/student/me',
  },
} as const;

export function provideApiConfig(config: ApiConfig): Provider {
  return {
    provide: API_CONFIG,
    useValue: config,
  };
}

