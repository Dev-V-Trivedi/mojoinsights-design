import type { IconName } from '@/components/Icon';

const AV = (seed: string) => `https://i.pravatar.cc/160?img=${seed}`;

export const WORKSPACE = {
  name: 'Digital Mojo',
  plan: 'Scale plan',
  version: 'v4.2 · CAPI Node 2.8.4',
  user: {
    name: 'Dev Trivedi',
    email: 'Dev@digitalmojo.io',
    role: 'Workspace Admin',
    avatar: AV('12'),
  },
};

export const NOTIFICATIONS: {
  id: string; title: string; body: string; time: string; href: string;
  icon: IconName; tone: 'danger' | 'success' | 'warning'; read: boolean;
}[] = [
  { id: 'n1', title: 'Meta CAPI dispatch failing', body: '12 events queued for retry on node eu-central-1.', time: '4 min ago', href: '/alerts', icon: 'alert', tone: 'danger', read: false },
  { id: 'n2', title: 'Audience sync completed', body: 'High-Intent Retargeting pushed 48,204 members.', time: '22 min ago', href: '/audiences', icon: 'target', tone: 'success', read: false },
  { id: 'n3', title: 'Budget pacing threshold', body: 'Northwind Spring campaign at 92% of daily cap.', time: '1 hr ago', href: '/campaigns', icon: 'bolt', tone: 'warning', read: false },
  { id: 'n4', title: 'Offline import finished', body: '3,882 of 3,904 rows ingested · 22 rejected.', time: '2 hr ago', href: '/offline-import', icon: 'upload', tone: 'success', read: true },
  { id: 'n5', title: 'Google Ads token expiring', body: 'OAuth refresh required within 6 days.', time: 'Yesterday', href: '/settings', icon: 'key', tone: 'warning', read: true },
];

export const MESSAGES = [
  { id: 'm1', from: 'Amara Osei', preview: 'Can you confirm the Lead_Qualified mapping before the Northwind QBR?', time: '12 min ago', avatar: AV('5') },
  { id: 'm2', from: 'Dev Patel', preview: 'Pushed the new hashing utility — audit trail now stores sha256 only.', time: '48 min ago', avatar: AV('33') },
  { id: 'm3', from: 'Sophia Vance', preview: 'TikTok Events adapter is live on the Lumen Retail workspace.', time: '3 hr ago', avatar: AV('47') },
];
