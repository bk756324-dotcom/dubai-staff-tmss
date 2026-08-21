import React from 'react';
import { Wrench, DollarSign, AlertTriangle, CheckCircle, Clock, Download } from 'lucide-react';
import { exportToCsv } from '../../utils/exportCsv.js';

interface MaintenanceAnalyticsTabProps {
  data: any;
}

export const MaintenanceAnalyticsTab: React.FC<MaintenanceAnalyticsTabProps> = ({ data }) => {
  const summary = data?.summary || {};
  const byServiceType = data?.byServiceType || {};
  const byVehicle = data?.byVehicle || [];
  const recentWorkOrders = data?.recentWorkOrders || [];

  const handleExportWorkOrders = () => {
    exportToCsv('Dubai_Fleet_Maintenance_Logs', recentWorkOrders, [
      { key: 'vehicleNumber', header: 'Vehicle Number' },
      { key: 'serviceType', header: 'Service Type' },
      { key: 'description', header: 'Work Performed / Diagnostic' },
      { key: 'status', header: 'Work Order Status' },
      { key: 'garageName', header: 'Authorized Service Center' },
      { key: 'costAed', header: 'Cost (AED)' },
      { key: 'date', header: 'Service Date' },
      { key: 'nextServiceDueKm', header: 'Next Service Odometer (KM)' },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Maintenance Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Maintenance Spend</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {(summary.totalCostAed || 0).toLocaleString()} AED
          </div>
          <div className="text-xs text-slate-500 mt-1">Avg {(summary.avgCostAed || 0).toLocaleString()} AED / job</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Completed Jobs</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {summary.completedWorkOrders || 0} Work Orders
          </div>
          <div className="text-xs text-slate-500 mt-1">100% Quality Inspected</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Open in Garage</div>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-1">
            {summary.openWorkOrders || 0} Active
          </div>
          <div className="text-xs text-slate-500 mt-1">In progress / Scheduled</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Overdue Maintenance</div>
          <div className="text-2xl font-bold font-mono text-rose-600 mt-1">
            {summary.overdueWorkOrders || 0} Overdue
          </div>
          <div className="text-xs text-rose-600 mt-1">Immediate garage dispatch required</div>
        </div>
      </div>

      {/* Service Type Breakdown & Vehicle Cost Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Type Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <Wrench className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Cost by Service Type</h4>
            </div>
          </div>

          <div className="space-y-3.5">
            {Object.entries(byServiceType).map(([type, val]: [string, any]) => (
              <div key={type} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">{type.replace('_', ' ')}</span>
                  <span className="font-mono font-bold text-slate-900">{val.costAed.toLocaleString()} AED</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{val.count} service event(s)</span>
                  <span>Avg {Math.round(val.costAed / val.count).toLocaleString()} AED</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Cost Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-900">Vehicle Maintenance Cost Log</h4>
            <button
              type="button"
              onClick={handleExportWorkOrders}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Work Orders (CSV)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                  <th className="py-2.5 px-3">Vehicle</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 text-right">Events</th>
                  <th className="py-2.5 px-3 text-right">Total Cost</th>
                  <th className="py-2.5 px-3 text-right">Last Service</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {byVehicle.map((v: any) => (
                  <tr key={v.vehicleId} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{v.vehicleNumber}</td>
                    <td className="py-2.5 px-3 text-slate-600">{v.vehicleType}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold">{v.totalEvents}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {v.totalCostAed.toLocaleString()} AED
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-500">{v.lastServiceDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
