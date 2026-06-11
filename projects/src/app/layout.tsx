import type { Metadata } from 'next';
import AppShell from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: '农药数字监管系统',
  description: '安徽省粮食安全监测监管信息系统 - 农药数字监管分系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
