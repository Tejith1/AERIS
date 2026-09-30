import React from 'react';
import { ShieldAlert, Wind, MapPin, TrendingUp, AlertTriangle, Camera, Mic, Heart, Shield } from 'lucide-react';
import { Hotspot } from '../../types';

interface CitizenHomeProps {
  city: string;
  hotspots: Hotspot[];
  onOpenReportForm: () => void;
}

export const CitizenHome: React.FC<CitizenHomeProps> = ({
  city,
  hotspots,
  onOpenReportForm
}) => {
  const activeCount = hotspots.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

      {/* Hero Location AQ Card */}
      <div className="bg-gradient-to-br from-slate-900 via-navy-900 to-slate-900 border border-command-border rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Wind className="w-48 h-48 text-sky-400" />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>CURRENT LOCATION: {city.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Air Quality & Local Pollution Index</h1>
          </div>

          <div className="flex items-center space-x-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-xl border border-red-500/30">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <span className="font-extrabold text-sm uppercase">HIGH RISK AREA</span>
          </div>
        </div>

        {/* AQ Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-navy-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">AIR QUALITY INDEX</span>
            <div className="text-3xl font-black text-amber-400 mt-1">168</div>
            <span className="text-[10px] text-amber-400/80 font-medium">UNHEALTHY FOR SENSITIVE</span>
          </div>

          <div className="bg-navy-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">PM 2.5</span>
            <div className="text-3xl font-black text-white mt-1">94 <span className="text-xs text-slate-400 font-normal">µg/m³</span></div>
            <span className="text-[10px] text-red-400 font-medium">↑ 18% vs yesterday</span>
          </div>

          <div className="bg-navy-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">PM 10</span>
            <div className="text-3xl font-black text-white mt-1">141 <span className="text-xs text-slate-400 font-normal">µg/m³</span></div>
            <span className="text-[10px] text-slate-400 font-medium">Moderate dust</span>
          </div>

          <div className="bg-navy-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">POLLUTION TREND</span>
            <div className="flex items-center space-x-1 text-red-400 text-lg font-bold mt-2">
              <TrendingUp className="w-5 h-5" />
              <span>Increasing</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Wind moving SW</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-300">
            Detected unusual smoke, industrial smell, or illegal garbage burning near you?
          </p>

          <button
            onClick={onOpenReportForm}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-red-600/30 transition-all scale-100 hover:scale-105"
          >
            <Camera className="w-4 h-4" />
            <Mic className="w-4 h-4" />
            <span>REPORT POLLUTION EVENT</span>
          </button>
        </div>
      </div>

      {/* Active Hotspots Alert Banner */}
      <div className="bg-navy-900 border border-command-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-white text-base">Active Pollution Hotspots Near You ({activeCount})</h2>
          </div>
          <span className="text-xs text-sky-400 font-semibold cursor-pointer">View Map →</span>
        </div>

        <div className="space-y-3">
          {hotspots.map((h) => (
            <div key={h.id} className="bg-navy-950 p-4 rounded-lg border border-slate-800/80 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                    {h.severity}
                  </span>
                  <h3 className="font-bold text-white text-sm">{h.title}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Probable Source: <strong className="text-slate-200">{h.probable_source}</strong> ({Math.round(h.source_confidence * 100)}% AI confidence)
                </p>
                <div className="flex items-center space-x-4 text-xs text-slate-500 mt-2">
                  <span>PM2.5: {h.current_pm25} µg/m³</span>
                  <span>Citizen Reports: {h.contributing_report_count} verified</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-amber-400">AQI {h.current_aqi}</div>
                <span className="text-[10px] text-slate-500">Updated 10m ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health & Safety Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-navy-900 p-5 rounded-xl border border-command-border">
          <div className="flex items-center space-x-2 mb-3 text-emerald-400">
            <Heart className="w-5 h-5" />
            <h3 className="font-bold text-white text-sm">Health Precautions</h3>
          </div>
          <ul className="text-xs text-slate-300 space-y-2">
            <li>• Wear N95/FFP2 masks when outdoors during morning peak hours.</li>
            <li>• Sensitive individuals and children should limit outdoor exercise.</li>
            <li>• Use HEPA air purifiers in residential indoor spaces.</li>
          </ul>
        </div>

        <div className="bg-navy-900 p-5 rounded-xl border border-command-border">
          <div className="flex items-center space-x-2 mb-3 text-sky-400">
            <Shield className="w-5 h-5" />
            <h3 className="font-bold text-white text-sm">Citizen Action Rights</h3>
          </div>
          <ul className="text-xs text-slate-300 space-y-2">
            <li>• Environmental observations are routed directly to State PCB inspectors.</li>
            <li>• Voice and photographic evidence accelerates authority intervention.</li>
            <li>• All submissions maintain citizen privacy and anonymized location.</li>
          </ul>
        </div>
      </div>

    </div>
  );
};
