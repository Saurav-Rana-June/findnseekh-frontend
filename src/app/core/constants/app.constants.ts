export const APP_STORAGE_KEYS = {
  accessToken: 'findnseekh_access_token',
  refreshToken: 'findnseekh_refresh_token',
  locationPrompted: 'findnseekh_location_prompted',
  userLocation: 'findnseekh_user_location',
} as const;

export const APP_ROUTE_PATHS = {
  root: '',
  auth: 'auth',
  login: 'login',
  register: 'register',
  profile: 'profile',
  teachers: 'teachers',
  requests: 'requests',
  listings: 'listings',
  admin: 'admin',
} as const;

export const HTTP_HEADERS = {
  authorization: 'Authorization',
  bearerPrefix: 'Bearer ',
} as const;

