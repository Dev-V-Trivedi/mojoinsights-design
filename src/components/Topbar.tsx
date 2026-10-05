'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ALL_NAV, findNav } from '@/lib/nav';
import { Icon } from './Icon';
import { useShell } from './ShellContext';
import { WORKSPACE, NOTIFICATIONS, MESSAGES } from '@/data/workspace';
import { useWorkspace } from './WorkspaceContext';
import { useClickOutside } from '@/lib/hooks';

function Popover({
  open, onClose, children, align = 'right', width = 'w-80',
}: { open: boolean; onClose: () => void; children: React.ReactNode; align?: 'right' | 'left'; width?: string }) {
  const ref = useClickOutside<HTMLDivElement>(onClose, open);
  if (!open) return null;
  return (
    <div ref={ref}
         className={`absolute top-[calc(100%+10px)] ${align === 'right' ? 'right-0' : 'left-0'} ${width} z-50
                     rounded-card bg-white border border-hairline shadow-level2 overflow-hidden animate-fade-up`}>
      {children}
    </div>
  );
}

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setMobileOpen } = useShell();
  const { brand } = useWorkspace();
  const current = findNav(pathname);

  const [query, setQuery] = React.useState('');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [msgOpen, setMsgOpen] = React.useState(false);
  const [acctOpen, setAcctOpen] = React.useState(false);
  const [unread, setUnread] = React.useState(NOTIFICATIONS.filter((n) => !n.read).length);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') { setSearchOpen(false); inputRef.current?.blur(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_NAV.slice(0, 6);
    return ALL_NAV.filter(
      (i) => i.label.toLowerCase().includes(q) || i.description.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query]);

  const searchRef = useClickOutside<HTMLDivElement>(() => setSearchOpen(false), searchOpen);

  return (
    <header className="sticky top-0 z-30 px-4 sm:px-6 pt-4 pb-3 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto w-full max-w-[1480px] flex items-center gap-3">
        <button onClick={() => setMobileOpen(true)} aria-label="Open navigation" className="btn-icon lg:hidden">
          <Icon name="menu" className="w-5 h-5" />
        </button>

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 min-w-0 mr-auto">
          <Link href="/clients" className="text-[12.5px] font-medium text-neutralx-secondary hover:text-ink transition-colors whitespace-nowrap">
            {brand ? brand.name : 'All brands'}
          </Link>
          <Icon name="chevron" className="w-3.5 h-3.5 text-neutralx-muted shrink-0" />
          <span className="text-[12.5px] font-semibold text-ink truncate">{current?.label ?? 'Overview'}</span>
        </div>

        {/* Global search */}
        <div ref={searchRef} className="relative ml-auto md:ml-0 flex-1 md:flex-none md:w-[340px]">
          <div className="relative flex items-center bg-white rounded-full border border-hairline shadow-level1
                          focus-within:border-ink focus-within:shadow-focus transition-shadow h-10 px-3.5">
            <Icon name="search" className="w-4 h-4 text-neutralx-muted shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search pages, events, leads…"
              aria-label="Global search"
              className="w-full bg-transparent border-none outline-none px-2.5 text-[12.5px] text-ink placeholder:text-neutralx-muted"
            />
            <kbd className="hidden sm:block shrink-0 text-[10px] font-mono text-neutralx-muted border border-hairline rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </div>
          <Popover open={searchOpen} onClose={() => setSearchOpen(false)} align="left" width="w-full min-w-[320px]">
            <p className="label-micro px-4 pt-3 pb-1.5 text-[10px]">
              {query ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Jump to'}
            </p>
            <ul className="pb-2 max-h-[340px] overflow-y-auto">
              {results.map((r) => (
                <li key={r.href}>
                  <button
                    onClick={() => { router.push(r.href); setSearchOpen(false); setQuery(''); }}
                    className="w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-hover transition-colors"
                  >
                    <span className="mt-0.5 w-8 h-8 shrink-0 rounded-full bg-gold flex items-center justify-center text-ink">
                      <Icon name={r.icon} className="w-4 h-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold text-ink">{r.label}</span>
                      <span className="block text-[11.5px] text-neutralx-secondary line-clamp-1">{r.description}</span>
                    </span>
                  </button>
                </li>
              ))}
              {results.length === 0 && (
                <li className="px-4 py-6 text-center text-[12.5px] text-neutralx-secondary">
                  No matches for “{query}”.
                </li>
              )}
            </ul>
          </Popover>
        </div>

        {/* Messages */}
        <div className="relative">
          <button onClick={() => { setMsgOpen((v) => !v); setNotifOpen(false); setAcctOpen(false); }}
                  aria-label="Messages" aria-expanded={msgOpen} className="btn-icon relative">
            <Icon name="chat" className="w-[18px] h-[18px]" />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-danger ring-2 ring-white" />
          </button>
          <Popover open={msgOpen} onClose={() => setMsgOpen(false)}>
            <div className="px-4 py-3 border-b border-hairline">
              <p className="text-card-title font-display">Messages</p>
            </div>
            <ul className="max-h-[320px] overflow-y-auto">
              {MESSAGES.map((m) => (
                <li key={m.id} className="flex gap-3 px-4 py-3 border-b border-hairline last:border-0 hover:bg-hover transition-colors cursor-pointer">
                  <img src={m.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-ink">{m.from}</p>
                    <p className="text-[11.5px] text-neutralx-secondary line-clamp-2">{m.preview}</p>
                    <p className="text-[10.5px] text-neutralx-muted mt-0.5">{m.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Popover>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setNotifOpen((v) => !v); setMsgOpen(false); setAcctOpen(false); }}
                  aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} aria-expanded={notifOpen}
                  className="btn-icon relative">
            <Icon name="bell" className="w-[18px] h-[18px]" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-ink
                               text-[10px] font-bold flex items-center justify-center ring-2 ring-canvas tnum">
                {unread}
              </span>
            )}
          </button>
          <Popover open={notifOpen} onClose={() => setNotifOpen(false)} width="w-[360px]">
            <div className="px-4 py-3 border-b border-hairline flex items-center justify-between">
              <p className="text-card-title font-display">Notifications</p>
              <button onClick={() => setUnread(0)} className="text-[11.5px] font-semibold text-neutralx-secondary hover:text-ink">
                Mark all read
              </button>
            </div>
            <ul className="max-h-[340px] overflow-y-auto">
              {NOTIFICATIONS.map((n) => (
                <li key={n.id}>
                  <Link href={n.href} onClick={() => setNotifOpen(false)}
                        className="flex gap-3 px-4 py-3 border-b border-hairline last:border-0 hover:bg-hover transition-colors">
                    <span className={`mt-0.5 w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
                      n.tone === 'danger' ? 'bg-danger-tint text-danger'
                      : n.tone === 'success' ? 'bg-success-tint text-success'
                      : 'bg-warning-tint text-warning'}`}>
                      <Icon name={n.icon} className="w-4 h-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[12.5px] font-semibold text-ink">{n.title}</span>
                      <span className="block text-[11.5px] text-neutralx-secondary">{n.body}</span>
                      <span className="block text-[10.5px] text-neutralx-muted mt-0.5">{n.time}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/alerts" onClick={() => setNotifOpen(false)}
                  className="block px-4 py-3 text-center text-[12px] font-semibold text-ink hover:bg-hover transition-colors">
              View all incidents →
            </Link>
          </Popover>
        </div>

        {/* Account */}
        <div className="relative">
          <button onClick={() => { setAcctOpen((v) => !v); setMsgOpen(false); setNotifOpen(false); }}
                  aria-label="Account menu" aria-expanded={acctOpen}
                  className="w-10 h-10 rounded-full overflow-hidden border border-hairline shadow-level1 bg-white">
            <img src={WORKSPACE.user.avatar} alt="" className="w-full h-full object-cover" />
          </button>
          <Popover open={acctOpen} onClose={() => setAcctOpen(false)} width="w-64">
            <div className="px-4 py-3 border-b border-hairline flex items-center gap-3">
              <img src={WORKSPACE.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-ink truncate">{WORKSPACE.user.name}</p>
                <p className="text-[11.5px] text-neutralx-secondary truncate">{WORKSPACE.user.email}</p>
              </div>
            </div>
            <ul className="py-1.5">
              {[
                { href: '/profile', label: 'Your profile', icon: 'user' as const },
                { href: '/settings', label: 'Settings & API', icon: 'settings' as const },
                { href: '/team', label: 'Team & access', icon: 'team' as const },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setAcctOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[12.5px] font-medium text-ink hover:bg-hover transition-colors">
                    <Icon name={l.icon} className="w-4 h-4 text-neutralx-secondary" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-hairline">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[12.5px] font-medium text-danger hover:bg-danger-tint transition-colors">
                <Icon name="logout" className="w-4 h-4" /> Sign out
              </button>
            </div>
          </Popover>
        </div>
      </div>
    </header>
  );
}
