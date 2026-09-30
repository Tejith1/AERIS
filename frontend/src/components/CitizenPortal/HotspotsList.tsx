import React from 'react';
import { Hotspot } from '../../types';
import { AlertTriangle, MapPin } from 'lucide-react';

interface HotspotsListProps {
  hotspots: Hotspot[];
}

export const HotspotsList: React.FC<HotspotsListProps> = ({ hotspots }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center space-x-2 text-white font-bold text-lg border-b border-slate-800 pb-3">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        <h2>All Active Regional Hotspots ({hotspots.length})</h2>
      </div>

      <div className="space-y-3">
        {hotspots.map((h) => (
          <div key={h.id} className="bg-navy-900 p-5 rounded-xl border border-command-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  {h.severity}
                </span>
                <h3 className="font-bold text-white text-base">{h.title}</h3>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>{h.city} ({h.latitude}° N, {h.longitude}° E)</span>
              </div>

              <p className="text-xs text-slate-300">
                Probable Source: <strong className="text-white">{h.probable_source}</strong> ({Math.round(h.source_confidence * 100)}% confidence)
              </p>
            </div>

            <div className="text-right bg-navy-950 p-3 rounded-lg border border-slate-800 w-full md:w-auto">
              <div className="text-2xl font-black text-amber-400">AQI {h.current_aqi}</div>
              <span className="text-xs text-slate-400 block font-mono">PM2.5: {h.current_pm25} µg/m³</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
