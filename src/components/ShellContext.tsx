'use client';

import * as React from 'react';

type Shell = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  search: string;
  setSearch: (v: string) => void;
};

const Ctx = React.createContext<Shell | null>(null);

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    try {
      const v = window.localStorage.getItem('mi.sidebar.collapsed');
      if (v === '1') setCollapsed(true);
    } catch {}
  }, []);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      try { window.localStorage.setItem('mi.sidebar.collapsed', next ? '1' : '0'); } catch {}
      return next;
    });
  }, []);

  const value = React.useMemo(
    () => ({ collapsed, toggleCollapsed, mobileOpen, setMobileOpen, search, setSearch }),
    [collapsed, toggleCollapsed, mobileOpen, search],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShell() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error('useShell must be used inside ShellProvider');
  return ctx;
}
