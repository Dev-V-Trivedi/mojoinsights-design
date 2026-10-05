export type Lead = {
  id: string; name: string; hash: string; status: string; crm: string; tags: string[];
  quality: number; tier: 'Tier A' | 'Tier B' | 'Tier C'; channel: string; created: string;
};

const NAMES = [
  ['Sophia Vance', 'a1f3…9c8e', 'Visit Done', 'Zoho CRM', ['High Intent', 'CAPI'], 9.2, 'meta_retarget', '12m ago'],
  ['Marcus Vance', '7c4b…1d2a', 'Positive Stage', 'HubSpot', ['Enterprise', 'Demo'], 8.6, 'google_brand', '34m ago'],
  ['Alina Roy', '3e9f…88b1', 'Interested', 'Salesforce', ['E-Commerce'], 7.9, 'meta_lookalike', '1h ago'],
  ['Carlos Brown III', 'b2d8…04e7', 'Fresh', 'Sell.Do', ['Real Estate'], 8.1, 'tiktok_spark', '2h ago'],
  ['Joel Cannan', '4f1a…55c3', 'Claimed', 'LeadSquared', ['Inbound'], 7.4, 'google_pmax', '3h ago'],
  ['David Kim', '99ea…33f2', 'Failed', 'Webhook', ['Missing Phone'], 4.8, 'meta_capi', '5h ago'],
  ['Priya Nair', '1d9a…77b4', 'Visit Done', 'HubSpot', ['High Intent'], 9.0, 'meta_retarget', '6h ago'],
  ['Thomas Oyelaran', '5c0a…21fe', 'Interested', 'Zoho CRM', ['B2B SaaS'], 8.3, 'linkedin_abm', '8h ago'],
  ['Erika Lund', '8b22…4a19', 'Fresh', 'Salesforce', ['FinTech'], 7.7, 'google_brand', '9h ago'],
  ['Noah Fischer', 'c3d7…6e08', 'Claimed', 'HubSpot', ['Demo'], 8.8, 'meta_lookalike', '11h ago'],
  ['Maya Srinivasan', '2e45…9f31', 'Positive Stage', 'Sell.Do', ['Enterprise', 'CAPI'], 9.4, 'google_pmax', '13h ago'],
  ['Luis Ortega', '6a18…b2c7', 'Failed', 'Webhook', ['Invalid Email'], 3.9, 'tiktok_spark', '15h ago'],
  ['Hannah Weber', 'f09c…13aa', 'Visit Done', 'Zoho CRM', ['Healthcare'], 8.0, 'meta_capi', '17h ago'],
  ['Ibrahim Saleh', '7d31…c5e2', 'Interested', 'LeadSquared', ['Real Estate'], 7.2, 'google_brand', '19h ago'],
  ['Clara Mendes', '4b86…0d9f', 'Fresh', 'HubSpot', ['Inbound', 'CAPI'], 8.5, 'meta_retarget', '21h ago'],
  ['Victor Haugen', 'a7f2…35bb', 'Claimed', 'Salesforce', ['B2B SaaS'], 7.6, 'linkedin_abm', '22h ago'],
  ['Rina Takahashi', '3c90…e81d', 'Positive Stage', 'Zoho CRM', ['Enterprise'], 9.1, 'google_pmax', '1d ago'],
  ['Ahmed Farouk', '8e4d…72c0', 'Visit Done', 'Sell.Do', ['High Intent'], 8.9, 'meta_lookalike', '1d ago'],
] as const;

export const LEADS: Lead[] = NAMES.map((n, i) => ({
  id: `L${84900 + i}`,
  name: n[0] as string,
  hash: n[1] as string,
  status: n[2] as string,
  crm: n[3] as string,
  tags: [...(n[4] as readonly string[])],
  quality: n[5] as number,
  tier: (n[5] as number) >= 8.5 ? 'Tier A' : (n[5] as number) >= 6.5 ? 'Tier B' : 'Tier C',
  channel: n[6] as string,
  created: n[7] as string,
}));

export const LEAD_STATUSES = ['All', 'Fresh', 'Claimed', 'Interested', 'Visit Done', 'Positive Stage', 'Failed'];
export const LEAD_CRMS = ['All', 'Zoho CRM', 'HubSpot', 'Salesforce', 'Sell.Do', 'LeadSquared', 'Webhook'];

export const LEAD_TIMELINE = [
  { step: 'Form submit', time: '14:32:04', detail: 'Native JS capture on digitalmojo.io/audit' },
  { step: 'SHA-256 hash', time: '14:32:05', detail: 'Mojo normalized 4 PII fields client-side' },
  { step: 'Meta CAPI sent', time: '14:33:11', detail: '200 OK · 142ms latency' },
  { step: 'Google EC', time: '14:33:12', detail: 'Synced match · enhanced conversion accepted' },
  { step: 'CRM pipeline', time: '14:45:00', detail: 'Stage verified via Zoho CRM' },
];
