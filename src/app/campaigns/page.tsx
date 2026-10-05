'use client';

import * as React from 'react';
import {
  PageHeader, Card, CardHeader, KpiCard, SectionGrid, Tabs, SearchField, TableShell,
  SortHeader, Pagination, StatusDot, ProgressBar, Mono, EmptyState, useToast, Modal, Toggle, LivePill,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { useTable } from '@/lib/hooks';
import { ROUTES, PARAM_MAP, CAMPAIGN_TABS } from '@/data/campaigns';
import { useWorkspace, useScaled } from '@/components/WorkspaceContext';
import { scopeRows } from '@/lib/brandScope';

export default function CampaignsPage() {
  const [tab, setTab] = React.useState(CAMPAIGN_TABS[0]);
  const [resolverOpen, setResolverOpen] = React.useState(false);
  const [testUrl, setTestUrl] = React.useState('https://digitalmojo.io/lp?utm_source=google_search&utm_campaign=pmax_leads&gclid=EAIaIQ');
  const [lowercase, setLowercase] = React.useState(true);
  const [geoFallback, setGeoFallback] = React.useState(false);
  const toast = useToast();
  const { brandId, money, brand } = useWorkspace();
  const scaled = useScaled();
  const byBrand = React.useMemo(() => scopeRows(ROUTES, brandId), [brandId]);
  const scoped = React.useMemo(
    () => (tab === CAMPAIGN_TABS[0] ? byBrand : byBrand.filter((r) => r.platform.startsWith(tab.split(' ')[0]))),
    [tab, byBrand],
  );
  const t = useTable(scoped, { searchKeys: ['name', 'platform', 'rule'], pageSize: 4, initialSort: { key: 'score', dir: 'desc' } });

  const parsed = React.useMemo(() => {
    try {
      const u = new URL(testUrl);
      return Array.from(u.searchParams.entries());
    } catch { return []; }
  }, [testUrl]);

  return (
    <>
      <PageHeader
        title="Campaign & Ad Set Signal Mapping"
        description="Map downstream ad-network attribution tokens, normalize incoming URL hashes, and dispatch enriched server-side payloads."
        badges={<><LivePill label="Deterministic CAPI routing" /><span className="badge-info">{ROUTES.length} active mappings</span></>}
        actions={
          <>
            <button className="btn-ghost" onClick={() => setResolverOpen(true)}>
              <Icon name="search" className="w-4 h-4" /> Test UTM resolver
            </button>
            <button className="btn-primary" onClick={() => toast('Signal route builder opened', 'info')}>
              <Icon name="plus" className="w-4 h-4" /> New signal route
            </button>
          </>
        }
      />

      <SectionGrid cols={4}>
        <KpiCard label="Mapped campaigns" value={byBrand.length} unit="active" icon="layers"
                 delta={{ value: '+6 this month', positive: true }} caption="0 unmapped UTM leaks detected" />
        <KpiCard label="Match enhancement rate" value="94.2%" icon="target"
                 delta={{ value: 'Tier A', positive: true }} caption="Auto-injecting fbclid, gclid and ttclid" />
        <KpiCard label="Value uplift (ROAS)" value="+28.4%" icon="trend"
                 delta={{ value: money(scaled(118_400), { compact: true }), positive: true }} caption="Incremental closed-won attributed revenue" />
        <KpiCard label="Unresolved signal leaks" value="0" unit="detected" tone="dark" icon="shield"
                 delta={{ value: '100% capture', positive: true }} caption="Every inbound parameter resolved to a schema" />
      </SectionGrid>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onChange={setTab} tabs={CAMPAIGN_TABS.map((c) => ({ id: c, label: c }))} />
        <SearchField value={t.query} onChange={t.setQuery} placeholder="Search campaign or UTM rule…" className="w-full sm:w-72" />
      </div>

      <Card>
        <CardHeader title="Active campaign signal routing matrix"
                    subtitle="Runtime translation layer between ad set UTM query hashes and destination CAPI schemas."
                    icon="flow" />
        {t.rows.length === 0 ? (
          <EmptyState title="No routes found" body="No campaign mapping matches this platform or search."
                      action={<button className="btn-ghost" onClick={() => { t.setQuery(''); setTab(CAMPAIGN_TABS[0]); }}>Reset</button>} />
        ) : (
          <>
            <TableShell minWidth={1120}>
              <thead>
                <tr className="border-b border-hairline">
                  <SortHeader label="Campaign & destination" active={t.sort?.key === 'name'} dir={t.sort?.dir} onClick={() => t.toggleSort('name')} />
                  <SortHeader label="Routing engine" />
                  <SortHeader label="Attached events" />
                  <SortHeader label="Score" active={t.sort?.key === 'score'} dir={t.sort?.dir} onClick={() => t.toggleSort('score')} />
                  <SortHeader label="24h volume" align="right" active={t.sort?.key === 'vol'} dir={t.sort?.dir} onClick={() => t.toggleSort('vol')} />
                  <SortHeader label="Action" align="right" />
                </tr>
              </thead>
              <tbody>
                {t.rows.map((r) => (
                  <tr key={r.id} className="row">
                    <td className="td">
                      <span className="flex items-start gap-3">
                        <span className="w-8 h-8 rounded-full bg-gold text-ink flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                          {r.badge}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-semibold text-ink">{r.name}</span>
                          <span className="block text-[11.5px] text-neutralx-secondary">{r.platform} · {r.ident}</span>
                          <Mono>{r.rule}</Mono>
                        </span>
                      </span>
                    </td>
                    <td className="td">
                      <span className="flex items-center gap-2 whitespace-nowrap">
                        <Icon name="bolt" className="w-3.5 h-3.5 text-gold shrink-0" />
                        {r.engine}
                      </span>
                    </td>
                    <td className="td">
                      <span className="flex flex-wrap gap-1.5">
                        {r.events.map((e) => (
                          <span key={e} className="badge bg-canvas text-neutralx-secondary border-hairline font-mono !text-[11px]">{e}</span>
                        ))}
                      </span>
                    </td>
                    <td className="td">
                      <span className="flex items-center gap-2.5">
                        <span className="w-14"><ProgressBar percent={r.score} tone={r.score >= 90 ? 'success' : 'gold'} /></span>
                        <span className="tnum font-semibold">{r.score}%</span>
                      </span>
                      <span className={`mt-1 ${r.grade === 'Optimal' ? 'badge-success' : 'badge-warning'}`}>{r.grade}</span>
                    </td>
                    <td className="td text-right whitespace-nowrap">
                      <span className="block tnum font-semibold">{r.vol} evts</span>
                      <span className="block text-[11.5px] text-neutralx-secondary tnum">${r.value.toLocaleString()} val</span>
                    </td>
                    <td className="td text-right">
                      <button onClick={() => toast(`Editing ${r.name}`, 'info')} className="btn-ghost !px-3.5 !py-1.5 !text-[12px]">
                        Edit rule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
            <Pagination page={t.page} pageCount={t.pageCount} total={t.total} onPage={t.setPage} unit="campaign rules" />
          </>
        )}
      </Card>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <Card className="xl:col-span-7">
          <CardHeader title="UTM parameter parser & rewriter"
                      subtitle="Canonical mapping applied to every inbound click before CAPI dispatch." icon="flow" />
          <div className="flex flex-col gap-3">
            {PARAM_MAP.map((p) => (
              <div key={p.from} className="flex items-center gap-3 rounded-panel bg-canvas border border-hairline p-3.5 flex-wrap">
                <Mono className="!text-ink font-semibold">{p.from}</Mono>
                <Icon name="chevron" className="w-3.5 h-3.5 text-neutralx-muted shrink-0" />
                <span className="text-[12.5px] text-neutralx-secondary">{p.to}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 mt-5 pt-5 border-t border-hairline">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[12.5px] font-medium text-ink">Enforce lowercase normalization</span>
              <Toggle checked={lowercase} onChange={setLowercase} label="Enforce lowercase normalization" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[12.5px] font-medium text-ink">Fallback to IP geolocation</span>
              <Toggle checked={geoFallback} onChange={setGeoFallback} label="Fallback to IP geolocation" />
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-5">
          <CardHeader title="Auto-sync cron" subtitle="Routing batches reconcile every 60 seconds." icon="clock"
                      action={<span className="badge-success"><StatusDot tone="success" /> Active</span>} />
          <div className="rounded-panel bg-ink text-white p-5">
            <p className="label-micro !text-white/85 mb-2">Next routing batch</p>
            <p className="font-display text-[28px] font-bold tnum">00:46</p>
            <p className="text-[12px] text-white/90 mt-1.5">Last ping processed 14 seconds ago</p>
            <button onClick={() => toast('Force resync dispatched')}
                    className="btn bg-gold text-ink w-full mt-5 py-2.5">Force resync</button>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-5">
            {[{ k: 'Signal quality', v: '94.2%' }, { k: 'Routes healthy', v: `${byBrand.length} / ${byBrand.length}` }].map((m) => (
              <div key={m.k} className="rounded-panel bg-canvas border border-hairline p-4">
                <p className="label-micro mb-1.5">{m.k}</p>
                <p className="font-display text-[18px] font-bold text-ink tnum">{m.v}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Modal
        open={resolverOpen} onClose={() => setResolverOpen(false)} width="max-w-xl"
        title="UTM resolver sandbox"
        description="Paste a landing-page URL to see exactly which parameters the routing engine will extract."
        footer={<button className="btn-primary" onClick={() => setResolverOpen(false)}>Done</button>}
      >
        <div className="flex flex-col gap-4 pb-2">
          <label className="flex flex-col gap-2">
            <span className="label-micro">Test URL</span>
            <textarea rows={3} value={testUrl} onChange={(e) => setTestUrl(e.target.value)} spellCheck={false}
                      className="field !h-auto py-3 font-mono !text-[11.5px] leading-relaxed" />
          </label>
          <div>
            <p className="label-micro mb-2.5">Resolved parameters ({parsed.length})</p>
            {parsed.length === 0 ? (
              <p className="text-[12.5px] text-danger">Not a valid URL — check the protocol and query string.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {parsed.map(([k, v]) => (
                  <div key={k} className="flex items-center gap-3 rounded-field bg-canvas border border-hairline px-3.5 py-2.5 flex-wrap">
                    <Mono className="!text-ink font-semibold">{k}</Mono>
                    <Icon name="chevron" className="w-3 h-3 text-neutralx-muted shrink-0" />
                    <Mono className="truncate">{v}</Mono>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
