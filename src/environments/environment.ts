export interface AppEnvironment {
  readonly production: boolean;
  readonly apiBaseUrl: string;
  readonly apiTimeoutMs: number;
  readonly appName: string;
}

export const environment: AppEnvironment = {
  production: true,
  apiBaseUrl: '/api/v1',
  apiTimeoutMs: 30_000,
  appName: 'Findnseekh',
};

