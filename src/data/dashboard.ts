export const DATE_RANGES = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Custom'] as const;
export type DateRange = (typeof DATE_RANGES)[number];

type Series = { labels: string[]; ingested: number[]; dispatched: number[] };

export const RANGE_DATA: Record<DateRange, {
  leads: number; conversions: number; matchQuality: number; latency: number;
  syncRate: number; leadsDelta: string; reliability: number; series: Series;
}> = {
  Today: {
    leads: 214, conversions: 168, matchQuality: 8.1, latency: 171, syncRate: 78, leadsDelta: '+6.2%', reliability: 88,
    series: { labels: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00', 'Now'], ingested: [12, 28, 44, 39, 52, 26, 13], dispatched: [9, 22, 36, 31, 41, 20, 9] },
  },
  Yesterday: {
    leads: 268, conversions: 191, matchQuality: 7.6, latency: 192, syncRate: 71, leadsDelta: '+2.8%', reliability: 81,
    series: { labels: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00'], ingested: [18, 34, 51, 44, 58, 41, 22], dispatched: [12, 24, 38, 33, 42, 28, 14] },
  },
  'Last 7 days': {
    leads: 1284, conversions: 912, matchQuality: 7.8, latency: 184, syncRate: 71, leadsDelta: '+14.2%', reliability: 84,
    series: { labels: ['Oct 18', 'Oct 19', 'Oct 20', 'Oct 21', 'Oct 22', 'Oct 23', 'Oct 24'], ingested: [148, 132, 96, 206, 214, 268, 220], dispatched: [102, 94, 88, 142, 168, 174, 144] },
  },
  'Last 30 days': {
    leads: 5428, conversions: 3964, matchQuality: 8.0, latency: 176, syncRate: 73, leadsDelta: '+18.6%', reliability: 86,
    series: { labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Now'], ingested: [820, 910, 1040, 980, 1180, 1284, 1240], dispatched: [610, 680, 760, 720, 880, 912, 902] },
  },
  Custom: {
    leads: 3102, conversions: 2284, matchQuality: 7.9, latency: 180, syncRate: 72, leadsDelta: '+11.4%', reliability: 85,
    series: { labels: ['Sep 28', 'Oct 2', 'Oct 6', 'Oct 10', 'Oct 14', 'Oct 18', 'Oct 22'], ingested: [340, 420, 388, 512, 466, 580, 614], dispatched: [250, 310, 288, 372, 344, 420, 448] },
  },
};

export const MATCH_KEYS = [
  { label: 'Hashed Email (em)', percent: 96.8 },
  { label: 'Click ID (fbclid / gclid)', percent: 88.4 },
  { label: 'Phone (ph)', percent: 74.1 },
  { label: 'External ID', percent: 61.9 },
];

export const ADAPTERS = [
  { id: 'a1', name: 'Meta CAPI VIP', tag: 'Master connector', tone: 'dark', events: '482k', status: 'Healthy' },
  { id: 'a2', name: 'Google Enhanced', tag: 'Server-side', tone: 'olive', events: '343k', status: 'Healthy' },
  { id: 'a3', name: 'TikTok Events', tag: 'Server events', tone: 'sage', events: '161k', status: 'Degraded' },
];

export const RECENT_CONVERSIONS = [
  { id: 'c1', event: 'EI_Lead_Success', person: 'Anna Jones', time: 'Today, 14:34', delta: '+2.45%', up: true, tone: 'success' as const },
  { id: 'c2', event: 'Contact_Form_Submit', person: 'Carlos Brown III', time: 'Today, 15:23', delta: '-4.75%', up: false, tone: 'warning' as const },
  { id: 'c3', event: 'Book_Consultation', person: 'Joel Cannan', time: 'Today, 17:54', delta: '+2.45%', up: true, tone: 'success' as const },
  { id: 'c4', event: 'Purchase_Complete', person: 'Marcus Vance', time: 'Today, 18:02', delta: '+8.10%', up: true, tone: 'success' as const },
];
