'use client';

import * as React from 'react';
import {
  PageHeader, Card, CardHeader, KpiCard, SectionGrid, Tabs, SearchField, TableShell,
  SortHeader, Pagination, StatusDot, Mono, EmptyState, useToast, Modal, Segmented, LivePill, Select,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { useTable } from '@/lib/hooks';
import { useWorkspace } from '@/components/WorkspaceContext';
import { scopeRows, scopeCount } from '@/lib/brandScope';

type Job = {
  id: string; name: string; target: string; cron: string; human: string;
  last: string; lastCode: string; next: string; retry: string; active: boolean; group: string;
};

const JOBS: Job[] = [
  { id: 'j1', name: 'Meta CAPI lead form flush', target: 'meta-pixel-prod · stream-us-1', cron: '*/15 * * * *', human: 'Every 15 minutes',
    last: '8m ago', lastCode: '200 OK', next: 'In 7m', retry: '3x exponential', active: true, group: 'CAPI dispatches' },
  { id: 'j2', name: 'HubSpot won deals → Google Ads offline', target: 'crm-deals · lookback-90d', cron: '0 * * * *', human: 'Hourly at :00',
    last: '32m ago', lastCode: '200 OK', next: 'In 28m', retry: '5x exponential', active: true, group: 'CRM polling' },
  { id: 'j3', name: 'Salesforce MQL stage transition scraper', target: 'salesforce-core · delta-feed', cron: '*/30 * * * *', human: 'Every 30 minutes',
    last: '2m ago', lastCode: '200 OK', next: 'In 28m', retry: '3x exponential', active: true, group: 'CRM polling' },
  { id: 'j4', name: 'TikTok audience seed refresh', target: 'tiktok-audiences · seed-v2', cron: '0 */6 * * *', human: 'Every 6 hours',
    last: '1h 12m ago', lastCode: '200 OK', next: 'In 4h 48m', retry: '3x exponential', active: true, group: 'Audience recalculation' },
  { id: 'j5', name: 'SHA-256 hash audit & scrub', target: 'compliance-worker · audit', cron: '0 2 * * *', human: 'Daily at 02:00 UTC',
    last: '12h ago', lastCode: '200 OK', next: 'In 11h', retry: '2x linear', active: true, group: 'Purge & compliance' },
  { id: 'j6', name: 'Zoho real-time webhook reconciliation', target: 'zoho-ingress · webhook', cron: '*/5 * * * *', human: 'Every 5 minutes',
    last: '1m ago', lastCode: '200 OK', next: 'In 4m', retry: '5x exponential', active: true, group: 'CRM polling' },
  { id: 'j7', name: 'Lookalike expansion recompute', target: 'meta-graph · lal-3pct', cron: '0 4 * * 1', human: 'Weekly Monday 04:00',
    last: '3d ago', lastCode: '200 OK', next: 'In 4d', retry: '2x linear', active: false, group: 'Audience recalculation' },
  { id: 'j8', name: 'GDPR erasure queue processor', target: 'compliance-worker · erasure', cron: '0 */4 * * *', human: 'Every 4 hours',
    last: '2h ago', lastCode: '200 OK', next: 'In 2h', retry: '3x exponential', active: true, group: 'Purge & compliance' },
];

const TABS = ['All schedules', 'CAPI dispatches', 'CRM polling', 'Audience recalculation', 'Purge & compliance'];
const VIEWS = ['Timeline', 'Weekly calendar', 'Daily agenda'] as const;

const TIMELINE = [
  { at: '14:30', label: 'SHA-256 hash audit', tone: 'muted' },
  { at: '14:38', label: 'Meta CAPI flush (15m)', tone: 'now' },
  { at: '14:45', label: 'Google enhanced offline', tone: 'next' },
  { at: '15:00', label: 'HubSpot & SFDC deal match', tone: 'next' },
  { at: '18:00', label: 'TikTok seed refresh', tone: 'next' },
  { at: '02:00', label: 'Security & SHA-256 scrub', tone: 'next' },
];

export default function SchedulesPage() {
  const [tab, setTab] = React.useState(TABS[0]);
  const [view, setView] = React.useState<(typeof VIEWS)[number]>('Timeline');
  const [jobs, setJobs] = React.useState(JOBS);
  const [newOpen, setNewOpen] = React.useState(false);
  const toast = useToast();

  const { brand, brandId } = useWorkspace();
  const inBrand = React.useMemo(() => scopeRows(jobs, brandId), [jobs, brandId]);
  const scoped = React.useMemo(() => (tab === TABS[0] ? inBrand : inBrand.filter((j) => j.group === tab)), [tab, inBrand]);
  const t = useTable(scoped, { searchKeys: ['name', 'target', 'cron'], pageSize: 5 });

  const toggleJob = (id: string) => {
    setJobs((s) => s.map((j) => (j.id === id ? { ...j, active: !j.active } : j)));
    const j = jobs.find((x) => x.id === id);
    toast(`${j?.name} ${j?.active ? 'paused' : 'resumed'}`);
  };

  const activeCount = inBrand.filter((j) => j.active).length;

  return (
    <>
      <PageHeader
        title="Schedules & Sync Automation"
        description="Automated CAPI ingestion intervals, CRM batch sync crons, offline conversion lookback windows, and audience refresh routines across multi-region serverless workers."
        badges={<><LivePill label="Real-time cron engine" /><span className="badge-info">{activeCount} active jobs</span></>}
        actions={
          <>
            <button className="btn-ghost" onClick={() => toast('Force sync dispatched to all workers')}>
              <Icon name="refresh" className="w-4 h-4" /> Run force sync
            </button>
            <button className="btn-primary" onClick={() => setNewOpen(true)}>
              <Icon name="plus" className="w-4 h-4" /> Schedule automation
            </button>
          </>
        }
      />

      <SectionGrid cols={4}>
        <KpiCard label="Scheduled automation jobs" value={activeCount} unit="active" icon="calendar"
                 delta={{ value: '+4 this week', positive: true }} caption={`${jobs.length - activeCount} paused / error-hold`} />
        <KpiCard label="24h execution success" value="99.94%" icon="check"
                 delta={{ value: '842 / 843 OK', positive: true }} caption="1 auto-retried · 0 dropped packets" />
        <KpiCard label="Next scheduled trigger" value="4m" unit="12s" icon="clock"
                 delta={{ value: 'Queued', neutral: true }} caption="HubSpot → Meta CAPI batch #4910" />
        <KpiCard label="Compute & queue latency" value="34" unit="ms" tone="dark" icon="bolt"
                 delta={{ value: 'Optimal', positive: true }} caption="Serverless edge node us-east-1" />
      </SectionGrid>

      <Card>
        <CardHeader title="Execution timeline" subtitle="Today's real-time cron schedule stream." icon="calendar"
                    action={<div className="flex items-center gap-3"><Mono>UTC / EST</Mono><Segmented options={VIEWS} value={view} onChange={setView} size="sm" /></div>} />

        {view === 'Timeline' && (
          <>
            <div className="relative h-2 rounded-full bg-canvas border border-hairline mb-8">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gold" style={{ width: '61%' }} />
              <div className="absolute -top-1 w-4 h-4 rounded-full bg-ink border-2 border-white shadow-level1" style={{ left: 'calc(61% - 8px)' }} />
            </div>
            <div className="flex justify-between mb-6">
              {['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((h) => (
                <Mono key={h}>{h}</Mono>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {TIMELINE.map((e) => (
                <div key={e.at + e.label}
                     className={`rounded-panel p-4 border flex items-center gap-3 ${
                       e.tone === 'now' ? 'bg-ink border-ink text-white' : 'bg-canvas border-hairline'}`}>
                  <span className={`font-mono text-[11.5px] font-semibold shrink-0 ${e.tone === 'now' ? 'text-gold' : 'text-neutralx-secondary'}`}>
                    {e.at}
                  </span>
                  <span className={`text-[12.5px] font-semibold truncate ${e.tone === 'now' ? 'text-white' : 'text-ink'}`}>{e.label}</span>
                  {e.tone === 'now' && <span className="badge bg-gold text-ink border-gold ml-auto shrink-0">Now</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'Weekly calendar' && (
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
              <div key={d} className="rounded-panel bg-canvas border border-hairline p-3 min-h-[140px]">
                <p className="label-micro mb-2.5">{d}</p>
                <div className="flex flex-col gap-1.5">
                  {jobs.slice(0, i === 0 ? 4 : (i % 3) + 1).map((j) => (
                    <span key={j.id} className="block rounded bg-white border border-hairline px-2 py-1 text-[10.5px] font-semibold text-ink truncate">
                      {j.name.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'Daily agenda' && (
          <ol className="relative border-l border-hairline ml-3">
            {TIMELINE.map((e) => (
              <li key={e.at + e.label} className="relative pl-7 pb-5 last:pb-0">
                <span className={`absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${e.tone === 'now' ? 'bg-gold' : 'bg-ink'}`} />
                <div className="flex items-baseline gap-3 flex-wrap">
                  <Mono>{e.at}</Mono>
                  <span className="text-[13px] font-semibold text-ink">{e.label}</span>
                  {e.tone === 'now' && <span className="badge-warning">Running</span>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onChange={setTab}
              tabs={TABS.map((x) => ({ id: x, label: x, badge: x === TABS[0] ? jobs.length : jobs.filter((j) => j.group === x).length }))} />
        <SearchField value={t.query} onChange={t.setQuery} placeholder="Search job, target or cron rule…" className="w-full sm:w-72" />
      </div>

      <Card>
        <CardHeader title="Active cron registrations" subtitle="All configured sync intervals with automated fallback policies." icon="clock" />
        {t.rows.length === 0 ? (
          <EmptyState icon="calendar" title="No jobs in this group" body="Switch group or clear the search to see scheduled automations."
                      action={<button className="btn-ghost" onClick={() => { t.setQuery(''); setTab(TABS[0]); }}>Reset</button>} />
        ) : (
          <>
            <TableShell minWidth={1180}>
              <thead>
                <tr className="border-b border-hairline">
                  <SortHeader label="Job name & target" active={t.sort?.key === 'name'} dir={t.sort?.dir} onClick={() => t.toggleSort('name')} />
                  <SortHeader label="Frequency / cron rule" />
                  <SortHeader label="Last execution" />
                  <SortHeader label="Next run" />
                  <SortHeader label="Retry policy" />
                  <SortHeader label="Status" />
                  <SortHeader label="Actions" align="right" />
                </tr>
              </thead>
              <tbody>
                {t.rows.map((j) => (
                  <tr key={j.id} className="row">
                    <td className="td">
                      <span className="block font-semibold text-ink">{j.name}</span>
                      <Mono>{j.target}</Mono>
                    </td>
                    <td className="td">
                      <Mono className="!text-ink font-semibold">{j.cron}</Mono>
                      <span className="block text-[11.5px] text-neutralx-secondary mt-0.5">{j.human}</span>
                    </td>
                    <td className="td">
                      <span className="flex items-center gap-2 whitespace-nowrap">
                        <StatusDot tone="success" />{j.last}
                      </span>
                      <Mono>{j.lastCode}</Mono>
                    </td>
                    <td className="td text-neutralx-secondary whitespace-nowrap">{j.active ? j.next : '—'}</td>
                    <td className="td text-neutralx-secondary whitespace-nowrap">{j.retry}</td>
                    <td className="td">
                      <span className={j.active ? 'badge-success' : 'badge-info'}>
                        <StatusDot tone={j.active ? 'success' : 'muted'} />{j.active ? 'Active' : 'Paused'}
                      </span>
                    </td>
                    <td className="td text-right">
                      <span className="inline-flex gap-2">
                        <button onClick={() => toast(`${j.name} triggered manually`)} className="btn-ghost !px-3 !py-1.5 !text-[12px]" aria-label={`Trigger ${j.name}`}>
                          <Icon name="play" className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => toggleJob(j.id)} className="btn-ghost !px-3 !py-1.5 !text-[12px]" aria-label={`${j.active ? 'Pause' : 'Resume'} ${j.name}`}>
                          <Icon name={j.active ? 'pause' : 'play'} className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
            <Pagination page={t.page} pageCount={t.pageCount} total={t.total} onPage={t.setPage} unit="cron tasks" />
          </>
        )}
      </Card>

      <Modal
        open={newOpen} onClose={() => setNewOpen(false)}
        title="Schedule a new automation"
        description="Define the cron cadence, target worker and retry policy for this sync job."
        footer={
          <>
            <button className="btn-ghost" onClick={() => setNewOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={() => { setNewOpen(false); toast('Automation scheduled'); }}>Create schedule</button>
          </>
        }
      >
        <div className="flex flex-col gap-4 pb-2">
          <label className="flex flex-col gap-2">
            <span className="label-micro">Job name</span>
            <input className="field" placeholder="e.g. Meta CAPI nightly flush" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="label-micro">Cron expression</span>
            <input className="field font-mono !text-[12.5px]" defaultValue="*/15 * * * *" />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <span className="label-micro">Group</span>
              <Select value="CAPI dispatches" onChange={() => {}} label="Group" options={TABS.slice(1)} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="label-micro">Retry policy</span>
              <Select value="3x exponential" onChange={() => {}} label="Retry policy"
                      options={['3x exponential', '5x exponential', '2x linear', 'No retry']} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
