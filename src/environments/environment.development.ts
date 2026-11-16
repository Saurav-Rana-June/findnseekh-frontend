import { type AppEnvironment, PrototypeUserRole } from './environment.model';

export const environment: AppEnvironment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000/api/v1',
  apiTimeoutMs: 30_000,
  appName: 'Findnseekh',
  /**
   * Set `prototypeMode` to `true` to run the entire project in Prototype Mode
   * without calling any backend APIs (for UI demonstrations and presentations).
   */
  prototypeMode: true,
  /**
   * Defines the active User Role in Prototype Mode:
   * - `PrototypeUserRole.STUDENT` (or 'STUDENT') -> Displays student-centric UI modules
   * - `PrototypeUserRole.TEACHER` (or 'TEACHER') -> Displays teacher-centric UI modules
   */
  prototypeUserRole: PrototypeUserRole.STUDENT,
};
