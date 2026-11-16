import type { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: true,
  apiBaseUrl: '/api/v1',
  apiTimeoutMs: 30_000,
  appName: 'Findnseekh',
  prototypeMode: false,
};
