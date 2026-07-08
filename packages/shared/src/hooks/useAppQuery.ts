import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
  QueryKey,
} from '@tanstack/react-query';
import { ApiError } from '../api/ApiError';

/**
 * Typed wrapper around useQuery with project-wide defaults.
 *
 * Design decisions:
 * - `retry` only for retryable errors (network / server / timeout) — never for
 *   4xx client errors, because retrying a 404 wastes bandwidth and confuses users.
 * - `staleTime` of 30s matches a "list screen" mental model — data is fresh
 *   enough to navigate around without a spinner, but polling is off by default.
 * - AbortSignal is forwarded to the fetch function via `queryFn` so React Query
 *   can cancel in-flight requests on component unmount.
 */
export function useAppQuery<TData>(
  options: UseQueryOptions<TData, ApiError>,
): UseQueryResult<TData, ApiError> {
  return useQuery<TData, ApiError>({
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && !error.isRetryable) return false;
      return failureCount < 2;
    },
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    ...options,
  });
}

export type { QueryKey };
