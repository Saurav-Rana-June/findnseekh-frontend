import { Routes } from '@angular/router';
import { TeachersRepositoryImpl } from '../data/repositories/teachers.repository.impl';
import { TeachersRepository } from '../domain/repositories/teachers.repository';
import { GetTeacherByIdUseCase } from '../domain/use-cases/get-teacher-by-id.use-case';
import { GetTeachersUseCase } from '../domain/use-cases/get-teachers.use-case';
import { TeacherListPage } from './pages/teacher-list-page/teacher-list-page';
import { TeachersStore } from './state/teachers.store';

export const TEACHERS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      { provide: TeachersRepository, useClass: TeachersRepositoryImpl },
      GetTeachersUseCase,
      GetTeacherByIdUseCase,
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
    ],
  },
];

