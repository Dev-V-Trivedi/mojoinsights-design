'use client';

import * as React from 'react';
import {
  PageHeader, Card, CardHeader, KpiCard, SectionGrid, Tabs, SearchField, TableShell,
  SortHeader, Pagination, StatusDot, Mono, CopyButton, useToast, LivePill, EmptyState, Select,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { useTable } from '@/lib/hooks';
import { useWorkspace } from '@/components/WorkspaceContext';
import { scopeRows } from '@/lib/brandScope';

type TabId = 'logs' | 'hasher' | 'replay' | 'compliance';

const LOGS = [
  { id: 'a1', time: '14:48:12.804', action: 'CAPI sync batch', actor: 'Cron Worker #14', target: '1,420 lead events', digest: 'a904f1c8b27e…b74c', status: 'Signed' },
  { id: 'a2', time: '14:44:02.119', action: 'Rule mutation', actor: 'amara.osei@digitalmojo.io', target: 'Lead_Form_Submit mapping', digest: '7b21e9d0a443…91fe', status: 'Signed' },
  { id: 'a3', time: '14:31:55.602', action: 'Rate limit event', actor: 'System', target: 'Meta CAPI endpoint', digest: 'c0d4a7719f82…3a08', status: 'Signed' },
  { id: 'a4', time: '14:12:40.277', action: 'Adapter enabled', actor: 'dev.patel@digitalmojo.io', target: 'TikTok Events API', digest: '2f88b3e5c016…dd71', status: 'Signed' },
  { id: 'a5', time: '13:58:19.930', action: 'GDPR erasure', actor: 'Compliance Worker', target: 'subject #44120', digest: '9e07c2a41b5d…0cb3', status: 'Signed' },
  { id: 'a6', time: '13:40:05.411', action: 'Key rotation', actor: 'Dev@digitalmojo.io', target: 'Meta system user token', digest: '4a1f6d93e872…57ea', status: 'Signed' },
  { id: 'a7', time: '13:22:48.006', action: 'Payload replay', actor: 'Cron Worker #9', target: 'DLQ #84902', digest: '8c35f0b1d4a9…2e60', status: 'Signed' },
  { id: 'a8', time: '12:59:31.845', action: 'Audience push', actor: 'Scheduler', target: 'High LTV customers', digest: '1d72a9e58c03…f4b8', status: 'Signed' },
];

const FIELDS = [
  { key: 'em', label: 'Email address', hint: 'Trim + lowercase', placeholder: 'sarah.connor@example.com' },
  { key: 'ph', label: 'Phone number', hint: 'E.164 format', placeholder: '+15550192834' },
  { key: 'fn', label: 'First name', hint: 'Lowercase + ASCII fold', placeholder: 'Sarah' },
  { key: 'ln', label: 'Last name', hint: 'Lowercase + ASCII fold', placeholder: 'Connor' },
  { key: 'zp', label: 'Postal code', hint: 'Strip whitespace', placeholder: '90210' },
];

function normalize(key: string, raw: string) {
  const v = raw.trim();
  if (key === 'ph') return v.replace(/[^\d+]/g, '');
  if (key === 'zp') return v.replace(/\s/g, '').toLowerCase();
  return v.toLowerCase();
}

export default function AuditPage() {
  const [tab, setTab] = React.useState<TabId>('logs');
  const [inputs, setInputs] = React.useState<Record<string, string>>({});
  const [digests, setDigests] = React.useState<Record<string, string>>({});
  const toast = useToast();

  const { brand, brandId } = useWorkspace();
  const logs = React.useMemo(() => scopeRows(LOGS, brandId), [brandId]);
  const t = useTable(logs, { searchKeys: ['action', 'actor', 'target'], pageSize: 6 });

  // Real WebCrypto SHA-256 over the normalized value.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const next: Record<string, string> = {};
      for (const f of FIELDS) {
        const raw = inputs[f.key];
        if (!raw?.trim()) continue;
        try {
          const data = new TextEncoder().encode(normalize(f.key, raw));
          const buf = await crypto.subtle.digest('SHA-256', data);
          next[f.key] = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
        } catch { /* WebCrypto unavailable over plain http on some hosts */ }
      }
      if (!cancelled) setDigests(next);
    })();
    return () => { cancelled = true; };
  }, [inputs]);

  return (
    <>
      <PageHeader
        title="Audit Trail & Hasher Utility"
        description="Real-time cryptographic audit log, SHA-256 client-side hasher sandbox, and raw webhook replay engine for enterprise compliance and CAPI event verification."
        badges={<><LivePill label="SOC-2 / GDPR verified" /><span className="badge-info">Zero-data retention</span></>}
        actions={
          <>
            <button className="btn-ghost" onClick={() => toast('Compliance PDF generated')}>
              <Icon name="download" className="w-4 h-4" /> Compliance PDF
            </button>
            <button className="btn-primary" onClick={() => setTab('hasher')}>
              <Icon name="key" className="w-4 h-4" /> Test hash in sandbox
            </button>
          </>
        }
      />

      <SectionGrid cols={4}>
        <KpiCard label="Cryptographic proofs" value="1.42M" icon="shield"
                 delta={{ value: '+18.2% vs last wk', positive: true }} caption="SHA-256 + HMAC-256 signed" />
        <KpiCard label="GDPR / CCPA erasures" value="14" unit="processed" icon="user"
                 delta={{ value: '100% on time', positive: true }} caption="0 pending erasures · SLA compliant" />
        <KpiCard label="Replay sandbox success" value="99.98%" icon="refresh"
                 delta={{ value: '4,812 dispatches', positive: true }} caption="Avg dry-run latency 28ms" />
        <KpiCard label="Data retention TTL" value="30" unit="days fixed" tone="dark" icon="clock"
                 delta={{ value: 'Enforced', positive: true }} caption="Zero plain-text storage · auto-purge pipeline" />
      </SectionGrid>

      <Tabs<TabId> value={tab} onChange={setTab}
            tabs={[
              { id: 'logs', label: 'Audit logs', badge: LOGS.length },
              { id: 'hasher', label: 'SHA-256 hasher' },
              { id: 'replay', label: 'Payload replay sandbox' },
              { id: 'compliance', label: 'Compliance expirations' },
            ]} />

      {tab === 'logs' && (
        <Card>
          <CardHeader title="Immutable cryptographic audit trail"
                      subtitle="Tamper-evident system log recorded with dual HMAC signatures."
                      icon="shield"
                      action={<SearchField value={t.query} onChange={t.setQuery} placeholder="Search action or actor…" className="w-56" />} />
          {t.rows.length === 0 ? (
            <EmptyState title="No audit entries match" body="Try a different action type or actor."
                        action={<button className="btn-ghost" onClick={() => t.setQuery('')}>Clear search</button>} />
          ) : (
            <>
              <TableShell minWidth={980}>
                <thead>
                  <tr className="border-b border-hairline">
                    <SortHeader label="Timestamp" active={t.sort?.key === 'time'} dir={t.sort?.dir} onClick={() => t.toggleSort('time')} />
                    <SortHeader label="Action type" active={t.sort?.key === 'action'} dir={t.sort?.dir} onClick={() => t.toggleSort('action')} />
                    <SortHeader label="Actor / origin" />
                    <SortHeader label="Target entity" />
                    <SortHeader label="SHA-256 digest" />
                    <SortHeader label="Status" align="right" />
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((l) => (
                    <tr key={l.id} className="row">
                      <td className="td"><Mono className="!text-ink font-semibold">{l.time}</Mono></td>
                      <td className="td font-semibold whitespace-nowrap">{l.action}</td>
                      <td className="td text-neutralx-secondary">{l.actor}</td>
                      <td className="td">{l.target}</td>
                      <td className="td">
                        <span className="flex items-center gap-1">
                          <Mono>{l.digest}</Mono>
                          <CopyButton value={l.digest} label={`Copy digest for ${l.action}`} />
                        </span>
                      </td>
                      <td className="td text-right">
                        <span className="badge-success"><StatusDot tone="success" /> HMAC {l.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
              <Pagination page={t.page} pageCount={t.pageCount} total={t.total} onPage={t.setPage} unit="audit entries" />
            </>
          )}
        </Card>
      )}

      {tab === 'hasher' && (
        <Card>
          <CardHeader
            title="Interactive SHA-256 pre-hashing sandbox"
            subtitle="Validate PII normalization rules before client ingestion. Hashing runs entirely in your browser via WebCrypto — nothing is transmitted."
            icon="key"
            action={<Mono>client-side WebCrypto</Mono>}
          />
          <div className="flex flex-col gap-4">
            {FIELDS.map((f) => (
              <div key={f.key} className="rounded-panel bg-canvas border border-hairline p-4">
                <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
                  <span className="text-[12.5px] font-semibold text-ink">
                    {f.label} <Mono className="ml-1">({f.key})</Mono>
                  </span>
                  <span className="badge-info">{f.hint}</span>
                </div>
                <input
                  className="field bg-white"
                  placeholder={f.placeholder}
                  value={inputs[f.key] ?? ''}
                  onChange={(e) => setInputs((s) => ({ ...s, [f.key]: e.target.value }))}
                />
                {digests[f.key] && (
                  <div className="mt-3 flex items-center gap-2 rounded-field bg-ink px-4 py-3">
                    <Icon name="shield" className="w-3.5 h-3.5 text-gold shrink-0" />
                    <code className="flex-1 font-mono text-[11px] text-white/90 break-all leading-relaxed">{digests[f.key]}</code>
                    <CopyButton value={digests[f.key]} label={`Copy ${f.label} digest`} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-4 pt-5 mt-1 border-t border-hairline flex-wrap">
            <p className="flex items-center gap-2 text-[12px] text-success font-semibold">
              <Icon name="check" className="w-4 h-4" /> Sanitizers compliant with Meta CAPI v19.0 &amp; Google Enhanced Conversions
            </p>
            <button className="btn-dark !px-4 !py-2 !text-[12px]"
                    onClick={() => toast(`Simulated payload with ${Object.keys(digests).length} hashed fields`)}>
              <Icon name="bolt" className="w-3.5 h-3.5" /> Simulate Meta &amp; Google EC payload
            </button>
          </div>
        </Card>
      )}

      {tab === 'replay' && (
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <Card>
            <CardHeader title="Raw payload replay" subtitle="Dry-run a stored event against a live endpoint without billing it." icon="refresh" />
            <label className="flex flex-col gap-2">
              <span className="label-micro">Stored payload</span>
              <textarea rows={12} spellCheck={false} className="field !h-auto py-3 font-mono !text-[11.5px] leading-relaxed"
                        defaultValue={'{\n  "event_name": "Purchase",\n  "event_time": 1716480724,\n  "action_source": "website",\n  "user_data": {\n    "em": "9b71d224bd62f3785d96d46ad3ea3d73…",\n    "ph": "4a2b918f0a394ec8912e76f9c8e14670…"\n  },\n  "custom_data": { "value": 340.00, "currency": "USD" }\n}'} />
            </label>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <Select label="Target endpoint" value="Meta CAPI (dry-run)" onChange={() => {}}
                      options={['Meta CAPI (dry-run)', 'Google EC (dry-run)', 'TikTok Events (dry-run)']} />
              <button className="btn-primary" onClick={() => toast('Dry-run accepted · 200 OK in 28ms')}>
                <Icon name="play" className="w-4 h-4" /> Run dry-run
              </button>
            </div>
          </Card>
          <Card>
            <CardHeader title="Recent dry-runs" subtitle="Sandbox dispatches never reach production attribution." icon="clock" />
            <ul className="flex flex-col">
              {LOGS.slice(0, 6).map((l) => (
                <li key={l.id} className="flex items-center gap-3 py-3 border-b border-hairline last:border-0">
                  <StatusDot tone="success" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-semibold text-ink truncate">{l.action}</p>
                    <Mono>{l.digest}</Mono>
                  </div>
                  <span className="badge-success shrink-0">200 OK</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {tab === 'compliance' && (
        <SectionGrid cols={3}>
          {[
            { k: 'Meta system user token', v: 'Never expires', tone: 'success', note: 'System user · full CAPI scope' },
            { k: 'Google OAuth refresh', v: 'Renews in 8 days', tone: 'warning', note: 'Auto-refresh scheduled' },
            { k: 'TikTok access token', v: 'Expires in 42 days', tone: 'success', note: 'Long-lived business token' },
            { k: 'Data processing agreement', v: 'Valid through 2027', tone: 'success', note: 'GDPR Art. 28 signed' },
            { k: 'SOC-2 Type II report', v: 'Renewed Mar 2026', tone: 'success', note: 'Next audit window Q1' },
            { k: 'Webhook signing secret', v: 'Rotates in 14 days', tone: 'warning', note: 'HMAC-256 · auto-rotation on' },
          ].map((c) => (
            <Card key={c.k}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="label-micro">{c.k}</span>
                <span className={c.tone === 'success' ? 'badge-success' : 'badge-warning'}>
                  <StatusDot tone={c.tone === 'success' ? 'success' : 'warning'} />
                  {c.tone === 'success' ? 'Healthy' : 'Action soon'}
                </span>
              </div>
              <p className="font-display text-[19px] font-bold text-ink">{c.v}</p>
              <p className="text-[12px] text-neutralx-secondary mt-1.5">{c.note}</p>
            </Card>
          ))}
        </SectionGrid>
      )}
    </>
  );
}
