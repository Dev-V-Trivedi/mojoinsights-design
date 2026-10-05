'use client';

import * as React from 'react';
import {
  PageHeader, Card, CardHeader, KpiCard, SectionGrid, Tabs, StatusDot, Mono, useToast,
  Modal, LivePill, Toggle, Select, TableShell, SortHeader, Checkbox, EmptyState, Donut,
} from '@/components/ui';
import { Icon, type IconName } from '@/components/Icon';

type TabId = 'builder' | 'templates' | 'scheduled' | 'history';

type Section = { id: string; title: string; detail: string; icon: IconName; on: boolean };

const INITIAL_SECTIONS: Section[] = [
  { id: 's1', title: 'Executive summary & blended ROAS uplift', detail: '+28.4% CAPI attribution incremental margin vs browser-only pixel', icon: 'trend', on: true },
  { id: 's2', title: 'Event match quality (EMQ) breakdown by platform', detail: 'Meta 9.2/10 · Google 9.4/10 · TikTok 8.1/10', icon: 'target', on: true },
  { id: 's3', title: 'Multi-touch attribution channel contribution', detail: 'Deterministic credit split across every connected network', icon: 'flow', on: true },
  { id: 's4', title: 'Conversion delivery health & retry summary', detail: 'Dispatch success, latency percentiles and DLQ activity', icon: 'broadcast', on: true },
  { id: 's5', title: 'Audience sync & customer match coverage', detail: 'Cohort scale, match rates and lookalike expansion', icon: 'users', on: true },
  { id: 's6', title: 'Compliance & hashing audit appendix', detail: 'SHA-256 proofs, GDPR erasures and retention attestation', icon: 'shield', on: false },
  { id: 's7', title: 'Raw conversion discrepancy & CRM delta', detail: 'Row-level variance between platform and CRM counts', icon: 'database', on: false },
];

const TEMPLATES = [
  { id: 't1', name: 'Executive CAPI & multi-touch attribution review', cadence: 'Monthly', recipients: 42, lastSent: '3 days ago', active: true },
  { id: 't2', name: 'Weekly CAPI health & match rate audit', cadence: 'Weekly', recipients: 18, lastSent: 'Yesterday', active: true },
  { id: 't3', name: 'Multi-channel blended ROAS brief', cadence: 'Monthly', recipients: 24, lastSent: '3 days ago', active: true },
  { id: 't4', name: 'Raw conversion discrepancy & CRM delta', cadence: 'Quarterly', recipients: 6, lastSent: '2 weeks ago', active: false },
  { id: 't5', name: 'Audit & compliance proof pack', cadence: 'Quarterly', recipients: 4, lastSent: '1 month ago', active: true },
];

const HISTORY = [
  { id: 'h1', name: 'Executive CAPI review — May 2026', client: 'Lumina Skin & Wellness', sent: 'May 31, 2026', opens: 38, total: 42, state: 'Delivered' },
  { id: 'h2', name: 'Weekly CAPI health — Wk 22', client: 'Apex FinTech Solutions', sent: 'May 30, 2026', opens: 16, total: 18, state: 'Delivered' },
  { id: 'h3', name: 'Blended ROAS brief — May 2026', client: 'Velocity Motors', sent: 'May 29, 2026', opens: 21, total: 24, state: 'Delivered' },
  { id: 'h4', name: 'Compliance proof pack — Q1', client: 'Meridian Trust Capital', sent: 'Apr 02, 2026', opens: 4, total: 4, state: 'Delivered' },
];

const CLIENT_BRANDS = ['Lumina Skin & Wellness', 'Aura Clean Beauty Labs', 'Vanguard Fitness App', 'Solstice Health Technologies', 'Apex FinTech Solutions'];

import { useWorkspace } from '@/components/WorkspaceContext';

export default function ReportsPage() {
  const [tab, setTab] = React.useState<TabId>('builder');
  const [sections, setSections] = React.useState(INITIAL_SECTIONS);
  const [templates, setTemplates] = React.useState(TEMPLATES);
  const [brand, setBrand] = React.useState(CLIENT_BRANDS[0]);
  const [period, setPeriod] = React.useState('Last 30 days');
  const [whiteLabel, setWhiteLabel] = React.useState(true);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const toast = useToast();
  const { money, brand: activeBrand, scale } = useWorkspace();
  const historyFor = React.useMemo(
    () => (activeBrand ? HISTORY.filter((h) => h.client === activeBrand.name) : HISTORY),
    [activeBrand],
  );

  const selected = sections.filter((s) => s.on);

  const move = (id: string, dir: -1 | 1) => {
    setSections((s) => {
      const i = s.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= s.length) return s;
      const next = [...s];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <>
      <PageHeader
        title="Report Builder & PDF Exporter"
        description="Design custom CAPI performance decks, schedule automated weekly and monthly attribution uplift reports, and generate white-label executive PDF exports."
        badges={<><LivePill label="White-label studio" /><span className="badge-info">Next batch in 2d 14h</span></>}
        actions={
          <>
            <button className="btn-ghost" onClick={() => setPreviewOpen(true)}>
              <Icon name="eye" className="w-4 h-4" /> Preview deck
            </button>
            <button className="btn-primary" onClick={() => toast('New report template created')}>
              <Icon name="plus" className="w-4 h-4" /> New template
            </button>
          </>
        }
      />

      <SectionGrid cols={4}>
        <KpiCard label="Scheduled automated reports" value={Math.max(1, Math.round(42 * scale))} unit="active" icon="calendar"
                 delta={{ value: '+6 new this quarter', positive: true }} caption="Sent to 184 client stakeholder inboxes" />
        <KpiCard label="Client portal views" value="1,240" unit="reads" icon="eye"
                 delta={{ value: '94% open rate', positive: true }} caption="Industry first-decile engagement" />
        <KpiCard label="Attributed lift demonstrated" value={`+${money(1_840_000, { compact: true })}`} icon="trend"
                 delta={{ value: '+32.6% YoY', positive: true }} caption="Documented across Q2 client reviews" />
        <KpiCard label="Delivery success rate" value="100%" tone="dark" icon="mail"
                 delta={{ value: 'TLS encrypted', positive: true }} caption="Zero bounces on automated dispatches" />
      </SectionGrid>

      <Tabs<TabId> value={tab} onChange={setTab}
            tabs={[
              { id: 'builder', label: 'Executive canvas' },
              { id: 'templates', label: 'Templates', badge: templates.length },
              { id: 'scheduled', label: 'Scheduled', badge: templates.filter((t) => t.active).length },
              { id: 'history', label: 'Delivery history' },
            ]} />

      {tab === 'builder' && (
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <Card className="xl:col-span-4">
            <CardHeader title="Canvas configuration" subtitle="White-label tokens and reporting scope." icon="settings"
                        action={<Mono>REV-2026.05</Mono>} />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="label-micro">Active template</span>
                <Select value="Executive CAPI & multi-touch review" onChange={() => {}} label="Active template"
                        options={TEMPLATES.map((t) => t.name).concat('Executive CAPI & multi-touch review')} />
              </div>
              <div className="flex flex-col gap-2">
                <span className="label-micro">Client brand workspace</span>
                <Select value={brand} onChange={setBrand} label="Client brand workspace" options={CLIENT_BRANDS} />
              </div>
              <div className="flex flex-col gap-2">
                <span className="label-micro">Reporting period</span>
                <Select value={period} onChange={setPeriod} label="Reporting period"
                        options={['Last 7 days', 'Last 30 days', 'Last quarter', 'Year to date', 'Custom range']} />
              </div>
              <div className="flex items-start justify-between gap-4 rounded-panel bg-canvas border border-hairline p-4">
                <div className="min-w-0">
                  <p className="text-[12.5px] font-semibold text-ink">White-label branding</p>
                  <p className="text-[11.5px] text-neutralx-secondary mt-0.5">Replace MojoInsights marks with the client logo.</p>
                </div>
                <Toggle checked={whiteLabel} onChange={setWhiteLabel} label="White-label branding" />
              </div>
              <div className="rounded-panel bg-ink text-white p-4">
                <p className="label-micro !text-white/85 mb-2">Deck summary</p>
                <p className="font-display text-[24px] font-bold tnum">{selected.length} sections</p>
                <p className="text-[12px] text-white/90 mt-1">≈ {selected.length * 2 + 2} pages · {brand}</p>
                <button className="btn bg-gold text-ink w-full mt-4 py-2.5"
                        onClick={() => toast(`Generating PDF for ${brand}…`)}>
                  <Icon name="download" className="w-4 h-4" /> Generate PDF
                </button>
              </div>
            </div>
          </Card>

          <Card className="xl:col-span-8">
            <CardHeader title="Modular report sections"
                        subtitle="Toggle and reorder the data modules embedded in the generated executive PDF."
                        icon="document"
                        action={<span className="badge-info">{selected.length} selected</span>} />
            <ul className="flex flex-col gap-3">
              {sections.map((s, i) => (
                <li key={s.id}
                    className={`flex items-center gap-3 rounded-panel border p-4 transition-colors ${
                      s.on ? 'bg-white border-hairline' : 'bg-canvas border-hairline opacity-60'}`}>
                  <span className="flex flex-col gap-0.5 shrink-0">
                    <button onClick={() => move(s.id, -1)} disabled={i === 0} aria-label={`Move ${s.title} up`}
                            className="w-6 h-5 rounded flex items-center justify-center text-neutralx-muted hover:text-ink hover:bg-hover disabled:opacity-30 transition-colors">
                      <Icon name="chevronDown" className="w-3.5 h-3.5 rotate-180" />
                    </button>
                    <button onClick={() => move(s.id, 1)} disabled={i === sections.length - 1} aria-label={`Move ${s.title} down`}
                            className="w-6 h-5 rounded flex items-center justify-center text-neutralx-muted hover:text-ink hover:bg-hover disabled:opacity-30 transition-colors">
                      <Icon name="chevronDown" className="w-3.5 h-3.5" />
                    </button>
                  </span>
                  <span className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-ink shrink-0">
                    <Icon name={s.icon} className="w-4 h-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold text-ink">{s.title}</span>
                    <span className="block text-[11.5px] text-neutralx-secondary mt-0.5">{s.detail}</span>
                  </span>
                  <span className="shrink-0">
                    <Checkbox checked={s.on} label={`Include ${s.title}`}
                              onChange={(v) => setSections((x) => x.map((y) => (y.id === s.id ? { ...y, on: v } : y)))} />
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {tab === 'templates' && (
        <Card>
          <CardHeader title="Report templates" subtitle="Reusable deck definitions across every client workspace." icon="document" />
          <TableShell>
            <thead>
              <tr className="border-b border-hairline">
                <SortHeader label="Template" />
                <SortHeader label="Cadence" />
                <SortHeader label="Recipients" align="right" />
                <SortHeader label="Last sent" />
                <SortHeader label="State" />
                <SortHeader label="" align="right" />
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.id} className="row">
                  <td className="td font-semibold">{t.name}</td>
                  <td className="td"><span className="badge-info">{t.cadence}</span></td>
                  <td className="td text-right tnum">{t.recipients}</td>
                  <td className="td text-neutralx-secondary whitespace-nowrap">{t.lastSent}</td>
                  <td className="td">
                    <span className={t.active ? 'badge-success' : 'badge-info'}>
                      <StatusDot tone={t.active ? 'success' : 'muted'} />{t.active ? 'Active' : 'Paused'}
                    </span>
                  </td>
                  <td className="td text-right">
                    <span className="inline-flex justify-end w-full">
                      <Toggle checked={t.active} label={`Toggle ${t.name}`}
                              onChange={(v) => { setTemplates((s) => s.map((x) => (x.id === t.id ? { ...x, active: v } : x))); toast(`${t.name} ${v ? 'resumed' : 'paused'}`); }} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        </Card>
      )}

      {tab === 'scheduled' && (
        <SectionGrid cols={2}>
          {templates.filter((t) => t.active).map((t) => (
            <Card key={t.id}>
              <CardHeader title={t.name} subtitle={`${t.cadence} · ${t.recipients} recipients`} icon="calendar"
                          action={<span className="badge-success"><StatusDot tone="success" /> Scheduled</span>} />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-panel bg-canvas border border-hairline p-4">
                  <p className="label-micro mb-1.5">Last sent</p>
                  <p className="text-[13px] font-semibold text-ink">{t.lastSent}</p>
                </div>
                <div className="rounded-panel bg-canvas border border-hairline p-4">
                  <p className="label-micro mb-1.5">Next dispatch</p>
                  <p className="text-[13px] font-semibold text-ink">
                    {t.cadence === 'Weekly' ? 'In 4 days' : t.cadence === 'Monthly' ? 'In 2d 14h' : 'In 3 weeks'}
                  </p>
                </div>
              </div>
              <button className="btn-ghost w-full mt-4" onClick={() => toast(`${t.name} sent to ${t.recipients} recipients`)}>
                <Icon name="mail" className="w-4 h-4" /> Send now
              </button>
            </Card>
          ))}
          {templates.every((t) => !t.active) && (
            <Card className="md:col-span-2">
              <EmptyState icon="calendar" title="No scheduled reports" body="Activate a template to start automated client dispatch." />
            </Card>
          )}
        </SectionGrid>
      )}

      {tab === 'history' && (
        <Card>
          <CardHeader title="Delivery history" subtitle="Every dispatched deck with stakeholder open rates." icon="mail" />
          <TableShell>
            <thead>
              <tr className="border-b border-hairline">
                <SortHeader label="Report" />
                <SortHeader label="Client workspace" />
                <SortHeader label="Sent" />
                <SortHeader label="Opens" align="right" />
                <SortHeader label="State" align="right" />
              </tr>
            </thead>
            <tbody>
              {historyFor.map((h) => (
                <tr key={h.id} className="row">
                  <td className="td font-semibold">{h.name}</td>
                  <td className="td text-neutralx-secondary">{h.client}</td>
                  <td className="td text-neutralx-secondary whitespace-nowrap">{h.sent}</td>
                  <td className="td text-right tnum">
                    {h.opens} / {h.total}
                    <span className="block text-[11.5px] text-neutralx-secondary">{Math.round((h.opens / h.total) * 100)}% open</span>
                  </td>
                  <td className="td text-right">
                    <span className="badge-success"><StatusDot tone="success" /> {h.state}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        </Card>
      )}

      <Modal
        open={previewOpen} onClose={() => setPreviewOpen(false)} width="max-w-2xl"
        title="Executive deck preview"
        description={`${brand} · ${period} · ${selected.length} sections`}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setPreviewOpen(false)}>Close</button>
            <button className="btn-primary" onClick={() => { setPreviewOpen(false); toast('PDF export started'); }}>
              <Icon name="download" className="w-4 h-4" /> Export PDF
            </button>
          </>
        }
      >
        <div className="rounded-card border border-hairline bg-canvas p-6 pb-2">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-hairline mb-5">
            <div>
              <p className="font-display text-[18px] font-bold text-ink">{brand}</p>
              <p className="text-[12px] text-neutralx-secondary mt-0.5">Conversion performance review · {period}</p>
            </div>
            {whiteLabel ? <span className="badge-info">Client branded</span> : <span className="badge bg-ink text-gold border-ink">MojoInsights</span>}
          </div>
          <div className="flex items-center gap-5 mb-5 flex-wrap">
            <Donut size={110} centerValue="4.12x" centerLabel="ROAS"
                   segments={[
                     { label: 'Meta', value: 45, color: '#111013' },
                     { label: 'Google', value: 32, color: '#F0BC00' },
                     { label: 'TikTok', value: 15, color: '#1F9D55' },
                     { label: 'Other', value: 8, color: '#A6A5AB' },
                   ]} />
            <div className="grid grid-cols-2 gap-3 flex-1 min-w-[200px]">
              {[
                { k: 'Attributed revenue', v: money(Math.round(342_850 * scale)) },
                { k: 'CAPI uplift', v: '+28.4%' },
                { k: 'Match quality', v: '9.2 / 10' },
                { k: 'Events dispatched', v: '1.07M' },
              ].map((m) => (
                <div key={m.k} className="rounded-panel bg-white border border-hairline p-3">
                  <p className="label-micro mb-1 text-[10px]">{m.k}</p>
                  <p className="font-display text-[15px] font-bold text-ink tnum">{m.v}</p>
                </div>
              ))}
            </div>
          </div>
          <ol className="flex flex-col gap-2 pb-4">
            {selected.map((s, i) => (
              <li key={s.id} className="flex items-center gap-3 rounded-field bg-white border border-hairline px-4 py-2.5">
                <span className="w-6 h-6 rounded-full bg-ink text-gold text-[11px] font-bold flex items-center justify-center shrink-0 tnum">
                  {i + 1}
                </span>
                <span className="text-[12.5px] font-semibold text-ink truncate">{s.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </Modal>
    </>
  );
}
