import { Routes } from '@angular/router';
import { RequestsRepositoryImpl } from '../data/repositories/requests.repository.impl';
import { RequestsApiService } from '../data/services/requests-api.service';
import { RequestsRepository } from '../domain/repositories/requests.repository';
import { AcceptRequestUseCase } from '../domain/use-cases/accept-request.use-case';
import { CancelRequestUseCase } from '../domain/use-cases/cancel-request.use-case';
import { GetReceivedRequestsUseCase } from '../domain/use-cases/get-received-requests.use-case';
import { GetSentRequestsUseCase } from '../domain/use-cases/get-sent-requests.use-case';
import { CreateLearningRequestUseCase } from '../domain/use-cases/create-learning-request.use-case';
import { RejectRequestUseCase } from '../domain/use-cases/reject-request.use-case';
import { RequestsPage } from './pages/requests-page/requests-page';
import { RequestsStore } from './state/requests.store';

export const REQUESTS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      RequestsApiService,
      { provide: RequestsRepository, useClass: RequestsRepositoryImpl },
      GetSentRequestsUseCase,
      GetReceivedRequestsUseCase,
      CreateLearningRequestUseCase,
      AcceptRequestUseCase,
      RejectRequestUseCase,
      CancelRequestUseCase,
      RequestsStore,
    ],
    children: [
      {
        path: '',
        component: RequestsPage,
        title: 'My Learning Requests & Enquiries — FindnSeekh',
      },
    ],
  },
];

