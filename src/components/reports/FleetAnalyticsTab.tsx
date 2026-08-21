import React, { useState, useMemo } from 'react';
import { Bus, Search, Download, ArrowUpDown, ChevronUp, ChevronDown, CheckCircle, AlertCircle, Wrench } from 'lucide-react';
import { exportToCsv } from '../../utils/exportCsv.js';

interface FleetAnalyticsTabProps {
  data: any;
}

export const FleetAnalyticsTab: React.FC<FleetAnalyticsTabProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState<string>('totalTripsCount');
  const [sortAsc, setSortAsc] = useState(false);

  const vehicles = data?.vehicles || [];

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v: any) => {
      const matchSearch =
        v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.assignedDriverName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = typeFilter === 'ALL' || v.vehicleType === typeFilter;
      const matchStatus = statusFilter === 'ALL' || v.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    }).sort((a: any, b: any) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [vehicles, searchTerm, typeFilter, statusFilter, sortField, sortAsc]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCsv = () => {
    exportToCsv('Dubai_Fleet_Performance_Report', filteredVehicles, [
      { key: 'vehicleNumber', header: 'Vehicle Number' },
      { key: 'registrationNumber', header: 'RTA Registration' },
      { key: 'vehicleType', header: 'Type' },
      { key: 'make', header: 'Make' },
      { key: 'model', header: 'Model' },
      { key: 'capacity', header: 'Capacity (Seats)' },
      { key: 'currentMileageKm', header: 'Odometer (KM)' },
      { key: 'status', header: 'Status' },
      { key: 'assignedDriverName', header: 'Assigned Driver' },
      { key: 'totalTripsCount', header: 'Total Trips' },
      { key: 'completedTripsCount', header: 'Completed Trips' },
      { key: 'passengerTripsCount', header: 'Passenger Trips Transported' },
      { key: 'utilizationPercent', header: 'Utilization Rate (%)' },
      { key: 'maintenanceCount', header: 'Maintenance Events' },
      { key: 'maintenanceCostAed', header: 'Maintenance Spend (AED)' },
      { key: 'salikCostAed', header: 'Salik Toll Cost (AED)' },
    ]);
  };

  const totalCost = filteredVehicles.reduce((acc: number, v: any) => acc + v.maintenanceCostAed + v.salikCostAed, 0);

  return (
    <div className="space-y-6">
      {/* Fleet Summary Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Tracked Fleet</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{vehicles.length} Units</div>
          <div className="text-xs text-emerald-600 mt-1">100% RTA Approved Fleet</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Active on Trips</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {vehicles.filter((v: any) => v.status === 'ON_TRIP').length} Units
          </div>
          <div className="text-xs text-slate-500 mt-1">Real-time GPS Tracking</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">In Garage / Workshop</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {vehicles.filter((v: any) => v.status === 'MAINTENANCE').length} Units
          </div>
          <div className="text-xs text-slate-500 mt-1">Under Scheduled Service</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Fleet Cost (Period)</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {totalCost.toLocaleString()} AED
          </div>
          <div className="text-xs text-slate-500 mt-1">Maintenance & Salik Tolls</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vehicle, plate, make..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Vehicle Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-700 font-medium"
          >
            <option value="ALL">All Vehicle Types</option>
            <option value="COASTER">Toyota Coaster (30 Seats)</option>
            <option value="HIACE">Toyota HiAce (14 Seats)</option>
            <option value="BUS_50">50-Seater Coach</option>
            <option value="BUS_34">34-Seater Standard Bus</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-700 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="AVAILABLE">Available</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Fleet CSV</span>
        </button>
      </div>

      {/* Fleet Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('vehicleNumber')}>
                  <div className="flex items-center gap-1.5">
                    <span>Vehicle</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Type & Capacity</th>
                <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Assigned Captain</th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('totalTripsCount')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Trips</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('passengerTripsCount')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Passengers</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('utilizationPercent')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Utilization</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('maintenanceCostAed')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Mnt Cost (AED)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('salikCostAed')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Salik Tolls</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No vehicles found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((v: any) => (
                  <tr key={v.vehicleId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 font-mono">{v.vehicleNumber}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{v.registrationNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{v.make} {v.model}</div>
                      <div className="text-[11px] text-slate-500">{v.capacity} Passenger Seats</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          v.status === 'ON_TRIP'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.status === 'AVAILABLE'
                            ? 'bg-sky-100 text-sky-800'
                            : v.status === 'MAINTENANCE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {v.status === 'ON_TRIP' && <CheckCircle className="w-3 h-3" />}
                        {v.status === 'MAINTENANCE' && <Wrench className="w-3 h-3" />}
                        <span>{v.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800">{v.assignedDriverName}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                      {v.totalTripsCount}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                      {v.passengerTripsCount}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span className={`font-semibold ${v.utilizationPercent >= 80 ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {v.utilizationPercent}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-800">
                      {v.maintenanceCostAed > 0 ? `${v.maintenanceCostAed.toLocaleString()} AED` : '0 AED'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-800">
                      {v.salikCostAed > 0 ? `${v.salikCostAed.toLocaleString()} AED` : '0 AED'}
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
