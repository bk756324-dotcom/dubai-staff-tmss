import React from 'react';
import { Users, Clock, Building2, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { exportToCsv } from '../../utils/exportCsv.js';

interface PassengerAnalyticsTabProps {
  data: any;
}

export const PassengerAnalyticsTab: React.FC<PassengerAnalyticsTabProps> = ({ data }) => {
  const shiftDistribution = data?.shiftDistribution || {};
  const clientDistribution = data?.clientDistribution || {};
  const dailyVolume = data?.dailyPassengerVolume || [];
  const occupancyAnalysis = data?.occupancyAnalysis || {};

  const totalRegistered = data?.totalRegisteredPassengers || 0;
  const activePassengers = data?.activePassengers || 0;
  const rfidTagged = data?.rfidTaggedCount || 0;

  const handleExportDailyVolume = () => {
    exportToCsv('Dubai_Daily_Passenger_Transit_Volume', dailyVolume, [
      { key: 'date', header: 'Operating Date' },
      { key: 'passengers', header: 'Boarded Passengers' },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Registered Staff</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{totalRegistered} Commuters</div>
          <div className="text-xs text-emerald-600 mt-1">{activePassengers} Currently Active on Shifts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">RFID Card Adoption</div>
          <div className="text-2xl font-bold font-mono text-purple-600 mt-1">{rfidTagged} Tagged</div>
          <div className="text-xs text-slate-500 mt-1">NFC / RFID automated manifest boarding</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Corporate Clients Served</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {Object.keys(clientDistribution).length} Partners
          </div>
          <div className="text-xs text-slate-500 mt-1">Dedicated corporate contracts</div>
        </div>
      </div>

      {/* Distribution Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shift Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Shift Volume Distribution</h4>
            </div>
            <span className="text-xs text-slate-500">24/7 Operations</span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(shiftDistribution).map(([shift, count]: [string, any]) => {
              const pct = totalRegistered > 0 ? Math.round((count / totalRegistered) * 100) : 0;
              return (
                <div key={shift} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{shift.replace('_', ' ')} SHIFT</span>
                    <span className="font-mono font-bold text-slate-900">{count} staff ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        shift === 'MORNING' ? 'bg-amber-500' : shift === 'EVENING' ? 'bg-indigo-500' : 'bg-slate-700'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Corporate Client Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Building2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Corporate Staff Allocation</h4>
            </div>
            <span className="text-xs text-slate-500">By Employer</span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(clientDistribution).map(([client, count]: [string, any]) => {
              const pct = totalRegistered > 0 ? Math.round((count / totalRegistered) * 100) : 0;
              return (
                <div key={client} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate max-w-[240px]">{client}</span>
                    <span className="font-mono font-bold text-slate-900">{count} staff ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Passenger Volume Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Historical Daily Passenger Transit Flow</h4>
              <p className="text-xs text-slate-500">Boarded commuters aggregate across all Dubai routes</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleExportDailyVolume}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Export Daily Flow (CSV)
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {dailyVolume.map((item: any) => (
            <div key={item.date} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <div className="text-[11px] font-medium text-slate-500 font-mono">{item.date}</div>
              <div className="text-lg font-bold font-mono text-slate-900 mt-1">{item.passengers}</div>
              <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Commuters</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
