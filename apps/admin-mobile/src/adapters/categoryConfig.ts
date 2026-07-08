import { PendingCategory, Colors } from '@clear-energy/shared';

/**
 * Visual config per PendingAction category.
 * Derived from the HTML mockup comments:
 * cash=emerald, mi_empty=amber, unassigned=violet, kyc=rose, prior_delivery=sky
 */
export interface CategoryConfig {
  label: string;
  icon: string;       // emoji — avoids icon-lib dependency
  color: string;      // border + header tint
  bgColor: string;
  textColor: string;
}

export const CATEGORY_CONFIG: Record<PendingCategory, CategoryConfig> = {
  cash: {
    label: 'Cash',
    icon: '💵',
    color: Colors.brand,
    bgColor: Colors.successBg,
    textColor: Colors.brandDark,
  },
  mi_empty: {
    label: 'MI Empty',
    icon: '📦',
    color: Colors.warning,
    bgColor: Colors.warningBg,
    textColor: Colors.warningText,
  },
  mi_full: {
    label: 'MI Full',
    icon: '📦',
    color: Colors.warning,
    bgColor: Colors.warningBg,
    textColor: Colors.warningText,
  },
  unassigned: {
    label: 'Unassigned orders',
    icon: '👤',
    color: Colors.info,
    bgColor: Colors.infoBg,
    textColor: Colors.infoText,
  },
  kyc: {
    label: 'KYC',
    icon: '🪪',
    color: Colors.danger,
    bgColor: Colors.dangerBg,
    textColor: Colors.dangerText,
  },
  prior_delivery: {
    label: 'Prior delivery',
    icon: '🚚',
    color: Colors.sky,
    bgColor: Colors.skyBg,
    textColor: Colors.skyText,
  },
  verification: {
    label: 'Verification',
    icon: '✅',
    color: Colors.brand,
    bgColor: Colors.successBg,
    textColor: Colors.brandDark,
  },
  branch_assign: {
    label: 'Branch assign',
    icon: '🏢',
    color: Colors.info,
    bgColor: Colors.infoBg,
    textColor: Colors.infoText,
  },
};
