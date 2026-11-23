import { HttpContextToken } from '@angular/common/http';
import { InjectionToken, Provider } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PrototypeUserRole } from '../../../environments/environment.model';

export { PrototypeUserRole };

export interface ApiConfig {
  readonly baseUrl: string;
  readonly timeoutMs: number;
  readonly prototypeMode?: boolean;
  readonly prototypeUserRole?: PrototypeUserRole | null;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');

/**
 * Injection token indicating whether the application is running in Prototype Mode.
 * When `true`, all repositories return mock dummy data and zero network APIs are executed.
 */
export const PROTOTYPE_MODE = new InjectionToken<boolean>('PROTOTYPE_MODE', {
  providedIn: 'root',
  factory: () => environment.prototypeMode,
});

/**
 * Injection token defining the active user role for Prototype Mode ('STUDENT' | 'TEACHER').
 */
export const PROTOTYPE_USER_ROLE = new InjectionToken<PrototypeUserRole | null>(
  'PROTOTYPE_USER_ROLE',
  {
    providedIn: 'root',
    factory: () => environment.prototypeUserRole ?? null,
  },
);

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
    teacherProfileCreate: '/profile/teacher',
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
    list: '/skills',
    search: '/skills/search',
    popular: '/skills/popular',
    suggestions: '/skills/suggestions',
    mySkills: '/skills/my-skills',
    byTeacher: (userId: number | string) => `/skills/teachers/${userId}`,
    byCategory: (categoryId: number | string) => `/skills/categories/${categoryId}`,
    create: '/skills',
    detail: (id: number | string) => `/skills/${id}`,
    update: (id: number | string) => `/skills/${id}`,
    updateStatus: (id: number | string) => `/skills/${id}/status`,
    delete: (id: number | string) => `/skills/${id}`,
  },
  locations: {
    suggestions: '/locations/suggestions',
  },
  categories: {
    list: '/categories',
    detail: (id: number | string) => `/categories/${id}`,
  },
  requests: {
    create: '/requests',
    sent: '/requests/sent',
    received: '/requests/received',
    detail: (id: number | string) => `/requests/${id}`,
    accept: (id: number | string) => `/requests/${id}/accept`,
    reject: (id: number | string) => `/requests/${id}/reject`,
    cancel: (id: number | string) => `/requests/${id}/cancel`,
  },
} as const;

export function provideApiConfig(config: ApiConfig): Provider {
  return {
    provide: API_CONFIG,
    useValue: config,
  };
}

