/**
 * Mirrors openapi.yaml#/components/schemas/TripStop
 * Note: sku is a pre-formatted string from the backend (e.g. "14.2 kg × 1"),
 * NOT a structured object — the API has already denormalised it for this view.
 */
export type TripStopStatus = 'pending' | 'active' | 'done' | 'skipped';

export interface TripStop {
  seq: number;
  orderId: string;
  customerName: string;
  sku: string;
  address: string;
  distanceKm: number;
  status: TripStopStatus;
  etaMin?: number | null;
}
