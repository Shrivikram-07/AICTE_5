import { Menu, Search, Bell, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar (Placeholder) */}
        <div className="relative hidden md:block w-72 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search institution name, PID, or compliance clause..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 pl-9 pr-4 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Synthetic Data Banner / Indicator - CRITICAL REQUIREMENT */}
        <div className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50/80 px-3 py-1 text-[11px] font-semibold text-amber-900 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="tracking-wide uppercase font-mono text-[10px]">
            DEMO ENVIRONMENT · SYNTHETIC DATA
          </span>
        </div>

        {/* SIH Tag */}
        <div className="hidden sm:flex items-center gap-1">
          <Badge variant="navy" size="sm" className="font-mono text-[10px]">
            <Sparkles className="h-3 w-3 mr-1 text-amber-400 inline" />
            SIH26261
          </Badge>
        </div>

        {/* Notification Bell */}
        <button
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
