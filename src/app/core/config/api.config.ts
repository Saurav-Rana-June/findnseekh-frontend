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
  home: {
    overview: '/home/overview',
  },
  teachers: {
    featured: '/teachers/featured',
    list: '/teachers',
    detail: (userId: number | string) => `/teachers/${userId}`,
    enquiry: (userId: number | string) => `/teachers/${userId}/enquiry`,
  },
  skills: {
    popular: '/skills/popular',
    suggestions: '/skills/suggestions',
  },
  locations: {
    suggestions: '/locations/suggestions',
  },
  categories: {
    list: '/categories',
    detail: (id: number | string) => `/categories/${id}`,
  },
} as const;

export function provideApiConfig(config: ApiConfig): Provider {
  return {
    provide: API_CONFIG,
    useValue: config,
  };
}

