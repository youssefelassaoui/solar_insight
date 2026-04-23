export type AnomalySeverity = 'critical' | 'warning' | 'info';
export type AnomalyStatus = 'open' | 'acknowledged' | 'resolved';
export type InverterStatus = 'online' | 'offline' | 'fault' | 'degraded';

export interface Anomaly {
  id: string;
  timestamp: string;
  inverter: string;
  type: string;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  description: string;
  value: number;
  threshold: number;
  unit: string;
}

export interface Inverter {
  id: string;
  name: string;
  status: InverterStatus;
  power: number;       // kW
  efficiency: number;  // %
  temperature: number; // °C
  irradiance: number;  // W/m²
  pr: number;          // Performance Ratio %
  anomalies: number;
  location: string;
}

export interface TimeSeriesPoint {
  time: string;
  value: number;
  expected?: number;
  anomaly?: boolean;
}

export interface KpiMetric {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}
