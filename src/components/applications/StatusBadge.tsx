import { ApplicationStatus } from '@/types';
import { cn } from '@/lib/utils';
import { Clock, AlertTriangle, Cpu, CheckCircle2, Award, Ban } from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  switch (status) {
    case 'PENDING_REVIEW':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800',
            className
          )}
        >
          <Clock className="h-3 w-3 text-amber-600" />
          Pending Review
        </span>
      );
    case 'VALIDATION_EXCEPTION':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-800',
            className
          )}
        >
          <AlertTriangle className="h-3 w-3 text-rose-600" />
          Validation Exception
        </span>
      );
    case 'UNDER_AI_REVIEW':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-blue-300 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-800',
            className
          )}
        >
          <Cpu className="h-3 w-3 text-blue-600" />
          Under AI Review
        </span>
      );
    case 'VERIFIED':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800',
            className
          )}
        >
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          Verified
        </span>
      );
    case 'APPROVAL_RECOMMENDED':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-indigo-300 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-800',
            className
          )}
        >
          <Award className="h-3 w-3 text-indigo-600" />
          Approval Recommended
        </span>
      );
    case 'REJECTED':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700',
            className
          )}
        >
          <Ban className="h-3 w-3 text-slate-500" />
          Rejected
        </span>
      );
    default:
      return (
        <span className={cn('inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600', className)}>
          {status}
        </span>
      );
  }
}
