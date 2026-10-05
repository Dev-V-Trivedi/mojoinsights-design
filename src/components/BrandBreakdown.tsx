'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, StatusDot, ProgressBar, BarMeter, SectionGrid, Mono } from './ui';
import { Icon } from './Icon';
import { useWorkspace } from './WorkspaceContext';
import { BrandAvatar } from './BrandSwitcher';
import { RANGE_DATA, type DateRange } from '@/data/dashboard';
import { ALL_BRANDS_ID, type Brand } from '@/data/brands';

/** Per-brand KPIs derived from the selected range and each brand's share of volume. */
export function brandMetrics(b: Brand, range: DateRange) {
  const d = RANGE_DATA[range];
  return {
    leads: Math.round(d.leads * b.scale),
    conversions: Math.round(d.conversions * b.scale),
    spend: b.spend,
    grade: b.grade,
    attention: b.state === 'alert',
  };
}

export function BrandCard({ brand, range, onOpen }: { brand: Brand; range: DateRange; onOpen: () => void }) {
  const m = brandMetrics(brand, range);
  const { money } = useWorkspace();
  return (
    <Card className="flex flex-col gap-5 hover:shadow-level2 transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <BrandAvatar initials={brand.initials} accent={brand.accent} size={44} />
          <div className="min-w-0">
            <p className="font-display text-[15px] font-bold text-ink truncate">{brand.name}</p>
            <p className="text-[11.5px] text-neutralx-secondary truncate">{brand.industry} · {brand.domain}</p>
          </div>
        </div>
        {m.attention
          ? <span className="badge-danger shrink-0"><StatusDot tone="danger" />Attention</span>
          : <span className="badge-success shrink-0"><StatusDot tone="success" />Healthy</span>}
      </div>

      <dl className="divide-y divide-hairline rounded-panel border border-hairline bg-canvas">
        {[
          { k: 'Leads', v: m.leads.toLocaleString() },
          { k: 'Conversions', v: m.conversions.toLocaleString() },
          { k: 'Match grade', v: `${m.grade}%` },
        ].map((x) => (
          <div key={x.k} className="flex items-center justify-between gap-3 px-3.5 py-2.5 min-w-0">
            <dt className="text-[12px] text-neutralx-secondary truncate">{x.k}</dt>
            <dd className="font-display text-[15px] font-bold text-ink tnum shrink-0">{x.v}</dd>
          </div>
        ))}
      </dl>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="label-micro text-[10px]">Monthly spend</span>
          <span className="text-[12px] font-bold text-ink tnum">{money(m.spend)}</span>
        </div>
        <ProgressBar percent={Math.min(100, brand.grade)} tone="ink" />
        <div className="flex items-center justify-between mt-2 text-[11.5px] text-neutralx-secondary">
          <span>Pacing <span className={brand.pacingUp ? 'text-success font-semibold' : 'text-danger font-semibold'}>{brand.pacing}</span></span>
          <span className="truncate ml-3">{brand.sync}</span>
        </div>
      </div>

      <button onClick={onOpen} className="btn-dark w-full mt-auto">
        Open {brand.name.split(' ')[0]} dashboard <Icon name="chevron" className="w-3.5 h-3.5" />
      </button>
    </Card>
  );
}

/** Spend comparison across every brand, sized relative to the largest. */
export function SpendComparison({ range }: { range: DateRange }) {
  const { brands, money } = useWorkspace();
  const sorted = [...brands].sort((a, b) => b.spend - a.spend);
  const max = sorted[0]?.spend ?? 1;
  return (
    <Card>
      <CardHeader title="Spend by brand" subtitle={`Monthly tracked spend · ${range}`} icon="trend" />
      <div className="flex flex-col gap-4">
        {sorted.map((b) => (
          <div key={b.id}>
            <div className="flex items-center justify-between mb-1.5 gap-3">
              <span className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: b.accent }} />
                <span className="text-[12.5px] font-medium text-ink truncate">{b.name}</span>
              </span>
              <span className="text-[12px] tnum text-neutralx-secondary shrink-0">{money(b.spend, { compact: true })}</span>
            </div>
            <ProgressBar percent={(b.spend / max) * 100} tone={b.state === 'alert' ? 'gold' : 'ink'} />
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Full brand overview: used on /brands and as a section on the dashboard. */
export function BrandGrid({ range, onOpenBrand }: { range: DateRange; onOpenBrand: (id: string) => void }) {
  const { brands } = useWorkspace();
  return (
    <SectionGrid cols={3}>
      {brands.map((b) => (
        <BrandCard key={b.id} brand={b} range={range} onOpen={() => onOpenBrand(b.id)} />
      ))}
    </SectionGrid>
  );
}
