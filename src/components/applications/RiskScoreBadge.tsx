import { cn } from '@/lib/utils';

interface RiskScoreBadgeProps {
  score: number;
  className?: string;
}

export function RiskScoreBadge({ score, className }: RiskScoreBadgeProps) {
  let colorStyle = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let dotStyle = 'bg-emerald-500';

  if (score >= 70) {
    colorStyle = 'text-rose-700 bg-rose-50 border-rose-300';
    dotStyle = 'bg-rose-500 animate-pulse';
  } else if (score >= 40) {
    colorStyle = 'text-amber-700 bg-amber-50 border-amber-300';
    dotStyle = 'bg-amber-500';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-xs font-semibold',
        colorStyle,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dotStyle)} />
      {score}/100
    </span>
  );
}
