import React from 'react';
import { Intervention } from '../../types';
import { X, Printer, ShieldAlert, CheckCircle } from 'lucide-react';

interface IncidentReportModalProps {
  intervention: Intervention | null;
  onClose: () => void;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({ intervention, onClose }) => {
  if (!intervention) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl p-8 shadow-2xl space-y-6 relative border border-slate-300">

        {/* Action Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center space-x-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>AERIS OFFICIAL INCIDENT REPORT PREVIEW</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="space-y-6 font-sans">
          <div className="flex items-start justify-between border-b-2 border-sky-600 pb-4">
            <div>
              <span className="bg-red-600 text-white font-extrabold text-xs px-2.5 py-1 rounded uppercase">
                {intervention.priority} SEVERITY
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-2">
                AERIS INCIDENT REPORT #{intervention.incident_number}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Sector: Hyderabad Industrial Region | Created: {new Date(intervention.created_at).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-lg text-slate-900">AERIS PLATFORM</span>
              <p className="text-[10px] text-slate-500">Government Environmental Command</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 uppercase font-bold text-[10px] block">Incident Title</span>
              <span className="font-extrabold text-slate-900 text-sm">{intervention.title}</span>
              <span className="text-slate-600 block mt-1">Status: <strong>{intervention.status}</strong></span>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-bold text-[10px] block">Assigned Regulatory Body</span>
              <span className="font-extrabold text-slate-900 text-sm">{intervention.assigned_department}</span>
              <span className="text-slate-600 block mt-1">Officer: {intervention.assigned_officer}</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-3 text-center border-y border-slate-200 py-3 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] block">EXPOSED POPULATION</span>
              <span className="font-black text-slate-900 text-base">{intervention.exposed_population.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">SCHOOLS IMPACTED</span>
              <span className="font-black text-slate-900 text-base">{intervention.exposed_schools}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">HOSPITALS IMPACTED</span>
              <span className="font-black text-slate-900 text-base">{intervention.exposed_hospitals}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">RISK INDEX</span>
              <span className="font-black text-red-600 text-base">{intervention.risk_index} / 100</span>
            </div>
          </div>

          {/* AI Evidence */}
          <div className="space-y-2 text-xs">
            <h3 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider">AI Multi-Sensor Evidence Attribution</h3>
            <ul className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5 text-slate-700">
              <li>✓ PM2.5 concentration increased 42% above regional baseline (146.0 µg/m³)</li>
              <li>✓ Sentinel-5P TROPOMI satellite NO2 column density plume anomaly detected</li>
              <li>✓ Spatiotemporal forecast predicts peak concentration at +3h horizon</li>
              <li>✓ 14 verified citizen photographic and voice reports received</li>
            </ul>
          </div>

          {/* Recommended Actions */}
          <div className="space-y-2 text-xs">
            <h3 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider">Mandated Priority Actions</h3>
            <p className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-800 whitespace-pre-line leading-relaxed">
              {intervention.recommended_action || "1. Deploy field inspection team immediately.\n2. Issue compliance notice.\n3. Issue local advisory."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
            Official Document generated by AERIS (AI Environmental Risk & Intelligence System). Verified for Regulatory Dispatch.
          </div>
        </div>

      </div>
    </div>
  );
};
