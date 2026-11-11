import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import {
  ApiError,
  FastApiErrorPayload,
  FastApiValidationError,
} from '../models/api-error.model';
import { AuthSessionService } from '../services/auth-session.service';

function normalizeErrorPayload(error: HttpErrorResponse): ApiError {
  const payload = error.error as FastApiErrorPayload | string | null | undefined;

  if (typeof payload === 'string' && payload.trim().length > 0) {
    return {
      status: error.status,
      message: payload,
      originalError: error,
    };
  }

  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.detail)) {
      const validationErrors = payload.detail as readonly FastApiValidationError[];
      const firstMessage = validationErrors[0]?.msg ?? 'Validation error.';
      return {
        status: error.status,
        message: firstMessage,
        validationErrors,
        originalError: error,
      };
    }

    if (typeof payload.detail === 'string' && payload.detail.trim().length > 0) {
      return {
        status: error.status,
        message: payload.detail,
        originalError: error,
      };
    }

    if (typeof payload.message === 'string' && payload.message.trim().length > 0) {
      return {
        status: error.status,
        message: payload.message,
        originalError: error,
      };
    }
  }

  return {
    status: error.status,
    message: error.message || 'An unexpected network error occurred.',
    originalError: error,
  };
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authSession = inject(AuthSessionService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(
          (): ApiError => ({
            status: 0,
            message: error instanceof Error ? error.message : 'An unexpected error occurred.',
            originalError: error,
          }),
        );
      }

      if (error.status === 401) {
        authSession.clearSession();
      }

      return throwError(() => normalizeErrorPayload(error));
    }),
  );
};

