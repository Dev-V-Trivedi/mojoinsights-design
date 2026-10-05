'use client';

import * as React from 'react';
import {
  PageHeader, Card, CardHeader, KpiCard, SectionGrid, Tabs, SearchField, TableShell,
  SortHeader, Pagination, StatusDot, Mono, EmptyState, useToast, Modal, Avatar, LivePill, Select, Toggle, ProgressBar,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { useTable } from '@/lib/hooks';
import { useWorkspace } from '@/components/WorkspaceContext';
import { scopeRows } from '@/lib/brandScope';

const AV = (s: string) => `https://i.pravatar.cc/160?img=${s}`;

type Member = {
  id: string; name: string; email: string; title: string; badge: string; group: string;
  scope: string; scopeDetail: string; mfa: string; mfaStrong: boolean; active: string; avatar?: string;
};

const MEMBERS: Member[] = [
  { id: 'm1', name: 'Carlos Vance', email: 'carlos.vance@digitalmojo.io', title: 'Organization Super Admin', badge: 'SUPER ADMIN',
    group: 'Admins', scope: 'All 28 client workspaces', scopeDetail: 'Full read/write + billing', mfa: 'Hardware key (YubiKey)', mfaStrong: true, active: 'Active now', avatar: AV('12') },
  { id: 'm2', name: 'Elena Rostova', email: 'elena.r@digitalmojo.io', title: 'Lead Data Architect', badge: 'DATA ENG',
    group: 'Data & attribution engineers', scope: 'All clients (CAPI gateway)', scopeDetail: 'ETL, pipeline ingest, webhooks', mfa: 'TOTP authenticator', mfaStrong: true, active: '14m ago', avatar: AV('5') },
  { id: 'm3', name: 'Marcus Thorne', email: 'marcus.t@digitalmojo.io', title: 'Performance Media Lead', badge: 'MEDIA BUYER',
    group: 'Media buyers', scope: '12 e-commerce accounts', scopeDetail: 'Meta Ads, TikTok Spark', mfa: 'TOTP authenticator', mfaStrong: true, active: '1h ago', avatar: AV('33') },
  { id: 'm4', name: 'Amara Osei', email: 'amara.o@digitalmojo.io', title: 'Senior Account Executive', badge: 'ACCOUNT EXEC',
    group: 'Account executives', scope: '6 enterprise accounts', scopeDetail: 'Read-only + reporting', mfa: 'TOTP authenticator', mfaStrong: true, active: '3h ago', avatar: AV('47') },
  { id: 'm5', name: 'Dev Patel', email: 'dev.patel@digitalmojo.io', title: 'Attribution Engineer', badge: 'DATA ENG',
    group: 'Data & attribution engineers', scope: 'All clients (read)', scopeDetail: 'Hashing utility, audit trail', mfa: 'Hardware key (YubiKey)', mfaStrong: true, active: '28m ago', avatar: AV('68') },
  { id: 'm6', name: 'Sophia Lindqvist', email: 'sophia.l@digitalmojo.io', title: 'Paid Social Buyer', badge: 'MEDIA BUYER',
    group: 'Media buyers', scope: '8 D2C accounts', scopeDetail: 'Meta Ads, audiences', mfa: 'TOTP authenticator', mfaStrong: true, active: 'Yesterday', avatar: AV('26') },
  { id: 'm7', name: 'Lumina Client Portal', email: 'portal@luminawellness.co', title: 'Client stakeholder (viewer)', badge: 'VIEWER',
    group: 'Client portal viewers', scope: 'Lumina Skin & Wellness', scopeDetail: 'Reports only', mfa: 'Email OTP', mfaStrong: false, active: '2 days ago' },
  { id: 'm8', name: 'capi-dispatch-bot', email: 'svc.capi@digitalmojo.io', title: 'Service account', badge: 'SERVICE',
    group: 'Service accounts & bots', scope: 'CAPI gateway', scopeDetail: 'Write-only event dispatch', mfa: 'Signed JWT', mfaStrong: true, active: 'Active now' },
  { id: 'm9', name: 'segment-webhook-bot', email: 'svc.segment@digitalmojo.io', title: 'Service account', badge: 'SERVICE',
    group: 'Service accounts & bots', scope: 'Audience sync', scopeDetail: 'Read cohorts, write matches', mfa: 'Signed JWT', mfaStrong: true, active: 'Active now' },
];

const TABS = ['All members', 'Media buyers', 'Data & attribution engineers', 'Account executives', 'Client portal viewers', 'Service accounts & bots'];

const ROLE_MATRIX = [
  { role: 'Super Admin', dash: true, conv: true, aud: true, set: true, bill: true },
  { role: 'Data Engineer', dash: true, conv: true, aud: true, set: true, bill: false },
  { role: 'Media Buyer', dash: true, conv: true, aud: true, set: false, bill: false },
  { role: 'Account Executive', dash: true, conv: true, aud: false, set: false, bill: false },
  { role: 'Client Viewer', dash: true, conv: false, aud: false, set: false, bill: false },
];

export default function TeamPage() {
  const [tab, setTab] = React.useState(TABS[0]);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [scimOn, setScimOn] = React.useState(true);
  const toast = useToast();

  const { brandId } = useWorkspace();
  // Members who can reach this brand: workspace-wide admins and anyone assigned to it.
  const inBrand = React.useMemo(
    () => MEMBERS.filter((m) => brandId === 'all' || m.scope.startsWith('All') || scopeRows([m], brandId).length > 0),
    [brandId],
  );
  const scoped = React.useMemo(() => (tab === TABS[0] ? inBrand : inBrand.filter((m) => m.group === tab)), [tab, inBrand]);
  const t = useTable(scoped, { searchKeys: ['name', 'email', 'title'], pageSize: 6 });

  return (
    <>
      <PageHeader
        title="Team Management & Access"
        description="Manage media buyers, data engineers, client stakeholders, granular API access tokens, and role-based permissions across agency client workspaces."
        badges={<><LivePill label="Enterprise RBAC" /><span className="badge-info">SSO & SCIM enforced</span></>}
        actions={
          <>
            <button className="btn-ghost" onClick={() => toast('Access log opened', 'info')}>
              <Icon name="shield" className="w-4 h-4" /> Audit access log
            </button>
            <button className="btn-primary" onClick={() => setInviteOpen(true)}>
              <Icon name="plus" className="w-4 h-4" /> Invite member
            </button>
          </>
        }
      />

      <SectionGrid cols={4}>
        <KpiCard label="Active seats" value={`${inBrand.length} / 25`} icon="team"
                 delta={{ value: '64% used', neutral: true }} caption="Agency enterprise tier · 9 seats available">
          <div className="mt-3"><ProgressBar percent={(MEMBERS.length / 25) * 100} tone="ink" /></div>
        </KpiCard>
        <KpiCard label="2FA & FIDO2 policy" value="100%" unit="enforced" icon="shield"
                 delta={{ value: 'Zero non-compliant', positive: true }} caption="Hardware keys + TOTP · YubiKey ready" />
        <KpiCard label="Privileged admins" value="3" unit="admins" icon="key"
                 delta={{ value: 'Quorum 2 / 3', neutral: true }} caption="Strict multi-approval on destructive actions" />
        <KpiCard label="API scopes & bots" value="5" unit="active keys" tone="dark" icon="bolt"
                 delta={{ value: 'Zero stale keys', positive: true }} caption="CAPI & segment webhooks · rotates in 14d" />
      </SectionGrid>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onChange={setTab}
              tabs={TABS.map((x) => ({ id: x, label: x, badge: x === TABS[0] ? MEMBERS.length : MEMBERS.filter((m) => m.group === x).length }))} />
        <SearchField value={t.query} onChange={t.setQuery} placeholder="Search member or email…" className="w-full sm:w-64" />
      </div>

      <Card>
        <CardHeader title="Member credentials & scopes" subtitle="Live SCIM sync with the connected Okta directory." icon="team"
                    action={
                      <div className="flex items-center gap-2.5">
                        <span className="text-[12px] font-semibold text-ink">SCIM sync</span>
                        <Toggle checked={scimOn} onChange={setScimOn} label="SCIM directory sync" />
                      </div>
                    } />
        {t.rows.length === 0 ? (
          <EmptyState icon="team" title="No members in this group" body="Switch group or adjust the search to find teammates."
                      action={<button className="btn-ghost" onClick={() => { t.setQuery(''); setTab(TABS[0]); }}>Reset</button>} />
        ) : (
          <>
            <TableShell minWidth={1120}>
              <thead>
                <tr className="border-b border-hairline">
                  <SortHeader label="Team member / identity" active={t.sort?.key === 'name'} dir={t.sort?.dir} onClick={() => t.toggleSort('name')} />
                  <SortHeader label="Role & badge" />
                  <SortHeader label="Brand access workspace" />
                  <SortHeader label="2FA state" />
                  <SortHeader label="Last active" />
                  <SortHeader label="" align="right" />
                </tr>
              </thead>
              <tbody>
                {t.rows.map((m) => (
                  <tr key={m.id} className="row">
                    <td className="td">
                      <span className="flex items-center gap-3">
                        <Avatar src={m.avatar} name={m.name} size={34} />
                        <span className="min-w-0">
                          <span className="block font-semibold text-ink truncate">{m.name}</span>
                          <Mono>{m.email}</Mono>
                        </span>
                      </span>
                    </td>
                    <td className="td">
                      <span className="block font-semibold">{m.title}</span>
                      <span className={`badge mt-1 ${m.badge === 'SUPER ADMIN' ? 'bg-ink text-gold border-ink' : 'bg-canvas text-neutralx-secondary border-hairline'}`}>
                        {m.badge}
                      </span>
                    </td>
                    <td className="td">
                      <span className="block font-semibold">{m.scope}</span>
                      <span className="text-[11.5px] text-neutralx-secondary">{m.scopeDetail}</span>
                    </td>
                    <td className="td">
                      <span className={m.mfaStrong ? 'badge-success' : 'badge-warning'}>
                        <Icon name="key" className="w-3 h-3" />{m.mfa}
                      </span>
                    </td>
                    <td className="td">
                      <span className="flex items-center gap-2 whitespace-nowrap">
                        <StatusDot tone={m.active.includes('now') ? 'success' : 'muted'} />{m.active}
                      </span>
                    </td>
                    <td className="td text-right">
                      <button onClick={() => toast(`Managing ${m.name}`, 'info')} className="btn-ghost !px-3 !py-1.5 !text-[12px]"
                              aria-label={`Manage ${m.name}`}>
                        <Icon name="settings" className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
            <Pagination page={t.page} pageCount={t.pageCount} total={t.total} onPage={t.setPage} unit="team members" />
          </>
        )}
      </Card>

      <Card>
        <CardHeader title="Role permission matrix" subtitle="What each role can reach across the workspace." icon="shield" />
        <TableShell minWidth={1120}>
          <thead>
            <tr className="border-b border-hairline">
              <SortHeader label="Role" />
              {['Dashboard', 'Conversions', 'Audiences', 'Settings & API', 'Billing'].map((h) => (
                <SortHeader key={h} label={h} align="right" />
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLE_MATRIX.map((r) => (
              <tr key={r.role} className="row">
                <td className="td font-semibold">{r.role}</td>
                {[r.dash, r.conv, r.aud, r.set, r.bill].map((v, i) => (
                  <td key={i} className="td text-right">
                    {v ? <Icon name="check" className="w-4 h-4 text-success inline" strokeWidth={2.4} />
                       : <Icon name="x" className="w-4 h-4 text-neutralx-muted inline" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </TableShell>
      </Card>

      <Modal
        open={inviteOpen} onClose={() => setInviteOpen(false)}
        title="Invite a team member"
        description="They will receive an email invitation and must enrol in two-factor authentication before first sign-in."
        footer={
          <>
            <button className="btn-ghost" onClick={() => setInviteOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={() => { setInviteOpen(false); toast('Invitation sent'); }}>Send invitation</button>
          </>
        }
      >
        <div className="flex flex-col gap-4 pb-2">
          <label className="flex flex-col gap-2">
            <span className="label-micro">Work email</span>
            <input className="field" type="email" placeholder="name@digitalmojo.io" />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <span className="label-micro">Role</span>
              <Select value="Media Buyer" onChange={() => {}} label="Role"
                      options={['Super Admin', 'Data Engineer', 'Media Buyer', 'Account Executive', 'Client Viewer']} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="label-micro">Workspace scope</span>
              <Select value="Selected clients" onChange={() => {}} label="Workspace scope"
                      options={['All client workspaces', 'Selected clients', 'Single client']} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
