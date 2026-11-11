import { Routes } from '@angular/router';
import { APP_ROUTE_PATHS } from '../../../core/constants/app.constants';
import { AuthRepositoryImpl } from '../data/repositories/auth.repository.impl';
import { AuthApiService } from '../data/services/auth-api.service';
import { AuthRepository } from '../domain/repositories/auth.repository';
import { LoginUseCase } from '../domain/use-cases/login.use-case';
import { LoginPage } from './pages/login-page/login-page';
import { AuthStore } from './state/auth.store';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    providers: [
      AuthApiService,
      { provide: AuthRepository, useClass: AuthRepositoryImpl },
      LoginUseCase,
      AuthStore,
    ],
    children: [
      {
        path: APP_ROUTE_PATHS.login,
        component: LoginPage,
        title: 'Sign In | Findnseekh',
      },
      {
        path: '',
        redirectTo: APP_ROUTE_PATHS.login,
        pathMatch: 'full',
      },
    ],
  },
];

