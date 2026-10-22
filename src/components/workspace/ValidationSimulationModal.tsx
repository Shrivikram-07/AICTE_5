import { useApplicationContext } from '@/context/ApplicationContext';
import { Cpu, CheckCircle2, ShieldCheck } from 'lucide-react';

export function ValidationSimulationModal() {
  const { isSimulatingValidation, validationProgress } = useApplicationContext();

  if (!isSimulatingValidation || !validationProgress) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-navy-950 text-white p-5 border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Cpu className="h-5 w-5 text-white animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI Scrutiny Validation Engine</h3>
                <span className="rounded bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.2 font-mono font-semibold">
                  SIMULATION
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Executing multi-stage regulatory checks against APH 2024–27 rules
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar & Current Stage */}
        <div className="p-6 space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-800">
                Stage {validationProgress.stage} of 4: {validationProgress.stageName}
              </span>
              <span className="font-mono font-bold text-blue-700">
                {validationProgress.percent}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${validationProgress.percent}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-600 leading-relaxed font-mono">
            {validationProgress.detail}
          </div>

          {/* Simulated stages checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className={`flex items-center gap-2 ${validationProgress.stage >= 1 ? 'text-emerald-700 font-medium' : 'text-slate-400'}`}>
              <CheckCircle2 className={`h-4 w-4 ${validationProgress.stage >= 1 ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span>1. Dossier Inventory & OCR Classification</span>
            </div>
            <div className={`flex items-center gap-2 ${validationProgress.stage >= 2 ? 'text-emerald-700 font-medium' : 'text-slate-400'}`}>
              <CheckCircle2 className={`h-4 w-4 ${validationProgress.stage >= 2 ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span>2. Cross-Document Field Entity Extraction</span>
            </div>
            <div className={`flex items-center gap-2 ${validationProgress.stage >= 3 ? 'text-emerald-700 font-medium' : 'text-slate-400'}`}>
              <CheckCircle2 className={`h-4 w-4 ${validationProgress.stage >= 3 ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span>3. APH 2024–27 Norms Rulebase Evaluation</span>
            </div>
            <div className={`flex items-center gap-2 ${validationProgress.stage >= 4 ? 'text-emerald-700 font-medium' : 'text-slate-400'}`}>
              <CheckCircle2 className={`h-4 w-4 ${validationProgress.stage >= 4 ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span>4. Deficiency Scoring & Audit Manifest Generation</span>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
            Deterministic simulation harness · No live external calls
          </span>
          <span className="font-mono text-[10px] text-slate-400">SIH26261</span>
        </div>
      </div>
    </div>
  );
}
