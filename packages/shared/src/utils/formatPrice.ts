/**
 * Converts integer paise to a formatted Indian-locale rupee string.
 *
 * The API contract specifies money as paise (1/100 of a rupee),
 * identical to how Stripe uses cents. We format ONLY at the display layer.
 *
 * Examples:
 *   formatPrice(118000) → "₹1,180.00"
 *   formatPrice(100)    → "₹1.00"
 *   formatPrice(0)      → "₹0.00"
 *   formatPrice(487200) → "₹4,872.00"
 *
 * Uses Intl.NumberFormat with the 'en-IN' locale so digit grouping follows
 * the Indian system (e.g. 1,00,000 for one lakh). The `minimumFractionDigits`
 * of 2 ensures paise are always shown, matching accounting conventions.
 */
const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(paise: number): string {
  if (!Number.isFinite(paise)) {
    throw new TypeError(`formatPrice expects a finite number, got: ${paise}`);
  }
  const rupees = paise / 100;
  return formatter.format(rupees);
}

/**
 * Compact variant — strips paise when .00 for space-constrained UI contexts.
 * formatPriceCompact(118000) → "₹1,180"
 * formatPriceCompact(118050) → "₹1,180.50"
 */
export function formatPriceCompact(paise: number): string {
  if (!Number.isFinite(paise)) {
    throw new TypeError(`formatPriceCompact expects a finite number, got: ${paise}`);
  }
  const rupees = paise / 100;
  const hasPaise = paise % 100 !== 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: hasPaise ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(rupees);
}
