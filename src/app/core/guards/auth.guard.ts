import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { APP_ROUTE_PATHS } from '../constants/app.constants';
import { AuthSessionService } from '../services/auth-session.service';

export const authGuard: CanActivateFn = () => {
  const authSession = inject(AuthSessionService);
  const router = inject(Router);

  if (authSession.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/', APP_ROUTE_PATHS.auth, APP_ROUTE_PATHS.login]);
};

export const guestGuard: CanActivateFn = () => {
  const authSession = inject(AuthSessionService);
  const router = inject(Router);

  if (!authSession.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/', APP_ROUTE_PATHS.root]);
};

