import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AuthRepositoryImpl } from './data/repositories/auth.repository.impl';
import { AuthApiService } from './data/services/auth-api.service';
import { AuthRepository } from './domain/repositories/auth.repository';
import { BecomeTeacherUseCase } from './domain/use-cases/become-teacher.use-case';
import { GetStudentProfileUseCase } from './domain/use-cases/get-student-profile.use-case';
import { LoginUseCase } from './domain/use-cases/login.use-case';
import { RegisterUseCase } from './domain/use-cases/register.use-case';
import { UpdateStudentProfileUseCase } from './domain/use-cases/update-student-profile.use-case';
import { UpdateTeacherProfileUseCase } from './domain/use-cases/update-teacher-profile.use-case';
import { AuthStore } from './presentation/state/auth.store';

export function provideAuth(): EnvironmentProviders {
  return makeEnvironmentProviders([
    AuthApiService,
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    LoginUseCase,
    RegisterUseCase,
    BecomeTeacherUseCase,
    UpdateTeacherProfileUseCase,
    GetStudentProfileUseCase,
    UpdateStudentProfileUseCase,
    AuthStore,
  ]);
}
