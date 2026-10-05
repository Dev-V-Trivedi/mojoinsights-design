'use client';

import * as React from 'react';
import {
  PageHeader, LivePill, Card, CardHeader, KpiCard, SectionGrid, Tabs, SearchField, Select,
  TableShell, SortHeader, Pagination, StatusDot, ProgressBar, Mono, EmptyState, useToast,
  Modal, BarMeter, Toggle,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { useTable } from '@/lib/hooks';
import { AUDIENCES, NETWORK_HEALTH, COHORT_TABS } from '@/data/audiences';
import { useWorkspace, useScaled } from '@/components/WorkspaceContext';
import { scopeRows } from '@/lib/brandScope';

export default function AudiencesPage() {
  const [tab, setTab] = React.useState(COHORT_TABS[0]);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [autoSync, setAutoSync] = React.useState(true);
  const [syncing, setSyncing] = React.useState<string | null>(null);
  const toast = useToast();
  const { brand, brandId, money } = useWorkspace();
  const scaled = useScaled();
  const cohorts = React.useMemo(() => scopeRows(AUDIENCES, brandId), [brandId]);

  const t = useTable(cohorts, { searchKeys: ['name', 'source'], pageSize: 5, initialSort: { key: 'users', dir: 'desc' } });

  const pushNow = (id: string, name: string) => {
    setSyncing(id);
    setTimeout(() => { setSyncing(null); toast(`${name} pushed to all networks`); }, 1100);
  };

  const totalProfiles = cohorts.reduce((s, a) => s + a.matched, 0);

  return (
    <>
      <PageHeader
        title="Audiences & Customer Match"
        description="Deterministic CRM cohort synchronization, custom audience hashing, and high-value LTV lookalike push across ad networks."
        badges={<><LivePill label="1st-party CAPI sync" /><span className="badge-info">Auto-refresh 15m</span></>}
        actions={
          <>
            <button className="btn-ghost" onClick={() => toast('Syncing all cohorts to Meta & Google')}>
              <Icon name="refresh" className="w-4 h-4" /> Sync all
            </button>
            <button className="btn-primary" onClick={() => setCreateOpen(true)}>
              <Icon name="plus" className="w-4 h-4" /> Create audience sync
            </button>
          </>
        }
      />

      <SectionGrid cols={4}>
        <KpiCard label="Total synced profiles" value={totalProfiles.toLocaleString()} icon="users"
                 delta={{ value: '+12.4%', positive: true }} caption="SHA-256 hashed emails & phones across 6 platforms" />
        <KpiCard label="Avg match rate (EMQ)" value="88.6%" icon="target"
                 delta={{ value: 'Grade A', positive: true }} caption="Meta 91.2% · Google 94.0% · TikTok 80.5%" />
        <KpiCard label="Active segments" value={cohorts.length} unit="synced" icon="layers"
                 delta={{ value: '0 failed · 2 queued', neutral: true }} caption="Automated webhook sync · 60s poll interval" />
        <KpiCard label="ROAS lift from match" value="+34.2%" tone="dark" icon="trend"
                 delta={{ value: `+${money(184_200, { compact: true })} incr.`, positive: true }} caption="Holdout tested · significant at p < 0.01" />
      </SectionGrid>

      <Card className="relative overflow-hidden">
        <CardHeader
          title="Lookalike generation pipeline"
          subtitle="High-LTV profiles are transformed into seed lookalikes across Meta Graph and Google Demand Gen with dynamic churn dampening."
          icon="target"
          action={<span className="badge-success">Auto-expanding</span>}
        />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 items-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { k: 'Seed population', v: scaled(98420).toLocaleString(), s: 'High-value users' },
              { k: 'Expansion ratio', v: '3%', s: 'Meta lookalike tier' },
              { k: 'Projected reach', v: '2.9M', s: 'Across 4 networks' },
            ].map((m, i) => (
              <div key={m.k} className="rounded-panel bg-canvas border border-hairline p-4 relative">
                <p className="label-micro mb-1.5">{m.k}</p>
                <p className="font-display text-[22px] font-bold text-ink tnum">{m.v}</p>
                <p className="text-[11.5px] text-neutralx-secondary mt-1">{m.s}</p>
                {i < 2 && <Icon name="chevron" className="hidden sm:block w-4 h-4 text-neutralx-muted absolute -right-[18px] top-1/2 -translate-y-1/2 z-10" />}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2.5 rounded-full border border-hairline bg-canvas px-4 h-10">
              <span className="text-[12px] font-semibold text-ink">Sync engine</span>
              <Toggle checked={autoSync} onChange={setAutoSync} label="Automatic sync engine" />
            </div>
            <button className="btn-dark" onClick={() => toast('Seed inspector opened', 'info')}>Inspect seeds</button>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onChange={setTab} tabs={COHORT_TABS.map((c) => ({ id: c, label: c }))} />
        <div className="flex items-center gap-2.5">
          <SearchField value={t.query} onChange={t.setQuery} placeholder="Search cohort or source…" className="w-full sm:w-64" />
          <Select label="Network" value={t.filters.network ?? 'All platforms'}
                  onChange={(v) => t.setFilters((f) => ({ ...f, network: v === 'All platforms' ? '' : v }))}
                  options={['All platforms', 'Meta', 'Google', 'TikTok', 'LinkedIn']} />
        </div>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <Card className="xl:col-span-8">
          <CardHeader title="Active audience segments" subtitle="Every CRM cohort currently mirrored to an ad network." icon="users" />
          {t.rows.length === 0 ? (
            <EmptyState title="No cohorts match" body="Adjust the search or network filter to see your segments."
                        action={<button className="btn-ghost" onClick={() => { t.setQuery(''); t.setFilters({}); }}>Reset</button>} />
          ) : (
            <>
              <TableShell minWidth={1020}>
                <thead>
                  <tr className="border-b border-hairline">
                    <SortHeader label="Audience & source" active={t.sort?.key === 'name'} dir={t.sort?.dir} onClick={() => t.toggleSort('name')} />
                    <SortHeader label="Target networks" />
                    <SortHeader label="Matched scale" active={t.sort?.key === 'users'} dir={t.sort?.dir} onClick={() => t.toggleSort('users')} />
                    <SortHeader label="Sync status" />
                    <SortHeader label="Actions" align="right" />
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((a) => (
                    <tr key={a.id} className="row">
                      <td className="td">
                        <span className="block font-semibold text-ink">{a.name}</span>
                        <span className="text-[11.5px] text-neutralx-secondary">{a.source} · {a.cadence}</span>
                      </td>
                      <td className="td">
                        <span className="flex flex-wrap gap-1.5">
                          {a.networks.map((n) => (
                            <span key={n} className="badge bg-canvas text-neutralx-secondary border-hairline">{n}</span>
                          ))}
                        </span>
                      </td>
                      <td className="td">
                        <span className="block tnum font-semibold">{a.users.toLocaleString()} users</span>
                        <span className="flex items-center gap-2 mt-1">
                          <span className="w-16"><ProgressBar percent={a.rate} tone={a.rate >= 90 ? 'success' : 'gold'} /></span>
                          <span className="text-[11.5px] text-neutralx-secondary tnum whitespace-nowrap">
                            {a.matched.toLocaleString()} ({a.rate}%)
                          </span>
                        </span>
                      </td>
                      <td className="td">
                        <span className="flex items-center gap-2 whitespace-nowrap">
                          <StatusDot tone={a.state === 'queued' ? 'warning' : 'success'} />
                          {a.status}
                        </span>
                      </td>
                      <td className="td text-right">
                        <button onClick={() => pushNow(a.id, a.name)} disabled={syncing === a.id}
                                className="btn-ghost !px-3.5 !py-1.5 !text-[12px]">
                          {syncing === a.id ? 'Pushing…' : 'Push now'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
              <Pagination page={t.page} pageCount={t.pageCount} total={t.total} onPage={t.setPage} unit="CRM audience cohorts" />
            </>
          )}
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader title="Network match health" subtitle="Real-time identity resolution per destination." icon="broadcast"
                      action={<span className="badge-success">Live</span>} />
          <div className="flex flex-col gap-5">
            {NETWORK_HEALTH.map((n) => (
              <div key={n.name}>
                <BarMeter label={n.name} percent={n.rate} color={n.color} />
                <p className="text-[11.5px] text-neutralx-secondary mt-1.5">{n.note}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Modal
        open={createOpen} onClose={() => setCreateOpen(false)}
        title="Create audience sync"
        description="Define a CRM cohort and the ad networks it should be mirrored to."
        footer={
          <>
            <button className="btn-ghost" onClick={() => setCreateOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={() => { setCreateOpen(false); toast('Audience sync created'); }}>
              Create sync
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4 pb-2">
          <label className="flex flex-col gap-2">
            <span className="label-micro">Audience name</span>
            <input className="field" placeholder="e.g. High LTV customers" />
          </label>
          <div className="flex flex-col gap-2">
            <span className="label-micro">Source system</span>
            <Select value="HubSpot CRM" onChange={() => {}} label="Source system"
                    options={['HubSpot CRM', 'Salesforce', 'Zoho CRM', 'Stripe Billing', 'Internal DB']} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="label-micro">Target networks</span>
            <div className="flex flex-wrap gap-2">
              {['Meta', 'Google', 'TikTok', 'LinkedIn'].map((n, i) => (
                <label key={n} className={i < 2 ? 'chip-on cursor-pointer' : 'chip-off cursor-pointer'}>
                  <input type="checkbox" defaultChecked={i < 2} className="sr-only" />{n}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
