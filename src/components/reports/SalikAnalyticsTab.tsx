import React, { useState, useMemo } from 'react';
import { DollarSign, Search, Download, ArrowUpDown, Info, ShieldCheck, MapPin } from 'lucide-react';
import { exportToCsv } from '../../utils/exportCsv.js';

interface SalikAnalyticsTabProps {
  data: any;
}

export const SalikAnalyticsTab: React.FC<SalikAnalyticsTabProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gateFilter, setGateFilter] = useState('ALL');

  const summary = data?.summary || {};
  const byGate = data?.byGate || [];
  const byVehicle = data?.byVehicle || [];
  const byRoute = data?.byRoute || [];
  const transactions = data?.transactions || [];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t: any) => {
      const matchSearch =
        t.tollGateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.clientCompanyName && t.clientCompanyName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchGate = gateFilter === 'ALL' || t.tollGateName === gateFilter;
      return matchSearch && matchGate;
    });
  }, [transactions, searchTerm, gateFilter]);

  const handleExportCsv = () => {
    exportToCsv('Dubai_Salik_Toll_Transactions', filteredTransactions, [
      { key: 'timestamp', header: 'Toll Timestamp' },
      { key: 'tollGateName', header: 'Salik Toll Gate' },
      { key: 'tollGateCode', header: 'Gate Code' },
      { key: 'corridor', header: 'Highway Corridor' },
      { key: 'vehicleNumber', header: 'Vehicle Plate / Unit' },
      { key: 'driverName', header: 'Captain Name' },
      { key: 'routeName', header: 'Assigned Route' },
      { key: 'clientCompanyName', header: 'Corporate Client' },
      { key: 'tagNumber', header: 'Salik RFID Tag Number' },
      { key: 'amountAed', header: 'Toll Amount (AED)' },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            SIMULATED SALIK DATA &bull; UAE Road Toll Telemetry
          </h4>
          <p className="text-xs text-amber-700 mt-0.5">
            Toll transactions are generated from simulated Salik RFID highway gantry telemetry (E11 Sheikh Zayed Road, Airport Tunnel, Al Garhoud Bridge, Al Safa, and Al Barsha gates) for operations cost accounting and billing allocation.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Salik Toll Spend</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {(summary.totalSpendAed || 0).toLocaleString()} AED
          </div>
          <div className="text-xs text-slate-500 mt-1">Rate: 4.00 AED standard gantry pass</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Toll Transactions Logged</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {summary.totalTransactions || 0} Gantry Crossings
          </div>
          <div className="text-xs text-slate-500 mt-1">100% RFID Tag Auto-debited</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Average Salik Cost / Trip</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {summary.avgTollCostPerTrip || 0} AED
          </div>
          <div className="text-xs text-slate-500 mt-1">Allocated to client route cost-centers</div>
        </div>
      </div>

      {/* Cost Breakdown by Gate & Corridor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gate Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Spend by Salik Toll Gantry</h4>
            </div>
            <span className="text-xs text-slate-500 font-mono">4.00 AED/pass</span>
          </div>

          <div className="space-y-3">
            {byGate.map((g: any) => (
              <div key={g.gateName} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-slate-900">{g.gateName}</div>
                  <div className="text-[11px] text-slate-500">{g.corridor} &bull; {g.transactions} passes</div>
                </div>
                <div className="font-mono font-bold text-slate-900 text-sm">
                  {g.spendAed.toFixed(2)} AED
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route Allocation */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-900">Tolls by Route Corridor</h4>
            <span className="text-xs text-slate-500">Billing Recovery</span>
          </div>

          <div className="space-y-3">
            {byRoute.map((r: any) => (
              <div key={r.routeName} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-slate-900">{r.routeName}</div>
                  <div className="text-[11px] text-slate-500">{r.transactions} toll event(s)</div>
                </div>
                <div className="font-mono font-bold text-slate-900 text-sm">
                  {r.spendAed.toFixed(2)} AED
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Transaction Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tag, gate, vehicle, driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <select
              value={gateFilter}
              onChange={(e) => setGateFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-700 font-medium"
            >
              <option value="ALL">All Toll Gates</option>
              {byGate.map((g: any) => (
                <option key={g.gateName} value={g.gateName}>
                  {g.gateName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Salik Log (CSV)</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Toll Gantry</th>
                <th className="py-3.5 px-4">Vehicle</th>
                <th className="py-3.5 px-4">Captain</th>
                <th className="py-3.5 px-4">Client / Route</th>
                <th className="py-3.5 px-4">RFID Tag Number</th>
                <th className="py-3.5 px-4 text-right">Amount (AED)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No Salik toll transactions found for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {tx.timestamp.replace('T', ' ').slice(0, 16)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{tx.tollGateName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{tx.corridor}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{tx.vehicleNumber}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{tx.driverName}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{tx.routeName}</div>
                      <div className="text-[11px] text-slate-500">{tx.clientCompanyName}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{tx.tagNumber}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {tx.amountAed.toFixed(2)} AED
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
