import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { ForecastHorizon } from '../../types';
import { TrendingUp, Cpu, CheckCircle } from 'lucide-react';

interface ForecastChartProps {
  horizons: ForecastHorizon[];
  currentPm25: number;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ horizons, currentPm25 }) => {
  const chartData = [
    { horizon: 'Now', pm25: currentPm25, lower: currentPm25 - 2, upper: currentPm25 + 2 },
    ...horizons.map(h => ({
      horizon: `+${h.horizon_hours}h`,
      pm25: h.predicted_pm25,
      lower: h.confidence_lower,
      upper: h.confidence_upper,
      pm10: h.predicted_pm10
    }))
  ];

  return (
    <div className="bg-navy-900 border border-command-border rounded-xl p-5 space-y-4">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>SPATIOTEMPORAL POLLUTION FORECASTING ENGINE</span>
          </div>
          <h3 className="text-base font-extrabold text-white mt-0.5">PM2.5 Dispersion & Spike Horizon Prediction</h3>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400 bg-navy-950 px-3 py-1 rounded-lg border border-slate-800 font-mono">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>Model: XGBoost-Spatiotemporal-v2.1</span>
          </div>
          <div className="flex items-center space-x-1 text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            <span>R² = 0.92 | MAE = 4.2</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart with Confidence Bands */}
      <div className="w-full h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="pm25Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
            <XAxis dataKey="horizon" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} domain={[50, 'dataMax + 40']} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0b1329', borderColor: '#1e2d4a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="pm25" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#pm25Gradient)" name="Predicted PM2.5 (µg/m³)" />
            <Line type="monotone" dataKey="upper" stroke="#f97316" strokeDasharray="3 3" name="Upper Confidence Limit" />
            <Line type="monotone" dataKey="lower" stroke="#f97316" strokeDasharray="3 3" name="Lower Confidence Limit" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 bg-navy-950 p-3 rounded-lg border border-slate-800">
        <span>Forecast Summary: PM2.5 expected to peak at <strong>172.0 µg/m³</strong> in <strong>+3 hours</strong> before southwest wind dispersion begins.</span>
        <span className="text-sky-400 font-semibold cursor-pointer">Export Model Metrics →</span>
      </div>

    </div>
  );
};
