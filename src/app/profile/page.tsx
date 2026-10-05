'use client';

import * as React from 'react';
import {
  PageHeader, Card, CardHeader, KpiCard, SectionGrid, Tabs, StatusDot, Mono, useToast,
  Modal, LivePill, Toggle, Select, TableShell, SortHeader, Avatar, CopyButton,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { WORKSPACE } from '@/data/workspace';

type TabId = 'general' | 'security' | 'notifications' | 'connected' | 'sessions';

const SESSIONS = [
  { id: 's1', device: 'macOS Sonoma · Chrome 124', location: 'San Francisco, CA', ip: '198.51.100.24', when: 'Active now', current: true },
  { id: 's2', device: 'iOS 18 · Safari', location: 'San Francisco, CA', ip: '198.51.100.88', when: '2 hours ago', current: false },
  { id: 's3', device: 'Windows 11 · Edge 125', location: 'Austin, TX', ip: '203.0.113.42', when: 'Yesterday', current: false },
  { id: 's4', device: 'macOS Sonoma · Chrome 124', location: 'London, UK', ip: '192.0.2.17', when: '4 days ago', current: false },
];

const AD_ACCOUNTS = [
  { id: 'n1', name: 'Meta Business Manager system user', ident: 'sys_user_carlos_mojo', expiry: 'Token expires in 180 days', state: 'Active' },
  { id: 'n2', name: 'Google Ads manager (MCC)', ident: 'MojoHQ-Global · 821-491-0921', expiry: 'OAuth refresh in 8 days', state: 'Active' },
  { id: 'n3', name: 'TikTok For Business', ident: 'CT82K409201A', expiry: 'Token expires in 42 days', state: 'Active' },
  { id: 'n4', name: 'LinkedIn Campaign Manager', ident: 'Acc 509182391', expiry: 'Pending MCC access sync', state: 'Pending' },
];

const NOTIFY = [
  { k: 'CAPI dispatch failures', d: 'Immediate alert when an endpoint starts rejecting events.', email: true, push: true, slack: true },
  { k: 'Budget pacing thresholds', d: 'When a campaign crosses 90% of its daily cap.', email: true, push: false, slack: true },
  { k: 'Audience sync completion', d: 'Summary once a cohort finishes pushing to all networks.', email: false, push: false, slack: true },
  { k: 'Token & credential expiry', d: 'Warning 14 days before any credential lapses.', email: true, push: true, slack: false },
  { k: 'Weekly performance digest', d: 'Monday morning roll-up of ROAS and match quality.', email: true, push: false, slack: false },
];

export default function ProfilePage() {
  const [tab, setTab] = React.useState<TabId>('general');
  const [dirty, setDirty] = React.useState(false);
  const [notify, setNotify] = React.useState(NOTIFY);
  const [revokeId, setRevokeId] = React.useState<string | null>(null);
  const [sessions, setSessions] = React.useState(SESSIONS);
  const toast = useToast();

  const setChannel = (i: number, ch: 'email' | 'push' | 'slack', v: boolean) => {
    setNotify((s) => s.map((n, idx) => (idx === i ? { ...n, [ch]: v } : n)));
    setDirty(true);
  };

  return (
    <>
      <PageHeader
        title="Profile & Account Settings"
        description="Manage personal profile details, notification preferences, connected advertising identity credentials, and security audit keys across the Digital Mojo workspace."
        badges={<><LivePill label="Multi-factor auth active" /><span className="badge-info">{WORKSPACE.user.role}</span></>}
        actions={
          <>
            <button className="btn-ghost" disabled={!dirty} onClick={() => { setDirty(false); setNotify(NOTIFY); toast('Changes discarded', 'info'); }}>
              Discard changes
            </button>
            <button className="btn-primary" disabled={!dirty} onClick={() => { setDirty(false); toast('Profile updated'); }}>
              <Icon name="check" className="w-4 h-4" /> Save updates
            </button>
          </>
        }
      />

      <SectionGrid cols={4}>
        <KpiCard label="Identity & role" value={WORKSPACE.user.name.split(' ')[0]} icon="user"
                 delta={{ value: 'Full read / write', positive: true }} caption={`${WORKSPACE.name} agency owner · RBAC #0001`} />
        <KpiCard label="Assigned ad accounts" value="18" unit="active" icon="target"
                 delta={{ value: '+2 pending sync', neutral: true }} caption="Meta · Google · TikTok · LinkedIn" />
        <KpiCard label="Security posture" value="100%" unit="secure" icon="shield"
                 delta={{ value: 'Audit pass', positive: true }} caption="Hardware YubiKey + TOTP · 0 compromise flags" />
        <KpiCard label="Active session" value="SF, CA" tone="dark" icon="clock"
                 delta={{ value: 'Active now', positive: true }} caption="macOS Sonoma · Chrome 124 · 198.51.100.24" />
      </SectionGrid>

      <Tabs<TabId> value={tab} onChange={setTab}
            tabs={[
              { id: 'general', label: 'General profile' },
              { id: 'security', label: 'Security & 2FA' },
              { id: 'notifications', label: 'Notifications' },
              { id: 'connected', label: 'Connected ad accounts', badge: AD_ACCOUNTS.length },
              { id: 'sessions', label: 'Sessions & devices', badge: sessions.length },
            ]} />

      {tab === 'general' && (
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <Card className="xl:col-span-4">
            <CardHeader title="Profile avatar" subtitle="JPG, WebP or PNG · max 2048px and 5MB." icon="user" />
            <div className="flex flex-col items-center text-center">
              <img src={WORKSPACE.user.avatar} alt=""
                   className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-level2" />
              <p className="font-display text-card-title text-ink mt-4">{WORKSPACE.user.name}</p>
              <Mono className="mt-1">UID: MJ-88912-US</Mono>
              <div className="flex items-center gap-2.5 mt-5 w-full">
                <label className="btn-dark flex-1 cursor-pointer">
                  Change photo
                  <input type="file" accept="image/*" className="sr-only" onChange={() => { setDirty(true); toast('Avatar staged for upload'); }} />
                </label>
                <button className="btn-ghost !px-4" onClick={() => { setDirty(true); toast('Avatar removed', 'info'); }}>Remove</button>
              </div>
            </div>
          </Card>

          <Card className="xl:col-span-8">
            <CardHeader title="Personal information" subtitle="Your platform identity and team contact details." icon="settings" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { l: 'Legal full name', v: WORKSPACE.user.name, type: 'text' },
                { l: 'Corporate email', v: WORKSPACE.user.email, type: 'email', verified: true },
                { l: 'Executive role / title', v: 'Agency Owner & Workspace Admin', type: 'text' },
                { l: 'Direct phone (security alerts)', v: '+1 555 019 2834', type: 'tel' },
              ].map((f) => (
                <label key={f.l} className="flex flex-col gap-2">
                  <span className="label-micro flex items-center gap-2">
                    {f.l}
                    {f.verified && <span className="badge-success !py-0.5"><Icon name="check" className="w-3 h-3" /> Verified</span>}
                  </span>
                  <input className="field" type={f.type} defaultValue={f.v} onChange={() => setDirty(true)} />
                </label>
              ))}
              <div className="flex flex-col gap-2">
                <span className="label-micro">Reporting timezone & locale</span>
                <Select value="America/Los_Angeles (UTC-07:00)" onChange={() => setDirty(true)} label="Reporting timezone"
                        options={['America/Los_Angeles (UTC-07:00)', 'America/New_York (UTC-04:00)', 'Europe/London (UTC+01:00)', 'Asia/Kolkata (UTC+05:30)']} />
              </div>
              <div className="flex flex-col gap-2">
                <span className="label-micro">Agency department</span>
                <Select value="Leadership" onChange={() => setDirty(true)} label="Agency department"
                        options={['Leadership', 'Performance Media', 'Data & Attribution', 'Client Services']} />
              </div>
            </div>
          </Card>
        </section>
      )}

      {tab === 'security' && (
        <SectionGrid cols={2}>
          <Card>
            <CardHeader title="Two-factor authentication" subtitle="Both factors are enrolled and enforced by workspace policy." icon="shield" />
            <div className="flex flex-col gap-3">
              {[
                { k: 'Hardware security key', d: 'YubiKey 5C · registered Mar 2026', on: true },
                { k: 'TOTP authenticator', d: 'Google Authenticator · backup factor', on: true },
                { k: 'SMS fallback', d: 'Disabled by policy — phishing resistant factors only', on: false },
              ].map((f) => (
                <div key={f.k} className="flex items-start justify-between gap-4 rounded-panel bg-canvas border border-hairline p-4">
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-ink">{f.k}</p>
                    <p className="text-[11.5px] text-neutralx-secondary mt-0.5">{f.d}</p>
                  </div>
                  <span className={f.on ? 'badge-success shrink-0' : 'badge-info shrink-0'}>
                    <StatusDot tone={f.on ? 'success' : 'muted'} />{f.on ? 'Enrolled' : 'Disabled'}
                  </span>
                </div>
              ))}
            </div>
            <button className="btn-ghost w-full mt-4" onClick={() => toast('Recovery codes regenerated')}>
              <Icon name="key" className="w-4 h-4" /> Regenerate recovery codes
            </button>
          </Card>
          <Card>
            <CardHeader title="Password & access" subtitle="Last changed 42 days ago." icon="key" />
            <div className="flex flex-col gap-4">
              {['Current password', 'New password', 'Confirm new password'].map((l) => (
                <label key={l} className="flex flex-col gap-2">
                  <span className="label-micro">{l}</span>
                  <input className="field" type="password" placeholder="••••••••••••" autoComplete="off" />
                </label>
              ))}
              <button className="btn-dark w-full" onClick={() => toast('Password updated')}>Update password</button>
            </div>
          </Card>
        </SectionGrid>
      )}

      {tab === 'notifications' && (
        <Card>
          <CardHeader title="Notification preferences" subtitle="Choose how each class of event reaches you." icon="bell" />
          <TableShell>
            <thead>
              <tr className="border-b border-hairline">
                <SortHeader label="Event class" />
                <SortHeader label="Email" align="right" />
                <SortHeader label="Push" align="right" />
                <SortHeader label="Slack" align="right" />
              </tr>
            </thead>
            <tbody>
              {notify.map((n, i) => (
                <tr key={n.k} className="row">
                  <td className="td !h-auto py-4">
                    <span className="block font-semibold text-ink">{n.k}</span>
                    <span className="block text-[11.5px] text-neutralx-secondary mt-0.5">{n.d}</span>
                  </td>
                  {(['email', 'push', 'slack'] as const).map((ch) => (
                    <td key={ch} className="td text-right">
                      <span className="inline-flex justify-end w-full">
                        <Toggle checked={n[ch]} onChange={(v) => setChannel(i, ch, v)} label={`${n.k} via ${ch}`} />
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </TableShell>
        </Card>
      )}

      {tab === 'connected' && (
        <Card>
          <CardHeader title="Connected ad network identifiers"
                      subtitle="Federated service accounts used for multi-touch attribution synchronization."
                      icon="link" action={<span className="badge-success">3 synchronized</span>} />
          <div className="flex flex-col gap-3">
            {AD_ACCOUNTS.map((a) => (
              <div key={a.id} className="flex items-center gap-4 rounded-panel bg-canvas border border-hairline p-4 flex-wrap">
                <span className="w-10 h-10 rounded-full bg-gold text-ink flex items-center justify-center shrink-0">
                  <Icon name="plug" className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold text-ink">{a.name}</p>
                  <span className="flex items-center gap-1">
                    <Mono>{a.ident}</Mono>
                    <CopyButton value={a.ident} label={`Copy ${a.name} identifier`} />
                  </span>
                </div>
                <span className="text-[11.5px] text-neutralx-secondary shrink-0">{a.expiry}</span>
                <span className={a.state === 'Active' ? 'badge-success shrink-0' : 'badge-warning shrink-0'}>
                  <StatusDot tone={a.state === 'Active' ? 'success' : 'warning'} />{a.state}
                </span>
                <button className="btn-ghost !px-3.5 !py-1.5 !text-[12px] shrink-0" onClick={() => toast(`${a.name} token refreshed`)}>
                  Refresh token
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'sessions' && (
        <Card>
          <CardHeader title="Session history & devices" subtitle="Revoke anything you do not recognise." icon="clock"
                      action={<button className="btn-ghost !px-4 !py-2 !text-[12px] !text-danger"
                                      onClick={() => { setSessions((s) => s.filter((x) => x.current)); toast('All other sessions revoked', 'danger'); }}>
                        Revoke all others
                      </button>} />
          <TableShell>
            <thead>
              <tr className="border-b border-hairline">
                <SortHeader label="Device" />
                <SortHeader label="Location" />
                <SortHeader label="IP address" />
                <SortHeader label="Last seen" />
                <SortHeader label="" align="right" />
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="row">
                  <td className="td">
                    <span className="flex items-center gap-2.5">
                      <StatusDot tone={s.current ? 'success' : 'muted'} />
                      <span className="font-semibold">{s.device}</span>
                      {s.current && <span className="badge-success">This device</span>}
                    </span>
                  </td>
                  <td className="td text-neutralx-secondary">{s.location}</td>
                  <td className="td"><Mono>{s.ip}</Mono></td>
                  <td className="td text-neutralx-secondary whitespace-nowrap">{s.when}</td>
                  <td className="td text-right">
                    {!s.current && (
                      <button onClick={() => setRevokeId(s.id)} className="btn-ghost !px-3.5 !py-1.5 !text-[12px] !text-danger">
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        </Card>
      )}

      <Modal
        open={!!revokeId} onClose={() => setRevokeId(null)}
        title="Revoke this session?"
        description="That device will be signed out immediately and must re-authenticate with both factors."
        footer={
          <>
            <button className="btn-ghost" onClick={() => setRevokeId(null)}>Cancel</button>
            <button className="btn-primary"
                    onClick={() => { setSessions((s) => s.filter((x) => x.id !== revokeId)); toast('Session revoked', 'danger'); setRevokeId(null); }}>
              Revoke session
            </button>
          </>
        }
      />
    </>
  );
}
