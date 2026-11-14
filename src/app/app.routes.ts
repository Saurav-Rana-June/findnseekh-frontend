import { Routes } from '@angular/router';
import { APP_ROUTE_PATHS } from './core/constants/app.constants';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: APP_ROUTE_PATHS.root,
    component: MainLayout,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/home/presentation/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: APP_ROUTE_PATHS.profile,
        loadChildren: () =>
          import('./features/profile/presentation/profile.routes').then((m) => m.PROFILE_ROUTES),
      },
      {
        path: APP_ROUTE_PATHS.teachers,
        loadChildren: () =>
          import('./features/teachers/presentation/teachers.routes').then((m) => m.TEACHERS_ROUTES),
      },
    ],
  },
  {
    path: APP_ROUTE_PATHS.auth,
    component: AuthLayout,
    canActivate: [guestGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/auth/presentation/auth.routes').then((m) => m.AUTH_ROUTES),
      },
    ],
  },
  {
    path: APP_ROUTE_PATHS.admin,
    component: AdminLayout,
    canActivate: [authGuard],
    children: [],
  },
  {
    path: '**',
    redirectTo: APP_ROUTE_PATHS.root,
  },
];
