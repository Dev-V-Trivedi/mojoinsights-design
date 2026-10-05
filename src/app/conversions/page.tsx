'use client';

import * as React from 'react';
import {
  PageHeader, LivePill, VersionPill, Card, CardHeader, KpiCard, Tabs, Segmented, SearchField,
  SectionGrid, TableShell, SortHeader, Pagination, BarMeter, Donut, StatusDot, ProgressBar,
  EmptyState, Mono, useToast, Modal, Select,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { useTable } from '@/lib/hooks';
import { DATE_RANGES, type DateRange } from '@/data/dashboard';
import { EVENT_SIGNALS, VOLUME_SPLIT, RETRY_QUEUE, LIVE_STREAM, ACTIVITY_LOG, CHANNEL_FEEDS } from '@/data/conversions';
import { useWorkspace, useScaled } from '@/components/WorkspaceContext';
import { scopeRows, scopeCount } from '@/lib/brandScope';

type TabId = 'overview' | 'activity' | 'channels' | 'retry';

export default function ConversionsPage() {
  const [tab, setTab] = React.useState<TabId>('overview');
  const [range, setRange] = React.useState<DateRange>('Last 7 days');
  const [queue, setQueue] = React.useState(RETRY_QUEUE);
  const [testOpen, setTestOpen] = React.useState(false);
  const toast = useToast();
  const { brand, brandId, money } = useWorkspace();
  const scaled = useScaled();
  const retryQueue = React.useMemo(() => scopeRows(queue, brandId), [queue, brandId]);
  const signals = React.useMemo(() => scopeRows(EVENT_SIGNALS, brandId), [brandId]);
  const sent = scopeCount(948, brandId), failed = scopeCount(14, brandId);

  const t = useTable(signals, { searchKeys: ['name', 'platform'], pageSize: 5, initialSort: { key: 'fired', dir: 'desc' } });

  const retryOne = (id: string) => {
    setQueue((q) => q.filter((r) => r.id !== id));
    toast(`Payload ${id} re-dispatched`);
  };

  return (
    <>
      <PageHeader
        title="Conversions"
        description="Real-time server-side CAPI event orchestration, delivery tracking, and automated failure retries across connected advertising networks."
        badges={<><LivePill /><VersionPill>v2.8.4 CAPI Node</VersionPill></>}
        actions={
          <>
            <Segmented options={DATE_RANGES} value={range} onChange={setRange} />
            <button className="btn-primary" onClick={() => setTestOpen(true)}>
              <Icon name="bolt" className="w-4 h-4" /> Test event payload
            </button>
          </>
        }
      />

      <SectionGrid cols={3}>
        <KpiCard label="Sent today" value={sent.toLocaleString()} unit="dispatched" icon="broadcast"
                 delta={{ value: '+8.4%', positive: true }}
                 caption={<Mono>Meta CAPI · Google EC · TikTok</Mono>} />
        <KpiCard label="Failed today" value={String(failed)} unit="failed" icon="alert"
                 delta={{ value: '-32% drop', positive: true }}
                 caption={<>{retryQueue.length} in retry queue · 2 fatal errors</>} />
        <KpiCard label="Avg delivery latency" value="138" unit="ms" icon="clock"
                 delta={{ value: 'Optimal · 99.8% p99', positive: true }}
                 caption="Edge worker dispatch to ad endpoints · -14ms vs benchmark" />
      </SectionGrid>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs<TabId>
          value={tab} onChange={setTab}
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'activity', label: 'Activity log', dot: true },
            { id: 'channels', label: 'Channels & feeds' },
            { id: 'retry', label: 'Retry queue', badge: retryQueue.length },
          ]}
        />
        <div className="flex items-center gap-2.5">
          <SearchField value={t.query} onChange={t.setQuery} placeholder="Filter by event, network, ID…" className="w-full sm:w-72" />
          <button className="btn-icon" aria-label="Refresh stream" onClick={() => toast('Stream refreshed', 'info')}>
            <Icon name="refresh" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {tab === 'overview' && (
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <Card className="xl:col-span-8">
            <CardHeader
              title="Event signals performance"
              subtitle="Configured conversion events and real-time delivery health by target ad channel."
              action={<Mono>Auto-sync 30s</Mono>}
            />
            {t.rows.length === 0 ? (
              <EmptyState title="No matching signals" body="Try a different event name or ad platform."
                          action={<button className="btn-ghost" onClick={() => t.setQuery('')}>Clear filter</button>} />
            ) : (
              <>
                <TableShell minWidth={940}>
                  <thead>
                    <tr className="border-b border-hairline">
                      <SortHeader label="Event name" active={t.sort?.key === 'name'} dir={t.sort?.dir} onClick={() => t.toggleSort('name')} />
                      <SortHeader label="Target platform" active={t.sort?.key === 'platform'} dir={t.sort?.dir} onClick={() => t.toggleSort('platform')} />
                      <SortHeader label="Fired count" align="right" active={t.sort?.key === 'fired'} dir={t.sort?.dir} onClick={() => t.toggleSort('fired')} />
                      <SortHeader label="Success rate" active={t.sort?.key === 'success'} dir={t.sort?.dir} onClick={() => t.toggleSort('success')} />
                      <SortHeader label="Last synced" />
                      <SortHeader label="Action" align="right" />
                    </tr>
                  </thead>
                  <tbody>
                    {t.rows.map((e) => (
                      <tr key={e.id} className="row">
                        <td className="td">
                          <span className="flex items-center gap-2.5 font-semibold">
                            <StatusDot tone={e.status === 'healthy' ? 'success' : 'warning'} />
                            {e.name}
                          </span>
                        </td>
                        <td className="td">
                          <span className={`badge ${e.platform === 'Meta CAPI' ? 'bg-gold-tint text-warning border-gold/30'
                            : e.platform === 'TikTok Events' ? 'bg-success-tint text-success border-success/20'
                            : 'bg-info-tint text-ink border-hairline'}`}>
                            {e.platform}
                          </span>
                        </td>
                        <td className="td text-right tnum font-semibold">{e.fired}</td>
                        <td className="td">
                          <span className="flex items-center gap-2.5">
                            <span className="w-20"><ProgressBar percent={e.success} tone={e.success >= 98 ? 'success' : 'gold'} /></span>
                            <span className="tnum font-semibold">{e.success}%</span>
                          </span>
                        </td>
                        <td className="td text-neutralx-secondary whitespace-nowrap">{e.synced}</td>
                        <td className="td text-right">
                          <button onClick={() => toast(`Inspecting ${e.name}`, 'info')}
                                  className="btn-ghost !px-3.5 !py-1.5 !text-[12px]">Inspect</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </TableShell>
                <Pagination page={t.page} pageCount={t.pageCount} total={t.total} onPage={t.setPage} unit="tracked server signals" />
              </>
            )}
          </Card>

          <div className="xl:col-span-4 flex flex-col gap-5">
            <Card>
              <CardHeader title="Event volume distribution"
                          subtitle="Percentage share across total dispatched conversions." icon="target" />
              <div className="flex items-center gap-5 mb-5">
                <Donut segments={VOLUME_SPLIT.map((v) => ({ ...v, value: scaled(v.value) }))} size={132} centerValue={scaled(1072).toLocaleString()} centerLabel="Events" />
                <div className="flex-1 flex flex-col gap-3 min-w-0">
                  {VOLUME_SPLIT.map((v) => (
                    <BarMeter key={v.label} label={v.label} value={scaled(v.value)} percent={v.percent} color={v.color} />
                  ))}
                </div>
              </div>
              <div className="rounded-panel bg-canvas border border-hairline p-4 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-gold-tint text-warning flex items-center justify-center shrink-0">
                  <Icon name="shield" className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold text-ink">CAPI match rate</p>
                  <p className="text-[11.5px] text-neutralx-secondary">Avg 9.2 / 10 Meta EMQ</p>
                </div>
                <span className="badge-success shrink-0">High quality</span>
              </div>
            </Card>

            <Card>
              <CardHeader title="Live signal stream" subtitle="Outbound conversions verified by ingestion endpoints."
                          action={<Mono>3s refresh</Mono>} />
              <ul className="flex flex-col">
                {scopeRows(LIVE_STREAM, brandId).slice(0, 4).map((s) => (
                  <li key={s.id} className="flex items-start gap-3 py-3 border-b border-hairline last:border-0">
                    <span className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-ink shrink-0">
                      <Icon name={s.icon} className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] font-semibold text-ink truncate">
                        {s.event} <Mono className="ml-1">{s.hash}</Mono>
                      </p>
                      <p className="text-[11.5px] text-neutralx-secondary truncate">
                        {s.lead} · {s.target} ({s.code} · {s.ms}ms)
                      </p>
                    </div>
                    <Mono className="shrink-0">{s.ago}</Mono>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-4 mt-1 border-t border-hairline">
                <span className="flex items-center gap-2 text-[12px] text-neutralx-secondary">
                  <StatusDot tone="success" /> Socket connected
                </span>
                <button onClick={() => setTab('activity')} className="text-[12px] font-semibold text-ink hover:underline">
                  Full inspector →
                </button>
              </div>
            </Card>
          </div>
        </section>
      )}

      {tab === 'activity' && (
        <Card>
          <CardHeader title="Activity log" subtitle="Every mutation, dispatch and automated recovery across the conversion pipeline." icon="clock" />
          <ol className="relative border-l border-hairline ml-3">
            {scopeRows(ACTIVITY_LOG, brandId).map((l) => (
              <li key={l.id} className="relative pl-7 pb-6 last:pb-0">
                <span className={`absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  l.tone === 'danger' ? 'bg-danger' : l.tone === 'success' ? 'bg-success' : 'bg-gold'}`} />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <Mono>{l.time}</Mono>
                  <span className="text-[13px] font-semibold text-ink">{l.action}</span>
                  <span className="badge-info">{l.actor}</span>
                </div>
                <p className="text-[12.5px] text-neutralx-secondary mt-1">{l.detail}</p>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {tab === 'channels' && (
        <SectionGrid cols={2}>
          {scopeRows(CHANNEL_FEEDS, brandId).map((f) => (
            <Card key={f.id}>
              <CardHeader title={f.name} subtitle={`Worker node ${f.node}`} icon="plug"
                          action={<span className={f.state === 'Healthy' ? 'badge-success' : 'badge-warning'}>{f.state}</span>} />
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { k: '24h events', v: f.events24.toLocaleString() },
                  { k: 'Success rate', v: `${f.success}%` },
                  { k: 'Avg latency', v: `${f.latency}ms` },
                  { k: 'Match quality', v: `${f.emq} / 10` },
                ].map((m) => (
                  <div key={m.k} className="rounded-panel bg-canvas border border-hairline p-3.5">
                    <p className="label-micro mb-1.5">{m.k}</p>
                    <p className="font-display text-[18px] font-bold text-ink tnum">{m.v}</p>
                  </div>
                ))}
              </div>
              <ProgressBar percent={f.success} tone={f.state === 'Healthy' ? 'success' : 'gold'} />
            </Card>
          ))}
        </SectionGrid>
      )}

      {tab === 'retry' && (
        <Card>
          <CardHeader
            title="Retry queue (automated backoff)"
            subtitle="Exponential backoff with jitter protection against upstream ad server rate limits."
            icon="refresh"
            action={<span className="badge-danger">{retryQueue.length} pending</span>}
          />
          {retryQueue.length === 0 ? (
            <EmptyState icon="check" title="Queue is empty" body="Every quarantined payload has been re-dispatched successfully." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {retryQueue.map((r) => (
                <div key={r.id} className="rounded-panel bg-canvas border border-hairline p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="flex items-center gap-2 min-w-0">
                      <Mono className="!text-ink font-semibold">{r.id}</Mono>
                      <Mono>{r.hash}</Mono>
                    </span>
                    <span className="badge-info shrink-0">{r.platform}</span>
                  </div>
                  <p className="text-[13px] font-semibold text-ink">{r.event}</p>
                  <p className="text-[11.5px] text-neutralx-secondary mt-0.5">Attempt {r.attempt} of {r.max} · next in {r.next}</p>
                  <div className="flex gap-1 my-3">
                    {Array.from({ length: r.max }).map((_, i) => (
                      <span key={i} className={`h-1.5 flex-1 rounded-full ${i < r.attempt ? 'bg-danger' : 'bg-hairline'}`} />
                    ))}
                  </div>
                  <button onClick={() => retryOne(r.id)} className="btn-ghost w-full !py-2 !text-[12px]">Retry now</button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between pt-5 mt-1 border-t border-hairline flex-wrap gap-3">
            <Mono>Worker: node-eu-central-1</Mono>
            <button disabled={retryQueue.length === 0}
                    onClick={() => { setQueue([]); toast(`Flushed ${retryQueue.length} payloads`); }}
                    className="btn-dark !px-4 !py-2 !text-[12px]">
              Flush all queue ({retryQueue.length})
            </button>
          </div>
        </Card>
      )}

      <Modal
        open={testOpen} onClose={() => setTestOpen(false)}
        title="Test event payload"
        description="Dispatch a dry-run conversion to verify mapping and identity resolution. Nothing is billed or attributed."
        footer={
          <>
            <button className="btn-ghost" onClick={() => setTestOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={() => { setTestOpen(false); toast('Test payload accepted · 200 OK'); }}>
              <Icon name="bolt" className="w-4 h-4" /> Dispatch test
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4 pb-2">
          <label className="flex flex-col gap-2">
            <span className="label-micro">Event name</span>
            <input className="field" defaultValue="Purchase" />
          </label>
          <div className="flex flex-col gap-2">
            <span className="label-micro">Destination</span>
            <Select value="Meta CAPI" onChange={() => {}} label="Destination"
                    options={['Meta CAPI', 'Google Enhanced', 'TikTok Events', 'LinkedIn CAPI']} />
          </div>
          <label className="flex flex-col gap-2">
            <span className="label-micro">Payload (JSON)</span>
            <textarea rows={6} spellCheck={false}
                      className="field !h-auto py-3 font-mono !text-[11.5px] leading-relaxed"
                      defaultValue={'{\n  "event_name": "Purchase",\n  "value": 340.00,\n  "currency": "USD",\n  "em": "sha256:9b71d224…"\n}'} />
          </label>
        </div>
      </Modal>
    </>
  );
}
