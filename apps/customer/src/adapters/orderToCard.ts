import { Order, OrderStatus, OrderCardProps, StatusTone } from '@clear-energy/shared';
import { formatOrderDate } from '@clear-energy/shared';

/**
 * Maps an Order (domain type) to OrderCardProps (presentational type).
 * This is where Customer-specific business rules live:
 * - Which status label text to show
 * - Which status tone (colour) to use
 * - What the "meta" right-side text should be
 *
 * The shared OrderCard knows nothing about these rules.
 */
export function orderToCardProps(order: Order): Omit<OrderCardProps, 'leading'> {
  return {
    id: order.id,
    title: order.sku.name,
    subtitle: order.address,
    meta: formatOrderDate(order.placedAt),
    statusLabel: statusLabel(order.status),
    statusTone: statusTone(order.status),
  };
}

function statusLabel(status: OrderStatus): string {
  switch (status) {
    case 'placed':         return 'Order placed';
    case 'assigned':       return 'Driver assigned';
    case 'out_for_delivery': return 'Out for delivery';
    case 'delivered':      return 'Delivered';
    case 'cancelled':      return 'Cancelled · Refund processed';
    case 'returned':       return 'Returned';
  }
}

function statusTone(status: OrderStatus): StatusTone {
  switch (status) {
    case 'out_for_delivery':
    case 'assigned':       return 'success';
    case 'placed':         return 'neutral';
    case 'delivered':      return 'neutral';
    case 'cancelled':
    case 'returned':       return 'danger';
  }
}
