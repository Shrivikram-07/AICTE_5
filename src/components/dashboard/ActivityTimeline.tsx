import { useApplicationContext } from '@/context/ApplicationContext';
import { Clock, AlertCircle, CheckCircle, FileText, RefreshCw, UserCheck } from 'lucide-react';

export function ActivityTimeline() {
  const { activities } = useApplicationContext();

  const getIcon = (type: string) => {
    switch (type) {
      case 'DEFICIT_FLAG':
        return <AlertCircle className="h-4 w-4 text-rose-600" />;
      case 'VERIFICATION':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'DOCUMENT_UPLOAD':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'STATUS_CHANGE':
      case 'MANUAL_OVERRIDE':
        return <UserCheck className="h-4 w-4 text-indigo-600" />;
      default:
        return <RefreshCw className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.slice(0, 6).map((activity, idx) => {
          const isLast = idx === Math.min(activities.length, 6) - 1;

          return (
            <li key={activity.id} className="relative pb-6">
              {!isLast && (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex items-start space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 ring-4 ring-white shrink-0">
                  {getIcon(activity.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 truncate">
                      {activity.institutionName}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {activity.action}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                      {activity.applicationId}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      by {activity.actor}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
