'use client';

import * as React from 'react';
import {
  PageHeader, Card, CardHeader, KpiCard, SectionGrid, SearchField, Select, TableShell,
  SortHeader, Pagination, StatusDot, ProgressBar, Mono, EmptyState, useToast, Modal, LivePill, Segmented, Avatar,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { useTable } from '@/lib/hooks';
import { useWorkspace } from '@/components/WorkspaceContext';
import { BRANDS } from '@/data/brands';

const BRAND_ID_BY_NAME: Record<string, string> = Object.fromEntries(BRANDS.map((b) => [b.name, b.id]));

type Client = {
  id: string; initials: string; name: string; industry: string; domain: string;
  spend: number; pacing: string; pacingUp: boolean; channels: string[]; pipelines: number;
  grade: number; tier: 'Tier A' | 'Tier B'; state: 'healthy' | 'alert'; sync: string;
};

const CLIENTS: Client[] = [
  { id: 'c1', initials: 'LW', name: 'Lumina Skin & Wellness', industry: 'E-Commerce / D2C', domain: 'luminawellness.co',
    spend: 420_000, pacing: '+4.2%', pacingUp: true, channels: ['Meta CAPI', 'TikTok', 'Google'], pipelines: 6,
    grade: 96.2, tier: 'Tier A', state: 'alert', sync: 'Meta 429 throttle · exponential backoff' },
  { id: 'c2', initials: 'AF', name: 'Apex FinTech Solutions', industry: 'Lead Gen / FinTech', domain: 'apexfintech.io',
    spend: 850_000, pacing: 'Nominal', pacingUp: true, channels: ['Google Enh.', 'LinkedIn CAPI'], pipelines: 4,
    grade: 94.8, tier: 'Tier A', state: 'healthy', sync: 'Synced 14s ago' },
  { id: 'c3', initials: 'VM', name: 'Velocity Motors', industry: 'Auto / Dealerships', domain: 'velocitydealers.com',
    spend: 290_000, pacing: '-1.8%', pacingUp: false, channels: ['Meta Offline', 'Store Visits'], pipelines: 3,
    grade: 88.5, tier: 'Tier B', state: 'healthy', sync: 'Synced 48s ago' },
  { id: 'c4', initials: 'NB', name: 'Northwind Build Group', industry: 'Real Estate', domain: 'northwindbuild.com',
    spend: 310_000, pacing: '+2.1%', pacingUp: true, channels: ['Meta CAPI', 'Google'], pipelines: 5,
    grade: 91.4, tier: 'Tier A', state: 'healthy', sync: 'Synced 1m ago' },
  { id: 'c5', initials: 'SH', name: 'Solstice Health Technologies', industry: 'Healthcare', domain: 'solsticehealth.io',
    spend: 180_000, pacing: '-0.4%', pacingUp: false, channels: ['Google Enh.'], pipelines: 2,
    grade: 86.0, tier: 'Tier B', state: 'healthy', sync: 'Synced 3m ago' },
  { id: 'c6', initials: 'AC', name: 'Aura Clean Beauty Labs', industry: 'E-Commerce / D2C', domain: 'auraclean.co',
    spend: 240_000, pacing: '+6.8%', pacingUp: true, channels: ['Meta CAPI', 'TikTok'], pipelines: 4,
    grade: 93.1, tier: 'Tier A', state: 'healthy', sync: 'Synced 22s ago' },
  { id: 'c7', initials: 'VF', name: 'Vanguard Fitness App', industry: 'B2B SaaS', domain: 'vanguardfit.app',
    spend: 150_000, pacing: '+1.2%', pacingUp: true, channels: ['Meta CAPI', 'Google'], pipelines: 3,
    grade: 89.7, tier: 'Tier B', state: 'healthy', sync: 'Synced 5m ago' },
  { id: 'c8', initials: 'MT', name: 'Meridian Trust Capital', industry: 'FinTech', domain: 'meridiantrust.com',
    spend: 620_000, pacing: '+3.4%', pacingUp: true, channels: ['LinkedIn CAPI', 'Google Enh.'], pipelines: 5,
    grade: 95.3, tier: 'Tier A', state: 'healthy', sync: 'Synced 8s ago' },
];

const INDUSTRIES = ['All industries', 'E-Commerce / D2C', 'B2B SaaS', 'FinTech', 'Real Estate', 'Healthcare', 'Lead Gen / FinTech', 'Auto / Dealerships'];
const VIEWS = ['Table', 'Grid'] as const;

export default function ClientsPage() {
  const [view, setView] = React.useState<(typeof VIEWS)[number]>('Table');
  const [active, setActive] = React.useState<Client | null>(null);
  const toast = useToast();
  const { setBrandId, money } = useWorkspace();

  const t = useTable(CLIENTS, { searchKeys: ['name', 'industry', 'domain'], pageSize: 5, initialSort: { key: 'spend', dir: 'desc' } });
  const totalSpend = CLIENTS.reduce((s, c) => s + c.spend, 0);

  return (
    <>
      <PageHeader
        title="Client & Brand Portfolio"
        description="Manage multi-tenant client brand workspaces, monitor ad spend pacing, inspect CAPI match health across accounts, and switch active client context seamlessly."
        badges={<><LivePill label={`${CLIENTS.length} managed accounts`} /><span className="badge-info">{money(totalSpend, { compact: true })} monthly spend</span></>}
        actions={
          <>
            <button className="btn-ghost" onClick={() => toast('Portfolio audit exported')}>
              <Icon name="download" className="w-4 h-4" /> Export audit
            </button>
            <button className="btn-primary" onClick={() => toast('New client workspace wizard opened', 'info')}>
              <Icon name="plus" className="w-4 h-4" /> Add client brand
            </button>
          </>
        }
      />

      <SectionGrid cols={4}>
        <KpiCard label="Managed brands" value={CLIENTS.length} unit="active" icon="briefcase"
                 delta={{ value: '+4 this quarter', positive: true }} caption="Zero churn in the trailing 90 days" />
        <KpiCard label="Monthly CAPI volume" value="4.8M" unit="events" icon="broadcast"
                 delta={{ value: '99.8% nominal', positive: true }} caption="Aggregated across every client workspace" />
        <KpiCard label="Portfolio ROAS uplift" value="+31.2%" icon="trend"
                 delta={{ value: `${money(840_000, { compact: true })} incremental`, positive: true }} caption="Attributed above browser-pixel baseline" />
        <KpiCard label="Cross-account signals" value="1" unit="account" tone="dark" icon="alert"
                 delta={{ value: 'Meta 429 throttle', positive: false }} caption="Lumina Skin & Wellness needs attention" />
      </SectionGrid>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <SearchField value={t.query} onChange={t.setQuery} placeholder="Search brand or domain…" className="w-full sm:w-64" />
          <Select label="Industry" value={t.filters.industry || 'All industries'}
                  onChange={(v) => t.setFilters((f) => ({ ...f, industry: v === 'All industries' ? '' : v }))}
                  options={INDUSTRIES} />
        </div>
        <Segmented options={VIEWS} value={view} onChange={setView} />
      </div>

      {t.rows.length === 0 ? (
        <Card>
          <EmptyState icon="briefcase" title="No client workspaces match"
                      body="Try a different industry filter or search term."
                      action={<button className="btn-ghost" onClick={() => { t.setQuery(''); t.setFilters({}); }}>Reset filters</button>} />
        </Card>
      ) : view === 'Table' ? (
        <Card>
          <CardHeader title="Client workspaces" subtitle={`Showing ${t.rows.length} of ${CLIENTS.length} managed brands.`} icon="briefcase" />
          <TableShell minWidth={1180}>
            <thead>
              <tr className="border-b border-hairline">
                <SortHeader label="Client brand" active={t.sort?.key === 'name'} dir={t.sort?.dir} onClick={() => t.toggleSort('name')} />
                <SortHeader label="Tracked spend" align="right" active={t.sort?.key === 'spend'} dir={t.sort?.dir} onClick={() => t.toggleSort('spend')} />
                <SortHeader label="Channels & pipelines" />
                <SortHeader label="Match grade" active={t.sort?.key === 'grade'} dir={t.sort?.dir} onClick={() => t.toggleSort('grade')} />
                <SortHeader label="Sync state" />
                <SortHeader label="Workspace" align="right" />
              </tr>
            </thead>
            <tbody>
              {t.rows.map((c) => (
                <tr key={c.id} className="row">
                  <td className="td">
                    <span className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-gold text-ink flex items-center justify-center font-bold text-[12px] shrink-0">
                        {c.initials}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="font-semibold text-ink truncate">{c.name}</span>
                          {c.state === 'alert' && <span className="badge-danger shrink-0">Alert</span>}
                        </span>
                        <span className="block text-[11.5px] text-neutralx-secondary truncate">{c.industry} · {c.domain}</span>
                      </span>
                    </span>
                  </td>
                  <td className="td text-right whitespace-nowrap">
                    <span className="block tnum font-semibold">{money(c.spend)}/mo</span>
                    <span className={`block text-[11.5px] tnum ${c.pacingUp ? 'text-success' : 'text-danger'}`}>
                      Pacing {c.pacing}
                    </span>
                  </td>
                  <td className="td">
                    <span className="flex flex-wrap gap-1.5 mb-1">
                      {c.channels.map((ch) => (
                        <span key={ch} className="badge bg-canvas text-neutralx-secondary border-hairline">{ch}</span>
                      ))}
                    </span>
                    <span className="text-[11.5px] text-neutralx-secondary">{c.pipelines} active pipelines</span>
                  </td>
                  <td className="td">
                    <span className="flex items-center gap-2.5">
                      <span className="w-14"><ProgressBar percent={c.grade} tone={c.grade >= 92 ? 'success' : 'gold'} /></span>
                      <span className="tnum font-semibold whitespace-nowrap">{c.grade}% {c.tier}</span>
                    </span>
                  </td>
                  <td className="td">
                    <span className="flex items-center gap-2">
                      <StatusDot tone={c.state === 'alert' ? 'danger' : 'success'} />
                      <span className="text-[12px]">{c.sync}</span>
                    </span>
                  </td>
                  <td className="td text-right">
                    <button onClick={() => setActive(c)} className="btn-ghost !px-3.5 !py-1.5 !text-[12px] whitespace-nowrap">
                      Switch context <Icon name="chevron" className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
          <Pagination page={t.page} pageCount={t.pageCount} total={t.total} onPage={t.setPage} unit="client workspaces" />
        </Card>
      ) : (
        <SectionGrid cols={3}>
          {t.rows.map((c) => (
            <Card key={c.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="w-11 h-11 rounded-[14px] bg-gold text-ink flex items-center justify-center font-bold text-[13px] shrink-0">
                  {c.initials}
                </span>
                {c.state === 'alert'
                  ? <span className="badge-danger"><StatusDot tone="danger" /> Alert</span>
                  : <span className="badge-success"><StatusDot tone="success" /> Healthy</span>}
              </div>
              <h3 className="font-display text-card-title text-ink">{c.name}</h3>
              <p className="text-[12px] text-neutralx-secondary mt-1">{c.industry} · {c.domain}</p>
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="rounded-panel bg-canvas border border-hairline p-3">
                  <p className="label-micro mb-1">Spend</p>
                  <p className="font-display text-[16px] font-bold text-ink tnum">{money(c.spend, { compact: true })}</p>
                </div>
                <div className="rounded-panel bg-canvas border border-hairline p-3">
                  <p className="label-micro mb-1">Match grade</p>
                  <p className="font-display text-[16px] font-bold text-ink tnum">{c.grade}%</p>
                </div>
              </div>
              <button onClick={() => setActive(c)} className="btn-dark w-full mt-auto">Switch context</button>
            </Card>
          ))}
        </SectionGrid>
      )}

      <Modal
        open={!!active} onClose={() => setActive(null)}
        title={active ? `Switch to ${active.name}?` : ''}
        description="Every dashboard, report and CAPI pipeline will be scoped to this client workspace until you switch back."
        footer={
          <>
            <button className="btn-ghost" onClick={() => setActive(null)}>Cancel</button>
            <button className="btn-primary" onClick={() => { if (active) setBrandId(BRAND_ID_BY_NAME[active.name] ?? 'all'); toast(`Now working in ${active?.name}`); setActive(null); }}>
              Switch context
            </button>
          </>
        }
      >
        {active && (
          <div className="grid grid-cols-2 gap-3 pb-2">
            {[
              { k: 'Monthly spend', v: money(active.spend) },
              { k: 'Match grade', v: `${active.grade}% ${active.tier}` },
              { k: 'Active pipelines', v: String(active.pipelines) },
              { k: 'Sync state', v: active.state === 'alert' ? 'Needs attention' : 'Healthy' },
            ].map((m) => (
              <div key={m.k} className="rounded-panel bg-canvas border border-hairline p-4">
                <p className="label-micro mb-1.5">{m.k}</p>
                <p className="text-[13.5px] font-semibold text-ink">{m.v}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}
