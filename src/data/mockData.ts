import type { Anomaly, Inverter, TimeSeriesPoint } from '../types';
import { format, subHours, subMinutes } from 'date-fns';

const now = new Date();

export const inverters: Inverter[] = [
  { id: 'INV-01', name: 'Inverter 01', status: 'online', power: 48.2, efficiency: 97.4, temperature: 42, irradiance: 820, pr: 82.1, anomalies: 0, location: 'Block A' },
  { id: 'INV-02', name: 'Inverter 02', status: 'fault', power: 0, efficiency: 0, temperature: 78, irradiance: 815, pr: 0, anomalies: 3, location: 'Block A' },
  { id: 'INV-03', name: 'Inverter 03', status: 'degraded', power: 31.7, efficiency: 88.2, temperature: 58, irradiance: 818, pr: 61.4, anomalies: 2, location: 'Block B' },
  { id: 'INV-04', name: 'Inverter 04', status: 'online', power: 50.1, efficiency: 98.1, temperature: 40, irradiance: 822, pr: 83.6, anomalies: 0, location: 'Block B' },
  { id: 'INV-05', name: 'Inverter 05', status: 'online', power: 47.8, efficiency: 96.9, temperature: 44, irradiance: 819, pr: 81.7, anomalies: 1, location: 'Block C' },
  { id: 'INV-06', name: 'Inverter 06', status: 'offline', power: 0, efficiency: 0, temperature: 25, irradiance: 820, pr: 0, anomalies: 1, location: 'Block C' },
  { id: 'INV-07', name: 'Inverter 07', status: 'online', power: 49.5, efficiency: 97.8, temperature: 41, irradiance: 821, pr: 82.9, anomalies: 0, location: 'Block D' },
  { id: 'INV-08', name: 'Inverter 08', status: 'online', power: 46.3, efficiency: 96.2, temperature: 45, irradiance: 818, pr: 80.4, anomalies: 0, location: 'Block D' },
];

export const anomalies: Anomaly[] = [
  {
    id: 'ANO-001',
    timestamp: format(subMinutes(now, 12), 'yyyy-MM-dd HH:mm'),
    inverter: 'INV-02',
    type: 'Overtemperature',
    severity: 'critical',
    status: 'open',
    description: 'Inverter temperature exceeded critical threshold of 75°C',
    value: 78,
    threshold: 75,
    unit: '°C',
  },
  {
    id: 'ANO-002',
    timestamp: format(subMinutes(now, 34), 'yyyy-MM-dd HH:mm'),
    inverter: 'INV-02',
    type: 'Zero Power Output',
    severity: 'critical',
    status: 'open',
    description: 'No power output detected despite sufficient irradiance',
    value: 0,
    threshold: 5,
    unit: 'kW',
  },
  {
    id: 'ANO-003',
    timestamp: format(subHours(now, 1), 'yyyy-MM-dd HH:mm'),
    inverter: 'INV-02',
    type: 'DC Bus Undervoltage',
    severity: 'critical',
    status: 'acknowledged',
    description: 'DC bus voltage dropped below minimum operating level',
    value: 280,
    threshold: 350,
    unit: 'V',
  },
  {
    id: 'ANO-004',
    timestamp: format(subHours(now, 2), 'yyyy-MM-dd HH:mm'),
    inverter: 'INV-03',
    type: 'Low Performance Ratio',
    severity: 'warning',
    status: 'open',
    description: 'Performance ratio below expected range for current irradiance',
    value: 61.4,
    threshold: 75,
    unit: '%',
  },
  {
    id: 'ANO-005',
    timestamp: format(subHours(now, 3), 'yyyy-MM-dd HH:mm'),
    inverter: 'INV-03',
    type: 'Efficiency Degradation',
    severity: 'warning',
    status: 'open',
    description: 'Conversion efficiency below normal operating range',
    value: 88.2,
    threshold: 94,
    unit: '%',
  },
  {
    id: 'ANO-006',
    timestamp: format(subHours(now, 4), 'yyyy-MM-dd HH:mm'),
    inverter: 'INV-05',
    type: 'String Current Imbalance',
    severity: 'warning',
    status: 'acknowledged',
    description: 'String current deviation exceeds 10% between strings',
    value: 14.2,
    threshold: 10,
    unit: '%',
  },
  {
    id: 'ANO-007',
    timestamp: format(subHours(now, 6), 'yyyy-MM-dd HH:mm'),
    inverter: 'INV-06',
    type: 'Communication Loss',
    severity: 'info',
    status: 'open',
    description: 'SCADA communication lost with inverter',
    value: 0,
    threshold: 1,
    unit: 'conn',
  },
];

export function generateTimeSeries(hours = 24, baseValue = 45, noiseLevel = 5): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  for (let i = hours; i >= 0; i--) {
    const t = subHours(now, i);
    const hour = t.getHours();
    const solarFactor = hour >= 6 && hour <= 18
      ? Math.sin(((hour - 6) / 12) * Math.PI)
      : 0;
    const expected = baseValue * solarFactor;
    const noise = (Math.random() - 0.5) * noiseLevel * solarFactor;
    const isAnomaly = Math.random() < 0.05 && solarFactor > 0.3;
    const value = isAnomaly ? expected * (0.4 + Math.random() * 0.3) : Math.max(0, expected + noise);

    points.push({
      time: format(t, 'HH:mm'),
      value: parseFloat(value.toFixed(1)),
      expected: parseFloat(expected.toFixed(1)),
      anomaly: isAnomaly,
    });
  }
  return points;
}

export const systemTimeSeries = generateTimeSeries(24, 380, 20);

export const kpiData = {
  totalPower: 273.6,
  totalPowerChange: -8.4,
  activePlants: 6,
  totalPlants: 8,
  openAnomalies: 5,
  anomalyChange: 2,
  performanceRatio: 78.3,
  prChange: -3.1,
  irradiance: 820,
  energyToday: 2184,
};
