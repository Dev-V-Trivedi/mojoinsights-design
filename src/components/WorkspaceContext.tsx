'use client';

import * as React from 'react';
import { BRANDS, ALL_BRANDS_ID, findBrand, PORTFOLIO, type Brand } from '@/data/brands';
import { CURRENCIES, DEFAULT_CURRENCY, formatMoney, type Currency, type MoneyOpts } from '@/lib/currency';

type Workspace = {
  /** null means the whole portfolio is in view. */
  brand: Brand | null;
  brandId: string;
  setBrandId: (id: string) => void;
  brands: Brand[];
  /** Metric multiplier for the active brand (1 for the full portfolio). */
  scale: number;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  money: (amountInInr: number, opts?: MoneyOpts) => string;
  portfolio: typeof PORTFOLIO;
};

const Ctx = React.createContext<Workspace | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [brandId, setBrandIdState] = React.useState<string>(ALL_BRANDS_ID);
  const [currency, setCurrencyState] = React.useState<Currency>(DEFAULT_CURRENCY);

  React.useEffect(() => {
    try {
      const b = window.localStorage.getItem('mi.brand');
      if (b && (b === ALL_BRANDS_ID || findBrand(b))) setBrandIdState(b);
      const c = window.localStorage.getItem('mi.currency') as Currency | null;
      if (c && CURRENCIES.includes(c)) setCurrencyState(c);
    } catch {}
  }, []);

  const setBrandId = React.useCallback((id: string) => {
    setBrandIdState(id);
    try { window.localStorage.setItem('mi.brand', id); } catch {}
  }, []);

  const setCurrency = React.useCallback((c: Currency) => {
    setCurrencyState(c);
    try { window.localStorage.setItem('mi.currency', c); } catch {}
  }, []);

  const brand = React.useMemo(() => (brandId === ALL_BRANDS_ID ? null : findBrand(brandId)), [brandId]);
  const scale = brand?.scale ?? 1;
  const money = React.useCallback(
    (amountInInr: number, opts?: MoneyOpts) => formatMoney(amountInInr, currency, opts),
    [currency],
  );

  const value = React.useMemo<Workspace>(
    () => ({ brand, brandId, setBrandId, brands: BRANDS, scale, currency, setCurrency, money, portfolio: PORTFOLIO }),
    [brand, brandId, setBrandId, scale, currency, setCurrency, money],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkspace() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error('useWorkspace must be used inside WorkspaceProvider');
  return ctx;
}

/** Scale a portfolio-level metric to the active brand. */
export function useScaled() {
  const { scale } = useWorkspace();
  return React.useCallback((n: number) => Math.max(1, Math.round(n * scale)), [scale]);
}
