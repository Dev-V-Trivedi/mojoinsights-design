'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './Icon';
import { useWorkspace } from './WorkspaceContext';
import { ALL_BRANDS_ID } from '@/data/brands';
import { useClickOutside } from '@/lib/hooks';

/** Brand monogram: ink tile with the brand's accent as a dot, so every brand reads distinctly. */
export function BrandAvatar({ initials, accent, size = 32 }: { initials: string; accent?: string; size?: number }) {
  return (
    <span
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      className="relative shrink-0 rounded-full bg-ink text-white flex items-center justify-center font-bold tracking-tight"
    >
      {initials}
      {accent && (
        <span
          style={{ background: accent }}
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white"
        />
      )}
    </span>
  );
}

export function BrandSwitcher({ compact = false }: { compact?: boolean }) {
  const { brand, brandId, setBrandId, brands, portfolio } = useWorkspace();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const router = useRouter();
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), open);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((b) => b.name.toLowerCase().includes(q) || b.industry.toLowerCase().includes(q));
  }, [brands, query]);

  const pick = (id: string) => { setBrandId(id); setOpen(false); setQuery(''); };
  const isAll = brandId === ALL_BRANDS_ID;

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Brand: ${brand ? brand.name : 'All brands'}`}
        title={compact ? (brand?.name ?? 'All brands') : undefined}
        className={`w-full flex items-center rounded-full bg-white border border-hairline shadow-level1
                    hover:shadow-level2 transition-all outline-none focus-visible:shadow-focus
                    ${open ? 'border-ink' : ''}
                    ${compact ? 'justify-center p-1' : 'gap-3 p-1.5 pr-3'}`}
      >
        {isAll ? (
          <span className="w-8 h-8 shrink-0 rounded-full bg-gold text-ink flex items-center justify-center text-[10px] font-extrabold tracking-wide">
            ALL
          </span>
        ) : (
          <BrandAvatar initials={brand!.initials} accent={brand!.accent} size={compact ? 32 : 32} />
        )}

        {!compact && (
          <>
            <span className="min-w-0 flex-1 text-left leading-tight">
              <span className="block text-[10px] uppercase tracking-[0.08em] font-semibold text-neutralx-muted">
                Active brand
              </span>
              <span className="block text-[13px] font-semibold text-ink truncate mt-0.5">
                {isAll ? `All brands · ${brands.length}` : brand!.name}
              </span>
            </span>
            <span className={`w-6 h-6 shrink-0 rounded-full bg-canvas flex items-center justify-center text-ink transition-transform ${open ? 'rotate-180' : ''}`}>
              <Icon name="chevronDown" className="w-3.5 h-3.5" />
            </span>
          </>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="listbox"
          aria-label="Brands"
          className={`absolute z-[60] rounded-card bg-white border border-hairline shadow-level3 overflow-hidden animate-fade-up
                      ${compact ? 'left-full ml-3 top-0 w-[300px]' : 'left-0 right-0 top-[calc(100%+8px)]'}`}
        >
          <div className="p-3">
            <div className="flex items-center gap-2 h-10 rounded-full bg-canvas border border-hairline px-3.5
                            focus-within:border-ink focus-within:shadow-focus transition-shadow">
              <Icon name="search" className="w-4 h-4 text-neutralx-muted shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search brands"
                aria-label="Search brands"
                className="w-full bg-transparent border-none outline-none text-[13px] text-ink placeholder:text-neutralx-muted"
              />
            </div>
          </div>

          <div className="max-h-[340px] overflow-y-auto px-2 pb-2">
            {/* Roll-up */}
            <button
              role="option"
              aria-selected={isAll}
              onClick={() => pick(ALL_BRANDS_ID)}
              className={`w-full flex items-center gap-3 rounded-panel px-3 py-2.5 text-left transition-colors
                          ${isAll ? 'bg-gold-tint' : 'hover:bg-hover'}`}
            >
              <span className="w-8 h-8 shrink-0 rounded-full bg-gold text-ink flex items-center justify-center text-[10px] font-extrabold">
                ALL
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-ink">All brands</span>
                <span className="block text-[11.5px] text-neutralx-secondary tnum">
                  {portfolio.alerts} need attention · {brands.length} brands
                </span>
              </span>
              {isAll && <span className="w-5 h-5 rounded-full bg-ink text-gold flex items-center justify-center shrink-0"><Icon name="check" className="w-3 h-3" strokeWidth={3} /></span>}
            </button>

            <p className="label-micro px-3 pt-4 pb-2 text-[10px]">Brands · {results.length}</p>

            {results.map((b) => {
              const active = brandId === b.id;
              return (
                <button
                  key={b.id}
                  role="option"
                  aria-selected={active}
                  onClick={() => pick(b.id)}
                  className={`w-full flex items-center gap-3 rounded-panel px-3 py-2.5 text-left transition-colors
                              ${active ? 'bg-gold-tint' : 'hover:bg-hover'}`}
                >
                  <BrandAvatar initials={b.initials} accent={b.accent} size={32} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-ink truncate">{b.name}</span>
                      {b.state === 'alert' && <span className="badge-danger !py-0 !px-1.5 !text-[10px] shrink-0">Alert</span>}
                    </span>
                    <span className="block text-[11.5px] text-neutralx-secondary truncate">{b.industry}</span>
                  </span>
                  {active && <span className="w-5 h-5 rounded-full bg-ink text-gold flex items-center justify-center shrink-0"><Icon name="check" className="w-3 h-3" strokeWidth={3} /></span>}
                </button>
              );
            })}

            {results.length === 0 && (
              <p className="px-4 py-6 text-center text-[12px] text-neutralx-secondary">No brand matches “{query}”.</p>
            )}
          </div>

          <div className="border-t border-hairline p-2">
            <button
              onClick={() => { setOpen(false); router.push('/clients'); }}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-full bg-ink text-white text-[12.5px] font-semibold hover:bg-ink-soft transition-colors"
            >
              Manage brands
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
