import { TripStop, TripStopStatus, OrderCardProps, StatusTone } from '@clear-energy/shared';

/**
 * Maps a TripStop to OrderCardProps.
 *
 * Driver-specific rules:
 * - `bordered` only for the active stop (creates the brand border from the mockup)
 * - `leading` content is a sequence number badge (except "done" which shows ✓)
 * - `meta` is the distance string
 * - `trailing` "Open" CTA is rendered by the screen, not this adapter,
 *    because the onPress handler requires navigation context
 */
export function stopToCardProps(
  stop: TripStop,
): Omit<OrderCardProps, 'leading' | 'trailing'> {
  return {
    id: stop.orderId,
    title: `${stop.customerName} · ${stop.sku}`,
    subtitle: stop.address,
    meta: `${stop.distanceKm} km`,
    statusLabel: statusLabel(stop.status, stop.etaMin),
    statusTone: statusTone(stop.status),
    bordered: stop.status === 'active',
  };
}

function statusLabel(status: TripStopStatus, etaMin?: number | null): string {
  switch (status) {
    case 'done':    return 'Completed';
    case 'active':  return etaMin != null ? `ETA ${etaMin} min` : 'En route';
    case 'pending': return 'Upcoming';
    case 'skipped': return 'Skipped';
  }
}

function statusTone(status: TripStopStatus): StatusTone {
  switch (status) {
    case 'done':    return 'success';
    case 'active':  return 'success';
    case 'pending': return 'neutral';
    case 'skipped': return 'warning';
  }
}
