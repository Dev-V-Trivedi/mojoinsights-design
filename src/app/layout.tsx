import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ShellProvider } from '@/components/ShellContext';
import { WorkspaceProvider } from '@/components/WorkspaceContext';
import { Sidebar } from '@/components/Sidebar';
import { ToastProvider } from '@/components/ui';
import { AppFrame } from '@/components/AppFrame';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-jakarta', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['500'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'MojoInsights', template: '%s · MojoInsights' },
  description: 'Marketing operations and real-time conversion intelligence for performance teams.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable} ${mono.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <ShellProvider>
          <WorkspaceProvider>
          <ToastProvider>
            <Sidebar />
            <AppFrame>{children}</AppFrame>
          </ToastProvider>
          </WorkspaceProvider>
        </ShellProvider>
      </body>
    </html>
  );
}
