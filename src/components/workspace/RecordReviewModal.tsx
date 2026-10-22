import { useState } from 'react';
import { ApplicationStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { useApplicationContext } from '@/context/ApplicationContext';
import { X, Award, CheckCircle2, AlertOctagon, ShieldAlert } from 'lucide-react';

interface RecordReviewModalProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
  onClose: () => void;
}

export function RecordReviewModal({
  applicationId,
  currentStatus,
  onClose,
}: RecordReviewModalProps) {
  const { recordOfficerReview } = useApplicationContext();
  const [decision, setDecision] = useState<ApplicationStatus>(currentStatus);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordOfficerReview(applicationId, decision, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-navy-950 text-white p-5 border-b border-navy-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Record Scrutiny Determination</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Formally sign off preliminary recommendation for {applicationId}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-900 block mb-2">
              Select Scrutiny Determination
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  decision === 'VALIDATION_EXCEPTION'
                    ? 'border-rose-400 bg-rose-50/70'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value="VALIDATION_EXCEPTION"
                  checked={decision === 'VALIDATION_EXCEPTION'}
                  onChange={() => setDecision('VALIDATION_EXCEPTION')}
                  className="mt-0.5 text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <div className="font-semibold text-rose-950 flex items-center gap-1.5">
                    <AlertOctagon className="h-3.5 w-3.5 text-rose-600" />
                    Validation Exception (Issue Deficiency Letter)
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Flag non-compliances (expired affiliation, missing Form 4B, intake mismatch) for applicant rectification.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  decision === 'APPROVAL_RECOMMENDED'
                    ? 'border-indigo-400 bg-indigo-50/70'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value="APPROVAL_RECOMMENDED"
                  checked={decision === 'APPROVAL_RECOMMENDED'}
                  onChange={() => setDecision('APPROVAL_RECOMMENDED')}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="font-semibold text-indigo-950 flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-indigo-600" />
                    Recommend for Approval
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Dossier complies with APH 2024–27 standards; forward to Regional Committee.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  decision === 'VERIFIED'
                    ? 'border-emerald-400 bg-emerald-50/70'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value="VERIFIED"
                  checked={decision === 'VERIFIED'}
                  onChange={() => setDecision('VERIFIED')}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="font-semibold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Mark as Verified
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Documentation verified without critical infractions.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-900 block mb-1">
              Officer Scrutiny Justification & Committee Minutes
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Reviewed 6 dossiers. Deficiency letter draft generated regarding expired affiliation order and missing Form 4B fire safety clearance."
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="rounded-lg bg-amber-50 p-2.5 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Determination is logged to the immutable audit timeline and persists in shared state.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Sign & Record Determination
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
