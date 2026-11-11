import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SKIP_AUTH } from '../config/api.config';
import { HTTP_HEADERS } from '../constants/app.constants';
import { AuthSessionService } from '../services/auth-session.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  const token = inject(AuthSessionService).accessToken();
  if (!token) {
    return next(req);
  }

  const authenticatedRequest = req.clone({
    setHeaders: {
      [HTTP_HEADERS.authorization]: `${HTTP_HEADERS.bearerPrefix}${token}`,
    },
  });

  return next(authenticatedRequest);
};

