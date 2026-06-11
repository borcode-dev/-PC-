'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Factory,
  BookOpen,
  Route,
  Store,
  FileText,
  Navigation,
  BarChart3,
  Settings,
  Package,
  Plug,
  Users,
  ChevronDown,
  ChevronRight,
  Bell,
  HelpCircle,
  User,
  RefreshCw,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { label: '首页监管总览', icon: LayoutDashboard, href: '/dashboard' },
  {
    label: '生产监管',
    icon: Factory,
    children: [
      { label: '生产企业管理', icon: Store, href: '/production/enterprises' },
      { label: '生产台账', icon: BookOpen, href: '/production/ledger' },
      { label: '生产流向追踪', icon: Route, href: '/production/tracking' },
    ],
  },
  {
    label: '经营监管',
    icon: Store,
    children: [
      { label: '经营企业管理', icon: Store, href: '/business/enterprises' },
      { label: '经营台账', icon: FileText, href: '/business/ledger' },
      { label: '经营流向追踪', icon: Navigation, href: '/business/tracking' },
    ],
  },

  { label: '统计分析', icon: BarChart3, href: '/statistics' },
  {
    label: '系统管理',
    icon: Settings,
    children: [
      { label: '主体管理', icon: Users, href: '/system/entities' },
      { label: '产品管理', icon: Package, href: '/system/products' },
      { label: '接口管理', icon: Plug, href: '/system/interfaces' },
    ],
  },
];

function MenuItemComp({ item, depth = 0 }: { item: MenuItem; depth?: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = item.href === pathname;
  const isChildActive = item.children?.some((c) => c.href === pathname);

  React.useEffect(() => {
    if (isChildActive) setOpen(true);
  }, [isChildActive]);

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
            isChildActive && 'text-primary font-medium'
          )}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        {open && (
          <div className="mt-0.5">
            {item.children.map((child) => (
              <MenuItemComp key={child.label} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
        isActive
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground'
      )}
      style={{ paddingLeft: `${12 + depth * 16}px` }}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentPath = pathname === '/' ? '/dashboard' : pathname;

  const breadcrumbMap: Record<string, string> = {
    '/dashboard': '首页监管总览',
    '/production/enterprises': '生产监管 / 生产企业管理',
    '/production/ledger': '生产监管 / 生产台账',
    '/production/ledger/new': '生产监管 / 生产台账 / 新增批次',
    '/production/tracking': '生产监管 / 生产流向追踪',
    '/business/enterprises': '经营监管 / 经营企业管理',
    '/business/ledger': '经营监管 / 经营台账',
    '/business/ledger/inbound': '经营监管 / 经营台账 / 入库登记',
    '/business/ledger/outbound': '经营监管 / 经营台账 / 出库登记',
    '/business/tracking': '经营监管 / 经营流向追踪',
    '/statistics': '统计分析',
    '/system/entities': '系统管理 / 主体管理',
    '/system/products': '系统管理 / 产品管理',
    '/system/interfaces': '系统管理 / 接口管理',
  };

  // Match dynamic routes
  const breadcrumb = breadcrumbMap[currentPath] || (currentPath.match(/\/production\/enterprises\//) ? '生产监管 / 企业详情' : currentPath.match(/\/business\/enterprises\//) ? '经营监管 / 企业详情' : '');

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="flex h-[60px] shrink-0 items-center justify-between px-4 text-white" style={{ backgroundColor: '#1A5C9A' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md p-1.5 hover:bg-white/10 lg:hidden"
          >
            {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20">
              <Factory className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-wide">农药数字监管系统</span>
          </div>
          {breadcrumb && (
            <span className="ml-4 hidden text-sm text-white/70 sm:inline">
              {breadcrumb}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button className="rounded-md p-1.5 hover:bg-white/10" title="刷新">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button className="relative rounded-md p-1.5 hover:bg-white/10" title="消息">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px]">3</span>
          </button>
          <button className="rounded-md p-1.5 hover:bg-white/10" title="帮助">
            <HelpCircle className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/10">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm">省级管理员</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            'shrink-0 border-r border-border bg-white transition-all duration-200',
            sidebarOpen ? 'w-[220px]' : 'w-0 overflow-hidden'
          )}
        >
          <nav className="flex h-full flex-col gap-1 overflow-y-auto p-2">
            {menuItems.map((item) => (
              <MenuItemComp key={item.label} item={item} />
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-[220px] border-r border-border bg-white">
              <nav className="flex h-full flex-col gap-1 overflow-y-auto p-2 pt-[68px]">
                {menuItems.map((item) => (
                  <MenuItemComp key={item.label} item={item} />
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#F5F7FA]">
          {children}
        </main>
      </div>

      {/* Status Bar */}
      <footer className="flex h-[32px] shrink-0 items-center justify-between border-t border-border bg-white px-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>当前在线：123人</span>
          <span>生产台账待审核：8条</span>
          <span>经营台账待审核：12条</span>
        </div>
        <span>2026-06-06</span>
      </footer>
    </div>
  );
}
