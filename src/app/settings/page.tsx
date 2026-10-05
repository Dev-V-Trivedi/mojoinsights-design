'use client';

import * as React from 'react';
import {
  PageHeader, Card, CardHeader, KpiCard, SectionGrid, Tabs, StatusDot, Mono, CopyButton,
  useToast, Modal, LivePill, Toggle, Select, TableShell, SortHeader, EmptyState,
} from '@/components/ui';
import { Icon, type IconName } from '@/components/Icon';
import { useWorkspace } from '@/components/WorkspaceContext';
import { CURRENCIES, type Currency } from '@/lib/currency';

type TabId = 'tokens' | 'webhooks' | 'encryption' | 'audit';

const CREDENTIALS = [
  { id: 'k1', name: 'Meta Conversions API (CAPI)', icon: 'broadcast' as IconName, state: 'Active · verified',
    ids: [{ k: 'Pixel ID', v: '298410294819024' }, { k: 'Dataset', v: 'DigitalMojo_Production' }],
    secretLabel: 'System token', secret: 'EAAG••••••••••••••••••••••••x91B', expiry: 'Never expires (system user)', healthy: true },
  { id: 'k2', name: 'Google Ads Enhanced Conversions', icon: 'target' as IconName, state: 'Active · connected',
    ids: [{ k: 'Customer ID', v: '821-491-0921' }, { k: 'Manager MCC', v: 'MojoHQ-Global' }],
    secretLabel: 'OAuth2 secret', secret: 'GOCSPX-89••••••••••••kM1', expiry: 'Auto-refresh in 8 days', healthy: false },
  { id: 'k3', name: 'TikTok Events API', icon: 'play' as IconName, state: 'Active · synced',
    ids: [{ k: 'Pixel code', v: 'CT82K409201A' }, { k: 'App ID', v: 'TT-91024-OFF' }],
    secretLabel: 'Access token', secret: 'ttk_••••••••••••••••••9f2D', expiry: 'Expires in 42 days', healthy: true },
  { id: 'k4', name: 'LinkedIn Conversions API', icon: 'layers' as IconName, state: 'Active · limited',
    ids: [{ k: 'Account', v: '509182391' }, { k: 'Partner ID', v: 'li-mojo-01' }],
    secretLabel: 'Bearer token', secret: 'li_••••••••••••••••••••7bQ2', expiry: 'Expires in 90 days', healthy: true },
];

const WEBHOOKS = [
  { id: 'w1', url: 'https://api.digitalmojo.io/hooks/zoho-ingress', events: 'lead.created, deal.won', state: 'Active', last: '2 min ago', code: '200' },
  { id: 'w2', url: 'https://api.digitalmojo.io/hooks/hubspot-sync', events: 'deal.stage_changed', state: 'Active', last: '14 min ago', code: '200' },
  { id: 'w3', url: 'https://api.digitalmojo.io/hooks/segment-audience', events: 'audience.synced', state: 'Active', last: '1 hr ago', code: '200' },
  { id: 'w4', url: 'https://hooks.partner.example/legacy-feed', events: 'conversion.dispatched', state: 'Paused', last: '3 days ago', code: '504' },
];

export default function SettingsPage() {
  const [tab, setTab] = React.useState<TabId>('tokens');
  const [revealed, setRevealed] = React.useState<Set<string>>(new Set());
  const [rotate, setRotate] = React.useState<string | null>(null);
  const [zeroLog, setZeroLog] = React.useState(true);
  const [autoRotate, setAutoRotate] = React.useState(true);
  const toast = useToast();
  const { currency, setCurrency, money } = useWorkspace();

  const toggleReveal = (id: string) =>
    setRevealed((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <>
      <PageHeader
        title="Settings & API Credentials"
        description="Manage Conversion API access tokens, webhook signing secrets, customer data encryption keys, and developer integrations across active advertising networks."
        badges={<><LivePill label="Multi-cloud CAPI gateway" /><span className="badge-info">99.98% uptime</span></>}
        actions={
          <>
            <button className="btn-ghost" onClick={() => toast('Audit log exported')}>
              <Icon name="download" className="w-4 h-4" /> Export audit log
            </button>
            <button className="btn-primary" onClick={() => toast('New API key generated', 'success')}>
              <Icon name="key" className="w-4 h-4" /> Generate new key
            </button>
          </>
        }
      />

      <SectionGrid cols={4}>
        <KpiCard label="Connected networks" value="8" unit="endpoints" icon="plug"
                 delta={{ value: '+2 this month', positive: true }} caption="Meta, Google, TikTok, LinkedIn, GA4, Pinterest" />
        <KpiCard label="24h gateway traffic" value="1.42M" unit="calls" icon="broadcast"
                 delta={{ value: 'Optimal', positive: true }} caption="Avg latency 42ms · p99 110ms" />
        <KpiCard label="Token health & expiry" value="0" unit="expired" icon="key"
                 delta={{ value: '2 action needed', neutral: true }} caption="2 credentials renewing in under 14 days" />
        <KpiCard label="Encryption & compliance" value="SHA-256" unit="+ AES" tone="dark" icon="shield"
                 delta={{ value: 'SOC-2 Type II', positive: true }} caption="GDPR, CPRA and CCPA compliant · zero-log PII" />
      </SectionGrid>

      <Tabs<TabId> value={tab} onChange={setTab}
            tabs={[
              { id: 'tokens', label: 'API & CAPI tokens', badge: CREDENTIALS.length },
              { id: 'webhooks', label: 'Webhooks & endpoints', badge: WEBHOOKS.length },
              { id: 'encryption', label: 'Data encryption & PII' },
              { id: 'audit', label: 'Audit trail' },
            ]} />

      {tab === 'tokens' && (
        <div className="flex flex-col gap-5">
          {CREDENTIALS.map((c) => (
            <Card key={c.id}>
              <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-11 h-11 rounded-[14px] bg-gold text-ink flex items-center justify-center shrink-0">
                    <Icon name={c.icon} className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-display text-card-title text-ink">{c.name}</h2>
                    <span className={`badge mt-1 ${c.healthy ? 'badge-success' : 'badge-warning'}`}>
                      <StatusDot tone={c.healthy ? 'success' : 'warning'} />{c.state}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button className="btn-ghost !px-4 !py-2 !text-[12px]" onClick={() => toast(`Test payload sent to ${c.name}`)}>
                    <Icon name="bolt" className="w-3.5 h-3.5" /> Test payload
                  </button>
                  <button className="btn-dark !px-4 !py-2 !text-[12px]" onClick={() => setRotate(c.id)}>
                    <Icon name="refresh" className="w-3.5 h-3.5" /> Rotate key
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {c.ids.map((i) => (
                  <div key={i.k} className="rounded-panel bg-canvas border border-hairline p-3.5 flex items-center justify-between gap-3">
                    <span className="label-micro shrink-0">{i.k}</span>
                    <span className="flex items-center gap-1 min-w-0">
                      <Mono className="!text-ink font-semibold truncate">{i.v}</Mono>
                      <CopyButton value={i.v} label={`Copy ${i.k}`} />
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-panel bg-ink p-4 flex items-center gap-3 flex-wrap">
                <span className="label-micro !text-white/85 shrink-0">{c.secretLabel}</span>
                <code className="flex-1 font-mono text-[12px] text-white/90 truncate min-w-0">
                  {revealed.has(c.id) ? c.secret.replace(/•+/g, 'A9f2Kd81Lq04Zm77Xp52Bv') : c.secret}
                </code>
                <button onClick={() => toggleReveal(c.id)} aria-label={`${revealed.has(c.id) ? 'Hide' : 'Reveal'} ${c.secretLabel}`}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition-colors shrink-0">
                  <Icon name="eye" className="w-3.5 h-3.5" />
                </button>
                <CopyButton value={c.secret} label={`Copy ${c.secretLabel}`} />
                <span className={`badge shrink-0 ${c.healthy ? 'bg-white/15 text-white border-white/25' : 'bg-gold text-ink border-gold'}`}>
                  {c.expiry}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'webhooks' && (
        <Card>
          <CardHeader title="Outbound webhooks" subtitle="Signed with HMAC-256 using your workspace signing secret." icon="link"
                      action={<button className="btn-ghost !px-4 !py-2 !text-[12px]" onClick={() => toast('Webhook builder opened', 'info')}>
                        <Icon name="plus" className="w-3.5 h-3.5" /> Add endpoint
                      </button>} />
          <TableShell>
            <thead>
              <tr className="border-b border-hairline">
                <SortHeader label="Endpoint URL" />
                <SortHeader label="Subscribed events" />
                <SortHeader label="State" />
                <SortHeader label="Last delivery" />
                <SortHeader label="" align="right" />
              </tr>
            </thead>
            <tbody>
              {WEBHOOKS.map((w) => (
                <tr key={w.id} className="row">
                  <td className="td"><Mono className="!text-ink font-semibold">{w.url}</Mono></td>
                  <td className="td"><Mono>{w.events}</Mono></td>
                  <td className="td">
                    <span className={w.state === 'Active' ? 'badge-success' : 'badge-info'}>
                      <StatusDot tone={w.state === 'Active' ? 'success' : 'muted'} />{w.state}
                    </span>
                  </td>
                  <td className="td">
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      <span className={w.code === '200' ? 'badge-success' : 'badge-danger'}>{w.code}</span>
                      <span className="text-neutralx-secondary">{w.last}</span>
                    </span>
                  </td>
                  <td className="td text-right">
                    <button onClick={() => toast(`Pinged ${w.url}`)} className="btn-ghost !px-3.5 !py-1.5 !text-[12px]">Send test</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        </Card>
      )}

      {tab === 'encryption' && (
        <SectionGrid cols={2}>
          <Card>
            <CardHeader title="Display currency" subtitle="Monetary values are stored in INR and converted for display." icon="key" />
            <label className="flex flex-col gap-2 max-w-xs">
              <span className="label-micro">Currency</span>
              <Select value={currency} onChange={(v) => { setCurrency(v as Currency); toast(`Currency set to ${v}`); }}
                      label="Display currency" options={[...CURRENCIES]} />
            </label>
            <p className="text-[12px] text-neutralx-secondary mt-3">
              Example: {money(842_000, { decimals: 0 })} · defaults to INR
            </p>
          </Card>
          <Card>
            <CardHeader title="PII handling policy" subtitle="How customer identifiers are normalized and stored." icon="shield" />
            <div className="flex flex-col gap-4">
              {[
                { k: 'Zero plain-text logging', d: 'Raw PII is discarded after client-side hashing.', v: zeroLog, set: setZeroLog },
                { k: 'Automatic key rotation', d: 'Signing secrets rotate every 90 days without downtime.', v: autoRotate, set: setAutoRotate },
              ].map((o) => (
                <div key={o.k} className="flex items-start justify-between gap-4 rounded-panel bg-canvas border border-hairline p-4">
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-ink">{o.k}</p>
                    <p className="text-[11.5px] text-neutralx-secondary mt-0.5">{o.d}</p>
                  </div>
                  <Toggle checked={o.v} onChange={o.set} label={o.k} />
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <span className="label-micro">Data retention window</span>
                <Select value="30 days (recommended)" onChange={() => {}} label="Data retention window"
                        options={['7 days', '30 days (recommended)', '90 days', '180 days']} />
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader title="Encryption at a glance" subtitle="Algorithms applied across the gateway." icon="key" />
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: 'In transit', v: 'TLS 1.3' },
                { k: 'At rest', v: 'AES-256-GCM' },
                { k: 'Identity hashing', v: 'SHA-256' },
                { k: 'Payload signing', v: 'HMAC-256' },
              ].map((m) => (
                <div key={m.k} className="rounded-panel bg-canvas border border-hairline p-4">
                  <p className="label-micro mb-1.5">{m.k}</p>
                  <p className="font-display text-[16px] font-bold text-ink">{m.v}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-panel bg-ink text-white p-4 flex items-center gap-3">
              <Icon name="shield" className="w-5 h-5 text-gold shrink-0" />
              <p className="text-[12.5px] text-white/90">
                SOC-2 Type II certified · GDPR Art. 28 processor agreement on file.
              </p>
            </div>
          </Card>
        </SectionGrid>
      )}

      {tab === 'audit' && (
        <Card>
          <EmptyState icon="shield" title="Full audit trail lives in its own workspace"
                      body="Cryptographic proofs, GDPR erasures and the SHA-256 hashing sandbox are available on the Audit Trail page."
                      action={<a href="/audit" className="btn-primary">Open audit trail</a>} />
        </Card>
      )}

      <Modal
        open={!!rotate} onClose={() => setRotate(null)}
        title="Rotate this credential?"
        description="A new secret is issued immediately and the previous one stops working after a 60-minute grace period. Update any external service that uses it."
        footer={
          <>
            <button className="btn-ghost" onClick={() => setRotate(null)}>Cancel</button>
            <button className="btn-primary" onClick={() => { toast('Key rotated · grace period 60 minutes'); setRotate(null); }}>
              Rotate key
            </button>
          </>
        }
      >
        <div className="rounded-panel bg-warning-tint border border-gold/30 p-4 flex items-start gap-3 mb-2">
          <Icon name="alert" className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-ink leading-relaxed">
            Any dispatcher still presenting the old secret after the grace period will receive HTTP 401 and its events will land in the dead-letter queue.
          </p>
        </div>
      </Modal>
    </>
  );
}
