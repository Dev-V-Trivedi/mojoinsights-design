'use client';

import { useShell } from './ShellContext';
import { Topbar } from './Topbar';
import { AppFooter } from './AppFooter';

export function AppFrame({ children }: { children: React.ReactNode }) {
  const { collapsed } = useShell();
  return (
    <div
      className={`min-h-screen flex flex-col transition-[padding] duration-300 ease-[cubic-bezier(.22,1,.36,1)]
                  ${collapsed ? 'lg:pl-[108px]' : 'lg:pl-[296px]'}`}
    >
      <Topbar />
      <main className="flex-1 w-full px-4 sm:px-6 pb-10">
        <div className="mx-auto w-full max-w-[1480px] flex flex-col gap-6">{children}</div>
      </main>
      <AppFooter />
    </div>
  );
}
