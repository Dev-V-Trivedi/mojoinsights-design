'use client';

import * as React from 'react';
import {
  PageHeader, LivePill, Card, CardHeader, KpiCard, SectionGrid, Tabs, SearchField,
  EmptyState, useToast, Modal, StatusDot, Mono,
} from '@/components/ui';
import { Icon, type IconName } from '@/components/Icon';
import { INTEGRATIONS, INTEGRATION_GROUPS, INTEGRATION_FILTERS, type Integration } from '@/data/integrations';

const stateBadge = (s: Integration['state']) =>
  s === 'connected' ? <span className="badge-success"><StatusDot tone="success" /> Connected</span>
  : s === 'ready' ? <span className="badge-warning">Ready to configure</span>
  : <span className="badge-info">Coming soon</span>;

export default function IntegrationsPage() {
  const [filter, setFilter] = React.useState(INTEGRATION_FILTERS[0]);
  const [query, setQuery] = React.useState('');
  const [detail, setDetail] = React.useState<Integration | null>(null);
  const toast = useToast();

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return INTEGRATIONS.filter((i) => {
      const matchQ = !q || i.name.toLowerCase().includes(q) || i.blurb.toLowerCase().includes(q);
      const matchF =
        filter === INTEGRATION_FILTERS[0] ? true
        : filter === INTEGRATION_FILTERS[1] ? i.state === 'connected'
        : filter === INTEGRATION_FILTERS[2] ? i.state === 'ready'
        : i.state === 'roadmap';
      return matchQ && matchF;
    });
  }, [filter, query]);

  const connected = INTEGRATIONS.filter((i) => i.state === 'connected').length;
  const pending = INTEGRATIONS.filter((i) => i.state === 'ready').length;

  return (
    <>
      <PageHeader
        title="Integrations Catalog"
        description="Connect ad networks, CRMs, website forms, and AI enrichment pipelines. Orchestrate dual-stream CAPI dispatch, server-side payload hashing, and unified conversion tracking."
        badges={<LivePill label="Live sync active" />}
        actions={
          <button className="btn-primary" onClick={() => toast('Custom webhook builder opened', 'info')}>
            <Icon name="plus" className="w-4 h-4" /> Custom webhook
          </button>
        }
      />

      <SectionGrid cols={4}>
        <KpiCard label="Connected sources" value={connected} unit={`/ ${INTEGRATIONS.length} total`} icon="plug"
                 delta={{ value: 'Active', positive: true }} caption="Meta, Google Ads, Zoho, GA4, BigQuery, AI enrichment" />
        <KpiCard label="Daily sync rate" value="99.84%" icon="refresh"
                 delta={{ value: '+0.12%', positive: true }} caption="28,491 / 28,536 events delivered" />
        <KpiCard label="Dispatch latency" value="142" unit="ms p95" icon="clock"
                 delta={{ value: '-18ms', positive: true }} caption="Measured at the edge worker boundary" />
        <KpiCard label="Configuration pending" value={pending} unit="available" tone="dark" icon="alert"
                 delta={{ value: 'High priority', neutral: true }} caption="TikTok Events, Salesforce, HubSpot, WhatsApp" />
      </SectionGrid>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={filter} onChange={setFilter}
              tabs={INTEGRATION_FILTERS.map((f) => ({
                id: f,
                label: f,
                badge: f === INTEGRATION_FILTERS[0] ? INTEGRATIONS.length
                  : f === INTEGRATION_FILTERS[1] ? connected
                  : f === INTEGRATION_FILTERS[2] ? pending
                  : INTEGRATIONS.filter((i) => i.state === 'roadmap').length,
              }))} />
        <SearchField value={query} onChange={setQuery} placeholder="Search integrations…" className="w-full sm:w-72" />
      </div>

      {visible.length === 0 ? (
        <Card>
          <EmptyState icon="plug" title="No integrations match" body="Try a different search term or switch to all integrations."
                      action={<button className="btn-ghost" onClick={() => { setQuery(''); setFilter(INTEGRATION_FILTERS[0]); }}>Reset</button>} />
        </Card>
      ) : (
        INTEGRATION_GROUPS.map((group, gi) => {
          const items = visible.filter((i) => i.group === group);
          if (items.length === 0) return null;
          return (
            <section key={group} className="flex flex-col gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="font-display text-card-title text-ink">{group}</h2>
                <span className="h-px flex-1 bg-hairline min-w-[40px]" />
                <Mono>GROUP {String(gi + 1).padStart(2, '0')}</Mono>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {items.map((i) => (
                  <Card key={i.id} className="flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <span className="w-11 h-11 rounded-[14px] bg-gold text-ink flex items-center justify-center shrink-0">
                        <Icon name={i.icon as IconName} className="w-5 h-5" />
                      </span>
                      {stateBadge(i.state)}
                    </div>
                    <h3 className="font-display text-card-title text-ink">{i.name}</h3>
                    <p className="text-[12.5px] text-neutralx-secondary mt-2 leading-relaxed flex-1">{i.blurb}</p>
                    <dl className="flex flex-col gap-2 my-4 pt-4 border-t border-hairline">
                      {i.meta.map((m) => (
                        <div key={m.k} className="flex items-center justify-between gap-3">
                          <dt className="text-[11.5px] text-neutralx-secondary">{m.k}</dt>
                          <dd className="text-[12px] font-semibold text-ink tnum truncate">{m.v}</dd>
                        </div>
                      ))}
                    </dl>
                    <button onClick={() => setDetail(i)}
                            className={i.state === 'connected' ? 'btn-ghost w-full' : i.state === 'ready' ? 'btn-primary w-full' : 'btn-ghost w-full'}>
                      {i.state === 'connected' ? <Icon name="settings" className="w-4 h-4" />
                        : i.state === 'ready' ? <Icon name="play" className="w-4 h-4" />
                        : <Icon name="bell" className="w-4 h-4" />}
                      {i.cta}
                    </button>
                  </Card>
                ))}
              </div>
            </section>
          );
        })
      )}

      <Modal
        open={!!detail} onClose={() => setDetail(null)} width="max-w-lg"
        title={detail?.name ?? ''}
        description={detail?.blurb}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setDetail(null)}>Close</button>
            <button className="btn-primary"
                    onClick={() => {
                      toast(detail?.state === 'connected' ? 'Endpoint settings saved'
                        : detail?.state === 'ready' ? `${detail?.name} connection started`
                        : 'You will be notified at release');
                      setDetail(null);
                    }}>
              {detail?.cta}
            </button>
          </>
        }
      >
        {detail && (
          <div className="flex flex-col gap-4 pb-2">
            <div className="flex items-center gap-3">
              {stateBadge(detail.state)}
              <span className="badge-info">{detail.group}</span>
            </div>
            <dl className="flex flex-col gap-2.5">
              {detail.meta.map((m) => (
                <div key={m.k} className="flex items-center justify-between gap-3 rounded-field bg-canvas border border-hairline px-4 py-3">
                  <dt className="text-[12px] text-neutralx-secondary">{m.k}</dt>
                  <dd className="text-[12.5px] font-semibold text-ink">{m.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Modal>
    </>
  );
}
