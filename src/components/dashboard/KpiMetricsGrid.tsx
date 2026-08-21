import React from 'react';
import {
  Bus,
  Clock,
  Users,
  CalendarDays,
  ShieldCheck,
  Fuel,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '../ui/Card.js';

interface KpiMetricsGridProps {
  systemStats?: any;
  kpiData?: any;
  onNavigate?: (path: string) => void;
}

export const KpiMetricsGrid: React.FC<KpiMetricsGridProps> = ({ systemStats, kpiData, onNavigate }) => {
  const fleet = kpiData?.fleetSummary || {
    totalVehicles: 28,
    onTrip: 18,
    available: 8,
    underMaintenance: 2,
    utilizationRatePercent: 92,
  };

  const operations = kpiData?.operationsSummary || {
    totalClients: 14,
    activeContractsAed: 1560000,
    todayTripsCount: 38,
    onTimePerformancePercent: 98.4,
    complianceAlertsCount: 3,
  };

  const metrics = [
    {
      id: 'active-fleet',
      label: 'Fleet in Transit',
      value: `${fleet.onTrip} / ${fleet.totalVehicles || 28}`,
      subtext: `${fleet.available} Available • ${fleet.underMaintenance} In Service`,
      trend: `${fleet.utilizationRatePercent}% Utilization`,
      trendPositive: true,
      icon: <Bus className="w-5 h-5 text-orange-500" />,
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      progress: Math.min(100, Math.round(((fleet.onTrip || 18) / (fleet.totalVehicles || 28)) * 100)),
      progressBarColor: 'bg-orange-500',
      link: '/app/fleet',
    },
    {
      id: 'on-time-dispatch',
      label: 'On-Time Performance',
      value: `${operations.onTimePerformancePercent}%`,
      subtext: 'Average departure delay < 2.1 mins',
      trend: '+0.8% vs last month',
      trendPositive: true,
      icon: <Clock className="w-5 h-5 text-emerald-500" />,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      progress: 98,
      progressBarColor: 'bg-emerald-500',
      link: '/app/trips',
    },
    {
      id: 'daily-passengers',
      label: 'Commuters Transported',
      value: '1,420',
      subtext: 'Across 14 Dubai Corporate Contracts',
      trend: '100% RFID Verified',
      trendPositive: true,
      icon: <Users className="w-5 h-5 text-blue-500" />,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      progress: 88,
      progressBarColor: 'bg-blue-500',
      link: '/app/passengers',
    },
    {
      id: 'daily-trips',
      label: 'Today’s Dispatched Trips',
      value: `${operations.todayTripsCount || 38}`,
      subtext: '24 Completed • 12 Active • 2 Upcoming',
      trend: 'Peak Morning Shift',
      trendPositive: true,
      icon: <CalendarDays className="w-5 h-5 text-indigo-500" />,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      progress: 74,
      progressBarColor: 'bg-indigo-500',
      link: '/app/trips',
    },
    {
      id: 'compliance-watchdog',
      label: 'RTA & Permits Watchdog',
      value: `${operations.complianceAlertsCount || 3} Renewals`,
      subtext: '1 Mulkiya & 2 RTA Driver Cards ≤30d',
      trend: 'Action Required',
      trendPositive: false,
      icon: <ShieldCheck className="w-5 h-5 text-amber-500" />,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      progress: 30,
      progressBarColor: 'bg-amber-500',
      link: '/app/compliance',
    },
    {
      id: 'safety-rating',
      label: 'Captain Safety Score',
      value: '4.93 / 5.0',
      subtext: 'Zero speeding or harsh braking alerts',
      trend: 'Top Tier Rating',
      trendPositive: true,
      icon: <TrendingUp className="w-5 h-5 text-teal-500" />,
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      progress: 98,
      progressBarColor: 'bg-teal-500',
      link: '/app/drivers',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {metrics.map((m) => (
        <Card
          key={m.id}
          onClick={() => onNavigate && m.link && onNavigate(m.link)}
          className={`p-4 border-slate-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
            onNavigate ? 'cursor-pointer hover:border-orange-300 group' : ''
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider line-clamp-1 group-hover:text-orange-600 transition-colors">
                {m.label}
              </span>
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0 group-hover:bg-orange-50 transition-colors">
                {m.icon}
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-heading group-hover:text-orange-600 transition-colors">
                {m.value}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight mb-3">
              {m.subtext}
            </p>
          </div>

          <div>
            {/* Mini Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${m.progressBarColor}`}
                style={{ width: `${m.progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-semibold">
              <span className={`px-1.5 py-0.5 rounded border ${m.badgeColor}`}>
                {m.trend}
              </span>
              <span className="text-slate-400 font-mono">{m.progress}%</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
