import type { AppEnvironment } from './environment';

export const environment: AppEnvironment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000/api/v1',
  apiTimeoutMs: 30_000,
  appName: 'Findnseekh',
};

