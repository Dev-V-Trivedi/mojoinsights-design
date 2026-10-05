'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV, isActive } from '@/lib/nav';
import { Icon } from './Icon';
import { useShell } from './ShellContext';
import { WORKSPACE } from '@/data/workspace';
import { BrandMark } from './BrandMark';
import { BrandSwitcher } from './BrandSwitcher';

export function Logo({ compact }: { compact: boolean }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 shrink-0 rounded-[14px] bg-ink flex items-center justify-center shadow-level1">
        <BrandMark className="w-[22px] h-[22px]" />
      </div>
      {!compact && (
        <div className="min-w-0 animate-slide-in">
          <p className="font-display text-[15px] font-bold text-ink leading-tight truncate">MojoInsights</p>
          <p className="text-[11px] text-neutralx-secondary truncate">{WORKSPACE.plan}</p>
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useShell();
  const compact = collapsed;

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px] lg:hidden"
             onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      <aside
        className={[
          'fixed z-50 top-4 bottom-4 left-4 flex flex-col bg-white border border-hairline shadow-level2',
          'rounded-[26px] transition-[width,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)]',
          compact ? 'w-[76px]' : 'w-[264px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0',
        ].join(' ')}
        aria-label="Main navigation"
      >
        {/* Brand */}
        <div className={`flex items-center justify-between gap-2 pt-5 pb-4 ${compact ? 'px-3.5' : 'px-5'}`}>
          <Logo compact={compact} />
          {!compact && (
            <button onClick={toggleCollapsed} aria-label="Collapse sidebar" title="Collapse sidebar"
                    className="hidden lg:flex w-9 h-9 shrink-0 rounded-full items-center justify-center text-neutralx-secondary hover:text-ink hover:bg-hover transition-colors outline-none focus-visible:shadow-focus">
              <Icon name="collapse" className="w-[18px] h-[18px]" />
            </button>
          )}
          <button onClick={() => setMobileOpen(false)} aria-label="Close navigation"
                  className="lg:hidden w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-neutralx-muted hover:bg-hover">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>

        {/* Brand context */}
        <div className={`pb-4 ${compact ? 'px-2.5' : 'px-4'}`}>
          <BrandSwitcher compact={compact} />
        </div>

        {compact && (
          <button onClick={toggleCollapsed} aria-label="Expand sidebar" title="Expand sidebar"
                  className="hidden lg:flex mx-auto mb-2 w-9 h-9 rounded-full items-center justify-center text-neutralx-secondary hover:text-ink hover:bg-hover transition-colors outline-none focus-visible:shadow-focus">
            <Icon name="expand" className="w-[18px] h-[18px]" />
          </button>
        )}

        {/* Nav */}
        <nav className={`flex-1 overflow-y-auto overflow-x-hidden pb-2 ${compact ? 'px-2.5' : 'px-3'}`}
             style={{ scrollbarWidth: 'none' }}>
          {NAV.map((group) => (
            <div key={group.title} className="mb-1.5">
              {compact ? (
                <div className="h-px bg-hairline mx-2 my-3" />
              ) : (
                <p className="label-micro px-3 pt-3 pb-1.5 text-[10px]">{group.title}</p>
              )}
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href, pathname);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        title={compact ? item.label : undefined}
                        className={[
                          'group relative flex items-center rounded-full transition-all duration-200',
                          compact ? 'justify-center h-11 w-11 mx-auto' : 'gap-3 h-11 px-3',
                          active
                            ? 'bg-ink text-white shadow-level1'
                            : 'text-neutralx-secondary hover:text-ink hover:bg-hover',
                        ].join(' ')}
                      >
                        <span className={`relative shrink-0 ${active ? 'text-gold' : ''}`}>
                          <Icon name={item.icon} className="w-[19px] h-[19px]" />
                          {compact && item.badge ? (
                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold ring-2 ring-white" />
                          ) : null}
                        </span>
                        {!compact && (
                          <>
                            <span className="text-[13.5px] font-semibold tracking-[-0.01em] truncate">{item.label}</span>
                            {item.badge ? (
                              <span className={[
                                'ml-auto shrink-0 min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold',
                                'flex items-center justify-center tnum',
                                active ? 'bg-gold text-ink' : 'bg-canvas text-neutralx-secondary border border-hairline',
                              ].join(' ')}>{item.badge}</span>
                            ) : null}
                          </>
                        )}
                        {compact && (
                          <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 shadow-level2 transition-opacity group-hover:opacity-100">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer: plan + user */}
        <div className={`border-t border-hairline pt-3 pb-4 ${compact ? 'px-2.5' : 'px-3'}`}>
          {!compact && (
            <div className="mb-3 rounded-panel bg-canvas border border-hairline p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="label-micro text-[10px]">Monthly events</span>
                <span className="text-[11px] font-bold text-ink tnum">68%</span>
              </div>
              <div className="h-1.5 rounded-full bg-hairline overflow-hidden">
                <div className="h-full rounded-full bg-gold" style={{ width: '68%' }} />
              </div>
              <p className="mt-2 text-[11px] text-neutralx-secondary tnum">2.04M / 3M on {WORKSPACE.plan}</p>
            </div>
          )}
          <Link href="/profile"
                className={`flex items-center rounded-full transition-colors hover:bg-hover ${compact ? 'justify-center p-1' : 'gap-3 p-1.5 pr-3'}`}>
            <img src={WORKSPACE.user.avatar} alt=""
                 className="w-9 h-9 shrink-0 rounded-full object-cover border border-hairline" />
            {!compact && (
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] font-semibold text-ink truncate">{WORKSPACE.user.name}</span>
                <span className="block text-[11px] text-neutralx-secondary truncate">{WORKSPACE.user.role}</span>
              </span>
            )}
            {!compact && <Icon name="logout" className="w-4 h-4 text-neutralx-muted shrink-0" />}
          </Link>
        </div>
      </aside>
    </>
  );
}
