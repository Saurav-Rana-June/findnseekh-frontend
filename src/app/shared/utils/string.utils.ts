export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

