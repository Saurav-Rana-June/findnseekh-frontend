import { Routes } from '@angular/router';
import { TeachersRepositoryImpl } from '../data/repositories/teachers.repository.impl';
import { TeachersRepository } from '../domain/repositories/teachers.repository';
import { GetTeachersUseCase } from '../domain/use-cases/get-teachers.use-case';
import { TeacherListPage } from './pages/teacher-list-page/teacher-list-page';
import { TeachersStore } from './state/teachers.store';

export const TEACHERS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      { provide: TeachersRepository, useClass: TeachersRepositoryImpl },
      GetTeachersUseCase,
      TeachersStore,
    ],
    children: [
      {
        path: '',
        component: TeacherListPage,
        title: 'Find Teachers & Mentors — FindnSeekh',
      },
    ],
  },
];

