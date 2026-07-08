/**
 * Design tokens — derived directly from the mockup CSS variables and Tailwind
 * classes used across all three HTML mockups.
 *
 * Rule: apps import from here. No colour literals anywhere else.
 */

export const Colors = {
  // Brand — matches mockup `--brand` and `--brand-dark`
  brand: '#0F766E',
  brandDark: '#0E5D56',

  // Semantic status tones (used by OrderCard statusTone prop)
  success: '#10b981',     // emerald-500 — active/out_for_delivery
  successBg: '#d1fae5',   // emerald-100
  successText: '#065f46', // emerald-900

  warning: '#f59e0b',     // amber-500 — mi_empty category
  warningBg: '#fef3c7',   // amber-100
  warningText: '#92400e', // amber-800

  danger: '#f43f5e',      // rose-500 — cancelled / SLA breached
  dangerBg: '#ffe4e6',    // rose-100
  dangerText: '#9f1239',  // rose-800

  info: '#8b5cf6',        // violet-500 — unassigned category
  infoBg: '#ede9fe',      // violet-100
  infoText: '#5b21b6',    // violet-800

  sky: '#0ea5e9',         // sky-500 — prior_delivery category
  skyBg: '#e0f2fe',
  skyText: '#0369a1',

  // Neutral surface / text scale (slate)
  background: '#f8fafc',  // slate-50
  surface: '#ffffff',
  border: '#f1f5f9',      // slate-100
  borderMuted: '#e2e8f0', // slate-200

  textPrimary: '#0f172a', // slate-900
  textSecondary: '#475569', // slate-600
  textMuted: '#94a3b8',   // slate-400
  textDisabled: '#cbd5e1', // slate-300
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,   // card radius matches mockup `rounded-2xl`
  full: 9999,
} as const;

export const FontSize = {
  xs: 10,
  sm: 11,
  base: 12,
  md: 13,
  lg: 14,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  display: 30,
} as const;

export const FontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
