export const ROUTES = [
  { id: 'r1', badge: 'M', name: 'Q3 Enterprise High-Intent Retargeting', platform: 'Meta Ads', ident: 'Pixel: 298410294819024',
    rule: 'utm_campaign = q3_retargeting_ent', engine: 'Dispatches Lead & Purchase',
    events: ['Lead', 'Schedule_Demo', 'Closed_Won'], score: 95.8, grade: 'Optimal', vol: 412, value: 42_800 },
  { id: 'r2', badge: 'G', name: 'Search Brand & Competitor Core', platform: 'Google Ads', ident: 'CID: 821-491-0921',
    rule: 'utm_source = google_search', engine: 'Enhanced conv. + GCLID',
    events: ['Conversion', 'Phone_Call', 'MQL_Stage'], score: 93.4, grade: 'Optimal', vol: 284, value: 31_200 },
  { id: 'r3', badge: 'T', name: 'TikTok Spark Viral Creator Whitelist', platform: 'TikTok', ident: 'CT82K409201A',
    rule: 'utm_medium = tiktok_spark', engine: 'TTCLID + E.164 hash',
    events: ['CompleteReg', 'AddToCart'], score: 84.2, grade: 'Good', vol: 156, value: 8_450 },
  { id: 'r4', badge: 'in', name: 'LinkedIn Enterprise Tier-1 ABM Accounts', platform: 'LinkedIn', ident: 'Acc: 509182391',
    rule: 'utm_source = linkedin_abm', engine: 'Corp domain hash',
    events: ['Lead_Submit', 'Demo_Request'], score: 81.0, grade: 'Good', vol: 62, value: 14_200 },
  { id: 'r5', badge: 'M', name: 'Prospecting Lookalike 3% Broad', platform: 'Meta Ads', ident: 'Pixel: 298410294819024',
    rule: 'utm_campaign = lal_3pct_broad', engine: 'Dispatches Lead only',
    events: ['Lead', 'ViewContent'], score: 88.6, grade: 'Optimal', vol: 338, value: 19_600 },
  { id: 'r6', badge: 'G', name: 'Performance Max — Lead Gen', platform: 'Google Ads', ident: 'CID: 821-491-0921',
    rule: 'utm_campaign = pmax_leads', engine: 'Enhanced conv. for leads',
    events: ['Conversion', 'Quote_Request'], score: 91.2, grade: 'Optimal', vol: 221, value: 26_400 },
];

export const PARAM_MAP = [
  { from: 'utm_source', to: 'Ad network identifier' },
  { from: 'utm_campaign', to: 'CAPI custom campaign key' },
  { from: 'utm_content', to: 'Ad creative ID' },
  { from: 'utm_medium', to: 'Placement classification' },
  { from: 'fbclid / gclid / ttclid', to: '1st-party persistent store (90-day cookie)' },
];

export const CAMPAIGN_TABS = ['All campaigns', 'Meta Ads', 'Google Ads', 'TikTok Spark', 'LinkedIn ABM'];
