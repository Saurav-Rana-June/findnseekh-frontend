export interface FastApiValidationError {
  readonly loc: readonly (string | number)[];
  readonly msg: string;
  readonly type: string;
}

export interface FastApiErrorPayload {
  readonly detail?: string | readonly FastApiValidationError[];
  readonly message?: string;
}

export interface ApiError {
  readonly status: number;
  readonly message: string;
  readonly validationErrors?: readonly FastApiValidationError[];
  readonly originalError?: unknown;
}

