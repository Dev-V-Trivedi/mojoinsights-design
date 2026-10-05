/**
 * All monetary values in the data layer are stored in INR (the base currency).
 * Display converts from INR into whichever currency the workspace has selected.
 */
export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'] as const;
export type Currency = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = 'INR';

/** Units of the target currency per 1 INR. */
export const RATES: Record<Currency, number> = {
  INR: 1,
  USD: 1 / 83.2,
  EUR: 1 / 90.1,
  GBP: 1 / 105.4,
  AED: 1 / 22.6,
  SGD: 1 / 61.8,
};

export const LOCALES: Record<Currency, string> = {
  INR: 'en-IN', USD: 'en-US', EUR: 'de-DE', GBP: 'en-GB', AED: 'en-AE', SGD: 'en-SG',
};

export const SYMBOLS: Record<Currency, string> = {
  INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'AED ', SGD: 'S$',
};

export type MoneyOpts = { compact?: boolean; decimals?: number };

export function formatMoney(amountInInr: number, currency: Currency, opts: MoneyOpts = {}): string {
  const { compact = false, decimals } = opts;
  const value = amountInInr * RATES[currency];

  if (compact) {
    // INR reads naturally in lakh / crore; everything else in K / M / B.
    if (currency === 'INR') {
      if (Math.abs(value) >= 1e7) return `${SYMBOLS.INR}${trim(value / 1e7)} Cr`;
      if (Math.abs(value) >= 1e5) return `${SYMBOLS.INR}${trim(value / 1e5)} L`;
      if (Math.abs(value) >= 1e3) return `${SYMBOLS.INR}${trim(value / 1e3)}K`;
      return `${SYMBOLS.INR}${Math.round(value)}`;
    }
    const s = SYMBOLS[currency];
    if (Math.abs(value) >= 1e9) return `${s}${trim(value / 1e9)}B`;
    if (Math.abs(value) >= 1e6) return `${s}${trim(value / 1e6)}M`;
    if (Math.abs(value) >= 1e3) return `${s}${trim(value / 1e3)}K`;
    return `${s}${Math.round(value)}`;
  }

  return new Intl.NumberFormat(LOCALES[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 0,
  }).format(value);
}

function trim(n: number): string {
  const r = Math.abs(n) >= 100 ? Math.round(n) : Math.round(n * 10) / 10;
  return String(r);
}
