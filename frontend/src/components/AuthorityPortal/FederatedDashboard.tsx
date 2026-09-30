import React, { useState } from 'react';
import { FederatedStatus } from '../../types';
import { Network, ShieldCheck, Cpu, RefreshCw, CheckCircle, Database } from 'lucide-react';
import axios from 'axios';

interface FederatedDashboardProps {
  federatedData: FederatedStatus | null;
  onRefresh: () => void;
}

export const FederatedDashboard: React.FC<FederatedDashboardProps> = ({
  federatedData,
  onRefresh
}) => {
  const [isTraining, setIsTraining] = useState(false);

  const handleTrainRound = async () => {
    setIsTraining(true);
    try {
      await axios.post('/api/v1/federated/train');
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsTraining(false);
    }
  };

  if (!federatedData) return null;

  return (
    <div className="bg-navy-900 border border-command-border rounded-xl p-5 space-y-5">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <Network className="w-4 h-4" />
            <span>FEDERATED AI MULTI-CITY INTELLIGENCE NETWORK (FLOWER / PYTORCH)</span>
          </div>
          <h3 className="text-lg font-extrabold text-white mt-0.5">Privacy-Preserving Cross-City Model Aggregation</h3>
        </div>

        <button
          onClick={handleTrainRound}
          disabled={isTraining}
          className="flex items-center space-x-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-sky-500/20 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isTraining ? 'animate-spin' : ''}`} />
          <span>{isTraining ? 'Aggregating FedAvg Weights...' : 'Execute FL Training Round'}</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-navy-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">FEDERATED TRAINING ROUND</span>
          <div className="text-3xl font-black text-white mt-1">#{federatedData.current_round}</div>
          <span className="text-[10px] text-sky-400 font-mono">Strategy: FedAvg (Weighted Averaging)</span>
        </div>

        <div className="bg-navy-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">GLOBAL MODEL ACCURACY</span>
          <div className="text-3xl font-black text-emerald-400 mt-1">{federatedData.global_accuracy}%</div>
          <span className="text-[10px] text-emerald-400 font-mono">Global Loss: {federatedData.global_loss}</span>
        </div>

        <div className="bg-navy-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">DATA PRIVACY GOVERNANCE</span>
          <div className="flex items-center space-x-1.5 text-emerald-400 text-base font-bold mt-2">
            <ShieldCheck className="w-5 h-5" />
            <span>100% Zero Raw Data Sharing</span>
          </div>
          <span className="text-[10px] text-slate-400">Only local model weights aggregated</span>
        </div>
      </div>

      {/* City Clients Breakdown Table */}
      <div className="bg-navy-950 rounded-xl border border-slate-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Participating City Client Nodes</span>
          <span className="text-xs text-slate-500 font-mono">Active FL Nodes: {federatedData.city_metrics.length}</span>
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          {federatedData.city_metrics.map(city => (
            <div key={city.city} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold">
                  {city.city[0]}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{city.city} Node Client</h4>
                  <p className="text-[11px] text-slate-400">Dataset Size: <strong>{city.sample_count.toLocaleString()}</strong> environmental records</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-[10px] text-slate-500 block">Local Loss</span>
                  <span className="font-mono text-slate-300 font-bold">{city.local_loss}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Local Model Acc</span>
                  <span className="font-mono text-emerald-400 font-bold">{city.local_accuracy}%</span>
                </div>
                <div className="hidden md:block">
                  <span className="text-[10px] text-slate-500 block">Privacy Guarantee</span>
                  <span className="text-[11px] text-sky-400 font-semibold">{city.data_privacy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
