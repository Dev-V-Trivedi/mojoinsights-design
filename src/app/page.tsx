'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  PageHeader, LivePill, Card, CardHeader, KpiCard, AreaChart, Gauge, Segmented,
  SectionGrid, Sparkline, StatusDot, ProgressBar, useToast, Modal,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { WORKSPACE } from '@/data/workspace';
import { useWorkspace, useScaled } from '@/components/WorkspaceContext';
import { BrandGrid, SpendComparison } from '@/components/BrandBreakdown';
import { DATE_RANGES, RANGE_DATA, MATCH_KEYS, ADAPTERS, RECENT_CONVERSIONS, type DateRange } from '@/data/dashboard';
import { scopeRows } from '@/lib/brandScope';

export default function DashboardPage() {
  const [range, setRange] = React.useState<DateRange>('Last 7 days');
  const [connectorOpen, setConnectorOpen] = React.useState(false);
  const d = RANGE_DATA[range];
  const toast = useToast();
  const { brand, brandId, money, setBrandId } = useWorkspace();
  const scaled = useScaled();
  const sc = React.useCallback((a: number[]) => a.map(scaled), [scaled]);
  const q = brand ? brand.grade / 10 : d.matchQuality;
  const rel = brand ? brand.grade : d.reliability;

  return (
    <>
      <PageHeader
        title={`Hello, ${WORKSPACE.user.name.split(' ')[0]}!`}
        description={brand
          ? `Conversion activity for ${brand.name}.`
          : `Explore ingestion and conversion activity across all ${WORKSPACE.name} brands.`}
        badges={<LivePill label="CAPI Event Stream Connected" />}
        actions={
          <>
            <Segmented options={DATE_RANGES} value={range} onChange={setRange} />
            <button className="btn-primary" onClick={() => setConnectorOpen(true)}>
              <Icon name="plus" className="w-4 h-4" /> Add connector
            </button>
          </>
        }
      />

      {/* KPI row */}
      <SectionGrid cols={4}>
        <KpiCard label="Leads captured" value={scaled(d.leads).toLocaleString()} icon="users"
                 delta={{ value: d.leadsDelta, positive: true }}
                 caption={`Across ${WORKSPACE.name} connected sources`} />
        <KpiCard label="Conversions sent" value={scaled(d.conversions).toLocaleString()} icon="broadcast"
                 delta={{ value: `${d.syncRate}% sync rate`, neutral: true }}
                 spark={sc(d.series.dispatched)} />
        <KpiCard label="Avg match quality" value={q.toFixed(1)} unit="/ 10" icon="target"
                 delta={{ value: 'Tier A · High', positive: true }}
                 caption="Meta EMQ and Google enhanced score blend" />
        <KpiCard label="CAPI pipeline" value={`${d.latency}`} unit="ms p99" tone="dark" icon="bolt"
                 delta={{ value: 'Optimal', positive: true }}
                 caption="Edge worker dispatch to ad endpoints" spark={sc(d.series.ingested)} />
      </SectionGrid>

      {!brand && (
        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-card-title text-ink">Brand breakdown</h2>
              <p className="text-[12.5px] text-neutralx-secondary mt-1">Open a brand to see its full dashboard.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-8"><BrandGrid range={range} onOpenBrand={(id) => setBrandId(id)} /></div>
            <div className="xl:col-span-4"><SpendComparison range={range} /></div>
          </div>
        </section>
      )}

      {/* Chart + quality + profile */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <Card className="xl:col-span-7">
          <CardHeader
            title="Event ingestion vs CAPI dispatched"
            subtitle="Leads captured by MojoInsights compared with server-side events accepted downstream."
            action={<span className="badge-success"><StatusDot tone="success" /> Active sync</span>}
          />
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-panel bg-canvas border border-hairline p-4">
              <p className="label-micro mb-2">Leads ingested</p>
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="font-display text-[26px] font-bold text-ink tnum">{scaled(d.leads).toLocaleString()}</span>
                <span className="badge-success">{d.leadsDelta}</span>
              </div>
            </div>
            <div className="rounded-panel bg-canvas border border-hairline p-4">
              <p className="label-micro mb-2">CAPI events dispatched</p>
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="font-display text-[26px] font-bold text-ink tnum">{scaled(d.conversions).toLocaleString()}</span>
                <span className="badge-info">{d.syncRate}% sync</span>
              </div>
            </div>
          </div>
          <AreaChart
            labels={d.series.labels}
            series={[
              { name: 'Ingested', data: sc(d.series.ingested), color: '#3F4238', fill: 'url(#none)' },
              { name: 'Dispatched', data: sc(d.series.dispatched), color: '#F0BC00' },
            ]}
          />
          <div className="flex items-center gap-5 mt-4 pt-4 border-t border-hairline">
            <span className="flex items-center gap-2 text-[12px] text-neutralx-secondary">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3F4238]" /> Leads ingested
            </span>
            <span className="flex items-center gap-2 text-[12px] text-neutralx-secondary">
              <span className="w-2.5 h-2.5 rounded-full bg-gold" /> CAPI dispatched
            </span>
          </div>
        </Card>

        <Card className="xl:col-span-5">
          <CardHeader title="Match quality" subtitle="Meta &amp; Google Ads CAPI identity resolution." icon="target" />
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-display text-[34px] font-bold text-ink tnum leading-none">{q.toFixed(1)} <span className="text-neutralx-muted text-[20px]">/ 10</span></p>
              <p className="text-[12.5px] text-neutralx-secondary mt-2 max-w-[200px]">Match rate is 18% higher than the previous period.</p>
            </div>
            <Gauge value={rel} label="Reliability" size={160} />
          </div>
          <div className="mt-6 pt-5 border-t border-hairline flex flex-col gap-4">
            {MATCH_KEYS.map((k) => (
              <div key={k.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12.5px] font-medium text-ink">{k.label}</span>
                  <span className="text-[12.5px] font-bold text-ink tnum">{k.percent}%</span>
                </div>
                <ProgressBar percent={k.percent} tone={k.percent > 85 ? 'ink' : 'gold'} />
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Adapters / recent / security */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <Card className="xl:col-span-5 relative overflow-hidden">
          <CardHeader title="CAPI adapters in wallet"
                      subtitle="Server-side dispatch feeds configured for Meta, Google Ads and TikTok." />
          <div className="flex flex-col gap-3">
            {scopeRows(ADAPTERS, brandId).map((a) => (
              <div key={a.id}
                   className={`rounded-panel p-4 border flex items-center justify-between gap-4 transition-transform hover:-translate-y-0.5 ${
                     a.tone === 'dark' ? 'bg-ink border-white/10 text-white'
                     : a.tone === 'olive' ? 'bg-[#4A5240] border-[#4A5240] text-white'
                     : 'bg-[#6F7A61] border-[#6F7A61] text-white'}`}>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-white/85">{a.tag}</p>
                  <p className="font-display text-[15px] font-bold truncate mt-0.5">{a.name}</p>
                  <p className="font-mono text-[11px] text-white/85 mt-1.5">1234 •••• •••• {a.id.slice(-4).padStart(4, '0')}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[15px] font-bold tnum">{a.events}</p>
                  <p className="text-[10.5px] text-white/85">{a.status}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-dark w-full mt-5" onClick={() => setConnectorOpen(true)}>
            Add new connector <Icon name="plus" className="w-4 h-4" />
          </button>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader title="Recent conversions"
                      action={<Link href="/conversions" className="text-[12px] font-semibold text-neutralx-secondary hover:text-ink">View all</Link>} />
          <ul className="flex flex-col">
            {scopeRows(RECENT_CONVERSIONS, brandId).map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-3.5 border-b border-hairline last:border-0">
                <StatusDot tone={c.tone} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink truncate">{c.event}</p>
                  <p className="text-[11.5px] text-neutralx-secondary truncate">{c.person} · {c.time}</p>
                </div>
                <span className={c.up ? 'badge-success' : 'badge-danger'}>{c.delta}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="xl:col-span-3 flex flex-col items-center text-center justify-center">
          <span className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-ink mb-4">
            <Icon name="shield" className="w-7 h-7" />
          </span>
          <p className="font-display text-[17px] font-bold text-ink">Keeping you safe</p>
          <p className="text-[12.5px] text-neutralx-secondary mt-2 leading-relaxed">
            Meta system user token and Google OAuth refresh token are active. Next rotation in 6 days.
          </p>
          <Link href="/settings" className="btn-dark w-full mt-5">Review security</Link>
        </Card>
      </section>

      <Modal
        open={connectorOpen}
        onClose={() => setConnectorOpen(false)}
        title="Add a CAPI connector"
        description="Pick a destination to start dispatching server-side conversion events."
        footer={
          <>
            <button className="btn-ghost" onClick={() => setConnectorOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={() => { setConnectorOpen(false); toast('Connector draft created'); }}>
              Continue
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
          {['Meta Conversions API', 'Google Enhanced Conversions', 'TikTok Events API', 'LinkedIn CAPI'].map((n) => (
            <label key={n} className="flex items-center gap-3 rounded-field border border-hairline p-4 cursor-pointer hover:bg-hover transition-colors">
              <input type="radio" name="connector" defaultChecked={n.startsWith('Meta')} className="accent-ink w-4 h-4" />
              <span className="text-[13px] font-semibold text-ink">{n}</span>
            </label>
          ))}
        </div>
      </Modal>
    </>
  );
}
