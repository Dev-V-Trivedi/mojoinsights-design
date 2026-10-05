'use client';

import * as React from 'react';

export function useClickOutside<T extends HTMLElement>(onOutside: () => void, active = true) {
  const ref = React.useRef<T>(null);
  React.useEffect(() => {
    if (!active) return;
    const handler = (e: MouseEvent) => {
      const el = ref.current;
      if (el && !el.contains(e.target as Node) && !el.parentElement?.contains(e.target as Node)) onOutside();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onOutside, active]);
  return ref;
}

export type SortDir = 'asc' | 'desc';

export function useTable<T extends Record<string, any>>(
  rows: T[],
  opts: { searchKeys: (keyof T)[]; pageSize?: number; initialSort?: { key: keyof T; dir: SortDir } },
) {
  const { searchKeys, pageSize = 8, initialSort } = opts;
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState(initialSort ?? null);
  const [page, setPage] = React.useState(1);
  const [filters, setFilters] = React.useState<Record<string, string>>({});

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = rows;
    if (q) {
      out = out.filter((r) => searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q)));
    }
    for (const [key, val] of Object.entries(filters)) {
      if (val && val !== 'All') out = out.filter((r) => String(r[key as keyof T]) === val);
    }
    if (sort) {
      const { key, dir } = sort;
      out = [...out].sort((a, b) => {
        const av = a[key], bv = b[key];
        const n = typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv), undefined, { numeric: true });
        return dir === 'asc' ? n : -n;
      });
    }
    return out;
  }, [rows, query, sort, filters, searchKeys]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  React.useEffect(() => { setPage(1); }, [query, filters, sort]);

  const toggleSort = React.useCallback((key: keyof T) => {
    setSort((s) => (s && s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  }, []);

  return {
    query, setQuery, sort, toggleSort, filters, setFilters,
    rows: paged, total: filtered.length, page: safePage, pageCount, setPage,
  };
}

export function useSelection<T extends { id: string }>(rows: T[]) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const allOn = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggle = (id: string) =>
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () =>
    setSelected((s) => (allOn ? new Set() : new Set(rows.map((r) => r.id))));
  const clear = () => setSelected(new Set());
  return { selected, toggle, toggleAll, allOn, clear, count: selected.size };
}
