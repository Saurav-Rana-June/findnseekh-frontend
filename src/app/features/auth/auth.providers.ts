import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AuthRepositoryImpl } from './data/repositories/auth.repository.impl';
import { AuthApiService } from './data/services/auth-api.service';
import { AuthRepository } from './domain/repositories/auth.repository';
import { LoginUseCase } from './domain/use-cases/login.use-case';
import { AuthStore } from './presentation/state/auth.store';

export function provideAuth(): EnvironmentProviders {
  return makeEnvironmentProviders([
    AuthApiService,
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    LoginUseCase,
    AuthStore,
  ]);
}

