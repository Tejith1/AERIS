import React from 'react';
import { Radio, AlertTriangle, CheckCircle2, Flame, Wind, Eye, FileText, Bell, PauseCircle } from 'lucide-react';

interface SimulationControllerProps {
  isSimulating: boolean;
  currentStep: number;
  onStop: () => void;
  onStart: () => void;
}

export const SimulationController: React.FC<SimulationControllerProps> = ({
  isSimulating,
  currentStep,
  onStop,
  onStart
}) => {
  const steps = [
    { label: "Normal", icon: CheckCircle2 },
    { label: "AQ Spike", icon: Wind },
    { label: "Citizen Reports", icon: Eye },
    { label: "Satellite Detect", icon: Flame },
    { label: "AI Hotspot", icon: AlertTriangle },
    { label: "3h Forecast", icon: Wind },
    { label: "Exposure Modeled", icon: Eye },
    { label: "Alert Sent", icon: Bell },
    { label: "Intervention Assigned", icon: FileText }
  ];

  if (!isSimulating) return null;

  const activeIndex = currentStep % steps.length;

  return (
    <div className="bg-navy-900/95 border-b border-sky-500/30 px-4 py-2.5 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30 animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            <span>INDUSTRIAL POLLUTION EVENT DEMO SCENARIO</span>
          </div>
          <span className="text-xs text-slate-300 font-mono hidden lg:inline">
            Location: Hyderabad Industrial Sector
          </span>
        </div>

        {/* Timeline Stepper */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto max-w-full py-1">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === activeIndex;
            const isCompleted = idx < activeIndex;

            return (
              <div
                key={step.label}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105 ring-2 ring-sky-300'
                    : isCompleted
                    ? 'bg-navy-800 text-sky-400 border border-sky-500/20'
                    : 'bg-navy-950 text-slate-500 border border-command-border'
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'animate-bounce' : ''}`} />
                <span>{step.label}</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={onStop}
          className="flex items-center space-x-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium border border-slate-700 transition"
        >
          <PauseCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Pause Scenario</span>
        </button>

      </div>
    </div>
  );
};
