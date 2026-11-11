export const APP_STORAGE_KEYS = {
  accessToken: 'findnseekh_access_token',
  refreshToken: 'findnseekh_refresh_token',
} as const;

export const APP_ROUTE_PATHS = {
  root: '',
  auth: 'auth',
  login: 'login',
  register: 'register',
  admin: 'admin',
} as const;

export const HTTP_HEADERS = {
  authorization: 'Authorization',
  bearerPrefix: 'Bearer ',
} as const;

