import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PortalMode, Hotspot, InfrastructureItem, ForecastHorizon, ExposureSummary, Intervention, FederatedStatus } from './types';
import { Navigation } from './components/Navigation';
import { SimulationController } from './components/SimulationController';
import { CitizenHome } from './components/CitizenPortal/CitizenHome';
import { ReportPollutionForm } from './components/CitizenPortal/ReportPollutionForm';
import { HotspotsList } from './components/CitizenPortal/HotspotsList';
import { CommandCenter } from './components/AuthorityPortal/CommandCenter';
import { SystemHealth } from './components/AdminPortal/SystemHealth';

export const App: React.FC = () => {
  const [currentPortal, setPortal] = useState<PortalMode>('authority');
  const [citizenView, setCitizenView] = useState<'home' | 'report' | 'hotspots'>('home');
  const [selectedCity, setSelectedCity] = useState<string>('Hyderabad');

  // Simulation state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);

  // Core domain states
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [infrastructure, setInfrastructure] = useState<InfrastructureItem[]>([]);
  const [forecastHorizons, setForecastHorizons] = useState<ForecastHorizon[]>([]);
  const [exposure, setExposure] = useState<ExposureSummary | null>(null);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [federatedData, setFederatedData] = useState<FederatedStatus | null>(null);

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const [hRes, iRes, fRes, eRes, invRes, fedRes] = await Promise.all([
        axios.get(`/api/v1/hotspots?city=${selectedCity}`),
        axios.get(`/api/v1/exposure/infrastructure?city=${selectedCity}`),
        axios.get(`/api/v1/forecast?city=${selectedCity}`),
        axios.get(`/api/v1/exposure?city=${selectedCity}`),
        axios.get(`/api/v1/incidents`),
        axios.get(`/api/v1/federated/status`)
      ]);

      setHotspots(hRes.data);
      setInfrastructure(iRes.data);
      setForecastHorizons(fRes.data.horizons);
      setExposure(eRes.data);
      setInterventions(invRes.data);
      setFederatedData(fedRes.data);
    } catch (err) {
      console.warn("Backend API not reachable yet, loading fallback state:", err);
      // Demo Fallback State
      setHotspots([
        {
          id: "H1042",
          title: "Industrial Corridor Anomaly #H1042",
          city: selectedCity,
          latitude: 17.4401,
          longitude: 78.3489,
          radius_km: 1.8,
          severity: "CRITICAL",
          status: "ACTIVE",
          event_category: "Industrial smoke",
          confidence_score: 0.91,
          probable_source: "Industrial Activity",
          source_confidence: 0.87,
          current_pm25: 146.0,
          current_pm10: 218.0,
          current_aqi: 245,
          evidence_list: [
            "PM2.5 increased 42% above baseline",
            "NO2 anomaly detected near chemical zone",
            "Sentinel-5P TROPOMI satellite NO2 plume correlation",
            "Low wind velocity (6 km/h SW)",
            "14 citizen smoke reports verified nearby"
          ],
          contributing_report_count: 14,
          first_detected_at: new Date().toISOString(),
          last_updated_at: new Date().toISOString()
        }
      ]);

      setForecastHorizons([
        { horizon_hours: 1, predicted_pm25: 158.0, predicted_pm10: 232.0, predicted_aqi: 262, confidence_lower: 148.0, confidence_upper: 168.0 },
        { horizon_hours: 3, predicted_pm25: 172.0, predicted_pm10: 250.0, predicted_aqi: 285, confidence_lower: 158.0, confidence_upper: 186.0 },
        { horizon_hours: 6, predicted_pm25: 142.0, predicted_pm10: 210.0, predicted_aqi: 238, confidence_lower: 128.0, confidence_upper: 156.0 },
        { horizon_hours: 12, predicted_pm25: 110.0, predicted_pm10: 165.0, predicted_aqi: 195, confidence_lower: 96.0, confidence_upper: 124.0 },
        { horizon_hours: 24, predicted_pm25: 85.0, predicted_pm10: 130.0, predicted_aqi: 160, confidence_lower: 72.0, confidence_upper: 98.0 }
      ]);

      setInterventions([
        {
          id: "INV-1001",
          incident_number: "INC-2041",
          hotspot_id: "H1042",
          title: "Industrial Emissions Inspection & Compliance Mandate",
          assigned_department: "State Pollution Control Board",
          assigned_officer: "Inspector R. Sharma",
          priority: "CRITICAL",
          status: "UNDER_INVESTIGATION",
          recommended_action: "1. Deploy field inspection team immediately.\n2. Issue compliance notice.\n3. Issue health advisory for primary schools.",
          action_taken_notes: "Field inspection team dispatched. Air sampling initiated.",
          exposed_population: 18420,
          exposed_schools: 4,
          exposed_hospitals: 1,
          risk_index: 85.4,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

      setFederatedData({
        current_round: 12,
        global_accuracy: 89.4,
        global_loss: 0.142,
        participating_cities: ["Hyderabad", "Bengaluru", "Chennai"],
        city_metrics: [
          { city: "Hyderabad", sample_count: 14200, local_loss: 0.138, local_accuracy: 90.2, data_privacy: "Zero Raw Data Shared" },
          { city: "Bengaluru", sample_count: 11800, local_loss: 0.145, local_accuracy: 88.6, data_privacy: "Zero Raw Data Shared" },
          { city: "Chennai", sample_count: 9400, local_loss: 0.151, local_accuracy: 87.9, data_privacy: "Zero Raw Data Shared" }
        ],
        aggregation_strategy: "FedAvg",
        status: "OPERATIONAL",
        last_updated: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCity]);

  // Simulation timer loop
  useEffect(() => {
    let interval: any = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimulationStep(prev => prev + 1);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating]);

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setPortal('authority');
    axios.post('/api/v1/simulation/start').catch(() => {});
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
    axios.post('/api/v1/simulation/stop').catch(() => {});
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">

      {/* Top Header Navigation */}
      <Navigation
        currentPortal={currentPortal}
        setPortal={setPortal}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        onRunDemoScenario={handleStartSimulation}
        isSimulating={isSimulating}
      />

      {/* Live Simulation Banner Controller */}
      <SimulationController
        isSimulating={isSimulating}
        currentStep={simulationStep}
        onStop={handleStopSimulation}
        onStart={handleStartSimulation}
      />

      {/* Main App Body */}
      <main className="flex-1">
        {currentPortal === 'citizen' && (
          <div>
            {citizenView === 'home' && (
              <CitizenHome
                city={selectedCity}
                hotspots={hotspots}
                onOpenReportForm={() => setCitizenView('report')}
              />
            )}

            {citizenView === 'report' && (
              <ReportPollutionForm
                city={selectedCity}
                onReportSubmitted={() => {
                  fetchData();
                  setCitizenView('home');
                }}
                onCancel={() => setCitizenView('home')}
              />
            )}

            {citizenView === 'hotspots' && (
              <HotspotsList hotspots={hotspots} />
            )}
          </div>
        )}

        {currentPortal === 'authority' && (
          <CommandCenter
            city={selectedCity}
            hotspots={hotspots}
            infrastructure={infrastructure}
            horizons={forecastHorizons}
            exposure={exposure}
            interventions={interventions}
            federatedData={federatedData}
            onRefreshData={fetchData}
          />
        )}

        {currentPortal === 'admin' && (
          <SystemHealth />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-navy-900 border-t border-command-border py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AERIS © 2026 AI Environmental Risk & Intelligence System</span>
          <span className="font-mono text-sky-400/80">From environmental signals to actionable climate intelligence.</span>
        </div>
      </footer>

    </div>
  );
};

export default App;
