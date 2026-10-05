'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, KpiCard, SectionGrid, LivePill, Segmented, useToast } from '@/components/ui';
import { Icon } from '@/components/Icon';
import { BrandGrid, SpendComparison } from '@/components/BrandBreakdown';
import { useWorkspace } from '@/components/WorkspaceContext';
import { DATE_RANGES, type DateRange } from '@/data/dashboard';

export default function BrandsPage() {
  const [range, setRange] = React.useState<DateRange>('Last 7 days');
  const { setBrandId, brands, portfolio, money } = useWorkspace();
  const router = useRouter();
  const toast = useToast();

  const open = (id: string) => {
    setBrandId(id);
    const name = brands.find((b) => b.id === id)?.name;
    toast(`Switched to ${name}`, 'info');
    router.push('/');
  };

  const totalSpend = brands.reduce((s, b) => s + b.spend, 0);

  return (
    <>
      <PageHeader
        title="Brand overview"
        description="Every brand you monitor, side by side. Open one to scope the whole workspace to it."
        badges={<LivePill label={`${brands.length} brands monitored`} />}
        actions={<Segmented options={DATE_RANGES} value={range} onChange={setRange} />}
      />

      <SectionGrid cols={4}>
        <KpiCard label="Brands monitored" value={brands.length} icon="briefcase"
                 delta={{ value: 'All active', positive: true }} caption="Across every connected ad account" />
        <KpiCard label="Combined spend" value={money(totalSpend, { compact: true })} icon="trend"
                 caption="Monthly, all brands" />
        <KpiCard label="Average match grade" value={`${portfolio.grade}%`} icon="target"
                 delta={{ value: 'Tier A', positive: true }} caption="Identity match, weighted across brands" />
        <KpiCard label="Need attention" value={portfolio.alerts} tone="dark" icon="alert"
                 delta={{ value: portfolio.alerts ? 'Review now' : 'All clear', neutral: true }}
                 caption="Brands with an open alert" />
      </SectionGrid>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8">
          <BrandGrid range={range} onOpenBrand={open} />
        </div>
        <div className="xl:col-span-4">
          <SpendComparison range={range} />
        </div>
      </section>
    </>
  );
}
