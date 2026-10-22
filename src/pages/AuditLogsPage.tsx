import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useApplicationContext } from '@/context/ApplicationContext';
import { History, CheckCircle, AlertOctagon, UserCheck, FileText, RefreshCw } from 'lucide-react';

export function AuditLogsPage() {
  const { activities } = useApplicationContext();

  const getIcon = (type: string) => {
    switch (type) {
      case 'DEFICIT_FLAG':
        return <AlertOctagon className="h-4 w-4 text-rose-600" />;
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
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Compliance & AI Audit Trail
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Immutable ledger of all automated AI validations, officer scrutiny notes, and statutory determinations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-slate-600" />
            <CardTitle>System Activity Ledger ({activities.length} entries)</CardTitle>
          </div>
          <CardDescription>
            Chronological audit trail demonstrating end-to-end accountability under SIH26261.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="mt-0.5 rounded-full p-1.5 bg-slate-100 shrink-0">
                  {getIcon(log.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-900 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                        {log.applicationId}
                      </span>
                      <span className="font-semibold text-slate-900">{log.institutionName}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-700 mt-1 leading-relaxed">{log.action}</p>
                  {log.details && (
                    <p className="mt-1 font-mono text-[11px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100">
                      Note: {log.details}
                    </p>
                  )}
                  <div className="mt-1 text-[10px] text-slate-400">
                    Recorded by <strong className="text-slate-600">{log.actor}</strong> · Type: {log.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
