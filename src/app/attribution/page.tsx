'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  PageHeader, LivePill, Card, CardHeader, KpiCard, Segmented, SectionGrid, TableShell,
  SortHeader, StatusDot, ProgressBar, Mono, useToast, Select, BarMeter,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { MODELS, CHANNELS, TOUCHPOINTS, type Model } from '@/data/attribution';
import { DATE_RANGES, type DateRange } from '@/data/dashboard';
import { useWorkspace, useScaled } from '@/components/WorkspaceContext';
import { scopeRows } from '@/lib/brandScope';



export default function AttributionPage() {
  const [model, setModel] = React.useState<Model>('Data-Driven CAPI');
  const [range, setRange] = React.useState<DateRange>('Last 7 days');
  const [paused, setPaused] = React.useState(false);
  const toast = useToast();
  const { brand, brandId, money } = useWorkspace();
  const scaled = useScaled();
  const CH = React.useMemo(() => CHANNELS.map((c) => ({ ...c, capi: scaled(c.capi), pixel: scaled(c.pixel), leads: scaled(c.leads), incr: scaled(c.incr) })), [scaled]);

  const weight = { 'First Touch': 0.82, 'Linear (40/20/40)': 0.94, 'Data-Driven CAPI': 1, 'Time Decay': 0.9 }[model];
  const totalRevenue = Math.round(CH.reduce((s, c) => s + c.capi, 0) * weight);
  const maxCapi = Math.max(...CH.map((c) => c.capi));

  return (
    <>
      <PageHeader
        title="Attribution & Signals"
        description={`Deterministic server-side attribution and channel contribution for ${brand ? brand.name : 'all brands'}.`}
        badges={<><LivePill label="Multi-touch CAPI" /><span className="badge-success">Real-time EMQ 9.4</span></>}
        actions={
          <>
            <Segmented options={DATE_RANGES} value={range} onChange={setRange} />
            <button className="btn-ghost" onClick={() => toast('Export queued')}>
              <Icon name="download" className="w-4 h-4" /> Export CSV
            </button>
            <button className="btn-primary" onClick={() => toast('Attribution sync started')}>
              <Icon name="refresh" className="w-4 h-4" /> Run sync
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <span className="label-micro">Attribution model</span>
        <Segmented options={MODELS} value={model} onChange={setModel} />
        <Select label="CRM source" value="All integrations" onChange={() => {}}
                options={['All integrations', 'Zoho CRM', 'HubSpot', 'Salesforce']} />
      </div>

      <SectionGrid cols={4}>
        <KpiCard label="Attributed pipeline revenue" value={money(totalRevenue)} icon="trend"
                 delta={{ value: '+18.4%', positive: true }} caption="Verified across 5 connected CRM pipelines" />
        <KpiCard label="Blended ROAS (CAPI lift)" value={(4.12 * weight).toFixed(2)} unit="x" icon="bolt"
                 delta={{ value: '+0.42x lift', positive: true }} caption="3.70x browser-pixel baseline · 428 offline deals" />
        <KpiCard label="Deterministic stitched leads" value="96.4%" icon="shield"
                 delta={{ value: 'Grade A+', positive: true }} caption="1,238 / 1,284 leads hashed via SHA-256" />
        <KpiCard label="Signal loss recovery" value={`+${money(48_200)}`} tone="dark" icon="target"
                 delta={{ value: 'iOS ATT bypassed', positive: true }} caption="318 lost events recovered via edge proxy" />
      </SectionGrid>

      <Card>
        <CardHeader
          title="Touchpoint vs CAPI server ground-truth"
          subtitle="Credit split across advertising channels with deterministic event mapping."
          icon="flow"
          action={<span className="badge-success">Confidence 98.4%</span>}
        />
        <div className="flex flex-col gap-5">
          {CH.map((c) => (
            <div key={c.id} className="rounded-panel bg-canvas border border-hairline p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-full bg-gold text-ink flex items-center justify-center font-bold text-[13px] shrink-0">
                    {c.badge}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold text-ink truncate">{c.name}</p>
                    <Mono>{c.utm}</Mono>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-[20px] font-bold text-ink tnum">{money(Math.round(c.capi * weight))}</p>
                  <span className="badge-success mt-1">+{c.uplift}% uplift</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <span className="label-micro w-28 shrink-0">Browser pixel</span>
                  <div className="flex-1"><ProgressBar percent={(c.pixel / maxCapi) * 100} tone="gold" /></div>
                  <span className="text-[12px] tnum text-neutralx-secondary w-20 text-right shrink-0">{money(c.pixel)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="label-micro w-28 shrink-0">Server CAPI</span>
                  <div className="flex-1"><ProgressBar percent={(c.capi / maxCapi) * 100} tone="ink" /></div>
                  <span className="text-[12px] tnum font-semibold text-ink w-20 text-right shrink-0">{money(c.capi)}</span>
                </div>
              </div>

              <div className="flex items-center gap-5 mt-4 pt-4 border-t border-hairline flex-wrap">
                {[
                  { k: 'Leads', v: c.leads.toLocaleString() },
                  { k: 'Incremental', v: `+${c.incr}` },
                  { k: 'EMQ', v: c.emq.toFixed(1) },
                  { k: 'ROAS', v: `${c.roas.toFixed(2)}x` },
                  { k: 'Matched', v: `${c.matched}%` },
                ].map((m) => (
                  <div key={m.k}>
                    <p className="label-micro text-[10px]">{m.k}</p>
                    <p className="text-[13px] font-bold text-ink tnum mt-0.5">{m.v}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-5 mt-1 border-t border-hairline flex-wrap gap-3">
          <p className="text-[12px] text-neutralx-secondary">
            All conversions cross-referenced against SHA-256 phone and email hashes.
          </p>
          <Link href="/audit" className="text-[12px] font-semibold text-ink hover:underline">Explore raw signal audit logs →</Link>
        </div>
      </Card>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <Card className="xl:col-span-4">
          <CardHeader title="Channel signal health" subtitle="Live event match quality across destinations." icon="broadcast"
                      action={<span className="badge-success">Optimal 9.4</span>} />
          <div className="flex flex-col gap-5">
            {CH.slice(0, 3).map((c) => (
              <BarMeter key={c.id} label={c.name.split(' (')[0]} percent={c.matched} color={c.color} />
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-hairline">
            <p className="label-micro mb-2.5">Active ad tokens</p>
            <div className="flex flex-wrap gap-2">
              {['fbclid', '_fbp', 'gclid', 'ttclid', 'li_fat_id'].map((tk) => (
                <span key={tk} className="chip-off font-mono !text-[11px]">{tk}</span>
              ))}
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-8" pad={false}>
          <div className="p-6 pb-0">
            <CardHeader
              title="Live attribution stream"
              subtitle="Dispatched touchpoints resolved to deterministic identity chains."
              icon="flow"
              action={
                <button onClick={() => setPaused((p) => !p)} className="btn-ghost !px-3.5 !py-1.5 !text-[12px]">
                  <Icon name={paused ? 'play' : 'pause'} className="w-3.5 h-3.5" />
                  {paused ? 'Resume stream' : 'Pause stream'}
                </button>
              }
            />
          </div>
          <div className="px-6 pb-6">
            <TableShell minWidth={1020}>
              <thead>
                <tr className="border-b border-hairline">
                  <SortHeader label="Lead / identity" />
                  <SortHeader label="Primary conversion" />
                  <SortHeader label="Attributed touchpoint chain" />
                  <SortHeader label="CAPI target" />
                  <SortHeader label="Time" align="right" />
                </tr>
              </thead>
              <tbody>
                {scopeRows(TOUCHPOINTS, brandId).map((t) => (
                  <tr key={t.id} className="row">
                    <td className="td">
                      <span className="block font-semibold text-ink">{t.lead}</span>
                      <Mono>{t.hash}</Mono>
                    </td>
                    <td className="td font-semibold whitespace-nowrap">{t.conversion}</td>
                    <td className="td">
                      <span className="flex items-center gap-1.5 flex-wrap">
                        {t.chain.map((step, i) => (
                          <React.Fragment key={step}>
                            <span className="badge bg-canvas text-neutralx-secondary border-hairline whitespace-nowrap">{step}</span>
                            {i < t.chain.length - 1 && <Icon name="chevron" className="w-3 h-3 text-neutralx-muted" />}
                          </React.Fragment>
                        ))}
                      </span>
                    </td>
                    <td className="td">
                      <span className="flex items-center gap-2 whitespace-nowrap">
                        <StatusDot tone="success" />{t.target}
                      </span>
                    </td>
                    <td className="td text-right"><Mono>{t.time}</Mono></td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
            <div className="flex items-center gap-2 pt-4 mt-1 border-t border-hairline">
              <StatusDot tone={paused ? 'muted' : 'success'} />
              <Mono>{paused ? 'Stream paused' : 'Auto-refresh 10s'}</Mono>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}
