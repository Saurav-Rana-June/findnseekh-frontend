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
}
