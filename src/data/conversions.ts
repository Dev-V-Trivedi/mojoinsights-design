export type Platform = 'Meta CAPI' | 'Google Enhanced' | 'TikTok Events' | 'LinkedIn CAPI';

export const EVENT_SIGNALS = [
  { id: 'e1', name: 'Purchase', platform: 'Meta CAPI' as Platform, fired: 512, success: 99.4, synced: '2 min ago', status: 'healthy' as const },
  { id: 'e2', name: 'Lead_Form_Submit', platform: 'Google Enhanced' as Platform, fired: 284, success: 98.6, synced: '4 min ago', status: 'healthy' as const },
  { id: 'e3', name: 'Book_Consultation', platform: 'Meta CAPI' as Platform, fired: 118, success: 100, synced: 'Just now', status: 'healthy' as const },
  { id: 'e4', name: 'Visit_Done', platform: 'TikTok Events' as Platform, fired: 96, success: 97.2, synced: '7 min ago', status: 'degraded' as const },
  { id: 'e5', name: 'Contact_Initiated', platform: 'Google Enhanced' as Platform, fired: 62, success: 99.1, synced: '11 min ago', status: 'healthy' as const },
  { id: 'e6', name: 'Add_To_Cart', platform: 'Meta CAPI' as Platform, fired: 348, success: 99.8, synced: '1 min ago', status: 'healthy' as const },
  { id: 'e7', name: 'Schedule_Demo', platform: 'LinkedIn CAPI' as Platform, fired: 44, success: 94.2, synced: '18 min ago', status: 'degraded' as const },
  { id: 'e8', name: 'Quote_Request', platform: 'Google Enhanced' as Platform, fired: 71, success: 99.0, synced: '9 min ago', status: 'healthy' as const },
  { id: 'e9', name: 'Trial_Started', platform: 'Meta CAPI' as Platform, fired: 133, success: 98.1, synced: '6 min ago', status: 'healthy' as const },
  { id: 'e10', name: 'Download_Whitepaper', platform: 'LinkedIn CAPI' as Platform, fired: 29, success: 91.4, synced: '24 min ago', status: 'degraded' as const },
];

export const VOLUME_SPLIT = [
  { label: 'Purchase', value: 482, percent: 45, color: '#111013' },
  { label: 'Lead', value: 343, percent: 32, color: '#F0BC00' },
  { label: 'Visit', value: 161, percent: 15, color: '#1F9D55' },
  { label: 'Other events', value: 86, percent: 8, color: '#A6A5AB' },
];

export const RETRY_QUEUE = [
  { id: '#84920', hash: 'a1f3…9c8e', platform: 'Meta CAPI' as Platform, event: 'Book_Consultation', attempt: 2, max: 5, next: '14 min' },
  { id: '#84931', hash: 'd4e2…7b1a', platform: 'TikTok Events' as Platform, event: 'Lead_Form_Submit', attempt: 3, max: 5, next: '6 min' },
  { id: '#84944', hash: '9b71…2f05', platform: 'Google Enhanced' as Platform, event: 'Quote_Request', attempt: 1, max: 5, next: '22 min' },
  { id: '#84951', hash: '5c0a…88d3', platform: 'LinkedIn CAPI' as Platform, event: 'Download_Whitepaper', attempt: 4, max: 5, next: '3 min' },
];

export const LIVE_STREAM = [
  { id: 's1', event: 'EI_Visit_Done', hash: 'sha256:a1f3…', lead: 'Sophia Vance', target: 'Meta CAPI', code: '200 OK', ms: 142, ago: '12s ago', icon: 'eye' as const },
  { id: 's2', event: 'Contact_Form_Submit', hash: 'sha256:b2d8…', lead: 'Carlos Brown III', target: 'Google EC', code: '200 OK', ms: 118, ago: '45s ago', icon: 'mail' as const },
  { id: 's3', event: 'Lead_Qualified', hash: 'sha256:3e9f…', lead: 'Alina Roy', target: 'Meta + TikTok', code: '200 OK', ms: 134, ago: '2m ago', icon: 'users' as const },
  { id: 's4', event: 'Purchase_Complete', hash: 'sha256:7c4b…', lead: 'Marcus Vance', target: 'GA4 MP + Meta', code: '200 OK', ms: 164, ago: '4m ago', icon: 'briefcase' as const },
  { id: 's5', event: 'Add_To_Cart', hash: 'sha256:1d9a…', lead: 'Priya Nair', target: 'Meta CAPI', code: '200 OK', ms: 128, ago: '6m ago', icon: 'target' as const },
];

export const ACTIVITY_LOG = [
  { id: 'l1', time: '14:48:12', actor: 'Cron Worker #14', action: 'Batch dispatch', detail: '1,420 lead events flushed to Meta CAPI', tone: 'success' as const },
  { id: 'l2', time: '14:44:02', actor: 'Amara Osei', action: 'Rule updated', detail: 'Lead_Form_Submit mapped to Google Enhanced Conversions', tone: 'info' as const },
  { id: 'l3', time: '14:31:55', actor: 'System', action: 'Rate limit', detail: 'HTTP 429 from Meta — exponential backoff engaged', tone: 'danger' as const },
  { id: 'l4', time: '14:12:40', actor: 'Dev Patel', action: 'Adapter enabled', detail: 'TikTok Events API connected on node eu-central-1', tone: 'success' as const },
  { id: 'l5', time: '13:58:19', actor: 'Cron Worker #9', action: 'Retry succeeded', detail: 'Payload #84902 accepted after 2 attempts', tone: 'success' as const },
];

export const CHANNEL_FEEDS = [
  { id: 'f1', name: 'Meta Conversions API', node: 'stream-us-1', events24: 482_140, success: 99.6, latency: 142, emq: 9.2, state: 'Healthy' },
  { id: 'f2', name: 'Google Enhanced Conversions', node: 'stream-us-2', events24: 343_880, success: 99.1, latency: 118, emq: 9.4, state: 'Healthy' },
  { id: 'f3', name: 'TikTok Events API', node: 'stream-eu-1', events24: 161_420, success: 97.2, latency: 188, emq: 8.1, state: 'Degraded' },
  { id: 'f4', name: 'LinkedIn Conversions API', node: 'stream-eu-2', events24: 42_090, success: 94.2, latency: 264, emq: 7.6, state: 'Degraded' },
];
