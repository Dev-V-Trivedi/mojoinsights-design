import type { IconName } from '@/components/Icon';

export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  badge?: string | number;
  description: string;
};

export type NavGroup = { title: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    title: 'Analyze',
    items: [
      { href: '/', label: 'Dashboard', icon: 'grid', description: 'Executive overview of workspace conversion activity' },
      { href: '/conversions', label: 'Conversions', icon: 'broadcast', badge: 12, description: 'Real-time server-side CAPI event orchestration and delivery tracking' },
      { href: '/attribution', label: 'Attribution', icon: 'flow', description: 'Multi-touch attribution models and signal quality analytics' },
      { href: '/leads', label: 'Leads', icon: 'users', description: 'Explore captured leads, fit scoring and enrichment' },
      { href: '/reports', label: 'Report Builder', icon: 'document', description: 'Compose and export executive PDF reports' },
    ],
  },
  {
    title: 'Activate',
    items: [
      { href: '/audiences', label: 'Audiences', icon: 'target', description: 'Customer match segments synced to ad platforms' },
      { href: '/campaigns', label: 'Campaign Mapping', icon: 'layers', description: 'Map campaigns and ad sets to conversion signals' },
      { href: '/offline-import', label: 'Offline Import', icon: 'upload', description: 'Batch import offline conversions and store visits' },
      { href: '/integrations', label: 'Integrations', icon: 'plug', badge: 3, description: 'Connect ad networks, CRMs and data warehouses' },
    ],
  },
  {
    title: 'Operate',
    items: [
      { href: '/alerts', label: 'Alerts & Incidents', icon: 'alert', badge: 5, description: 'Incident triage and the dead-letter queue' },
      { href: '/schedules', label: 'Schedules', icon: 'calendar', description: 'Automated sync jobs, cadences and run history' },
      { href: '/audit', label: 'Audit Trail', icon: 'shield', description: 'Immutable signal audit log and hashing utility' },
    ],
  },
  {
    title: 'Workspace',
    items: [
      { href: '/brands', label: 'Brand Overview', icon: 'layers', description: 'Compare every brand side by side and open one' },
      { href: '/clients', label: 'Client Portfolio', icon: 'briefcase', description: 'Brands and client workspaces under management' },
      { href: '/team', label: 'Team & Access', icon: 'team', description: 'Members, roles and permission policies' },
      { href: '/settings', label: 'Settings & API', icon: 'settings', description: 'Workspace configuration and API credentials' },
      { href: '/profile', label: 'Profile', icon: 'user', description: 'Your account, security and notification preferences' },
    ],
  },
];

export const ALL_NAV: NavItem[] = NAV.flatMap((g) => g.items);

export function findNav(pathname: string): NavItem | undefined {
  if (pathname === '/') return ALL_NAV[0];
  return ALL_NAV.filter((i) => i.href !== '/')
    .sort((a, b) => b.href.length - a.href.length)
    .find((i) => pathname === i.href || pathname.startsWith(i.href + '/'));
}

export function isActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}
