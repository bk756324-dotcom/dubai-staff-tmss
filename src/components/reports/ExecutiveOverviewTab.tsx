import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Bus,
  Users,
  ShieldCheck,
  Wrench,
  DollarSign,
  ArrowRight,
  Info,
  Layers,
  Award,
} from 'lucide-react';
import { exportToCsv } from '../../utils/exportCsv.js';

interface ExecutiveOverviewProps {
  data: any;
  onNavigate: (path: string) => void;
}

export const ExecutiveOverviewTab: React.FC<ExecutiveOverviewProps> = ({ data, onNavigate }) => {
  if (!data || !data.kpis) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
        <Info className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-600">No report data found for the selected period.</p>
      </div>
    );
  }

  const { kpis, trends, tripStatusFunnel, actionableRisks, dateRange } = data;
  const { operations, fleet, drivers, passengers, compliance, maintenance, salik, scorecard } = kpis;

  const handleExportExecutiveSummary = () => {
    const summaryRows = [
      { metric: 'Total Trips Operated', value: operations.totalTrips, benchmark: 'N/A', category: 'Operations' },
      { metric: 'Completed Trips', value: operations.completedTrips, benchmark: 'N/A', category: 'Operations' },
      { metric: 'On-Time Performance Rate', value: `${operations.onTimePerformanceRate}%`, benchmark: '98.0% (SLA)', category: 'Operations' },
      { metric: 'Delay Rate (>5 mins)', value: `${operations.delayRate}%`, benchmark: '< 2.0%', category: 'Operations' },
      { metric: 'Trip Cancellation Rate', value: `${operations.cancellationRate}%`, benchmark: '< 0.5%', category: 'Operations' },
      { metric: 'Total Fleet Size', value: fleet.totalVehicles, benchmark: 'N/A', category: 'Fleet' },
      { metric: 'Fleet Utilization Rate', value: `${fleet.fleetUtilizationRate}%`, benchmark: '85.0%', category: 'Fleet' },
      { metric: 'Vehicle Standby Availability', value: `${fleet.vehicleAvailabilityRate}%`, benchmark: '15.0%', category: 'Fleet' },
      { metric: 'Total Registered Drivers', value: drivers.totalDrivers, benchmark: 'N/A', category: 'Drivers' },
      { metric: 'Active Duty Drivers', value: drivers.activeDrivers, benchmark: 'N/A', category: 'Drivers' },
      { metric: 'Driver Safety Rating', value: drivers.averageSafetyScore, benchmark: '4.80 / 5.0', category: 'Drivers' },
      { metric: 'Active Corporate Passengers', value: passengers.totalActivePassengers, benchmark: 'N/A', category: 'Passengers' },
      { metric: 'Passengers Transported', value: passengers.passengersTransported, benchmark: 'N/A', category: 'Passengers' },
      { metric: 'Average Fleet Seat Occupancy', value: `${passengers.averageOccupancyRate}%`, benchmark: '75.0%', category: 'Passengers' },
      { metric: 'Mulkiya & Permit Compliance Rate', value: `${compliance.complianceRate}%`, benchmark: '100.0%', category: 'Compliance' },
      { metric: 'Expiring Documents (<= 30d)', value: compliance.expiringDocs, benchmark: '0', category: 'Compliance' },
      { metric: 'Expired Documents', value: compliance.expiredDocs, benchmark: '0', category: 'Compliance' },
      { metric: 'Open Maintenance Work Orders', value: maintenance.openWorkOrders, benchmark: '< 2', category: 'Maintenance' },
      { metric: 'Overdue Maintenance Orders', value: maintenance.overdueWorkOrders, benchmark: '0', category: 'Maintenance' },
      { metric: 'Total Maintenance Spend (AED)', value: `${maintenance.totalMaintenanceCostAed.toLocaleString()} AED`, benchmark: 'N/A', category: 'Maintenance' },
      { metric: 'Salik Toll Highway Spend (AED)', value: `${salik.totalSalikSpendAed.toLocaleString()} AED`, benchmark: 'N/A', category: 'Financial / Tolls' },
      { metric: 'Operational Performance Score', value: `${scorecard.operationalPerformanceScore} / 100`, benchmark: '95.0', category: 'Executive Scorecard' },
    ];

    exportToCsv(`Dubai_TMS_Executive_Summary_${dateRange.startDate}_to_${dateRange.endDate}`, summaryRows, [
      { key: 'category', header: 'Category' },
      { key: 'metric', header: 'Key Performance Metric' },
      { key: 'value', header: 'Recorded Value' },
      { key: 'benchmark', header: 'Contractual / Ops Benchmark' },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Scorecard & Executive Status */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center relative z-10">
          {/* Performance Score Pillar */}
          <div className="flex items-center gap-5 border-b lg:border-b-0 lg:border-r border-slate-700/60 pb-6 lg:pb-0 lg:pr-6">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  {scorecard.operationalPerformanceScore}
                </span>
                <span className="text-[10px] tracking-wider uppercase text-emerald-300/80">/ 100</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Overall Operations Score
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {scorecard.status === 'EXCELLENT'
                  ? 'Exceeding Contractual SLAs'
                  : scorecard.status === 'SATISFACTORY'
                  ? 'Meeting Core Baselines'
                  : 'Action Required on Flagged SLAs'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Multi-factor composite based on verified GPS trips, fleet Mulkiya validity, and schedule accuracy.
              </p>
            </div>
          </div>

          {/* Quick High-Impact Metrics */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            <div className="bg-slate-800/80 backdrop-blur-xs rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>On-Time Performance (SLA)</span>
                <span className="text-emerald-400 font-semibold">Target: 98%</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono">{operations.onTimePerformanceRate}%</span>
                {trends.onTimePerformance && (
                  <span className={`text-xs flex items-center font-medium ${trends.onTimePerformance.direction === 'UP' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trends.onTimePerformance.direction === 'UP' ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                    {trends.onTimePerformance.changePctPoints > 0 ? `+${trends.onTimePerformance.changePctPoints}` : trends.onTimePerformance.changePctPoints} pp
                  </span>
                )}
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(operations.onTimePerformanceRate, 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xs rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Fleet Utilization</span>
                <span className="text-emerald-400 font-semibold">{fleet.activeVehicles} on transit</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono">{fleet.fleetUtilizationRate}%</span>
                <span className="text-xs text-slate-400">({fleet.totalVehicles} total fleet)</span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(fleet.fleetUtilizationRate, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Risks & Critical Operational Alerts */}
      {actionableRisks && actionableRisks.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h4 className="text-sm font-bold text-amber-900">
                Actionable Operations Attention Items ({actionableRisks.length})
              </h4>
            </div>
            <span className="text-xs font-medium text-amber-700">Real-time DB triggers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {actionableRisks.map((risk: any) => (
              <div
                key={risk.id}
                className="bg-white rounded-lg p-3.5 border border-amber-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">{risk.title}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        risk.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : risk.severity === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">{risk.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate(risk.actionPath)}
                  className="mt-3 inline-flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 group"
                >
                  <span>{risk.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Categorized Metric Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Operations KPI Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Trips & Dispatch</h4>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500">{operations.totalTrips} runs</span>
          </div>

          <div className="mt-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Completed On-Schedule</span>
              <span className="font-semibold text-slate-900 font-mono">{operations.completedTrips}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">In Transit / Boarding</span>
              <span className="font-semibold text-blue-600 font-mono">{operations.activeTrips}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Delayed (&gt;5 mins)</span>
              <span className={`font-semibold font-mono ${operations.delayedTrips > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                {operations.delayedTrips} ({operations.delayRate}%)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Cancelled Runs</span>
              <span className={`font-semibold font-mono ${operations.cancelledTrips > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                {operations.cancelledTrips}
              </span>
            </div>
          </div>
        </div>

        {/* Fleet KPI Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Bus className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Fleet Assets</h4>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500">{fleet.totalVehicles} units</span>
          </div>

          <div className="mt-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Active On Route</span>
              <span className="font-semibold text-emerald-600 font-mono">{fleet.activeVehicles}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Standby Available</span>
              <span className="font-semibold text-slate-900 font-mono">{fleet.availableVehicles}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Under Workshop Mnt</span>
              <span className={`font-semibold font-mono ${fleet.maintenanceVehicles > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                {fleet.maintenanceVehicles}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Fleet Availability</span>
              <span className="font-semibold text-slate-900 font-mono">{fleet.vehicleAvailabilityRate}%</span>
            </div>
          </div>
        </div>

        {/* Passenger & Occupancy KPI Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Passenger Flow</h4>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500">{passengers.totalActivePassengers} active</span>
          </div>

          <div className="mt-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Total Passenger Trips</span>
              <span className="font-semibold text-slate-900 font-mono">{passengers.passengersTransported}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Avg Seat Occupancy</span>
              <span className="font-semibold text-purple-600 font-mono">{passengers.averageOccupancyRate}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Active Driver Pool</span>
              <span className="font-semibold text-slate-900 font-mono">{drivers.activeDrivers} / {drivers.totalDrivers}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Driver Safety Index</span>
              <span className="font-semibold text-slate-900 font-mono">{drivers.averageSafetyScore} / 5.0</span>
            </div>
          </div>
        </div>

        {/* Compliance & Financial / Salik Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Compliance & Tolls</h4>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-600">{compliance.complianceRate}%</span>
          </div>

          <div className="mt-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Valid Mulkiyas/Permits</span>
              <span className="font-semibold text-slate-900 font-mono">{compliance.validDocs} / {compliance.totalTrackedDocs}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Expiring (&le;30d)</span>
              <span className={`font-semibold font-mono ${compliance.expiringDocs > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                {compliance.expiringDocs}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Mnt Spend (Period)</span>
              <span className="font-semibold text-slate-900 font-mono">{maintenance.totalMaintenanceCostAed.toLocaleString()} AED</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Salik Toll Spend</span>
              <span className="font-semibold text-slate-900 font-mono">{salik.totalSalikSpendAed.toLocaleString()} AED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Scorecard Breakdown & Operational Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transparent Scorecard Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Scorecard Calculation Framework</h4>
              <p className="text-xs text-slate-500">
                Transparent weighted operational formula with zero opaque estimations.
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono">
              Formula: Weighted Average
            </span>
          </div>

          <div className="space-y-3">
            {scorecard.components.map((c: any) => (
              <div key={c.name} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{c.name}</span>
                    <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono">
                      Weight: {c.weightPercent}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-500 text-[11px]">{c.formula}</span>
                    <span className="font-bold text-slate-900">{c.score}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      c.score >= 90 ? 'bg-emerald-500' : c.score >= 75 ? 'bg-sky-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(c.score, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Funnel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Trip Dispatch Lifecycle Funnel</h4>
                <p className="text-xs text-slate-500">Transit progression for selected period</p>
              </div>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3">
              {tripStatusFunnel.map((item: any) => (
                <div key={item.stage} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-slate-700">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleExportExecutiveSummary}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Executive KPI Summary (CSV)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
