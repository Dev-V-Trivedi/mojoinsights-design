export type IntegrationState = 'connected' | 'ready' | 'roadmap';

export type Integration = {
  id: string; name: string; group: string; state: IntegrationState; icon: string;
  blurb: string; meta: { k: string; v: string }[]; cta: string;
};

export const INTEGRATIONS: Integration[] = [
  { id: 'i1', name: 'Meta Conversions API', group: 'Advertising networks', state: 'connected', icon: 'broadcast',
    blurb: 'Direct server-to-server payload ingestion bypasses browser ad-blockers and iOS restrictions.',
    meta: [{ k: 'Pixel ID', v: '849201940' }, { k: 'Token validity', v: 'Expires in 42d' }, { k: 'Event match quality', v: '8.4 / 10' }],
    cta: 'Manage endpoint' },
  { id: 'i2', name: 'Google Ads Enhanced', group: 'Advertising networks', state: 'connected', icon: 'target',
    blurb: 'Automated first-party SHA-256 hashed lead data feedback to campaign smart bidding engines.',
    meta: [{ k: 'Customer ID', v: '492-104-9912' }, { k: 'Auth state', v: 'OAuth 2.0 active' }, { k: 'Match verification', v: '98.1% pass' }],
    cta: 'Manage endpoint' },
  { id: 'i3', name: 'TikTok Events API', group: 'Advertising networks', state: 'ready', icon: 'play',
    blurb: 'Direct server-side event pipeline for TikTok For Business catalog and lead conversion sync.',
    meta: [{ k: 'Sync pipeline', v: 'Server dispatch' }, { k: 'Prerequisites', v: 'Pixel ID required' }, { k: 'Avg uplift', v: '+22% attribution' }],
    cta: 'Configure now' },
  { id: 'i4', name: 'LinkedIn Conversions', group: 'Advertising networks', state: 'roadmap', icon: 'layers',
    blurb: 'B2B conversion attribution pipeline for senior accounts and high-ticket pipeline qualification.',
    meta: [{ k: 'Release track', v: 'v3.4 private beta' }, { k: 'Offline feedback', v: 'Ready' }],
    cta: 'Notify me on release' },
  { id: 'i5', name: 'Zoho CRM', group: 'CRM & pipeline systems', state: 'connected', icon: 'database',
    blurb: 'Real-time webhook listener pushes site visit hashes and extracts deal closed-won values.',
    meta: [{ k: 'Listener state', v: 'Active (port 8443)' }, { k: 'Last ingestion', v: '2 min ago' }, { k: 'Field mappings', v: '24 synced fields' }],
    cta: 'Manage mappings' },
  { id: 'i6', name: 'HubSpot CRM', group: 'CRM & pipeline systems', state: 'ready', icon: 'briefcase',
    blurb: 'Synchronize deals, marketing lifecycle stages, and touchpoint timelines into unified attribution.',
    meta: [{ k: 'Scope', v: 'Deals, contacts' }, { k: 'Prerequisites', v: 'Private app token' }],
    cta: 'Configure now' },
  { id: 'i7', name: 'Salesforce', group: 'CRM & pipeline systems', state: 'ready', icon: 'database',
    blurb: 'Bi-directional opportunity sync with MQL stage transitions streamed into the CAPI gateway.',
    meta: [{ k: 'Scope', v: 'Opportunity, Lead' }, { k: 'Auth', v: 'Connected app' }],
    cta: 'Configure now' },
  { id: 'i8', name: 'Sell.Do', group: 'CRM & pipeline systems', state: 'connected', icon: 'briefcase',
    blurb: 'Real-estate pipeline connector mapping site visits and booking stages to offline conversions.',
    meta: [{ k: 'Listener state', v: 'Active' }, { k: 'Last ingestion', v: '18 min ago' }, { k: 'Field mappings', v: '16 fields' }],
    cta: 'Manage mappings' },
  { id: 'i9', name: 'Google Analytics 4', group: 'Analytics & warehouses', state: 'connected', icon: 'trend',
    blurb: 'Measurement Protocol dispatch keeps GA4 aligned with server-verified conversion counts.',
    meta: [{ k: 'Property', v: 'G-4F82K01' }, { k: 'MP secret', v: 'Active' }, { k: 'Events / day', v: '112,400' }],
    cta: 'Manage endpoint' },
  { id: 'i10', name: 'BigQuery Warehouse', group: 'Analytics & warehouses', state: 'connected', icon: 'database',
    blurb: 'Nightly export of hashed event logs for custom modelling and incrementality studies.',
    meta: [{ k: 'Dataset', v: 'mojo_prod.events' }, { k: 'Schedule', v: 'Daily 03:00 UTC' }, { k: 'Rows', v: '42.8M' }],
    cta: 'Manage endpoint' },
  { id: 'i11', name: 'AI Lead Enrichment', group: 'Enrichment & messaging', state: 'connected', icon: 'bolt',
    blurb: 'Firmographic and intent enrichment applied before the lead reaches your CRM pipeline.',
    meta: [{ k: 'Model', v: 'mojo-enrich-v3' }, { k: 'Coverage', v: '88.2%' }, { k: 'Latency', v: '340ms' }],
    cta: 'Manage endpoint' },
  { id: 'i12', name: 'WhatsApp Business', group: 'Enrichment & messaging', state: 'ready', icon: 'chat',
    blurb: 'Conversation-started and qualified-reply events dispatched as server-side conversions.',
    meta: [{ k: 'Scope', v: 'Messages, templates' }, { k: 'Prerequisites', v: 'WABA ID required' }],
    cta: 'Configure now' },
  { id: 'i13', name: 'Custom Webhook', group: 'Enrichment & messaging', state: 'roadmap', icon: 'link',
    blurb: 'Define your own signed outbound webhook with a bring-your-own payload schema.',
    meta: [{ k: 'Release track', v: 'Design partner' }, { k: 'Signing', v: 'HMAC-256' }],
    cta: 'Notify me on release' },
];

export const INTEGRATION_GROUPS = ['Advertising networks', 'CRM & pipeline systems', 'Analytics & warehouses', 'Enrichment & messaging'];
export const INTEGRATION_FILTERS = ['All integrations', 'Connected only', 'Ready to configure', 'Roadmap / preview'];
