import React, { useState, useMemo } from 'react';
import { Users, Search, Download, ArrowUpDown, Star, ShieldCheck } from 'lucide-react';
import { exportToCsv } from '../../utils/exportCsv.js';

interface DriverAnalyticsTabProps {
  data: any;
}

export const DriverAnalyticsTab: React.FC<DriverAnalyticsTabProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState<string>('totalTrips');
  const [sortAsc, setSortAsc] = useState(false);

  const drivers = data?.drivers || [];

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d: any) => {
      const matchSearch =
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.assignedVehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
      return matchSearch && matchStatus;
    }).sort((a: any, b: any) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [drivers, searchTerm, statusFilter, sortField, sortAsc]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCsv = () => {
    exportToCsv('Dubai_Driver_Performance_Report', filteredDrivers, [
      { key: 'employeeId', header: 'Employee ID' },
      { key: 'name', header: 'Captain Name' },
      { key: 'phone', header: 'Contact' },
      { key: 'licenseNumber', header: 'RTA Permit / License' },
      { key: 'status', header: 'Status' },
      { key: 'assignedVehicleNumber', header: 'Assigned Vehicle' },
      { key: 'totalTrips', header: 'Total Trips' },
      { key: 'completedTrips', header: 'Completed Trips' },
      { key: 'delayedTrips', header: 'Delayed Trips' },
      { key: 'cancelledTrips', header: 'Cancelled Trips' },
      { key: 'onTimePercent', header: 'On-Time Performance (%)' },
      { key: 'passengerTrips', header: 'Passenger Deliveries' },
      { key: 'safetyScore', header: 'Safety Score (Out of 5.0)' },
      { key: 'licenseExpiry', header: 'License Expiry' },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Driver Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Captains</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{drivers.length} Drivers</div>
          <div className="text-xs text-slate-500 mt-1">Full-time RTA Certified</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Active On Trip</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {drivers.filter((d: any) => d.status === 'ON_TRIP').length} Active
          </div>
          <div className="text-xs text-slate-500 mt-1">In transit on route</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Average On-Time Rate</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {data?.summary?.avgOnTimePercent || 98.4}%
          </div>
          <div className="text-xs text-emerald-600 mt-1">Across all shifts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Fleet Safety Score</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1 flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{data?.summary?.avgSafetyScore || 4.93} / 5.0</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Telematics & Passenger ratings</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search captain name, ID, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-700 font-medium"
          >
            <option value="ALL">All Duty Statuses</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="AVAILABLE">Available / Standby</option>
            <option value="INACTIVE">Inactive / Leave</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Drivers CSV</span>
        </button>
      </div>

      {/* Driver Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1.5">
                    <span>Captain Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Contact & License</th>
                <th className="py-3.5 px-4">Assigned Unit</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('totalTrips')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Trips</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('onTimePercent')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>On-Time Rate</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('passengerTrips')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Passengers</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('safetyScore')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Safety Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No drivers found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((d: any) => (
                  <tr key={d.driverId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{d.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{d.employeeId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{d.phone}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{d.licenseNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-medium text-slate-800">{d.assignedVehicleNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          d.status === 'ON_TRIP'
                            ? 'bg-emerald-100 text-emerald-800'
                            : d.status === 'AVAILABLE'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {d.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                      {d.totalTrips}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span className={`font-semibold ${d.onTimePercent >= 98 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {d.onTimePercent}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                      {d.passengerTrips}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <div className="inline-flex items-center gap-1 font-semibold text-slate-900">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{d.safetyScore}</span>
                      </div>
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
