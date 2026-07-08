import { Order } from '../types/order';
import { TripStop } from '../types/trip';
import { PendingAction } from '../types/pendingAction';
import { apiFetch } from './client';

// ─── Query key factory ───────────────────────────────────────────────────────
/**
 * Centralised query key factory.
 * Using object descriptors (not raw strings) makes cache invalidation precise.
 */
export const queryKeys = {
  orders: (customerId: string) =>
    [{ scope: 'orders', customerId }] as const,
  trips: (driverId: string) =>
    [{ scope: 'trips', driverId }] as const,
  pendingActions: (adminId: string) =>
    [{ scope: 'pendingActions', adminId }] as const,
} as const;

// ─── Endpoint functions ──────────────────────────────────────────────────────

export interface FetchOrdersParams {
  customerId: string;
  limit?: number;
  signal?: AbortSignal;
}

export async function fetchOrders({
  customerId,
  limit = 20,
  signal,
}: FetchOrdersParams): Promise<Order[]> {
  return apiFetch<Order[]>(
    { method: 'GET', url: '/orders', params: { customerId, limit } },
    signal,
  );
}

export interface FetchTripsParams {
  driverId: string;
  signal?: AbortSignal;
}

export async function fetchTrips({
  driverId,
  signal,
}: FetchTripsParams): Promise<TripStop[]> {
  return apiFetch<TripStop[]>(
    { method: 'GET', url: '/trips', params: { driverId } },
    signal,
  );
}

export interface FetchPendingActionsParams {
  adminId: string;
  signal?: AbortSignal;
}

export async function fetchPendingActions({
  adminId,
  signal,
}: FetchPendingActionsParams): Promise<PendingAction[]> {
  return apiFetch<PendingAction[]>(
    { method: 'GET', url: '/pending-actions', params: { adminId } },
    signal,
  );
}
