import React, { useState } from 'react';
import { Intervention } from '../../types';
import { ShieldCheck, UserCheck, Clock, FileText, CheckCircle2, ChevronRight, AlertOctagon, Printer } from 'lucide-react';
import axios from 'axios';

interface InterventionWorkflowProps {
  interventions: Intervention[];
  onOpenReportModal: (intervention: Intervention) => void;
  onRefresh: () => void;
}

export const InterventionWorkflow: React.FC<InterventionWorkflowProps> = ({
  interventions,
  onOpenReportModal,
  onRefresh
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const statuses = [
    "DETECTED",
    "VERIFIED",
    "ASSIGNED",
    "UNDER_INVESTIGATION",
    "ACTION_TAKEN",
    "RESOLVED"
  ];

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await axios.post(`/api/v1/incidents/${id}/resolve`, {
        status: newStatus,
        action_taken_notes: `Status updated to ${newStatus} by Inspector R. Sharma.`
      });
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-navy-900 border border-command-border rounded-xl p-5 space-y-4">

      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>AUDITABLE AUTHORITY INTERVENTION WORKFLOW</span>
          </div>
          <h3 className="text-base font-extrabold text-white mt-0.5">Active Environmental Incidents & Regulatory Actions</h3>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Audit Trail Enabled | Role: Officer Level 3
        </span>
      </div>

      <div className="space-y-4">
        {interventions.map((inv) => {
          const currentStepIdx = statuses.indexOf(inv.status);

          return (
            <div key={inv.id} className="bg-navy-950 p-5 rounded-xl border border-slate-800 space-y-4">

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded font-mono text-xs font-extrabold bg-red-500/20 text-red-400 border border-red-500/30">
                      {inv.incident_number}
                    </span>
                    <h4 className="font-extrabold text-white text-base">{inv.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Assigned: <strong>{inv.assigned_department}</strong> ({inv.assigned_officer})
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenReportModal(inv)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 rounded-lg text-xs font-semibold border border-sky-500/30 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Generate Official PDF Report</span>
                  </button>
                </div>
              </div>

              {/* Workflow Stepper */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {statuses.map((st, idx) => {
                  const isActive = idx === currentStepIdx;
                  const isDone = idx < currentStepIdx;

                  return (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(inv.id, st)}
                      disabled={updatingId === inv.id}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg text-[10px] font-extrabold transition-all border ${
                        isActive
                          ? 'bg-sky-600 text-white border-sky-400 shadow-lg ring-2 ring-sky-400'
                          : isDone
                          ? 'bg-navy-800 text-emerald-400 border-emerald-500/30'
                          : 'bg-navy-950 text-slate-500 border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      <span>{st.replace('_', ' ')}</span>
                      {isDone && <CheckCircle2 className="w-3 h-3 mt-1 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Recommended Action & Exposure Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Recommended Regulatory Interventions</span>
                  <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                    {inv.recommended_action || "1. Deploy field inspection team immediately.\n2. Issue compliance notice.\n3. Issue local advisory."}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Exposure Impact Metric</span>
                  <ul className="text-slate-300 space-y-1">
                    <li>• Exposed Population: <strong>{inv.exposed_population.toLocaleString()}</strong></li>
                    <li>• Sensitive Infrastructure: <strong>{inv.exposed_schools} Schools, {inv.exposed_hospitals} Hospital</strong></li>
                    <li>• Environmental Risk Index: <strong className="text-red-400">{inv.risk_index} / 100</strong></li>
                  </ul>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
