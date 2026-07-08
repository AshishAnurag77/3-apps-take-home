import { formatPrice, formatPriceCompact } from '../utils/formatPrice';

/**
 * Intl.NumberFormat output for 'en-IN' can vary slightly across Node versions
 * (e.g. narrow no-break space vs regular space before the currency symbol).
 * We normalise whitespace in assertions to make tests portable.
 */
function normalise(s: string): string {
  return s.replace(/\s/g, ' ').trim();
}

describe('formatPrice', () => {
  it('formats a typical LPG order amount (₹1,180)', () => {
    expect(normalise(formatPrice(118000))).toBe('₹1,180.00');
  });

  it('formats paise less than one rupee', () => {
    expect(normalise(formatPrice(50))).toBe('₹0.50');
  });

  it('formats exactly one rupee', () => {
    expect(normalise(formatPrice(100))).toBe('₹1.00');
  });

  it('formats zero correctly', () => {
    expect(normalise(formatPrice(0))).toBe('₹0.00');
  });

  it('formats the mock-api cash transfer amount (₹4,872)', () => {
    expect(normalise(formatPrice(487200))).toBe('₹4,872.00');
  });

  it('formats a lakh-range amount with Indian grouping (₹1,00,000)', () => {
    // 10,000,000 paise = ₹1,00,000
    expect(normalise(formatPrice(10_000_000))).toBe('₹1,00,000.00');
  });

  it('formats ₹6,210 from the mock cash transfer', () => {
    expect(normalise(formatPrice(621000))).toBe('₹6,210.00');
  });

  it('throws on non-finite input', () => {
    expect(() => formatPrice(NaN)).toThrow(TypeError);
    expect(() => formatPrice(Infinity)).toThrow(TypeError);
  });
});

describe('formatPriceCompact', () => {
  it('strips .00 paise when whole-rupee amount', () => {
    expect(normalise(formatPriceCompact(118000))).toBe('₹1,180');
  });

  it('keeps paise when non-zero', () => {
    expect(normalise(formatPriceCompact(118050))).toBe('₹1,180.50');
  });

  it('handles zero', () => {
    expect(normalise(formatPriceCompact(0))).toBe('₹0');
  });
});
