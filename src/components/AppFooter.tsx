import Link from 'next/link';
import { WORKSPACE } from '@/data/workspace';

export function AppFooter() {
  return (
    <footer className="w-full px-4 sm:px-6 pb-8 pt-2">
      <div className="mx-auto w-full max-w-[1480px] flex flex-wrap items-center justify-between gap-4
                      border-t border-hairline pt-6">
        <p className="text-[12px] text-neutralx-muted">
          © {new Date().getFullYear()} {WORKSPACE.name} · MOJOINSIGHTS Conversion Engine {WORKSPACE.version}
        </p>
        <nav className="flex items-center gap-6">
          {[
            { href: '/settings', label: 'Documentation' },
            { href: '/settings', label: 'API Keys' },
            { href: '/alerts', label: 'Support' },
          ].map((l, i) => (
            <Link key={i} href={l.href} className="text-[12px] text-neutralx-secondary hover:text-ink transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
