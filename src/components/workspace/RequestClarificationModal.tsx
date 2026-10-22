import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useApplicationContext } from '@/context/ApplicationContext';
import { X, Send, HelpCircle } from 'lucide-react';

interface RequestClarificationModalProps {
  applicationId: string;
  institutionName: string;
  onClose: () => void;
}

export function RequestClarificationModal({
  applicationId,
  institutionName,
  onClose,
}: RequestClarificationModalProps) {
  const { requestClarification } = useApplicationContext();
  const [subject, setSubject] = useState(
    'Clarification on Expired University Affiliation Order & Form 4B Submission'
  );
  const [details, setDetails] = useState(
    'Please furnish current continuation affiliation letter for Academic Year 2026–27 from Maharashtra State Technological University and upload Municipal Fire Brigade Form 4B clearance within 7 business days.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestClarification(applicationId, subject, details);
    alert(`Clarification query dispatched to ${institutionName}. Logged to audit ledger.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-navy-950 text-white p-5 border-b border-navy-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Request Institution Clarification</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Dispatch official query notice to {institutionName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-900 block mb-1">Notice Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-900 block mb-1">
              Specific Clarification Directive & Evidentiary Request
            </label>
            <textarea
              rows={4}
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="gap-1.5">
              <Send className="h-3.5 w-3.5" />
              Dispatch Notice
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
