export const MODELS = ['First Touch', 'Linear (40/20/40)', 'Data-Driven CAPI', 'Time Decay'] as const;
export type Model = (typeof MODELS)[number];

export const CHANNELS = [
  { id: 'meta', badge: 'f', name: 'Meta Ads (Feed, Reels & Retargeting)', utm: 'meta_retarget / lookalike_3%',
    pixel: 112_400, capi: 158_400, uplift: 29.4, leads: 612, incr: 142, emq: 9.2, roas: 4.82, matched: 97.8, color: '#111013' },
  { id: 'google', badge: 'G', name: 'Google Ads (PMax & Brand Search)', utm: 'google_brand / pmax_leads',
    pixel: 98_200, capi: 114_200, uplift: 16.2, leads: 428, incr: 64, emq: 9.4, roas: 3.91, matched: 94.1, color: '#F0BC00' },
  { id: 'tiktok', badge: 'TT', name: 'TikTok Events API (Spark Ads)', utm: 'tiktok_spark / creator_whitelabel',
    pixel: 32_100, capi: 48_650, uplift: 34.8, leads: 184, incr: 48, emq: 8.1, roas: 3.20, matched: 89.4, color: '#1F9D55' },
  { id: 'crm', badge: 'CRM', name: 'Offline Pipeline Closes (Zoho & HubSpot)', utm: 'crm_deal_stage_sync',
    pixel: 0, capi: 21_600, uplift: 100, leads: 60, incr: 60, emq: 10, roas: 5.40, matched: 100, color: '#A6A5AB' },
];

export const TOUCHPOINTS = [
  { id: 't1', lead: 'Sophia Vance', hash: 'sha256:4a2b918f0a39…', conversion: 'Won deal · ₹4,200',
    chain: ['Meta Ad', 'Google Search', 'Zoho CRM (Closed)'], target: 'Meta CAPI (200 OK)', time: '14:32:04' },
  { id: 't2', lead: 'Marcus Vance', hash: 'sha256:7c4b9a1d2a45…', conversion: 'Qualified demo',
    chain: ['Google Brand', 'Direct / Form', 'HubSpot'], target: 'Google EC (Synced)', time: '14:31:12' },
  { id: 't3', lead: 'Carlos Brown III', hash: 'sha256:b2d8041e77c…', conversion: 'Consultation booked',
    chain: ['TikTok Spark', 'Retargeting', 'Sell.Do'], target: 'TikTok Events (200 OK)', time: '14:28:50' },
  { id: 't4', lead: 'Alina Roy', hash: 'sha256:3e9f88b142a…', conversion: 'Cart recovered · ₹890',
    chain: ['Meta Lookalike', 'Email', 'Checkout'], target: 'Meta CAPI (200 OK)', time: '14:22:19' },
  { id: 't5', lead: 'Maya Srinivasan', hash: 'sha256:2e459f31c08…', conversion: 'Enterprise MQL',
    chain: ['LinkedIn ABM', 'Google PMax', 'Salesforce'], target: 'LinkedIn CAPI (202)', time: '14:18:03' },
];
