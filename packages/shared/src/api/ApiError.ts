/**
 * Canonical error shape for everything that can go wrong in the API layer.
 * Screens pattern-match on `kind`, never on axios internals.
 */
export type ApiErrorKind =
  | 'network'      // no connectivity / ECONNREFUSED / timeout
  | 'timeout'      // request aborted by our AbortController
  | 'server'       // 5xx
  | 'client'       // 4xx (including 404)
  | 'unknown';

export class ApiError extends Error {
  public readonly kind: ApiErrorKind;
  public readonly statusCode?: number;
  public readonly originalError: unknown;

  constructor(
    kind: ApiErrorKind,
    message: string,
    originalError: unknown,
    statusCode?: number,
  ) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.statusCode = statusCode;
    this.originalError = originalError;

    // Maintain proper prototype chain in transpiled environments
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  get isRetryable(): boolean {
    return this.kind === 'network' || this.kind === 'server' || this.kind === 'timeout';
  }
}
