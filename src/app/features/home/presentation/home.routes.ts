import { Routes } from '@angular/router';
import { HomeRepositoryImpl } from '../data/repositories/home.repository.impl';
import { HomeRepository } from '../domain/repositories/home.repository';
import { GetHomeOverviewUseCase } from '../domain/use-cases/get-home-overview.use-case';
import { HomePage } from './pages/home-page/home-page';
import { HomeStore } from './state/home.store';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    providers: [
      { provide: HomeRepository, useClass: HomeRepositoryImpl },
      GetHomeOverviewUseCase,
      HomeStore,
    ],
    children: [
      {
        path: '',
        component: HomePage,
        title: 'FindnSeekh',
      },
    ],
  },
];
