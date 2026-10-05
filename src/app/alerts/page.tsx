'use client';

import * as React from 'react';
import {
  PageHeader, Card, CardHeader, KpiCard, SectionGrid, Tabs, SearchField, Select, TableShell,
  SortHeader, Pagination, StatusDot, Mono, EmptyState, useToast, Modal, Checkbox, LivePill,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { useTable, useSelection } from '@/lib/hooks';
import { useWorkspace } from '@/components/WorkspaceContext';
import { scopeRows } from '@/lib/brandScope';

type Incident = {
  id: string; destination: string; endpoint: string; event: string; detail: string; amount?: number;
  error: string; cause: string; ago: string; retries: string; severity: 'fatal' | 'throttle' | 'auth' | 'resolved';
  action: string;
};

const INCIDENTS: Incident[] = [
  { id: 'q1', destination: 'Meta CAPI', endpoint: '/v19.0/events', event: 'Purchase', detail: 'order', amount: 340,
    error: 'HTTP 429 Too Many Requests', cause: 'Rate throttle peak spike', ago: '12m ago', retries: '3 / 5 retries', severity: 'throttle', action: 'Replay' },
  { id: 'q2', destination: 'Google Ads', endpoint: 'Enhanced offline ingress', event: 'Lead', detail: 'Quote_Request',
    error: '401 Expired Refresh Token', cause: 'MCC OAuth refresh cycle failed', ago: '38m ago', retries: '1 / 5 (held)', severity: 'auth', action: 'Re-auth & push' },
  { id: 'q3', destination: 'TikTok Events API', endpoint: '/v1.3/track', event: 'CompleteRegistration', detail: 'Tier-A user sign',
    error: 'Malformed E.164 phone hash', cause: 'Sanitizer filter rejected prefix', ago: '1h 14m ago', retries: '0 / 5 (corrupted)', severity: 'fatal', action: 'Fix & replay' },
  { id: 'q4', destination: 'LinkedIn CAPI', endpoint: '/rest/conversionEvents', event: 'Download_Whitepaper', detail: 'B2B SaaS campaign',
    error: '504 Gateway Timeout', cause: 'LinkedIn target edge unreachable', ago: '2h 05m ago', retries: '4 / 5 retries', severity: 'throttle', action: 'Replay now' },
  { id: 'q5', destination: 'HubSpot Outbound', endpoint: 'Webhook ingress sync', event: 'Deal_ClosedWon', detail: 'Pipeline SQL handshake',
    error: '422 Unprocessable Entity', cause: 'Missing click ID (auto-healed)', ago: '3h 40m ago', retries: 'Resolved by fallback', severity: 'resolved', action: 'Archived' },
  { id: 'q6', destination: 'Meta CAPI', endpoint: '/v19.0/events', event: 'Add_To_Cart', detail: 'order', amount: 89,
    error: 'HTTP 429 Too Many Requests', cause: 'Burst above account limit', ago: '4h 12m ago', retries: '2 / 5 retries', severity: 'throttle', action: 'Replay' },
  { id: 'q7', destination: 'Google Ads', endpoint: 'Enhanced offline ingress', event: 'Conversion', detail: 'Phone_Call',
    error: '400 Invalid Customer ID', cause: 'Manager account re-linked', ago: '5h 02m ago', retries: '0 / 5 (held)', severity: 'auth', action: 'Re-auth & push' },
  { id: 'q8', destination: 'TikTok Events API', endpoint: '/v1.3/track', event: 'AddToCart', detail: 'Spark ads creative',
    error: 'Malformed email hash', cause: 'Non-normalized uppercase input', ago: '6h 30m ago', retries: '0 / 5 (corrupted)', severity: 'fatal', action: 'Fix & replay' },
];

const TABS = ['All incidents', 'Dead-letter queue', 'Rate throttles', 'Auth & token errors', 'Resolved'];

const sevBadge = (s: Incident['severity']) =>
  s === 'fatal' ? <span className="badge-danger">Corrupted</span>
  : s === 'throttle' ? <span className="badge-warning">Throttled</span>
  : s === 'auth' ? <span className="badge-danger">Auth error</span>
  : <span className="badge-success">Resolved</span>;

export default function AlertsPage() {
  const [tab, setTab] = React.useState(TABS[0]);
  const [rows, setRows] = React.useState(INCIDENTS);
  const [detail, setDetail] = React.useState<Incident | null>(null);
  const toast = useToast();
  const { brandId, money } = useWorkspace();
  const inBrand = React.useMemo(() => scopeRows(rows, brandId), [rows, brandId]);

  const scoped = React.useMemo(() => {
    const inBrand = scopeRows(rows, brandId);
    if (tab === TABS[1]) return inBrand.filter((r) => r.severity !== 'resolved');
    if (tab === TABS[2]) return inBrand.filter((r) => r.severity === 'throttle');
    if (tab === TABS[3]) return inBrand.filter((r) => r.severity === 'auth');
    if (tab === TABS[4]) return inBrand.filter((r) => r.severity === 'resolved');
    return inBrand;
  }, [tab, rows, brandId]);

  const t = useTable(scoped, { searchKeys: ['destination', 'event', 'error'], pageSize: 5 });
  const sel = useSelection(t.rows);

  const replay = (ids: string[]) => {
    setRows((r) => r.map((x) => (ids.includes(x.id) ? { ...x, severity: 'resolved', action: 'Archived', retries: 'Replayed OK' } : x)));
    toast(`${ids.length} payload${ids.length > 1 ? 's' : ''} replayed successfully`);
    sel.clear();
  };

  const quarantined = inBrand.filter((r) => r.severity !== 'resolved').length;

  return (
    <>
      <PageHeader
        title="Alerts, Incidents & Dead-Letter Queue"
        description="Monitor real-time CAPI dropoffs, HTTP 429 rate limit throttles, OAuth expiry warnings, and replay quarantined dead-letter payloads across ad network endpoints."
        badges={<><LivePill label="Zero unresolved Sev-1" /><span className="badge-info">DLQ retention 72 hours</span></>}
        actions={
          <>
            <button className="btn-ghost" onClick={() => toast('Incident log exported')}>
              <Icon name="download" className="w-4 h-4" /> Export log
            </button>
            <button className="btn-primary" onClick={() => toast('Manual payload injector opened', 'info')}>
              <Icon name="plus" className="w-4 h-4" /> Manual injection
            </button>
          </>
        }
      />

      <SectionGrid cols={4}>
        <KpiCard label="Active quarantined DLQ" value={quarantined} unit="payloads" icon="alert"
                 delta={{ value: '+3 in last hour', positive: false }} caption="Ready for replay within the retention window" />
        <KpiCard label="CAPI ingestion health" value="99.96%" icon="shield"
                 delta={{ value: '-0.02% 24h', neutral: true }} caption="Meta and Google nominal" />
        <KpiCard label="Throttled dispatches" value={inBrand.filter((r) => r.severity === 'throttle').length} unit="rate 429s" icon="clock"
                 delta={{ value: 'Backoff active', neutral: true }} caption="TikTok and LinkedIn edges" />
        <KpiCard label="Mean time to resolve" value="14m" unit="20s" tone="dark" icon="trend"
                 delta={{ value: '-4m vs 30d', positive: true }} caption="Automated recovery rules engaged" />
      </SectionGrid>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onChange={setTab}
              tabs={TABS.map((x) => ({
                id: x, label: x,
                badge: x === TABS[0] ? inBrand.length
                  : x === TABS[1] ? quarantined
                  : x === TABS[2] ? inBrand.filter((r) => r.severity === 'throttle').length
                  : x === TABS[3] ? inBrand.filter((r) => r.severity === 'auth').length
                  : inBrand.filter((r) => r.severity === 'resolved').length,
              }))} />
        <div className="flex items-center gap-2.5">
          <SearchField value={t.query} onChange={t.setQuery} placeholder="Search destination, event, error…" className="w-full sm:w-64" />
          <Select label="Platform" value={t.filters.destination || 'All platforms'}
                  onChange={(v) => t.setFilters((f) => ({ ...f, destination: v === 'All platforms' ? '' : v }))}
                  options={['All platforms', 'Meta CAPI', 'Google Ads', 'TikTok Events API', 'LinkedIn CAPI', 'HubSpot Outbound']} />
        </div>
      </div>

      <Card pad={false}>
        <div className="flex items-center justify-between gap-3 p-5 border-b border-hairline flex-wrap">
          <div>
            <h2 className="font-display text-card-title text-ink">Quarantined dead-letter queue</h2>
            <p className="text-[12.5px] text-neutralx-secondary mt-1">{quarantined} live failures held for replay</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button disabled={sel.count === 0} onClick={() => replay(Array.from(sel.selected))}
                    className="btn-dark !px-4 !py-2 !text-[12px]">
              <Icon name="refresh" className="w-3.5 h-3.5" /> Replay selected ({sel.count})
            </button>
            <button disabled={sel.count === 0}
                    onClick={() => { setRows((r) => r.filter((x) => !sel.selected.has(x.id))); toast(`Purged ${sel.count} corrupted payloads`, 'danger'); sel.clear(); }}
                    className="btn-ghost !px-4 !py-2 !text-[12px] !text-danger">
              <Icon name="trash" className="w-3.5 h-3.5" /> Purge
            </button>
          </div>
        </div>

        <div className="p-5 pt-4">
          {t.rows.length === 0 ? (
            <EmptyState icon="check" title="Nothing quarantined here"
                        body="Every payload in this view has been delivered or replayed successfully." />
          ) : (
            <>
              <TableShell minWidth={1120}>
                <thead>
                  <tr className="border-b border-hairline">
                    <th className="th w-10"><Checkbox checked={sel.allOn} onChange={sel.toggleAll} label="Select all incidents" /></th>
                    <SortHeader label="Destination & endpoint" active={t.sort?.key === 'destination'} dir={t.sort?.dir} onClick={() => t.toggleSort('destination')} />
                    <SortHeader label="Event type" />
                    <SortHeader label="Error diagnostics" />
                    <SortHeader label="Dropped / retries" />
                    <SortHeader label="Actions" align="right" />
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((r) => (
                    <tr key={r.id} className="row">
                      <td className="td"><Checkbox checked={sel.selected.has(r.id)} onChange={() => sel.toggle(r.id)} label={`Select ${r.id}`} /></td>
                      <td className="td">
                        <span className="block font-semibold text-ink">{r.destination}</span>
                        <Mono>{r.endpoint}</Mono>
                      </td>
                      <td className="td">
                        <span className="block font-semibold">{r.event}</span>
                        <span className="text-[11.5px] text-neutralx-secondary">{r.amount ? `${money(r.amount)} ${r.detail}` : r.detail}</span>
                      </td>
                      <td className="td">
                        <span className="flex items-center gap-2">
                          <StatusDot tone={r.severity === 'resolved' ? 'success' : r.severity === 'throttle' ? 'warning' : 'danger'} />
                          <span className="font-semibold">{r.error}</span>
                        </span>
                        <span className="block text-[11.5px] text-neutralx-secondary mt-0.5">{r.cause} · {r.ago}</span>
                      </td>
                      <td className="td">
                        {sevBadge(r.severity)}
                        <span className="block text-[11.5px] text-neutralx-secondary mt-1">{r.retries}</span>
                      </td>
                      <td className="td text-right">
                        <span className="inline-flex gap-2">
                          <button onClick={() => setDetail(r)} className="btn-ghost !px-3 !py-1.5 !text-[12px]" aria-label={`Inspect ${r.id}`}>
                            <Icon name="eye" className="w-3.5 h-3.5" />
                          </button>
                          <button disabled={r.severity === 'resolved'} onClick={() => replay([r.id])}
                                  className="btn-dark !px-3.5 !py-1.5 !text-[12px] whitespace-nowrap">
                            {r.action}
                          </button>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
              <Pagination page={t.page} pageCount={t.pageCount} total={t.total} onPage={t.setPage} unit="quarantined payloads" />
            </>
          )}
        </div>
      </Card>

      <Modal
        open={!!detail} onClose={() => setDetail(null)} width="max-w-xl"
        title={detail ? `${detail.destination} · ${detail.event}` : ''}
        description={detail ? `${detail.error} — ${detail.cause}` : ''}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setDetail(null)}>Close</button>
            <button className="btn-primary" disabled={detail?.severity === 'resolved'}
                    onClick={() => { if (detail) replay([detail.id]); setDetail(null); }}>
              <Icon name="refresh" className="w-4 h-4" /> Replay payload
            </button>
          </>
        }
      >
        {detail && (
          <div className="flex flex-col gap-4 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              {sevBadge(detail.severity)}
              <span className="badge-info">{detail.retries}</span>
              <span className="badge-info">{detail.ago}</span>
            </div>
            <div>
              <p className="label-micro mb-2">Rejected payload</p>
              <pre className="rounded-field bg-ink text-white/90 p-4 overflow-x-auto font-mono text-[11.5px] leading-relaxed">
{`{
  "event_name": "${detail.event}",
  "endpoint": "${detail.endpoint}",
  "action_source": "website",
  "user_data": { "em": "sha256:…", "ph": "sha256:…" },
  "error": "${detail.error}"
}`}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
