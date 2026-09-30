import React from 'react';
import { Activity, Database, Cpu, ShieldCheck, Server, AlertTriangle, RefreshCw } from 'lucide-react';

export const SystemHealth: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Server className="w-5 h-5 text-sky-400" />
            <span>AERIS SYSTEM ADMINISTRATION & INFRASTRUCTURE HEALTH</span>
          </h1>
          <p className="text-xs text-slate-400">Database connections, Data Provider modes, Model drift, and Audit logs</p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 text-xs font-mono font-bold">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>ALL SYSTEMS OPERATIONAL</span>
        </div>
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-navy-900 border border-command-border p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>DATABASE ENGINES</span>
            <Database className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-lg font-bold text-white">PostgreSQL / SQLite</div>
          <span className="text-[10px] text-emerald-400 font-mono">Status: Connected (SpatiaLite loaded)</span>
        </div>

        <div className="bg-navy-900 border border-command-border p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>DATA PROVIDER MODE</span>
            <Server className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-400">HYBRID (Demo + Open-Meteo)</div>
          <span className="text-[10px] text-slate-400 font-mono">Fallback Latency: 12ms</span>
        </div>

        <div className="bg-navy-900 border border-command-border p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>AI MODEL PIPELINES</span>
            <Cpu className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400">10 Active Engines</div>
          <span className="text-[10px] text-sky-400 font-mono">XGBoost, Flower FL, Vision, STT</span>
        </div>

        <div className="bg-navy-900 border border-command-border p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>SECURITY & RBAC</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white">JWT + OAuth2</div>
          <span className="text-[10px] text-emerald-400 font-mono">Encryption: HS256</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-navy-900 border border-command-border rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent System Audit Events</h3>

        <div className="bg-navy-950 rounded-lg border border-slate-800 text-xs divide-y divide-slate-800">
          {[
            { time: "Just now", event: "Automated FedAvg weight aggregation round #12 completed across 3 city nodes", status: "SUCCESS" },
            { time: "5m ago", event: "Hotspot #H1042 anomaly detected near Sanathnagar Industrial Sector", status: "ALERT" },
            { time: "12m ago", event: "Citizen photographic evidence uploaded - Computer Vision model inferred smoke plume (88% conf)", status: "INFO" },
            { time: "25m ago", event: "Open-Meteo Air Quality API sync completed for Hyderabad, Bengaluru, Chennai", status: "SUCCESS" }
          ].map((log, i) => (
            <div key={i} className="p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-slate-500 font-mono text-[11px]">{log.time}</span>
                <span className="text-slate-200">{log.event}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : log.status === 'ALERT' ? 'bg-red-500/20 text-red-400' : 'bg-sky-500/20 text-sky-400'
              }`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
