'use client';

import * as React from 'react';
import {
  PageHeader, LivePill, Card, CardHeader, KpiCard, SearchField, Select, SectionGrid,
  TableShell, SortHeader, Pagination, EmptyState, Mono, Avatar, StatusDot, ProgressBar,
  CopyButton, useToast, Checkbox, Modal,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { useTable, useSelection } from '@/lib/hooks';
import { LEADS, LEAD_STATUSES, LEAD_CRMS, LEAD_TIMELINE, type Lead } from '@/data/leads';
import { useWorkspace } from '@/components/WorkspaceContext';
import { scopeRows, scopeCount } from '@/lib/brandScope';

const statusTone = (s: string) =>
  s === 'Failed' ? 'badge-danger' : s === 'Positive Stage' || s === 'Visit Done' ? 'badge-success'
  : s === 'Fresh' ? 'badge-warning' : 'badge-info';

export default function LeadsPage() {
  const [inspect, setInspect] = React.useState<Lead | null>(null);
  const [pageSize, setPageSize] = React.useState('25 / page');
  const toast = useToast();
  const { brand, brandId } = useWorkspace();
  const scoped = React.useMemo(() => scopeRows(LEADS, brandId), [brandId]);

  const t = useTable(scoped, {
    searchKeys: ['name', 'hash', 'channel', 'crm'],
    pageSize: parseInt(pageSize) || 25,
    initialSort: { key: 'quality', dir: 'desc' },
  });
  const sel = useSelection(t.rows);

  return (
    <>
      <PageHeader
        title="Leads"
        description={`${scoped.length.toLocaleString()} leads captured for ${brand ? brand.name : 'all brands'} across active CAPI pipelines.`}
        badges={<LivePill label="Live pipeline" />}
        actions={
          <>
            <button className="btn-ghost" onClick={() => toast('Export queued · CSV will be emailed')}>
              <Icon name="download" className="w-4 h-4" /> Export CSV
            </button>
            <button className="btn-primary" onClick={() => toast('Rule builder opened', 'info')}>
              <Icon name="plus" className="w-4 h-4" /> Add rule
            </button>
          </>
        }
      />

      <SectionGrid cols={4}>
        <KpiCard label="Leads captured" value={scoped.length.toLocaleString()} icon="users"
                 delta={{ value: '+14.2%', positive: true }} caption="Across all connected sources" />
        <KpiCard label="Avg fit score" value="8.1" unit="/ 10" icon="target"
                 delta={{ value: 'Tier A', positive: true }} caption="Deterministic identity match grade" />
        <KpiCard label="CRM synced" value="96.4%" icon="database"
                 delta={{ value: '+3.1%', positive: true }} caption="Pushed to Zoho, HubSpot and Salesforce" />
        <KpiCard label="Failed capture" value="2" unit="leads" icon="alert" tone="dark"
                 delta={{ value: 'Needs review', neutral: true }} caption="Missing phone or invalid email hash" />
      </SectionGrid>

      <Card pad={false}>
        <div className="flex flex-wrap items-center gap-3 p-5 border-b border-hairline">
          <SearchField value={t.query} onChange={t.setQuery} placeholder="Search name, hash, channel…" className="flex-1 min-w-[220px]" />
          <Select label="Status" value={t.filters.status ?? 'All'}
                  onChange={(v) => t.setFilters((f) => ({ ...f, status: v }))} options={LEAD_STATUSES} />
          <Select label="CRM" value={t.filters.crm ?? 'All'}
                  onChange={(v) => t.setFilters((f) => ({ ...f, crm: v }))} options={LEAD_CRMS} />
          <Select label="Rows per page" value={pageSize} onChange={setPageSize}
                  options={['25 / page', '50 / page', '100 / page']} />
        </div>

        {sel.count > 0 && (
          <div className="flex items-center justify-between gap-3 px-5 py-3 bg-gold-tint border-b border-hairline flex-wrap">
            <p className="text-[12.5px] font-semibold text-ink">{sel.count} lead{sel.count > 1 ? 's' : ''} selected</p>
            <div className="flex items-center gap-2">
              <button className="btn-ghost !px-3.5 !py-1.5 !text-[12px]"
                      onClick={() => { toast(`Re-dispatched ${sel.count} CAPI events`); sel.clear(); }}>
                Resend CAPI
              </button>
              <button className="btn-dark !px-3.5 !py-1.5 !text-[12px]"
                      onClick={() => { toast(`${sel.count} leads pushed to CRM`); sel.clear(); }}>
                Push to CRM
              </button>
              <button className="btn !px-2.5 !py-1.5 text-neutralx-secondary hover:text-ink" onClick={sel.clear} aria-label="Clear selection">
                <Icon name="x" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="p-5 pt-4">
          {t.rows.length === 0 ? (
            <EmptyState title="No leads match those filters"
                        body="Reset the status or CRM filter to see the full pipeline."
                        action={<button className="btn-ghost" onClick={() => { t.setQuery(''); t.setFilters({}); }}>Reset filters</button>} />
          ) : (
            <>
              <TableShell minWidth={1180}>
                <thead>
                  <tr className="border-b border-hairline">
                    <th className="th w-10">
                      <Checkbox checked={sel.allOn} onChange={sel.toggleAll} label="Select all leads on this page" />
                    </th>
                    <SortHeader label="Lead & hash" active={t.sort?.key === 'name'} dir={t.sort?.dir} onClick={() => t.toggleSort('name')} />
                    <SortHeader label="Status" active={t.sort?.key === 'status'} dir={t.sort?.dir} onClick={() => t.toggleSort('status')} />
                    <SortHeader label="CRM sync" active={t.sort?.key === 'crm'} dir={t.sort?.dir} onClick={() => t.toggleSort('crm')} />
                    <SortHeader label="Tags" />
                    <SortHeader label="Match quality" active={t.sort?.key === 'quality'} dir={t.sort?.dir} onClick={() => t.toggleSort('quality')} />
                    <SortHeader label="Source channel" />
                    <SortHeader label="Created" />
                    <SortHeader label="" align="right" />
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((l) => (
                    <tr key={l.id} className="row">
                      <td className="td">
                        <Checkbox checked={sel.selected.has(l.id)} onChange={() => sel.toggle(l.id)} label={`Select ${l.name}`} />
                      </td>
                      <td className="td">
                        <span className="flex items-center gap-3">
                          <Avatar name={l.name} size={32} />
                          <span className="min-w-0">
                            <span className="block font-semibold text-ink truncate">{l.name}</span>
                            <Mono>{l.hash}</Mono>
                          </span>
                        </span>
                      </td>
                      <td className="td"><span className={`${statusTone(l.status)} whitespace-nowrap`}>{l.status}</span></td>
                      <td className="td text-neutralx-secondary whitespace-nowrap">{l.crm}</td>
                      <td className="td">
                        <span className="flex items-center gap-1.5">
                          <span className="badge bg-canvas text-neutralx-secondary border-hairline max-w-[120px] truncate">
                            {l.tags[0]}
                          </span>
                          {l.tags.length > 1 && <span className="badge-info shrink-0">+{l.tags.length - 1}</span>}
                        </span>
                      </td>
                      <td className="td">
                        <span className="flex items-center gap-2.5">
                          <span className="w-14"><ProgressBar percent={l.quality * 10} tone={l.quality >= 8.5 ? 'success' : l.quality >= 6.5 ? 'gold' : 'danger'} /></span>
                          <span className="tnum font-semibold whitespace-nowrap">{l.quality.toFixed(1)} {l.tier}</span>
                        </span>
                      </td>
                      <td className="td"><Mono>{l.channel}</Mono></td>
                      <td className="td text-neutralx-secondary whitespace-nowrap">{l.created}</td>
                      <td className="td text-right">
                        <button onClick={() => setInspect(l)} className="btn-ghost !px-3.5 !py-1.5 !text-[12px]">Inspect</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
              <Pagination page={t.page} pageCount={t.pageCount} total={t.total} onPage={t.setPage} unit="leads" />
            </>
          )}
        </div>
      </Card>

      <Modal
        open={!!inspect} onClose={() => setInspect(null)} width="max-w-2xl"
        title={inspect ? `Lead inspector · ${inspect.name}` : ''}
        description={inspect ? `Capture metadata, hashing proof and full CAPI dispatch timeline for ${inspect.id}.` : ''}
        footer={
          <>
            <button className="btn-ghost" onClick={() => { toast('Opening CRM record', 'info'); setInspect(null); }}>
              <Icon name="external" className="w-4 h-4" /> Open in CRM
            </button>
            <button className="btn-primary" onClick={() => { toast('CAPI event re-dispatched'); setInspect(null); }}>
              <Icon name="refresh" className="w-4 h-4" /> Resend CAPI event
            </button>
          </>
        }
      >
        {inspect && (
          <div className="flex flex-col gap-5 pb-2">
            <div className="flex items-center gap-4 flex-wrap">
              <Avatar name={inspect.name} size={48} />
              <div className="min-w-0">
                <p className="font-display text-[17px] font-bold text-ink">{inspect.name}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={statusTone(inspect.status)}>{inspect.status}</span>
                  <span className="badge-success">{inspect.quality.toFixed(1)} {inspect.tier}</span>
                </div>
              </div>
            </div>

            <div className="rounded-panel bg-canvas border border-hairline p-4 flex items-center gap-3">
              <Icon name="key" className="w-4 h-4 text-neutralx-secondary shrink-0" />
              <Mono className="flex-1 truncate">sha256:{inspect.hash.replace(/…/g, '918f0a394ec8912e76f9c8e')}</Mono>
              <CopyButton value={`sha256:${inspect.hash}`} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { k: 'Source URL', v: 'digitalmojo.io/audit' },
                { k: 'Source', v: `${inspect.channel}` },
                { k: 'CRM', v: inspect.crm },
              ].map((m) => (
                <div key={m.k} className="rounded-panel bg-canvas border border-hairline p-3.5">
                  <p className="label-micro mb-1.5">{m.k}</p>
                  <p className="text-[12.5px] font-semibold text-ink truncate">{m.v}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="label-micro mb-3">CAPI timeline</p>
              <ol className="relative border-l border-hairline ml-2">
                {LEAD_TIMELINE.map((s) => (
                  <li key={s.step} className="relative pl-6 pb-5 last:pb-0">
                    <span className="absolute -left-[6px] top-1 w-3 h-3 rounded-full bg-ink border-2 border-white" />
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-[12.5px] font-semibold text-ink">{s.step}</span>
                      <Mono>{s.time}</Mono>
                    </div>
                    <p className="text-[11.5px] text-neutralx-secondary mt-0.5">{s.detail}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[{ k: 'Hashed email', v: 98 }, { k: 'Hashed phone', v: 94 }].map((m) => (
                <div key={m.k} className="rounded-panel bg-canvas border border-hairline p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-semibold text-ink">{m.k}</span>
                    <span className="badge-success"><StatusDot tone="success" /> Verified</span>
                  </div>
                  <ProgressBar percent={m.v} tone="success" />
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
