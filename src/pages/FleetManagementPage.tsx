import React, { useState, useEffect, useCallback } from 'react';
import { Vehicle, Driver, Route, VehicleType, VehicleStatus } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Select } from '../components/ui/Select.js';
import { Badge, StatusBadge } from '../components/ui/Badge.js';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table.js';
import { LoadingSpinner, EmptyState } from '../components/ui/States.js';
import { Modal } from '../components/ui/Modal.js';
import { VehicleModal } from '../components/fleet/VehicleModal.js';
import { VehicleDetailModal } from '../components/fleet/VehicleDetailModal.js';
import {
  Bus,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ShieldCheck,
  RefreshCw,
  MoreVertical,
  Activity,
} from 'lucide-react';

interface FleetManagementPageProps {
  navigate: (path: string) => void;
}

export const FleetManagementPage: React.FC<FleetManagementPageProps> = ({ navigate }) => {
  const { apiFetch, user } = useAuth();
  const { showToast } = useToast();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('vehicleNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Delete/Deactivate Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Summary counts
  const [summary, setSummary] = useState({
    total: 0,
    available: 0,
    onTrip: 0,
    maintenance: 0,
    inactive: 0,
  });

  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'DISPATCHER';

  // Load Data
  const loadFleetData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedType !== 'ALL') params.append('vehicleType', selectedType);
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const [vehRes, drvRes, rtRes] = await Promise.all([
        apiFetch(`/api/vehicles?${params.toString()}`),
        apiFetch('/api/drivers'),
        apiFetch('/api/routes'),
      ]);

      if (vehRes && vehRes.success) {
        setVehicles(vehRes.data);
        if (vehRes.summary) {
          setSummary(vehRes.summary);
        }
      }

      if (drvRes && drvRes.success) {
        setDrivers(drvRes.data);
      }

      if (rtRes && rtRes.success) {
        setRoutes(rtRes.data);
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Network Error',
        message: err?.message || 'Failed to fetch fleet records.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiFetch, searchQuery, selectedType, selectedStatus, sortBy, sortOrder, showToast]);

  useEffect(() => {
    loadFleetData();
  }, [loadFleetData]);

  // Handle Action Triggers
  const handleOpenAdd = () => {
    setSelectedVehicle(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setSelectedVehicle(v);
    setIsModalOpen(true);
  };

  const handleOpenDetail = (v: Vehicle) => {
    setSelectedVehicle(v);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (v: Vehicle) => {
    setVehicleToDelete(v);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeactivate = async () => {
    if (!vehicleToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await apiFetch(`/api/vehicles/${vehicleToDelete.id}`, {
        method: 'DELETE',
      });

      if (res && res.success) {
        showToast({
          type: 'success',
          title: 'Fleet Updated',
          message: res.message || `Vehicle ${vehicleToDelete.vehicleNumber} deactivated successfully.`,
        });
        setIsDeleteModalOpen(false);
        setVehicleToDelete(null);
        loadFleetData();
      } else {
        showToast({
          type: 'error',
          title: 'Action Blocked',
          message: res?.error || 'Could not deactivate vehicle.',
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: err?.message || 'Failed to update vehicle status.',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Quick Status Toggle (e.g. Yard to Maintenance)
  const handleQuickStatusChange = async (vehicle: Vehicle, nextStatus: VehicleStatus) => {
    try {
      const res = await apiFetch(`/api/vehicles/${vehicle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res && res.success) {
        showToast({
          type: 'success',
          title: 'Status Updated',
          message: `${vehicle.vehicleNumber} status changed to ${nextStatus}.`,
        });
        loadFleetData();
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

  // Export to CSV
  const handleExportCSV = () => {
    if (vehicles.length === 0) {
      showToast({ type: 'warning', title: 'Export', message: 'No vehicle records to export.' });
      return;
    }

    const headers = ['Vehicle ID', 'Plate Number', 'Category', 'Make & Model', 'Year', 'Seats', 'Status', 'Driver', 'Route', 'Mulkiya Expiry', 'Insurance Expiry', 'Mileage (km)'];
    const rows = vehicles.map((v) => [
      v.vehicleNumber,
      v.registrationNumber,
      v.vehicleType,
      `${v.make} ${v.model}`,
      v.year,
      v.capacity,
      v.status,
      v.assignedDriverName || 'Unassigned',
      v.currentRouteName || 'Unassigned',
      v.registrationExpiry,
      v.insuranceExpiry,
      v.currentMileageKm,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dubai_fleet_manifest_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({ type: 'success', title: 'Export Generated', message: 'Fleet manifest downloaded in CSV format.' });
  };

  const utilizationRate = summary.total > 0 ? Math.round(((summary.onTrip + summary.available) / summary.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Dubai Fleet Management
            </h1>
            <Badge variant="navy" className="hidden sm:inline-flex">
              RTA Certified
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time fleet inventory, Dubai plate registry, seating manifests, and Mulkiya compliance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadFleetData(true)}
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
              Add Vehicle
            </Button>
          )}
        </div>
      </div>

      {/* 2. Operational Fleet Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Fleet</span>
            <Bus className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-heading mt-2 font-mono">
            {summary.total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Commercial & Staff Coaches</div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
            <span>Ready in Yard</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-900 font-heading mt-2 font-mono">
            {summary.available}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Available for Dispatch</div>
        </div>

        <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/40 shadow-xs">
          <div className="flex items-center justify-between text-xs text-orange-700 font-medium">
            <span>Active on Route</span>
            <Activity className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-900 font-heading mt-2 font-mono">
            {summary.onTrip}
          </div>
          <div className="text-[11px] text-orange-600 mt-1">In Transit / Boarding</div>
        </div>

        <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/40 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-700 font-medium">
            <span>In Maintenance</span>
            <Wrench className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-900 font-heading mt-2 font-mono">
            {summary.maintenance}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">Scheduled Workshop</div>
        </div>

        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-blue-700 font-medium">
            <span>Fleet Availability</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-900 font-heading mt-2 font-mono">
            {utilizationRate}%
          </div>
          <div className="text-[11px] text-blue-600 mt-1">Operational Ready Rate</div>
        </div>
      </div>

      {/* 3. Search, Filter, and Sort Controls */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bus code, plate, model, driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Vehicle Categories' },
              { value: 'COASTER', label: '30-Seater Coasters' },
              { value: 'STANDARD_BUS', label: '50-Seater Heavy Buses' },
              { value: 'LUXURY_COACH', label: '45-Seater Coaches' },
              { value: 'HIACE_VAN', label: '14-Seater HiAce Vans' },
              { value: 'MINIBUS', label: '22-Seater Mid-Buses' },
            ]}
          />

          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Operational Statuses' },
              { value: 'AVAILABLE', label: 'Available in Yard' },
              { value: 'ON_TRIP', label: 'On Trip (Active)' },
              { value: 'MAINTENANCE', label: 'In Maintenance' },
              { value: 'INACTIVE', label: 'Inactive / Standby' },
            ]}
          />

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'vehicleNumber', label: 'Sort by Bus Code' },
              { value: 'capacity', label: 'Sort by Seating Capacity' },
              { value: 'registrationExpiry', label: 'Sort by Mulkiya Expiry' },
              { value: 'currentMileageKm', label: 'Sort by Mileage' },
              { value: 'status', label: 'Sort by Status' },
            ]}
          />
        </div>
      </div>

      {/* 4. Fleet Data Table */}
      {loading ? (
        <LoadingSpinner message="Querying Dubai fleet records..." />
      ) : vehicles.length === 0 ? (
        <EmptyState
          title="No Vehicles Matching Criteria"
          description="No fleet vehicles matched your search or filter settings. Adjust filters or register a new bus."
          actionLabel={canManage ? 'Add New Vehicle' : undefined}
          onAction={canManage ? handleOpenAdd : undefined}
        />
      ) : (
        <div className="space-y-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fleet ID & Plate</TableHead>
                <TableHead>Specs & Capacity</TableHead>
                <TableHead>Assigned Captain</TableHead>
                <TableHead>Primary Route</TableHead>
                <TableHead>Mulkiya & Compliance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((v) => {
                // Calculate days to Mulkiya renewal
                const target = new Date(v.registrationExpiry).getTime();
                const today = new Date().getTime();
                const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
                const isExpired = diffDays < 0;
                const isExpiringSoon = diffDays >= 0 && diffDays <= 30;

                return (
                  <TableRow key={v.id}>
                    {/* Fleet ID & Dubai Plate */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs border border-slate-200">
                          <Bus className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 font-mono text-sm">{v.vehicleNumber}</div>
                          <div className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 mt-0.5">
                            <span className="text-[9px] text-slate-400">DXB</span>
                            <span>{v.registrationNumber}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Specs & Capacity */}
                    <TableCell>
                      <div>
                        <div className="font-semibold text-slate-800 text-xs sm:text-sm">
                          {v.make} {v.model}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {v.capacity} Seats • {v.year} • {v.fuelType}
                        </div>
                      </div>
                    </TableCell>

                    {/* Assigned Captain */}
                    <TableCell>
                      {v.assignedDriverName ? (
                        <div className="text-xs">
                          <div className="font-medium text-slate-900">{v.assignedDriverName}</div>
                          <div className="text-[11px] text-emerald-600 font-semibold">Active Crew</div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Unassigned (Yard Pool)</span>
                      )}
                    </TableCell>

                    {/* Primary Route */}
                    <TableCell>
                      {v.currentRouteName ? (
                        <span className="inline-flex items-center text-xs font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                          {v.currentRouteName}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Flexible Dispatch</span>
                      )}
                    </TableCell>

                    {/* Mulkiya Compliance */}
                    <TableCell>
                      <div className="text-xs">
                        <div className="font-medium text-slate-700">{v.registrationExpiry}</div>
                        {isExpired ? (
                          <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 mt-0.5">
                            <AlertTriangle className="w-3 h-3" /> Mulkiya Expired
                          </span>
                        ) : isExpiringSoon ? (
                          <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1 mt-0.5">
                            <AlertTriangle className="w-3 h-3" /> Expires in {diffDays}d
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-600">RTA Valid</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={v.status} />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(v)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Vehicle Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {canManage && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(v)}
                              className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Edit Vehicle"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {v.status === 'AVAILABLE' && (
                              <button
                                type="button"
                                onClick={() => handleQuickStatusChange(v, 'MAINTENANCE')}
                                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Move to Workshop Maintenance"
                              >
                                <Wrench className="w-4 h-4" />
                              </button>
                            )}

                            {v.status === 'MAINTENANCE' && (
                              <button
                                type="button"
                                onClick={() => handleQuickStatusChange(v, 'AVAILABLE')}
                                className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Release from Workshop to Yard"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenDelete(v)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Deactivate Vehicle"
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
              Showing <span className="font-semibold text-slate-900">{vehicles.length}</span> vehicle records
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Fleet Telemetry Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <VehicleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            showToast({
              type: 'success',
              title: 'Fleet Updated',
              message: selectedVehicle
                ? `Vehicle ${selectedVehicle.vehicleNumber} was successfully updated.`
                : 'New vehicle registered to fleet successfully.',
            });
            loadFleetData();
          }}
          vehicle={selectedVehicle}
          availableDrivers={drivers}
          availableRoutes={routes}
          apiFetch={apiFetch}
        />
      )}

      {/* View Details Dossier Modal */}
      {isDetailOpen && (
        <VehicleDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          vehicle={selectedVehicle}
          onEdit={(v) => handleOpenEdit(v)}
          onStatusChange={(v, newStatus) => handleQuickStatusChange(v, newStatus as VehicleStatus)}
        />
      )}

      {/* Deactivate Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={`Deactivate Vehicle: ${vehicleToDelete?.vehicleNumber}?`}
        description="This will mark the vehicle as INACTIVE and remove it from active dispatch pools."
        maxWidth="md"
      >
        <div className="space-y-4 pt-1">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
            <p className="font-semibold mb-1">Confirmation Safety Notice:</p>
            <p>
              Vehicles currently running live dispatched trips cannot be deactivated until the trip completes.
              Driver and route assignments will be safely unlinked.
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
              Deactivate Vehicle
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
