import { Routes } from '@angular/router';
import { HomeRepositoryImpl } from '../data/repositories/home.repository.impl';
import { HomeApiService } from '../data/services/home-api.service';
import { HomeRepository } from '../domain/repositories/home.repository';
import { GetHomeOverviewUseCase } from '../domain/use-cases/get-home-overview.use-case';
import { HomePage } from './pages/home-page/home-page';
import { HomeStore } from './state/home.store';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    providers: [
      HomeApiService,
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
