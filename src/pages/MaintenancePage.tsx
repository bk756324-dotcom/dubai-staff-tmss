import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Bus,
  FileText,
  Download,
  Eye,
  Check,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { MaintenanceRecord, MaintenanceStatus } from '../types/index.js';
import { CreateMaintenanceModal } from '../components/maintenance/CreateMaintenanceModal.js';
import { CompleteMaintenanceModal } from '../components/maintenance/CompleteMaintenanceModal.js';
import { MaintenanceDetailModal } from '../components/maintenance/MaintenanceDetailModal.js';
import { useToast } from '../context/ToastContext.js';
import { useI18n } from '../context/I18nContext.js';

interface MaintenancePageProps {
  navigate: (path: string) => void;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({ navigate }) => {
  const { t } = useI18n();
  const toast = useToast();

  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('ALL');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  const fetchMaintenance = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (priorityFilter !== 'ALL') params.append('priority', priorityFilter);
      if (serviceTypeFilter !== 'ALL') params.append('serviceType', serviceTypeFilter);
      if (searchQuery) params.append('q', searchQuery);

      const res = await fetch(`/api/maintenance?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.data || []);
        setSummary(data.summary || {});
      }
    } catch (err) {
      console.error('Error fetching maintenance records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, [statusFilter, priorityFilter, serviceTypeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMaintenance();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this maintenance record?')) return;

    try {
      const res = await fetch(`/api/maintenance/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.info('Record Deleted', 'Maintenance record removed.');
        fetchMaintenance();
      }
    } catch (err) {
      toast.error('Delete Failed', 'Error deleting maintenance record.');
    }
  };

  const handleExportCsv = () => {
    if (records.length === 0) {
      toast.info('No Data', 'No maintenance records to export.');
      return;
    }

    const headers = ['Record ID', 'Vehicle', 'Service Type', 'Priority', 'Status', 'Date', 'Cost (AED)', 'Workshop', 'Technician', 'Notes'];
    const rows = records.map((r) => [
      r.id,
      r.vehicleNumber,
      r.serviceType,
      r.priority || 'MEDIUM',
      r.status,
      r.date || r.scheduledDate,
      r.costAed || 0,
      `"${r.workshopName || ''}"`,
      `"${r.technicianName || ''}"`,
      `"${r.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dubai_Fleet_Maintenance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report Exported', 'Maintenance report exported successfully.');
  };

  return (
    <div id="maintenance-management-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-500 uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4 text-orange-500" />
            <span>{t('fleet_care', 'Fleet Health & Safety')}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('vehicle_maintenance', 'Vehicle Maintenance & Workshop Orders')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Log preventive services, AC overhauls, brake replacements, and RTA annual inspection certifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Maintenance</span>
          </button>
        </div>
      </div>

      {/* 6 Key Maintenance Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Orders</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {summary?.totalRecords || records.length}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1 font-medium">
            Active Fleet Tracked
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Scheduled</span>
          <div className="text-2xl font-black text-amber-500 mt-1 font-mono">
            {summary?.scheduled || 0}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1">
            Upcoming Bookings
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">In Progress</span>
          <div className="text-2xl font-black text-purple-500 mt-1 font-mono">
            {summary?.inProgress || 0}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1">
            At Workshop Bay
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completed</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {summary?.completed || 0}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1">
            Certified & Released
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Overdue</span>
          <div className="text-2xl font-black text-rose-500 mt-1 font-mono">
            {summary?.overdue || 0}
          </div>
          <span className="text-[11px] text-rose-500 dark:text-rose-400 mt-auto pt-1 font-semibold">
            Urgent Action
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Spend YTD</span>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {summary?.totalSpendAed ? `${(summary.totalSpendAed / 1000).toFixed(1)}k` : '0'} <span className="text-xs text-slate-400 font-normal">AED</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1">
            Fleet Operations Cost
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by vehicle plate, workshop, description, invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </form>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="OVERDUE">Overdue</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          {/* Service Type Filter */}
          <select
            value={serviceTypeFilter}
            onChange={(e) => setServiceTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="ALL">All Service Types</option>
            <option value="PREVENTIVE">Preventive Maintenance</option>
            <option value="OIL_CHANGE">Oil & Filter Change</option>
            <option value="BRAKE_SERVICE">Brake Service</option>
            <option value="TIRE_SERVICE">Tire Service</option>
            <option value="AC_OVERHAUL">AC Overhaul</option>
            <option value="RTA_INSPECTION">RTA Inspection</option>
            <option value="REPAIR">Repair</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
              setPriorityFilter('ALL');
              setServiceTypeFilter('ALL');
              fetchMaintenance();
            }}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset Filters"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Maintenance Orders Table */}
      <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Work Order / Vehicle</th>
                <th className="py-3 px-4">Service Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Scheduled / Done</th>
                <th className="py-3 px-4">Cost (AED)</th>
                <th className="py-3 px-4">Workshop</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Wrench className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold">No maintenance records found.</p>
                    <p className="text-[11px] mt-0.5">Click "Schedule Maintenance" above to create an order.</p>
                  </td>
                </tr>
              ) : (
                records.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      onClick={() => {
                        setSelectedRecord(item);
                        setIsDetailOpen(true);
                      }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
                            <Bus className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {item.vehicleNumber}
                            </span>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {item.id.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {item.serviceType.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
                        {item.description}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.priority === 'CRITICAL'
                              ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'
                              : item.priority === 'HIGH'
                              ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300'
                              : item.priority === 'MEDIUM'
                              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {item.priority || 'MEDIUM'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'COMPLETED'
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                              : item.status === 'IN_PROGRESS'
                              ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
                              : item.status === 'OVERDUE'
                              ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'
                              : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {item.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3" />}
                          {item.status === 'IN_PROGRESS' && <Wrench className="w-3 h-3 animate-spin" />}
                          {item.status === 'OVERDUE' && <AlertTriangle className="w-3 h-3" />}
                          <span>{item.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-mono">
                        {item.completedDate || item.scheduledDate || item.date}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {item.costAed ? `${item.costAed.toLocaleString()} AED` : '—'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-[150px] truncate">
                        {item.workshopName || item.vendor || 'Tasjeel Commercial'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status !== 'COMPLETED' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRecord(item);
                                setIsCompleteOpen(true);
                              }}
                              className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 font-semibold text-[11px] transition-colors"
                              title="Sign Off & Complete Order"
                            >
                              Sign Off
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecord(item);
                              setIsDetailOpen(true);
                            }}
                            className="p-1.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="p-1.5 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateMaintenanceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchMaintenance}
      />

      <CompleteMaintenanceModal
        record={selectedRecord}
        isOpen={isCompleteOpen}
        onClose={() => setIsCompleteOpen(false)}
        onSuccess={fetchMaintenance}
      />

      <MaintenanceDetailModal
        record={selectedRecord}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onCompleteOrder={(rec) => {
          setSelectedRecord(rec);
          setIsCompleteOpen(true);
        }}
      />
    </div>
  );
};
