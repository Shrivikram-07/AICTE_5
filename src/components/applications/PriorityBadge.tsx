import { PriorityLevel } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  switch (priority) {
    case 'HIGH':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700',
            className
          )}
        >
          <ArrowUp className="h-3 w-3 text-rose-600" />
          High
        </span>
      );
    case 'MEDIUM':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700',
            className
          )}
        >
          <ArrowRight className="h-3 w-3 text-amber-600" />
          Medium
        </span>
      );
    case 'LOW':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600',
            className
          )}
        >
          <ArrowDown className="h-3 w-3 text-slate-500" />
          Low
        </span>
      );
  }
}
