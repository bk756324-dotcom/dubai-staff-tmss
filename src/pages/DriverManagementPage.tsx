import React, { useState, useEffect, useCallback } from 'react';
import { Driver, Vehicle, Route, DriverStatus } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Select } from '../components/ui/Select.js';
import { Badge, StatusBadge } from '../components/ui/Badge.js';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table.js';
import { LoadingSpinner, EmptyState } from '../components/ui/States.js';
import { Modal } from '../components/ui/Modal.js';
import { DriverModal } from '../components/drivers/DriverModal.js';
import { DriverDetailModal } from '../components/drivers/DriverDetailModal.js';
import {
  UserCheck,
  Plus,
  Search,
  Download,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Star,
  Bus,
  Phone,
  RefreshCw,
  ShieldCheck,
  HeartPulse,
} from 'lucide-react';

interface DriverManagementPageProps {
  navigate: (path: string) => void;
}

export const DriverManagementPage: React.FC<DriverManagementPageProps> = ({ navigate }) => {
  const { apiFetch, user } = useAuth();
  const { showToast } = useToast();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Deactivation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Summary counts
  const [summary, setSummary] = useState({
    total: 0,
    available: 0,
    onTrip: 0,
    onLeave: 0,
    inactive: 0,
    expiringLicenses: 0,
  });

  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'DISPATCHER';

  const loadDriverData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const [drvRes, vehRes, rtRes] = await Promise.all([
        apiFetch(`/api/drivers?${params.toString()}`),
        apiFetch('/api/vehicles'),
        apiFetch('/api/routes'),
      ]);

      if (drvRes && drvRes.success) {
        let list = drvRes.data as Driver[];
        if (selectedCategory !== 'ALL') {
          list = list.filter((d) => d.licenseCategory === selectedCategory);
        }
        setDrivers(list);
        if (drvRes.summary) {
          setSummary(drvRes.summary);
        }
      }

      if (vehRes && vehRes.success) {
        setVehicles(vehRes.data);
      }

      if (rtRes && rtRes.success) {
        setRoutes(rtRes.data);
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: err?.message || 'Failed to fetch driver crew records.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiFetch, searchQuery, selectedStatus, selectedCategory, sortBy, sortOrder, showToast]);

  useEffect(() => {
    loadDriverData();
  }, [loadDriverData]);

  const handleOpenAdd = () => {
    setSelectedDriver(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d: Driver) => {
    setSelectedDriver(d);
    setIsModalOpen(true);
  };

  const handleOpenDetail = (d: Driver) => {
    setSelectedDriver(d);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (d: Driver) => {
    setDriverToDelete(d);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeactivate = async () => {
    if (!driverToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await apiFetch(`/api/drivers/${driverToDelete.id}`, {
        method: 'DELETE',
      });

      if (res && res.success) {
        showToast({
          type: 'success',
          title: 'Crew Updated',
          message: res.message || `Captain ${driverToDelete.name} status updated to INACTIVE.`,
        });
        setIsDeleteModalOpen(false);
        setDriverToDelete(null);
        loadDriverData();
      } else {
        showToast({
          type: 'error',
          title: 'Action Failed',
          message: res?.error || 'Could not deactivate driver.',
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: err?.message || 'Failed to update driver status.',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Quick Status Toggle (e.g. Set On Leave or Set Available)
  const handleQuickStatusChange = async (driver: Driver, nextStatus: DriverStatus) => {
    try {
      const res = await apiFetch(`/api/drivers/${driver.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res && res.success) {
        showToast({
          type: 'success',
          title: 'Status Updated',
          message: `Captain ${driver.name} is now ${nextStatus}.`,
        });
        loadDriverData();
      } else {
        showToast({
          type: 'error',
          title: 'Update Failed',
          message: res?.error || 'Could not update status.',
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: err?.message || 'Failed to update status.',
      });
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (drivers.length === 0) {
      showToast({ type: 'warning', title: 'Export', message: 'No driver records to export.' });
      return;
    }

    const headers = ['Employee ID', 'Name', 'Phone', 'Email', 'License No', 'License Category', 'License Expiry', 'RTA Permit', 'Visa Expiry', 'Status', 'Assigned Bus', 'Safety Rating', 'Total Trips'];
    const rows = drivers.map((d) => [
      d.employeeId,
      d.name,
      d.phone,
      d.email || '',
      d.licenseNumber,
      d.licenseCategory,
      d.licenseExpiry,
      d.rtaCardNumber || 'N/A',
      d.visaExpiry || 'N/A',
      d.status,
      d.assignedVehicleNumber || 'Unassigned',
      d.safetyRating || '5.0',
      d.totalTripsCompleted || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dubai_driver_captains_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({ type: 'success', title: 'Export Generated', message: 'Driver crew manifest downloaded in CSV format.' });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Driver Captains & Crew
            </h1>
            <Badge variant="orange">RTA Certified</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Certified Dubai Heavy Bus captains, RTA permits, safety ratings, shift rosters, and compliance tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadDriverData(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button size="sm" variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-1.5" />
            Export CSV
          </Button>

          {canManage && (
            <Button size="sm" variant="primary" onClick={handleOpenAdd}>
              <Plus className="w-4 h-4 mr-1.5" />
              Enroll Captain
            </Button>
          )}
        </div>
      </div>

      {/* 2. Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Captains</span>
            <UserCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-heading mt-2 font-mono">
            {summary.total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Active Heavy Bus Crew</div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
            <span>Available on Duty</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-900 font-heading mt-2 font-mono">
            {summary.available}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Ready for Immediate Route</div>
        </div>

        <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/40 shadow-xs">
          <div className="flex items-center justify-between text-xs text-orange-700 font-medium">
            <span>Driving Route</span>
            <Bus className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-900 font-heading mt-2 font-mono">
            {summary.onTrip}
          </div>
          <div className="text-[11px] text-orange-600 mt-1">Live in Transit</div>
        </div>

        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 shadow-xs">
          <div className="flex items-center justify-between text-xs text-blue-700 font-medium">
            <span>Rest / On Leave</span>
            <HeartPulse className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-900 font-heading mt-2 font-mono">
            {summary.onLeave}
          </div>
          <div className="text-[11px] text-blue-600 mt-1">Off-Duty & Annual Leave</div>
        </div>

        <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/40 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-amber-700 font-medium">
            <span>Compliance Watch</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-900 font-heading mt-2 font-mono">
            {summary.expiringLicenses}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">Permit Expiring ≤ 30 Days</div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search captain name, ID, phone, license..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={[
              { value: 'ALL', label: 'All License Categories' },
              { value: 'Heavy Bus (Category 6)', label: 'Heavy Bus (Category 6)' },
              { value: 'Light Bus (Category 5)', label: 'Light Bus (Category 5)' },
              { value: 'Heavy Truck / Articulated', label: 'Heavy Truck' },
            ]}
          />

          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Crew Statuses' },
              { value: 'AVAILABLE', label: 'Available on Duty' },
              { value: 'ON_TRIP', label: 'On Trip (Driving)' },
              { value: 'OFF_DUTY', label: 'Off Duty' },
              { value: 'ON_LEAVE', label: 'On Leave' },
              { value: 'INACTIVE', label: 'Inactive / Suspended' },
            ]}
          />

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'name', label: 'Sort by Captain Name' },
              { value: 'safetyRating', label: 'Sort by Safety Rating' },
              { value: 'totalTripsCompleted', label: 'Sort by Completed Trips' },
              { value: 'licenseExpiry', label: 'Sort by License Expiry' },
            ]}
          />
        </div>
      </div>

      {/* 4. Table */}
      {loading ? (
        <LoadingSpinner message="Querying Dubai driver captain registry..." />
      ) : drivers.length === 0 ? (
        <EmptyState
          title="No Captains Matching Filter"
          description="No driver records found matching your search. Clear filters or enroll a new captain."
          actionLabel={canManage ? 'Enroll New Captain' : undefined}
          onAction={canManage ? handleOpenAdd : undefined}
        />
      ) : (
        <div className="space-y-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Captain & ID</TableHead>
                <TableHead>Contact & Phone</TableHead>
                <TableHead>License & RTA Permit</TableHead>
                <TableHead>Assigned Vehicle</TableHead>
                <TableHead>Safety Index</TableHead>
                <TableHead>Duty Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((d) => {
                const target = new Date(d.licenseExpiry).getTime();
                const today = new Date().getTime();
                const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
                const isExpiring = diffDays >= 0 && diffDays <= 30;
                const isExpired = diffDays < 0;

                const initials = d.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <TableRow key={d.id}>
                    {/* Captain & ID */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-orange-400 font-bold text-xs flex items-center justify-center border border-slate-700 shadow-xs">
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{d.name}</div>
                          <div className="font-mono text-[11px] text-slate-500 font-medium">
                            {d.employeeId}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Contact & Phone */}
                    <TableCell>
                      <div className="text-xs">
                        <div className="font-medium text-slate-900 flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {d.phone}
                        </div>
                        {d.email && <div className="text-[11px] text-slate-500 mt-0.5">{d.email}</div>}
                      </div>
                    </TableCell>

                    {/* License & RTA */}
                    <TableCell>
                      <div className="text-xs">
                        <div className="font-semibold text-slate-800 truncate max-w-[180px]" title={d.licenseCategory}>
                          {d.licenseCategory.split('—')[0]}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {d.licenseNumber}
                        </div>
                        {isExpired ? (
                          <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 mt-0.5">
                            <AlertTriangle className="w-3 h-3" /> License Expired
                          </span>
                        ) : isExpiring ? (
                          <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1 mt-0.5">
                            <AlertTriangle className="w-3 h-3" /> Renewal in {diffDays}d
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-semibold">RTA Valid</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Assigned Vehicle */}
                    <TableCell>
                      {d.assignedVehicleNumber ? (
                        <div className="text-xs">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                            <Bus className="w-3.5 h-3.5 text-orange-500" />
                            {d.assignedVehicleNumber}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Unassigned (Pool)</span>
                      )}
                    </TableCell>

                    {/* Safety Index */}
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-slate-900 font-mono">
                          {d.safetyRating || '5.0'}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          ({d.totalTripsCompleted || 0} trips)
                        </span>
                      </div>
                    </TableCell>

                    {/* Duty Status */}
                    <TableCell>
                      <StatusBadge status={d.status} />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(d)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Captain Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {canManage && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(d)}
                              className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Edit Captain Profile"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {d.status === 'AVAILABLE' && (
                              <button
                                type="button"
                                onClick={() => handleQuickStatusChange(d, 'ON_LEAVE')}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Mark as On Leave"
                              >
                                <HeartPulse className="w-4 h-4" />
                              </button>
                            )}

                            {d.status === 'ON_LEAVE' && (
                              <button
                                type="button"
                                onClick={() => handleQuickStatusChange(d, 'AVAILABLE')}
                                className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Return to Duty (Available)"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenDelete(d)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Deactivate Captain"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between text-xs text-slate-500 px-2 pt-2">
            <div>
              Showing <span className="font-semibold text-slate-900">{drivers.length}</span> certified captain records
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>RTA Driver Compliance Monitor Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Driver Modal */}
      {isModalOpen && (
        <DriverModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            showToast({
              type: 'success',
              title: 'Crew Updated',
              message: selectedDriver
                ? `Captain ${selectedDriver.name} profile updated successfully.`
                : 'New driver captain enrolled successfully.',
            });
            loadDriverData();
          }}
          driver={selectedDriver}
          availableVehicles={vehicles}
          availableRoutes={routes}
          apiFetch={apiFetch}
        />
      )}

      {/* Dossier Detail Modal */}
      {isDetailOpen && (
        <DriverDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          driver={selectedDriver}
          onEdit={(d) => handleOpenEdit(d)}
        />
      )}

      {/* Deactivate Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={`Deactivate Captain: ${driverToDelete?.name}?`}
        description="This will set captain status to INACTIVE and unassign them from any linked vehicle."
        maxWidth="md"
      >
        <div className="space-y-4 pt-1">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
            <p className="font-semibold mb-1">Safety Notice:</p>
            <p>
              The driver will be removed from all active dispatch rosters. If they are assigned to a vehicle,
              the vehicle will be released to the available fleet pool.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              loading={deleteLoading}
              onClick={handleConfirmDeactivate}
            >
              Deactivate Captain
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
