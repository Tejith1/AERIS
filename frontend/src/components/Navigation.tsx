import React from 'react';
import { PortalMode } from '../types';
import { ShieldAlert, UserCheck, Settings, Play, Radio, MapPin, Activity } from 'lucide-react';

interface NavigationProps {
  currentPortal: PortalMode;
  setPortal: (mode: PortalMode) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onRunDemoScenario: () => void;
  isSimulating: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPortal,
  setPortal,
  selectedCity,
  setSelectedCity,
  onRunDemoScenario,
  isSimulating
}) => {
  const cities = ["Hyderabad", "Bengaluru", "Chennai", "Delhi", "Mumbai"];

  return (
    <header className="bg-navy-900 border-b border-command-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white tracking-wider">AERIS</span>
                <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono border border-sky-500/30">v1.0 FEDERATED</span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">AI Environmental Risk & Intelligence System</p>
            </div>
          </div>

          {/* City Selector */}
          <div className="flex items-center space-x-2 bg-navy-950/80 px-3 py-1.5 rounded-lg border border-command-border">
            <MapPin className="w-4 h-4 text-sky-400" />
            <span className="text-xs text-slate-400 font-medium hidden md:inline">Region:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-2"
            >
              {cities.map(c => (
                <option key={c} value={c} className="bg-navy-900 text-white">{c}</option>
              ))}
            </select>
          </div>

          {/* Portal Nav Switcher */}
          <div className="flex items-center space-x-1 sm:space-x-2 bg-navy-950 p-1 rounded-xl border border-command-border">
            <button
              onClick={() => setPortal('citizen')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentPortal === 'citizen'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Citizen App</span>
            </button>

            <button
              onClick={() => setPortal('authority')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentPortal === 'authority'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Command Center</span>
            </button>

            <button
              onClick={() => setPortal('admin')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentPortal === 'admin'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin</span>
            </button>
          </div>

          {/* Demo Scenario Button */}
          <button
            onClick={onRunDemoScenario}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg ${
              isSimulating
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110 shadow-emerald-500/20'
            }`}
          >
            {isSimulating ? <Radio className="w-4 h-4 text-amber-400 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span className="hidden sm:inline">{isSimulating ? 'SIMULATION RUNNING' : 'RUN DEMO SCENARIO'}</span>
          </button>

        </div>
      </div>
    </header>
  );
};
