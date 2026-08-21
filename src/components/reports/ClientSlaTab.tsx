import React, { useState, useMemo } from 'react';
import { Building2, Search, Download, ArrowUpDown, ShieldCheck, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';
import { exportToCsv } from '../../utils/exportCsv.js';

interface ClientSlaTabProps {
  data: any;
}

export const ClientSlaTab: React.FC<ClientSlaTabProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [slaFilter, setSlaFilter] = useState('ALL');
  const [sortField, setSortField] = useState<string>('onTimePercent');
  const [sortAsc, setSortAsc] = useState(false);

  const clients = data?.clients || [];
  const summary = data?.summary || {};

  const filteredClients = useMemo(() => {
    return clients.filter((c: any) => {
      const matchSearch =
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSla = slaFilter === 'ALL' || c.slaStatus === slaFilter;
      return matchSearch && matchSla;
    }).sort((a: any, b: any) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [clients, searchTerm, slaFilter, sortField, sortAsc]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCsv = () => {
    exportToCsv('Dubai_Corporate_Clients_SLA_Report', filteredClients, [
      { key: 'companyName', header: 'Company Name' },
      { key: 'industry', header: 'Industry Sector' },
      { key: 'contactPerson', header: 'Key Contact' },
      { key: 'email', header: 'Official Email' },
      { key: 'activeRoutesCount', header: 'Active Routes' },
      { key: 'totalTrips', header: 'Total Trips' },
      { key: 'completedTrips', header: 'Completed Trips' },
      { key: 'delayedTrips', header: 'Delayed Trips' },
      { key: 'cancelledTrips', header: 'Cancelled Trips' },
      { key: 'passengersTransported', header: 'Commuters Delivered' },
      { key: 'contractualSlaTarget', header: 'Contractual SLA Target (%)' },
      { key: 'internalKpiTarget', header: 'Internal Ops KPI Target (%)' },
      { key: 'onTimePercent', header: 'Actual On-Time Achieved (%)' },
      { key: 'slaStatus', header: 'SLA Status' },
      { key: 'contractValueAed', header: 'Contract Value (AED/mo)' },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* SLA Executive Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Corporate Contracts</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{clients.length} Clients</div>
          <div className="text-xs text-slate-500 mt-1">Emaar, Emirates, JAFZA, Al Habtoor</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">SLA Compliant (Target Met)</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {summary.slaMetCount || 0} Accounts
          </div>
          <div className="text-xs text-emerald-600 mt-1">&ge; 98.0% On-Time SLA Met</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Accounts At Risk</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {summary.slaAtRiskCount || 0} Accounts
          </div>
          <div className="text-xs text-amber-600 mt-1">95.0% - 97.9% On-Time Performance</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Contract Value</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {(summary.totalActiveContractValueAed || 0).toLocaleString()} AED/mo
          </div>
          <div className="text-xs text-slate-500 mt-1">Monthly Billing Revenue</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search corporate client, contact, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <select
            value={slaFilter}
            onChange={(e) => setSlaFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-700 font-medium"
          >
            <option value="ALL">All SLA Statuses</option>
            <option value="MET">SLA Met (&ge;98.0%)</option>
            <option value="AT_RISK">At Risk (95.0 - 97.9%)</option>
            <option value="BREACHED">Breached (&lt;95.0%)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Client SLA CSV</span>
        </button>
      </div>

      {/* Client Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('companyName')}>
                  <div className="flex items-center gap-1.5">
                    <span>Corporate Client</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Industry Sector</th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('totalTrips')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Trips</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('passengersTransported')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Passengers</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('onTimePercent')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Actual On-Time</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Contract SLA vs Internal KPI</th>
                <th className="py-3.5 px-4 text-center cursor-pointer hover:bg-slate-100" onClick={() => handleSort('slaStatus')}>
                  <div className="flex items-center justify-center gap-1.5">
                    <span>SLA Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('contractValueAed')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Monthly Value</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No corporate clients found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredClients.map((c: any) => (
                  <tr key={c.clientId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{c.companyName}</div>
                      <div className="text-[11px] text-slate-500">{c.contactPerson} &bull; {c.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800">{c.industry}</span>
                      <div className="text-[11px] text-slate-500">{c.activeRoutesCount} dedicated routes</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                      {c.totalTrips}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                      {c.passengersTransported}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span
                        className={`font-bold text-sm ${
                          c.slaStatus === 'MET'
                            ? 'text-emerald-600'
                            : c.slaStatus === 'AT_RISK'
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {c.onTimePercent}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-600">
                      <div>SLA: <span className="font-semibold text-slate-900">98.0%</span></div>
                      <div>KPI: <span className="font-semibold text-slate-700">99.0%</span></div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.slaStatus === 'MET'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.slaStatus === 'AT_RISK'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {c.slaStatus === 'MET' && <CheckCircle2 className="w-3 h-3" />}
                        {c.slaStatus === 'AT_RISK' && <AlertTriangle className="w-3 h-3" />}
                        {c.slaStatus === 'BREACHED' && <XCircle className="w-3 h-3" />}
                        <span>{c.slaStatus}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {c.contractValueAed.toLocaleString()} AED
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
