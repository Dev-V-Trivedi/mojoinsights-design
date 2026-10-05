'use client';

import * as React from 'react';
import {
  PageHeader, Card, CardHeader, KpiCard, SectionGrid, Tabs, TableShell, SortHeader,
  StatusDot, ProgressBar, Mono, useToast, Toggle, LivePill, EmptyState, Select,
} from '@/components/ui';
import { Icon } from '@/components/Icon';

type TabId = 'upload' | 'active' | 'history' | 'mapping';

const DESTINATIONS = [
  { id: 'd1', name: 'Meta Conversions API (CAPI)', ident: 'Dataset #298410294819024', on: true },
  { id: 'd2', name: 'Google Ads Enhanced Conversions for Leads', ident: 'CID 821-491-0921', on: true },
  { id: 'd3', name: 'TikTok Events API Offline Ingestion', ident: 'Pixel/App #TT-91024-OFF', on: true },
  { id: 'd4', name: 'LinkedIn Conversions API', ident: 'Partner ID not configured', on: false },
];

const MAPPINGS = [
  { src: 'customer_email', dest: 'em (hashed email)', rule: 'Lowercase · trim · SHA-256', sample: '9b71d224bd62f378…' },
  { src: 'customer_phone', dest: 'ph (hashed phone)', rule: 'E.164 · strip symbols · SHA-256', sample: '4a2b918f0a394ec8…' },
  { src: 'first_name', dest: 'fn (hashed first name)', rule: 'Lowercase · ASCII fold · SHA-256', sample: '05e197d19a4f35f9…' },
  { src: 'order_total', dest: 'value', rule: 'Decimal(2) · currency USD', sample: '340.00' },
  { src: 'purchase_time', dest: 'event_time', rule: 'ISO-8601 → Unix epoch', sample: '1716480724' },
  { src: 'store_id', dest: 'action_source', rule: 'Map → physical_store', sample: 'physical_store' },
];

const BATCHES = [
  { id: 'b1', file: 'pos_may_week3.csv', rows: 3_904, done: 3_882, rejected: 22, state: 'Completed', progress: 100, when: '2 hr ago' },
  { id: 'b2', file: 'phone_sales_q2.xlsx', rows: 1_280, done: 864, rejected: 4, state: 'Processing', progress: 67, when: 'Running now' },
  { id: 'b3', file: 'crm_closed_won.csv', rows: 612, done: 612, rejected: 0, state: 'Completed', progress: 100, when: 'Yesterday' },
  { id: 'b4', file: 'store_visits_apr.csv', rows: 8_420, done: 8_112, rejected: 308, state: 'Completed w/ errors', progress: 100, when: '3 days ago' },
  { id: 'b5', file: 'retail_pos_mar.csv', rows: 12_040, done: 12_040, rejected: 0, state: 'Completed', progress: 100, when: 'Last month' },
];

import { useWorkspace, useScaled } from '@/components/WorkspaceContext';
import { scopeRows } from '@/lib/brandScope';

export default function OfflineImportPage() {
  const [tab, setTab] = React.useState<TabId>('upload');
  const [dests, setDests] = React.useState(DESTINATIONS);
  const [dragging, setDragging] = React.useState(false);
  const [file, setFile] = React.useState<{ name: string; size: string } | null>(null);
  const [progress, setProgress] = React.useState(0);
  const toast = useToast();
  const { money, brandId } = useWorkspace();
  const scaled = useScaled();
  const batches = React.useMemo(() => scopeRows(BATCHES, brandId), [brandId]);

  const activeDests = dests.filter((d) => d.on).length;

  const ingest = (name: string, size: number) => {
    setFile({ name, size: `${(size / 1024 / 1024).toFixed(2)} MB` });
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(timer); return 100; }
        return p + 7;
      });
    }, 110);
    toast(`${name} queued for client-side hashing`);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) ingest(f.name, f.size);
  };

  return (
    <>
      <PageHeader
        title="Offline Conversion Ingestion"
        description="Ingest in-store purchases, POS transactions, phone sales, and CRM qualified deals. PII is normalized and hashed in the browser before dispatch to Meta, Google and TikTok."
        badges={<><LivePill label="Server-side PII normalizer" /><span className="badge-info">Zero unhashed PII egress</span></>}
        actions={
          <>
            <button className="btn-ghost" onClick={() => toast('CSV template downloaded')}>
              <Icon name="download" className="w-4 h-4" /> CSV template
            </button>
            <button className="btn-primary" onClick={() => setTab('upload')}>
              <Icon name="plus" className="w-4 h-4" /> New ingestion job
            </button>
          </>
        }
      />

      <SectionGrid cols={4}>
        <KpiCard label="Total offline ingested" value={scaled(142850).toLocaleString()} unit="events" icon="upload"
                 delta={{ value: `+${money(4_200_000, { compact: true })} offline sales`, positive: true }} caption="Validated in the last 30-day window" />
        <KpiCard label="Pre-hasher sanitization" value="100%" icon="shield"
                 delta={{ value: 'SHA-256 compliant', positive: true }} caption="Client-side enforced · RFC 6234" />
        <KpiCard label="Cross-network uplift" value="+38.6%" icon="trend"
                 delta={{ value: '+12.4% vs last qtr', positive: true }} caption="Matched against online click identifiers" />
        <KpiCard label="Processing speed" value="4,200" unit="rows / sec" tone="dark" icon="bolt"
                 delta={{ value: '14ms latency', positive: true }} caption="Edge worker streaming parser" />
      </SectionGrid>

      <Tabs<TabId> value={tab} onChange={setTab}
            tabs={[
              { id: 'upload', label: 'Upload new file' },
              { id: 'active', label: 'Active batches', badge: batches.filter((b) => b.state === 'Processing').length },
              { id: 'history', label: 'Ingestion history' },
              { id: 'mapping', label: 'Field mapping' },
            ]} />

      {tab === 'upload' && (
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <Card className="xl:col-span-7">
            <CardHeader title="Offline file ingestion dropzone" subtitle="CSV, TSV or XLSX · up to 50MB and 500,000 rows."
                        icon="upload" action={<Mono>v3.4 client parser</Mono>} />
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`rounded-card border-2 border-dashed p-10 text-center transition-colors ${
                dragging ? 'border-gold bg-gold-tint' : 'border-hairline bg-canvas'}`}
            >
              <span className="w-14 h-14 rounded-full bg-white border border-hairline flex items-center justify-center text-ink mx-auto mb-4">
                <Icon name="upload" className="w-6 h-6" />
              </span>
              <p className="font-display text-card-title text-ink">
                {file ? file.name : 'Drop your transaction file here'}
              </p>
              <p className="text-[12.5px] text-neutralx-secondary mt-1.5">
                {file ? `${file.size} · hashing in browser memory` : 'CSV, TSV or XLSX — nothing is uploaded before hashing'}
              </p>
              <label className="btn-dark mt-5 cursor-pointer inline-flex">
                Browse computer
                <input type="file" accept=".csv,.tsv,.xlsx" className="sr-only"
                       onChange={(e) => { const f = e.target.files?.[0]; if (f) ingest(f.name, f.size); }} />
              </label>

              {file && (
                <div className="mt-6 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-semibold text-ink">
                      {progress < 100 ? 'Hashing & validating…' : 'Ready to dispatch'}
                    </span>
                    <span className="text-[12px] tnum text-neutralx-secondary">{Math.min(progress, 100)}%</span>
                  </div>
                  <ProgressBar percent={Math.min(progress, 100)} tone={progress >= 100 ? 'success' : 'gold'} />
                  {progress >= 100 && (
                    <button className="btn-primary w-full mt-4"
                            onClick={() => { toast(`Dispatched to ${activeDests} networks`); setFile(null); setProgress(0); }}>
                      Dispatch to {activeDests} networks
                    </button>
                  )}
                </div>
              )}
            </div>
            <p className="flex items-center gap-2 text-[11.5px] text-neutralx-secondary mt-4">
              <Icon name="shield" className="w-3.5 h-3.5 shrink-0" />
              Client-side memory hashing — no plain text ever touches a remote server.
            </p>
          </Card>

          <Card className="xl:col-span-5">
            <CardHeader title="Destination multiplexing" subtitle="Fan out hashed payloads to multiple ad platforms concurrently."
                        icon="broadcast" action={<span className="badge-success">{activeDests} active</span>} />
            <div className="flex flex-col gap-3">
              {dests.map((d) => (
                <div key={d.id} className="flex items-center gap-3 rounded-panel bg-canvas border border-hairline p-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-semibold text-ink">{d.name}</p>
                    <Mono>{d.ident}</Mono>
                  </div>
                  <Toggle checked={d.on} label={`Enable ${d.name}`}
                          onChange={(v) => setDests((s) => s.map((x) => (x.id === d.id ? { ...x, on: v } : x)))} />
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      {(tab === 'active' || tab === 'history') && (
        <Card>
          <CardHeader title={tab === 'active' ? 'Active batches' : 'Ingestion history'}
                      subtitle="Every offline batch with row-level validation outcomes." icon="database" />
          <TableShell minWidth={900}>
            <thead>
              <tr className="border-b border-hairline">
                <SortHeader label="Source file" />
                <SortHeader label="Rows" align="right" />
                <SortHeader label="Ingested" align="right" />
                <SortHeader label="Rejected" align="right" />
                <SortHeader label="Progress" />
                <SortHeader label="State" />
                <SortHeader label="When" align="right" />
              </tr>
            </thead>
            <tbody>
              {batches.filter((b) => (tab === 'active' ? b.state === 'Processing' : true)).map((b) => (
                <tr key={b.id} className="row">
                  <td className="td"><Mono className="!text-ink font-semibold">{b.file}</Mono></td>
                  <td className="td text-right tnum">{b.rows.toLocaleString()}</td>
                  <td className="td text-right tnum font-semibold">{b.done.toLocaleString()}</td>
                  <td className="td text-right tnum">
                    {b.rejected > 0 ? <span className="text-danger font-semibold">{b.rejected}</span> : '—'}
                  </td>
                  <td className="td"><span className="block w-24"><ProgressBar percent={b.progress} tone={b.rejected > 100 ? 'gold' : 'success'} /></span></td>
                  <td className="td">
                    <span className={b.state === 'Processing' ? 'badge-warning' : b.rejected > 100 ? 'badge-warning' : 'badge-success'}>
                      <StatusDot tone={b.state === 'Processing' ? 'warning' : 'success'} />{b.state}
                    </span>
                  </td>
                  <td className="td text-right text-neutralx-secondary whitespace-nowrap">{b.when}</td>
                </tr>
              ))}
            </tbody>
          </TableShell>
          {tab === 'active' && batches.every((b) => b.state !== 'Processing') && (
            <EmptyState icon="check" title="No batches running" body="Upload a file to start a new offline ingestion job." />
          )}
        </Card>
      )}

      {tab === 'mapping' && (
        <Card>
          <CardHeader title="Source columns mapped to CAPI canonical schema"
                      subtitle="Live cryptographic preview with auto-detected transforms."
                      icon="flow"
                      action={<button className="btn-ghost !px-3.5 !py-1.5 !text-[12px]" onClick={() => toast('Mappings auto-detected')}>
                        <Icon name="bolt" className="w-3.5 h-3.5" /> Auto-detect
                      </button>} />
          <TableShell minWidth={900}>
            <thead>
              <tr className="border-b border-hairline">
                <SortHeader label="Raw source column" />
                <SortHeader label="Canonical destination" />
                <SortHeader label="Normalization rule" />
                <SortHeader label="Sanitized sample output" />
              </tr>
            </thead>
            <tbody>
              {MAPPINGS.map((m) => (
                <tr key={m.src} className="row">
                  <td className="td"><Mono className="!text-ink font-semibold">{m.src}</Mono></td>
                  <td className="td font-semibold">{m.dest}</td>
                  <td className="td text-neutralx-secondary">{m.rule}</td>
                  <td className="td"><Mono>{m.sample}</Mono></td>
                </tr>
              ))}
            </tbody>
          </TableShell>
          <div className="flex items-center justify-between gap-4 pt-5 mt-1 border-t border-hairline flex-wrap">
            <p className="flex items-center gap-2 text-[12px] text-success font-semibold">
              <Icon name="check" className="w-4 h-4" /> All sanitizers compliant with Meta CAPI v19.0 and Google Enhanced Conversions
            </p>
            <Select label="Mapping preset" value="POS default" onChange={() => {}}
                    options={['POS default', 'Phone sales', 'CRM closed-won', 'Custom']} />
          </div>
        </Card>
      )}
    </>
  );
}
