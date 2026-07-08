/**
 * Mirrors openapi.yaml#/components/schemas/PendingAction
 * This is a denormalised SLA-inbox view, not a real domain entity.
 * The breach check (ageMinutes > slaMinutes) drives visual treatment
 * but lives in the admin adapter — not in this shared type.
 */
export type PendingCategory =
  | 'mi_empty'
  | 'mi_full'
  | 'cash'
  | 'prior_delivery'
  | 'unassigned'
  | 'verification'
  | 'branch_assign'
  | 'kyc';

export type PendingPriority = 'low' | 'med' | 'high' | 'breached';

export type PendingActionVerb =
  | 'approve'
  | 'route'
  | 'decide'
  | 'assign'
  | 'remind'
  | 'review';

export interface PendingAction {
  id: string;
  category: PendingCategory;
  summary: string;
  priority: PendingPriority;
  ageMinutes: number;
  slaMinutes: number;
  action?: PendingActionVerb;
}
