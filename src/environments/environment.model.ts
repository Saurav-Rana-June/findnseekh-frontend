/**
 * User roles available for Prototype Mode demonstration.
 */
export enum PrototypeUserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export interface AppEnvironment {
  readonly production: boolean;
  readonly apiBaseUrl: string;
  readonly apiTimeoutMs: number;
  readonly appName: string;
  /**
   * If `true`, the entire application runs in Prototype Mode:
   * no external backend APIs are called, and rich mock dummy data is returned.
   * Useful for UI demonstrations, testing, and offline presentations.
   */
  readonly prototypeMode: boolean;
  /**
   * Optional default role in Prototype Mode (`STUDENT` | `TEACHER`).
   * When `null`, the app starts logged out; users sign in via the UI.
   */
  readonly prototypeUserRole: PrototypeUserRole | null;
}
