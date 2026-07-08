import {
  PendingAction,
  PendingCategory,
  PendingActionVerb,
  OrderCardProps,
  StatusTone,
} from '@clear-energy/shared';
import { formatAge } from '@clear-energy/shared';
import { CATEGORY_CONFIG } from './categoryConfig';

export interface CategoryGroup {
  category: PendingCategory;
  actions: PendingAction[];
  breachedCount: number;
}

/**
 * Groups a flat list of PendingActions by category.
 * Preserves API sort order (SLA-breach risk) within each group.
 */
export function groupByCategory(actions: PendingAction[]): CategoryGroup[] {
  const map = new Map<PendingCategory, PendingAction[]>();

  for (const action of actions) {
    const existing = map.get(action.category) ?? [];
    existing.push(action);
    map.set(action.category, existing);
  }

  return Array.from(map.entries()).map(([category, items]) => ({
    category,
    actions: items,
    breachedCount: items.filter((a) => isSlaBreached(a)).length,
  }));
}

export function isSlaBreached(action: PendingAction): boolean {
  return action.ageMinutes >= action.slaMinutes;
}

export function actionToCardProps(
  action: PendingAction,
): Omit<OrderCardProps, 'leading' | 'trailing'> {
  const breached = isSlaBreached(action);
  const cfg = CATEGORY_CONFIG[action.category];
  const ageLabel = formatAge(action.ageMinutes) + (breached ? ' ⚠' : '');

  return {
    id: action.id,
    title: action.summary,
    subtitle: `SLA ${formatAge(action.slaMinutes)} · ${ageLabel}`,
    statusLabel: breached ? 'SLA breached' : undefined,
    statusTone: breached ? 'danger' : priorityTone(action.priority),
    meta: formatAge(action.ageMinutes),
  };
}

export function actionVerbLabel(verb?: PendingActionVerb): string {
  switch (verb) {
    case 'approve': return 'Approve';
    case 'assign':  return 'Assign →';
    case 'route':   return 'Route';
    case 'decide':  return 'Decide';
    case 'remind':  return 'Remind';
    case 'review':  return 'Review';
    default:        return 'Act';
  }
}

function priorityTone(priority: PendingAction['priority']): StatusTone {
  switch (priority) {
    case 'breached': return 'danger';
    case 'high':     return 'warning';
    case 'med':      return 'neutral';
    case 'low':      return 'neutral';
  }
}
