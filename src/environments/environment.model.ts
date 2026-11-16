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
   * Defines the active User Role in Prototype Mode ('STUDENT' or 'TEACHER').
   * All UI modules and permissions across screens adapt dynamically to this role.
   */
  readonly prototypeUserRole: PrototypeUserRole;
}
