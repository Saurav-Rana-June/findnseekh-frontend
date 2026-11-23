import { Routes } from '@angular/router';
import { RequestsRepositoryImpl } from '../../requests/data/repositories/requests.repository.impl';
import { RequestsApiService } from '../../requests/data/services/requests-api.service';
import { CreateLearningRequestUseCase } from '../../requests/domain/use-cases/create-learning-request.use-case';
import { RequestsRepository } from '../../requests/domain/repositories/requests.repository';
import { TeachersRepositoryImpl } from '../data/repositories/teachers.repository.impl';
import { TeachersApiService } from '../data/services/teachers-api.service';
import { TeachersRepository } from '../domain/repositories/teachers.repository';
import { GetTeacherByIdUseCase } from '../domain/use-cases/get-teacher-by-id.use-case';
import { GetTeachersUseCase } from '../domain/use-cases/get-teachers.use-case';
import { SendTeacherEnquiryUseCase } from '../domain/use-cases/send-teacher-enquiry.use-case';
import { TeacherListPage } from './pages/teacher-list-page/teacher-list-page';
import { TeachersStore } from './state/teachers.store';

export const TEACHERS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      TeachersApiService,
      RequestsApiService,
      { provide: TeachersRepository, useClass: TeachersRepositoryImpl },
      { provide: RequestsRepository, useClass: RequestsRepositoryImpl },
      GetTeachersUseCase,
      GetTeacherByIdUseCase,
      CreateLearningRequestUseCase,
      SendTeacherEnquiryUseCase,
      TeachersStore,
    ],
    children: [
      {
        path: '',
        component: TeacherListPage,
        title: 'Find Teachers & Mentors — FindnSeekh',
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/teacher-profile-page/teacher-profile-page').then(
            (m) => m.TeacherProfilePage,
          ),
        title: 'Teacher Profile — FindnSeekh',
      },
      {
        path: ':id/courses',
        loadComponent: () =>
          import('./pages/teacher-courses-page/teacher-courses-page').then(
            (m) => m.TeacherCoursesPage,
          ),
        title: 'Courses & Classes — FindnSeekh',
      },
    ],
  },
];

