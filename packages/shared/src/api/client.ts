import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { ApiError, ApiErrorKind } from './ApiError';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
const TIMEOUT_MS = 10_000;

/** One shared instance — never create axios instances in screens. */
const httpClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request interceptor ────────────────────────────────────────────────────
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Idempotency-Key for any state-mutating requests (future-proofing)
    if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
      config.headers['Idempotency-Key'] = generateIdempotencyKey();
    }

    // Auth header injection point — wire in a token store when auth is added
    // const token = TokenStore.get();
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error: unknown) => Promise.reject(normaliseError(error)),
);

// ─── Response interceptor ───────────────────────────────────────────────────
httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => Promise.reject(normaliseError(error)),
);

// ─── Error normalisation ────────────────────────────────────────────────────
function normaliseError(raw: unknown): ApiError {
  if (raw instanceof ApiError) return raw;

  if (axios.isCancel(raw)) {
    return new ApiError('timeout', 'Request was cancelled', raw);
  }

  if (axios.isAxiosError(raw)) {
    const axiosErr = raw as AxiosError;

    if (!axiosErr.response) {
      // Network error (DNS, ECONNREFUSED, timeout from axios)
      const isTimeout =
        axiosErr.code === 'ECONNABORTED' || axiosErr.code === 'ERR_CANCELED';
      const kind: ApiErrorKind = isTimeout ? 'timeout' : 'network';
      return new ApiError(kind, axiosErr.message, raw);
    }

    const status = axiosErr.response.status;
    const kind: ApiErrorKind = status >= 500 ? 'server' : 'client';
    return new ApiError(
      kind,
      `HTTP ${status}: ${axiosErr.message}`,
      raw,
      status,
    );
  }

  return new ApiError('unknown', String(raw), raw);
}

// ─── Generic typed fetch wrapper ────────────────────────────────────────────
/**
 * Every API call goes through this. Returns typed data directly.
 * AbortController is wired per-call for React Query cancellation.
 */
export async function apiFetch<T>(
  config: AxiosRequestConfig,
  signal?: AbortSignal,
): Promise<T> {
  const response = await httpClient.request<T>({ ...config, signal });
  return response.data;
}

// ─── Utilities ──────────────────────────────────────────────────────────────
function generateIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export { httpClient };
