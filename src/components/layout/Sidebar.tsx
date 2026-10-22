import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck2,
  AlertTriangle,
  History,
  Settings,
  ShieldCheck,
  Building2,
  X,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    name: 'Command Centre',
    to: '/',
    icon: LayoutDashboard,
    badge: undefined,
  },
  {
    name: 'Applications Review',
    to: '/applications',
    icon: FileCheck2,
    badge: '11 Active',
  },
  {
    name: 'Verification Centre',
    to: '/verification',
    icon: ShieldCheck,
    badge: 'Operational',
  },
  {
    name: 'Risk Intelligence',
    to: '/risk-insights',
    icon: TrendingUp,
    badge: 'Analytics',
  },
  {
    name: 'Deficiency Tracking',
    to: '/deficiencies',
    icon: AlertTriangle,
    badge: '4 High',
  },
  {
    name: 'Compliance Audit Logs',
    to: '/audit-logs',
    icon: History,
    badge: undefined,
  },
  {
    name: 'Engine Settings',
    to: '/settings',
    icon: Settings,
    badge: undefined,
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-navy-950 border-r border-navy-800/80 text-slate-300 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-navy-800/80 bg-navy-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-500/20 text-white font-bold">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white tracking-wide text-sm">
                  AICTE Intelligence
                </span>
                <span className="rounded bg-amber-400/20 px-1.5 py-0.2 text-[10px] font-semibold text-amber-300">
                  v0.1
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">
                Problem Statement SIH26261
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-navy-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Institution Scope Pill */}
        <div className="px-5 py-3 border-b border-navy-800/40">
          <div className="flex items-center gap-2 rounded-lg bg-navy-900/80 p-2.5 border border-navy-800">
            <Building2 className="h-4 w-4 text-blue-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Jurisdiction
              </div>
              <div className="truncate text-xs font-medium text-slate-200">
                AICTE Approval Process Handbook
              </div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Operational Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all',
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-navy-800/70 hover:text-white'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-slate-400 group-hover:text-white" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-navy-800/90 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-navy-800/80 bg-navy-900/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 ring-2 ring-blue-500/30">
                SO
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-navy-900" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                Scrutiny Officer #42
              </p>
              <p className="truncate text-[11px] text-slate-400">
                AI Validation Bureau
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
