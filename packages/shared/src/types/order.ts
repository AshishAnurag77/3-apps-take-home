/**
 * Mirrors openapi.yaml#/components/schemas/Order
 * Money is always integer paise — format on display, never store as float.
 */
export type OrderStatus =
  | 'placed'
  | 'assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderSku {
  code: string;
  name: string;
  qty?: number;
}

export interface Order {
  id: string;
  customerName: string;
  address: string;
  amountPaise: number;
  sku: OrderSku;
  status: OrderStatus;
  placedAt: string; // ISO 8601 UTC
  eta?: string | null; // ISO 8601 UTC
}
