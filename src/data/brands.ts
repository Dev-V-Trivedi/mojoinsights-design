export type Brand = {
  id: string; initials: string; name: string; industry: string; domain: string;
  spend: number; pacing: string; pacingUp: boolean; channels: string[]; pipelines: number;
  grade: number; tier: 'Tier A' | 'Tier B'; state: 'healthy' | 'alert'; sync: string;
  /** Relative share of workspace volume — scopes every metric when this brand is active. */
  scale: number;
  accent: string;
};

export const BRANDS: Brand[] = [
  { id: 'lumina', initials: 'LW', name: 'Lumina Skin & Wellness', industry: 'E-Commerce / D2C', domain: 'luminawellness.co',
    spend: 420_000, pacing: '+4.2%', pacingUp: true, channels: ['Meta CAPI', 'TikTok', 'Google'], pipelines: 6,
    grade: 96.2, tier: 'Tier A', state: 'alert', sync: 'Meta 429 throttle · exponential backoff', scale: 0.21, accent: '#C98A3E' },
  { id: 'apex', initials: 'AF', name: 'Apex FinTech Solutions', industry: 'Lead Gen / FinTech', domain: 'apexfintech.io',
    spend: 850_000, pacing: 'Nominal', pacingUp: true, channels: ['Google Enh.', 'LinkedIn CAPI'], pipelines: 4,
    grade: 94.8, tier: 'Tier A', state: 'healthy', sync: 'Synced 14s ago', scale: 0.29, accent: '#3E6FC9' },
  { id: 'velocity', initials: 'VM', name: 'Velocity Motors', industry: 'Auto / Dealerships', domain: 'velocitydealers.com',
    spend: 290_000, pacing: '-1.8%', pacingUp: false, channels: ['Meta Offline', 'Store Visits'], pipelines: 3,
    grade: 88.5, tier: 'Tier B', state: 'healthy', sync: 'Synced 48s ago', scale: 0.11, accent: '#B4473E' },
  { id: 'northwind', initials: 'NB', name: 'Northwind Build Group', industry: 'Real Estate', domain: 'northwindbuild.com',
    spend: 310_000, pacing: '+2.1%', pacingUp: true, channels: ['Meta CAPI', 'Google'], pipelines: 5,
    grade: 91.4, tier: 'Tier A', state: 'healthy', sync: 'Synced 1m ago', scale: 0.12, accent: '#5B8C5A' },
  { id: 'solstice', initials: 'SH', name: 'Solstice Health Technologies', industry: 'Healthcare', domain: 'solsticehealth.io',
    spend: 180_000, pacing: '-0.4%', pacingUp: false, channels: ['Google Enh.'], pipelines: 2,
    grade: 86.0, tier: 'Tier B', state: 'healthy', sync: 'Synced 3m ago', scale: 0.06, accent: '#4B9AA8' },
  { id: 'aura', initials: 'AC', name: 'Aura Clean Beauty Labs', industry: 'E-Commerce / D2C', domain: 'auraclean.co',
    spend: 240_000, pacing: '+6.8%', pacingUp: true, channels: ['Meta CAPI', 'TikTok'], pipelines: 4,
    grade: 93.1, tier: 'Tier A', state: 'healthy', sync: 'Synced 22s ago', scale: 0.08, accent: '#A8639B' },
  { id: 'vanguard', initials: 'VF', name: 'Vanguard Fitness App', industry: 'B2B SaaS', domain: 'vanguardfit.app',
    spend: 150_000, pacing: '+1.2%', pacingUp: true, channels: ['Meta CAPI', 'Google'], pipelines: 3,
    grade: 89.7, tier: 'Tier B', state: 'healthy', sync: 'Synced 5m ago', scale: 0.05, accent: '#7A6BC4' },
  { id: 'meridian', initials: 'MT', name: 'Meridian Trust Capital', industry: 'FinTech', domain: 'meridiantrust.com',
    spend: 620_000, pacing: '+3.4%', pacingUp: true, channels: ['LinkedIn CAPI', 'Google Enh.'], pipelines: 5,
    grade: 95.3, tier: 'Tier A', state: 'healthy', sync: 'Synced 8s ago', scale: 0.08, accent: '#2F7D6B' },
];

export const ALL_BRANDS_ID = 'all';

export function findBrand(id: string): Brand | null {
  return BRANDS.find((b) => b.id === id) ?? null;
}

/** Portfolio totals used when no single brand is selected. */
export const PORTFOLIO = {
  spend: BRANDS.reduce((s, b) => s + b.spend, 0),
  pipelines: BRANDS.reduce((s, b) => s + b.pipelines, 0),
  grade: +(BRANDS.reduce((s, b) => s + b.grade, 0) / BRANDS.length).toFixed(1),
  alerts: BRANDS.filter((b) => b.state === 'alert').length,
};
