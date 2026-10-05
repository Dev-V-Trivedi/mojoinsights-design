import * as React from 'react';

const P: Record<string, React.ReactNode> = {
  grid: <><rect x="3" y="3" width="7.5" height="7.5" rx="2.2" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="2.2" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="2.2" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.2" /></>,
  broadcast: <><circle cx="12" cy="12" r="2.4" /><path d="M7.8 7.8a6 6 0 000 8.4M16.2 16.2a6 6 0 000-8.4M4.9 4.9a10 10 0 000 14.2M19.1 19.1a10 10 0 000-14.2" strokeLinecap="round" /></>,
  flow: <><circle cx="5.5" cy="6" r="2.5" /><circle cx="18.5" cy="12" r="2.5" /><circle cx="5.5" cy="18" r="2.5" /><path d="M8 6h4.5a3.5 3.5 0 013.5 3.5v.3M8 18h4.5a3.5 3.5 0 003.5-3.5v-.3" strokeLinecap="round" /></>,
  users: <><circle cx="9" cy="8.5" r="3.5" /><path d="M16.5 6.2a3.2 3.2 0 010 6.1" strokeLinecap="round" /><path d="M3 19.5a6 6 0 0112 0" strokeLinecap="round" /><path d="M17 15.2a5 5 0 014 4.3" strokeLinecap="round" /></>,
  document: <><path d="M6 3.5h7.5L19 9v11.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-16a1 1 0 011-1z" /><path d="M13 3.5V9h5.5M8.5 13h7M8.5 16.5h5" strokeLinecap="round" /></>,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.8" /><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" /></>,
  layers: <><path d="M12 3.2l8.5 4.4-8.5 4.4-8.5-4.4L12 3.2z" /><path d="M3.5 12.2l8.5 4.4 8.5-4.4M3.5 16.6l8.5 4.4 8.5-4.4" strokeLinecap="round" strokeLinejoin="round" /></>,
  upload: <><path d="M12 15.5V4.2M8.2 8l3.8-3.8L15.8 8" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 15v3.5a2 2 0 002 2h12a2 2 0 002-2V15" strokeLinecap="round" /></>,
  plug: <><path d="M9 3.5v5M15 3.5v5" strokeLinecap="round" /><path d="M6 8.5h12v3a6 6 0 01-6 6 6 6 0 01-6-6v-3z" /><path d="M12 17.5v3" strokeLinecap="round" /></>,
  alert: <><path d="M12 4.4l8.4 14.6H3.6L12 4.4z" strokeLinejoin="round" /><path d="M12 10v4" strokeLinecap="round" /><circle cx="12" cy="16.6" r="1" fill="currentColor" stroke="none" /></>,
  calendar: <><rect x="3.2" y="4.6" width="17.6" height="16.2" rx="3" /><path d="M16 2.8v3.6M8 2.8v3.6M3.2 10h17.6" strokeLinecap="round" /></>,
  shield: <><path d="M12 3.2l7 2.8v5.4c0 4.3-2.9 8.1-7 9.4-4.1-1.3-7-5.1-7-9.4V6l7-2.8z" strokeLinejoin="round" /><path d="M9.2 12.1l2 2 3.6-3.8" strokeLinecap="round" strokeLinejoin="round" /></>,
  briefcase: <><rect x="3" y="7.2" width="18" height="13.2" rx="3" /><path d="M8.6 7.2V5.6a2 2 0 012-2h2.8a2 2 0 012 2v1.6M3 12.6h18" strokeLinecap="round" /></>,
  team: <><circle cx="8" cy="8" r="3.1" /><circle cx="16.4" cy="9.4" r="2.5" /><path d="M2.8 19.2a5.2 5.2 0 0110.4 0M15 15.2a4.4 4.4 0 016.2 4" strokeLinecap="round" /></>,
  settings: <><circle cx="12" cy="12" r="3.1" /><path d="M19.3 14.2a1.6 1.6 0 00.32 1.77l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.6 1.6 0 00-1.77-.32 1.6 1.6 0 00-.97 1.47V20a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1.05-1.46 1.6 1.6 0 00-1.77.32l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.6 1.6 0 00.32-1.77A1.6 1.6 0 003.9 13.2H4a2 2 0 110-4h.1a1.6 1.6 0 001.46-1.05 1.6 1.6 0 00-.32-1.77l-.06-.06a2 2 0 112.83-2.83l.06.06a1.6 1.6 0 001.77.32H10a1.6 1.6 0 001-1.47V4a2 2 0 114 0v.1a1.6 1.6 0 00.97 1.47 1.6 1.6 0 001.77-.32l.06-.06a2 2 0 112.83 2.83l-.06.06a1.6 1.6 0 00-.32 1.77V10a1.6 1.6 0 001.47.97H20a2 2 0 110 4h-.1a1.6 1.6 0 00-1.47.97z" /></>,
  user: <><circle cx="12" cy="8.2" r="4" /><path d="M4.5 20.4a7.5 7.5 0 0115 0" strokeLinecap="round" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M16.2 16.2L21 21" strokeLinecap="round" /></>,
  bell: <><path d="M18 8.6a6 6 0 10-12 0c0 5-2 6.4-2 6.4h16s-2-1.4-2-6.4z" strokeLinejoin="round" /><path d="M13.7 19a2 2 0 01-3.4 0" strokeLinecap="round" /></>,
  chat: <><path d="M20.5 11.6a7.9 7.9 0 01-8.5 7.9 8.9 8.9 0 01-3.1-.6L3.5 20.5l1.6-5.1a8 8 0 01-.6-3.1 7.9 7.9 0 017.9-8.4 7.9 7.9 0 018.1 7.7z" strokeLinejoin="round" /></>,
  chevron: <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />,
  chevronDown: <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />,
  collapse: <><rect x="3.5" y="4" width="17" height="16" rx="4" /><path d="M9.5 4v16" /><path d="M16.5 10l-2.5 2 2.5 2" strokeLinecap="round" strokeLinejoin="round" /></>,
  expand: <><rect x="3.5" y="4" width="17" height="16" rx="4" /><path d="M9.5 4v16" /><path d="M13.5 10l2.5 2-2.5 2" strokeLinecap="round" strokeLinejoin="round" /></>,
  logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" /></>,
  plus: <path d="M12 5v14M5 12h14" strokeLinecap="round" />,
  check: <path d="M4.5 12.5l5 5 10-10" strokeLinecap="round" strokeLinejoin="round" />,
  x: <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />,
  refresh: <><path d="M20.5 12a8.5 8.5 0 11-2.6-6.1" strokeLinecap="round" /><path d="M20.8 4.2v4.6h-4.6" strokeLinecap="round" strokeLinejoin="round" /></>,
  download: <><path d="M12 4v11.5M8.2 11.8l3.8 3.7 3.8-3.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 16.5V19a2 2 0 002 2h12a2 2 0 002-2v-2.5" strokeLinecap="round" /></>,
  filter: <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />,
  bolt: <path d="M13.2 3L5 13.4h5.6L10.2 21l8.3-10.5h-5.7L13.2 3z" strokeLinejoin="round" />,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.2V12l3.2 2" strokeLinecap="round" strokeLinejoin="round" /></>,
  trend: <><path d="M3.5 16.5l5.5-5.5 3.5 3.5 7-7.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M14.5 7h5v5" strokeLinecap="round" strokeLinejoin="round" /></>,
  copy: <><rect x="8.5" y="8.5" width="12" height="12" rx="2.6" /><path d="M15.5 8.5v-2a2 2 0 00-2-2h-7a2 2 0 00-2 2v7a2 2 0 002 2h2" strokeLinecap="round" /></>,
  external: <><path d="M14 4h6v6" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 4l-8.5 8.5" strokeLinecap="round" /><path d="M19 14.5V19a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4.5" strokeLinecap="round" /></>,
  key: <><circle cx="8" cy="15.5" r="4" /><path d="M11 12.8L20 4M17 7l2.5 2.5M14.5 9.5L17 12" strokeLinecap="round" strokeLinejoin="round" /></>,
  database: <><ellipse cx="12" cy="6" rx="8" ry="3.2" /><path d="M4 6v12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V6M4 12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2" /></>,
  sparkline: <path d="M3 15l4-5 3.5 3L15 7l6 8" strokeLinecap="round" strokeLinejoin="round" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3.8 7l7.2 5.4a1.7 1.7 0 002 0L20.2 7" strokeLinecap="round" /></>,
  pause: <><rect x="7" y="5" width="3.4" height="14" rx="1.4" /><rect x="13.6" y="5" width="3.4" height="14" rx="1.4" /></>,
  play: <path d="M7.5 5.2l11 6.8-11 6.8V5.2z" strokeLinejoin="round" />,
  trash: <><path d="M4.5 7h15M9.5 7V5.4a1.6 1.6 0 011.6-1.6h1.8A1.6 1.6 0 0114.5 5.4V7" strokeLinecap="round" /><path d="M6.5 7l.9 12.2a2 2 0 002 1.8h5.2a2 2 0 002-1.8L17.5 7" strokeLinecap="round" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>,
  link: <><path d="M10 13.5a4 4 0 005.7 0l3-3a4 4 0 10-5.7-5.7l-1.4 1.4" strokeLinecap="round" /><path d="M14 10.5a4 4 0 00-5.7 0l-3 3a4 4 0 105.7 5.7l1.4-1.4" strokeLinecap="round" /></>,
};

export type IconName = keyof typeof P;

export function Icon({
  name, className = 'w-5 h-5', strokeWidth = 1.7,
}: { name: IconName; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor"
         strokeWidth={strokeWidth} aria-hidden="true" focusable="false">
      {P[name]}
    </svg>
  );
}
