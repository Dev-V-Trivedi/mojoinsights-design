export const AUDIENCES = [
  { id: 'a1', name: 'High LTV Customers (top-tier closes)', source: 'HubSpot CRM', cadence: 'Dynamic daily',
    networks: ['Meta', 'Google', 'TikTok'], users: 24_850, matched: 23_110, rate: 93.0, status: 'Synced 18m ago', state: 'synced' },
  { id: 'a2', name: 'MQL leads (unclosed, 30-day window)', source: 'Salesforce', cadence: 'Hourly sync',
    networks: ['Meta', 'Google'], users: 58_200, matched: 51_800, rate: 89.0, status: 'Synced 2m ago', state: 'synced' },
  { id: 'a3', name: 'Demo requested — non-purchased', source: 'Zoho CRM', cadence: 'Real-time webhook',
    networks: ['Meta', 'Google'], users: 14_320, matched: 13_170, rate: 92.0, status: 'Live stream', state: 'live' },
  { id: 'a4', name: 'Churn prevention (inactive 60d)', source: 'Stripe Billing', cadence: 'Daily at 02:00 UTC',
    networks: ['Meta', 'TikTok'], users: 9_410, matched: 7_998, rate: 85.0, status: 'Syncing in 12m', state: 'queued' },
  { id: 'a5', name: 'Suppression list (active subscribers)', source: 'Internal DB', cadence: 'Instant exclusion',
    networks: ['Meta', 'Google', 'TikTok', 'LinkedIn'], users: 105_400, matched: 99_800, rate: 94.7, status: 'Synced 1h ago', state: 'synced' },
  { id: 'a6', name: 'Cart abandoners (7-day)', source: 'Shopify', cadence: 'Every 4 hours',
    networks: ['Meta', 'TikTok'], users: 32_180, matched: 28_640, rate: 89.0, status: 'Synced 42m ago', state: 'synced' },
  { id: 'a7', name: 'Enterprise ABM target accounts', source: 'Salesforce', cadence: 'Weekly',
    networks: ['LinkedIn'], users: 4_120, matched: 3_460, rate: 84.0, status: 'Synced 3h ago', state: 'synced' },
  { id: 'a8', name: 'Closed-won exclusions', source: 'HubSpot CRM', cadence: 'Instant exclusion',
    networks: ['Meta', 'Google'], users: 18_900, matched: 17_980, rate: 95.1, status: 'Synced 24m ago', state: 'synced' },
];

export const NETWORK_HEALTH = [
  { name: 'Meta Custom Audiences', rate: 91.2, note: 'Normalized SHA-256 email, phone and external ID', color: '#111013' },
  { name: 'Google Customer Match', rate: 94.0, note: 'Enhanced conversions for leads active', color: '#F0BC00' },
  { name: 'TikTok Audience', rate: 80.5, note: 'E.164 phone hash required for full match', color: '#1F9D55' },
  { name: 'LinkedIn Matched Audiences', rate: 76.4, note: 'Corporate domain hashing in use', color: '#A6A5AB' },
];

export const COHORT_TABS = ['All cohorts', 'High LTV VIPs', 'Churn risk', 'Closed won exclusions', 'Cart abandoners'];
