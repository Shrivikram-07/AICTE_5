import React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  icon?: React.ReactNode;
  category?: 'primary' | 'warning' | 'success' | 'danger' | 'info';
}

export function MetricCard({
  title,
  value,
  change,
  trend = 'neutral',
  description,
  icon,
  category = 'primary',
}: MetricCardProps) {
  const categoryAccent = {
    primary: 'border-l-blue-600',
    warning: 'border-l-amber-500',
    success: 'border-l-emerald-500',
    danger: 'border-l-rose-500',
    info: 'border-l-indigo-500',
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden border-l-4 p-5 hover:border-slate-300 transition-all',
        categoryAccent[category]
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {icon && (
          <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              'inline-flex items-center text-xs font-medium',
              trend === 'up' && 'text-emerald-600',
              trend === 'down' && 'text-rose-600',
              trend === 'neutral' && 'text-amber-600'
            )}
          >
            {trend === 'up' && <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />}
            {trend === 'down' && <ArrowDownRight className="mr-0.5 h-3.5 w-3.5" />}
            {trend === 'neutral' && <Minus className="mr-0.5 h-3.5 w-3.5" />}
            {change}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-2 text-xs text-slate-500 line-clamp-1">{description}</p>
      )}
    </Card>
  );
}
