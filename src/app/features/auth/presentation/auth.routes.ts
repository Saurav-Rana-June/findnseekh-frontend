import { Routes } from '@angular/router';
import { APP_ROUTE_PATHS } from '../../../core/constants/app.constants';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: APP_ROUTE_PATHS.login,
        component: LoginPage,
        title: 'Sign In | Findnseekh',
      },
      {
        path: APP_ROUTE_PATHS.register,
        component: RegisterPage,
        title: 'Create Account | Findnseekh',
      },
      {
        path: '',
        redirectTo: APP_ROUTE_PATHS.login,
        pathMatch: 'full',
      },
    ],
  },
];

