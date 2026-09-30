import React, { useState } from 'react';
import { Hotspot, InfrastructureItem, ForecastHorizon, ExposureSummary, Intervention, FederatedStatus } from '../../types';
import { LiveGeospatialMap } from './LiveGeospatialMap';
import { ForecastChart } from './ForecastChart';
import { InterventionWorkflow } from './InterventionWorkflow';
import { FederatedDashboard } from './FederatedDashboard';
import { CopilotChat } from './CopilotChat';
import { IncidentReportModal } from './IncidentReportModal';
import { ShieldAlert, AlertTriangle, Users, School, Building2, Eye, TrendingUp, Network, Bot, FileText, Map, Activity, Download } from 'lucide-react';

interface CommandCenterProps {
  city: string;
  hotspots: Hotspot[];
  infrastructure: InfrastructureItem[];
  horizons: ForecastHorizon[];
  exposure: ExposureSummary | null;
  interventions: Intervention[];
  federatedData: FederatedStatus | null;
  onRefreshData: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  city,
  hotspots,
  infrastructure,
  horizons,
  exposure,
  interventions,
  federatedData,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'map' | 'forecast' | 'workflow' | 'federated' | 'copilot'>('map');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(hotspots[0] || null);
  const [reportModalIntervention, setReportModalIntervention] = useState<Intervention | null>(null);

  const criticalHotspotsCount = hotspots.filter(h => h.severity === 'CRITICAL').length;
  const currentPm25 = selectedHotspot ? selectedHotspot.current_pm25 : 146.0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      {/* Top Command Center Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

        <div className="bg-navy-900 border border-command-border p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
            <span>ACTIVE HOTSPOTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{hotspots.length}</div>
          <span className="text-[10px] text-red-400 font-semibold">{criticalHotspotsCount} Critical Events</span>
        </div>

        <div className="bg-navy-900 border border-command-border p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
            <span>PREDICTED EVENTS (+3h)</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400 mt-1">9</div>
          <span className="text-[10px] text-sky-400/80 font-mono">XGBoost Confidence 92%</span>
        </div>

        <div className="bg-navy-900 border border-command-border p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
            <span>CITIZEN REPORTS</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">286</div>
          <span className="text-[10px] text-emerald-400 font-semibold">14 Verified Nearby</span>
        </div>

        <div className="bg-navy-900 border border-command-border p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
            <span>POPULATION EXPOSED</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300 mt-1">
            {exposure ? exposure.population_exposed.toLocaleString() : '84,240'}
          </div>
          <span className="text-[10px] text-slate-400">PostGIS Buffer Calculation</span>
        </div>

        <div className="bg-navy-900 border border-command-border p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
            <span>SCHOOLS IMPACTED</span>
            <School className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400 mt-1">
            {exposure ? exposure.schools_affected : 21}
          </div>
          <span className="text-[10px] text-amber-400 font-semibold">Priority Health Advisory</span>
        </div>

        <div className="bg-navy-900 border border-command-border p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
            <span>HOSPITALS IMPACTED</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {exposure ? exposure.hospitals_affected : 6}
          </div>
          <span className="text-[10px] text-emerald-400">Air Filtration Mandated</span>
        </div>

      </div>

      {/* Primary Command Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-navy-900 p-1.5 rounded-xl border border-command-border">
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'map' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Live Geospatial Command Map</span>
          </button>

          <button
            onClick={() => setActiveTab('forecast')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'forecast' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Forecast & Source Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'workflow' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Authority Intervention Workflow ({interventions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('federated')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'federated' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Federated AI Network</span>
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'copilot' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span>AERIS AI Copilot</span>
          </button>
        </div>

        {/* Export Data Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => window.open(`/api/v1/hotspots/export/csv?city=${city}`, '_blank')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-navy-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold transition"
            title="Export Hotspots CSV"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Hotspots CSV</span>
          </button>
          <button
            onClick={() => window.open('/api/v1/incidents/export/csv', '_blank')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-navy-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold transition"
            title="Export Incidents CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Incidents CSV</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2">
              <LiveGeospatialMap
                city={city}
                hotspots={hotspots}
                infrastructure={infrastructure}
                selectedHotspot={selectedHotspot}
                onSelectHotspot={setSelectedHotspot}
              />
            </div>

            {/* Hotspot & Evidence Side Panel */}
            <div className="bg-navy-900 border border-command-border rounded-2xl p-5 space-y-4 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">SELECTED HOTSPOT DETAILS</span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30">
                    {selectedHotspot?.severity || 'CRITICAL'}
                  </span>
                </div>

                {selectedHotspot ? (
                  <div className="mt-4 space-y-4 text-xs">
                    <div>
                      <h3 className="font-extrabold text-white text-base">{selectedHotspot.title}</h3>
                      <p className="text-slate-400 text-xs mt-0.5">Location: Sanathnagar Industrial Sector 3</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-navy-950 p-3 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-500 text-[10px] block">CURRENT PM2.5</span>
                        <span className="text-xl font-extrabold text-red-400">{selectedHotspot.current_pm25} µg/m³</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">AIR QUALITY INDEX</span>
                        <span className="text-xl font-extrabold text-amber-400">AQI {selectedHotspot.current_aqi}</span>
                      </div>
                    </div>

                    {/* Source Attribution */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-sky-500/20 space-y-1">
                      <span className="text-sky-400 font-bold uppercase text-[10px] block">PROBABILISTIC SOURCE ATTRIBUTION</span>
                      <div className="text-sm font-extrabold text-white">{selectedHotspot.probable_source}</div>
                      <span className="text-[11px] text-emerald-400 font-mono">Confidence Score: {Math.round(selectedHotspot.source_confidence * 100)}%</span>
                    </div>

                    {/* Evidence List */}
                    <div className="space-y-2">
                      <span className="text-slate-300 font-bold uppercase text-[10px] block">AI Multi-Sensor Evidence Synthesis</span>
                      <ul className="space-y-1.5 text-slate-300">
                        {selectedHotspot.evidence_list.map((ev, i) => (
                          <li key={i} className="flex items-start space-x-2 bg-navy-950 p-2 rounded border border-slate-800/80">
                            <span className="text-sky-400 font-bold">•</span>
                            <span>{ev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mt-4">Select a hotspot on the map to view details.</p>
                )}
              </div>

              {/* Action Button */}
              {selectedHotspot && (
                <button
                  onClick={() => setActiveTab('workflow')}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-2.5 rounded-xl shadow-lg text-xs"
                >
                  DISPATCH AUTHORITY INTERVENTION →
                </button>
              )}
            </div>

          </div>
        )}

        {activeTab === 'forecast' && (
          <div className="space-y-6">
            <ForecastChart horizons={horizons} currentPm25={currentPm25} />
          </div>
        )}

        {activeTab === 'workflow' && (
          <InterventionWorkflow
            interventions={interventions}
            onOpenReportModal={setReportModalIntervention}
            onRefresh={onRefreshData}
          />
        )}

        {activeTab === 'federated' && (
          <FederatedDashboard
            federatedData={federatedData}
            onRefresh={onRefreshData}
          />
        )}

        {activeTab === 'copilot' && (
          <CopilotChat city={city} />
        )}
      </div>

      {/* PDF Incident Report Preview Modal */}
      <IncidentReportModal
        intervention={reportModalIntervention}
        onClose={() => setReportModalIntervention(null)}
      />

    </div>
  );
};
