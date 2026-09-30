export type PortalMode = 'citizen' | 'authority' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'citizen' | 'authority' | 'admin';
  city: string;
}

export interface CitizenReport {
  id: string;
  title: string;
  description?: string;
  category: string;
  severity: string;
  latitude: number;
  longitude: number;
  city: string;
  address?: string;
  photo_url?: string;
  cv_detected_event?: string;
  cv_confidence?: number;
  cv_possible_source?: string;
  cv_explanation?: string;
  status: string;
  confidence_score: number;
  created_at: string;
}

export interface Hotspot {
  id: string;
  title: string;
  city: string;
  latitude: number;
  longitude: number;
  radius_km: number;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'INVESTIGATING' | 'CONTROLLED' | 'RESOLVED';
  event_category: string;
  confidence_score: number;
  probable_source: string;
  source_confidence: number;
  current_pm25: number;
  current_pm10: number;
  current_aqi: number;
  current_no2?: number;
  evidence_list: string[];
  contributing_report_count: number;
  first_detected_at: string;
  last_updated_at: string;
}

export interface ForecastHorizon {
  horizon_hours: number;
  predicted_pm25: number;
  predicted_pm10: number;
  predicted_aqi: number;
  predicted_no2?: number;
  confidence_lower: number;
  confidence_upper: number;
}

export interface InfrastructureItem {
  id: string;
  name: string;
  category: 'SCHOOL' | 'HOSPITAL' | 'INDUSTRIAL' | 'RESIDENTIAL';
  city: string;
  latitude: number;
  longitude: number;
  capacity_or_size: number;
  risk_sensitivity: number;
  distance_km?: number;
}

export interface ExposureSummary {
  city: string;
  population_exposed: number;
  schools_affected: number;
  hospitals_affected: number;
  industrial_facilities: number;
  risk_index: number;
  vulnerability_breakdown: {
    pollution_severity_score: number;
    vulnerable_population_density: number;
    sensitive_infrastructure_weight: number;
  };
  nearby_schools: InfrastructureItem[];
  nearby_hospitals: InfrastructureItem[];
  nearby_industrial: InfrastructureItem[];
}

export interface Intervention {
  id: string;
  incident_number: string;
  hotspot_id: string;
  title: string;
  assigned_department: string;
  assigned_officer: string;
  priority: string;
  status: 'DETECTED' | 'VERIFIED' | 'ASSIGNED' | 'UNDER_INVESTIGATION' | 'ACTION_TAKEN' | 'RESOLVED';
  recommended_action?: string;
  action_taken_notes?: string;
  exposed_population: number;
  exposed_schools: number;
  exposed_hospitals: number;
  risk_index: number;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  alert_type: 'CRITICAL' | 'HIGH' | 'INFO';
  city: string;
  hotspot_id?: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  created_at: string;
}

export interface FederatedCityMetric {
  city: string;
  sample_count: number;
  local_loss: number;
  local_accuracy: number;
  data_privacy: string;
}

export interface FederatedStatus {
  current_round: number;
  global_accuracy: number;
  global_loss: number;
  participating_cities: string[];
  city_metrics: FederatedCityMetric[];
  aggregation_strategy: string;
  status: string;
  last_updated: string;
}

export interface CopilotAnswer {
  question: string;
  answer: string;
  sources_used: string[];
  context_data: any;
}
