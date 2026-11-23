import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../environments/environment';
import { PROTOTYPE_MODE, PROTOTYPE_USER_ROLE, provideApiConfig } from './config/api.config';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { etagInterceptor } from './interceptors/etag.interceptor';

export function provideCore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideApiConfig({
      baseUrl: environment.apiBaseUrl,
      timeoutMs: environment.apiTimeoutMs,
      prototypeMode: environment.prototypeMode,
      prototypeUserRole: environment.prototypeUserRole ?? null,
    }),
    {
      provide: PROTOTYPE_MODE,
      useValue: environment.prototypeMode,
    },
    {
      provide: PROTOTYPE_USER_ROLE,
      useValue: environment.prototypeUserRole ?? null,
    },
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, etagInterceptor, errorInterceptor]),
    ),
  ]);
}

