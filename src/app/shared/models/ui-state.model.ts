export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ViewState<T> {
  readonly data: T | null;
  readonly status: AsyncStatus;
  readonly error: string | null;
}

export interface SelectOption<T = string> {
  readonly label: string;
  readonly value: T;
  readonly disabled?: boolean;
}

