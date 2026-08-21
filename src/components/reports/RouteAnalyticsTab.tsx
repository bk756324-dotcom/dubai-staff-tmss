import React, { useState, useMemo } from 'react';
import { Route as RouteIcon, Search, Download, ArrowUpDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { exportToCsv } from '../../utils/exportCsv.js';

interface RouteAnalyticsTabProps {
  data: any;
}

export const RouteAnalyticsTab: React.FC<RouteAnalyticsTabProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [occupancyFilter, setOccupancyFilter] = useState('ALL');
  const [sortField, setSortField] = useState<string>('occupancyPercent');
  const [sortAsc, setSortAsc] = useState(false);

  const routes = data?.routes || [];

  const filteredRoutes = useMemo(() => {
    return routes.filter((r: any) => {
      const matchSearch =
        r.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.routeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.clientCompanyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.destination.toLowerCase().includes(searchTerm.toLowerCase());

      const matchOccupancy = occupancyFilter === 'ALL' || r.occupancyCategory === occupancyFilter;
      return matchSearch && matchOccupancy;
    }).sort((a: any, b: any) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [routes, searchTerm, occupancyFilter, sortField, sortAsc]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCsv = () => {
    exportToCsv('Dubai_Route_Performance_Report', filteredRoutes, [
      { key: 'routeCode', header: 'Route Code' },
      { key: 'routeName', header: 'Route Name' },
      { key: 'clientCompanyName', header: 'Client Organization' },
      { key: 'origin', header: 'Origin' },
      { key: 'destination', header: 'Destination' },
      { key: 'distanceKm', header: 'Distance (KM)' },
      { key: 'totalTrips', header: 'Trips' },
      { key: 'completedTrips', header: 'Completed' },
      { key: 'delayedTrips', header: 'Delayed' },
      { key: 'onTimePercent', header: 'On-Time (%)' },
      { key: 'passengerCount', header: 'Total Passengers' },
      { key: 'vehicleCapacity', header: 'Vehicle Capacity' },
      { key: 'occupancyPercent', header: 'Occupancy Rate (%)' },
      { key: 'occupancyCategory', header: 'Capacity Status' },
      { key: 'avgDelayMinutes', header: 'Avg Delay (Mins)' },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Route Summary Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Active Dubai Corridors</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{routes.length} Dedicated Lines</div>
          <div className="text-xs text-slate-500 mt-1">DIP, JAFZA, DXB, Al Quoz</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Avg Fleet Occupancy</div>
          <div className="text-2xl font-bold font-mono text-purple-600 mt-1">
            {data?.summary?.avgOccupancyPercent || 78.4}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Across all active contracts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Capacity Risk Routes (&gt;85%)</div>
          <div className="text-2xl font-bold font-mono text-rose-600 mt-1">
            {routes.filter((r: any) => r.occupancyCategory === 'CAPACITY_RISK').length} Lines
          </div>
          <div className="text-xs text-rose-600 mt-1">Require vehicle up-sizing</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Underutilized Routes (&lt;40%)</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {routes.filter((r: any) => r.occupancyCategory === 'UNDERUTILIZED').length} Lines
          </div>
          <div className="text-xs text-amber-600 mt-1">Candidates for consolidation</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search route name, corridor, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <select
            value={occupancyFilter}
            onChange={(e) => setOccupancyFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-700 font-medium"
          >
            <option value="ALL">All Occupancy Tiers</option>
            <option value="CAPACITY_RISK">Capacity Risk (&gt;85%)</option>
            <option value="EFFICIENT">Optimal / Efficient (40-85%)</option>
            <option value="UNDERUTILIZED">Underutilized (&lt;40%)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Routes CSV</span>
        </button>
      </div>

      {/* Route Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('routeName')}>
                  <div className="flex items-center gap-1.5">
                    <span>Route & Client</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Corridor Corridor</th>
                <th className="py-3.5 px-4">Assigned Vehicle</th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('totalTrips')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Trips</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('passengerCount')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Passengers</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('occupancyPercent')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Occupancy</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('onTimePercent')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>On-Time</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Capacity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRoutes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No routes found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRoutes.map((r: any) => (
                  <tr key={r.routeId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{r.routeName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {r.routeCode} &bull; {r.clientCompanyName}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{r.origin} &rarr; {r.destination}</div>
                      <div className="text-[11px] text-slate-500">{r.distanceKm} km transit corridor</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-medium text-slate-800">{r.assignedVehicleNumber}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                      {r.totalTrips}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                      {r.passengerCount}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span
                        className={`font-semibold ${
                          r.occupancyPercent > 85
                            ? 'text-rose-600'
                            : r.occupancyPercent < 40
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {r.occupancyPercent}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span className={`font-semibold ${r.onTimePercent >= 98 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {r.onTimePercent}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.occupancyCategory === 'CAPACITY_RISK'
                            ? 'bg-rose-100 text-rose-800'
                            : r.occupancyCategory === 'UNDERUTILIZED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {r.occupancyCategory.replace('_', ' ')}
                      </span>
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
