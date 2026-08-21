import React, { useState, useEffect, useCallback } from 'react';
import { Passenger, Client, Route, PassengerStatus } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Select } from '../components/ui/Select.js';
import { Badge, StatusBadge } from '../components/ui/Badge.js';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table.js';
import { LoadingSpinner, EmptyState } from '../components/ui/States.js';
import { Modal } from '../components/ui/Modal.js';
import { PassengerModal } from '../components/passengers/PassengerModal.js';
import { PassengerDetailModal } from '../components/passengers/PassengerDetailModal.js';
import {
  Users,
  Plus,
  Search,
  Download,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Building2,
  MapPin,
  Clock,
  CreditCard,
  RefreshCw,
  Sun,
  Moon,
  Sunset,
} from 'lucide-react';

interface PassengerManagementPageProps {
  navigate: (path: string) => void;
}

export const PassengerManagementPage: React.FC<PassengerManagementPageProps> = ({ navigate }) => {
  const { apiFetch, user } = useAuth();
  const { showToast } = useToast();

  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('ALL');
  const [selectedShift, setSelectedShift] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);

  // Deactivation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [passengerToDelete, setPassengerToDelete] = useState<Passenger | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Summary
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
    inactive: 0,
    morningShift: 0,
    eveningShift: 0,
    nightShift: 0,
  });

  const isClientUser = user?.role === 'CLIENT';
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'DISPATCHER' || isClientUser;

  const loadPassengerData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedClientId !== 'ALL') params.append('clientId', selectedClientId);
      if (selectedShift !== 'ALL') params.append('shift', selectedShift);
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const [passRes, cliRes, rtRes] = await Promise.all([
        apiFetch(`/api/passengers?${params.toString()}`),
        apiFetch('/api/clients'),
        apiFetch('/api/routes'),
      ]);

      if (passRes && passRes.success) {
        setPassengers(passRes.data);
        if (passRes.summary) {
          setSummary(passRes.summary);
        }
      }

      if (cliRes && cliRes.success) {
        setClients(cliRes.data);
      }

      if (rtRes && rtRes.success) {
        setRoutes(rtRes.data);
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: err?.message || 'Failed to fetch passenger records.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiFetch, searchQuery, selectedClientId, selectedShift, selectedStatus, sortBy, sortOrder, showToast]);

  useEffect(() => {
    loadPassengerData();
  }, [loadPassengerData]);

  const handleOpenAdd = () => {
    setSelectedPassenger(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Passenger) => {
    setSelectedPassenger(p);
    setIsModalOpen(true);
  };

  const handleOpenDetail = (p: Passenger) => {
    setSelectedPassenger(p);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (p: Passenger) => {
    setPassengerToDelete(p);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeactivate = async () => {
    if (!passengerToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await apiFetch(`/api/passengers/${passengerToDelete.id}`, {
        method: 'DELETE',
      });

      if (res && res.success) {
        showToast({
          type: 'success',
          title: 'Manifest Updated',
          message: res.message || `Passenger ${passengerToDelete.name} marked as INACTIVE.`,
        });
        setIsDeleteModalOpen(false);
        setPassengerToDelete(null);
        loadPassengerData();
      } else {
        showToast({
          type: 'error',
          title: 'Action Failed',
          message: res?.error || 'Could not deactivate passenger.',
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: err?.message || 'Failed to update passenger status.',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (passengers.length === 0) {
      showToast({ type: 'warning', title: 'Export', message: 'No passenger records to export.' });
      return;
    }

    const headers = ['Employee ID', 'Name', 'Phone', 'Company', 'Department', 'Pickup Location', 'Pickup Time', 'Drop Location', 'Drop Time', 'Route', 'Shift', 'RFID Card', 'Status'];
    const rows = passengers.map((p) => [
      p.employeeId,
      p.name,
      p.phone,
      p.clientCompanyName || 'N/A',
      p.department || '',
      p.pickupPoint,
      p.pickupTime,
      p.dropPoint,
      p.dropTime,
      p.routeName || 'Unassigned',
      p.shift,
      p.rfidCardNumber || 'N/A',
      p.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dubai_passenger_manifest_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({ type: 'success', title: 'Export Generated', message: 'Passenger commute manifest downloaded in CSV format.' });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Passenger & Employee Manifest
            </h1>
            <Badge variant="orange">Smart RFID</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Corporate employee rosters, RFID tap boarding, shift allocation, pickup/drop-off community points.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadPassengerData(true)}
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
              Enroll Passenger
            </Button>
          )}
        </div>
      </div>

      {/* 2. Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Enrolled</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-heading mt-2 font-mono">
            {summary.total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Registered Staff</div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
            <span>Daily Commuters</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-900 font-heading mt-2 font-mono">
            {summary.active}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Active Roster Status</div>
        </div>

        <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/40 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-700 font-medium">
            <span>Morning Shift</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-900 font-heading mt-2 font-mono">
            {summary.morningShift}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">06:00 - 15:00 Shift</div>
        </div>

        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 shadow-xs">
          <div className="flex items-center justify-between text-xs text-blue-700 font-medium">
            <span>Evening Shift</span>
            <Sunset className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-900 font-heading mt-2 font-mono">
            {summary.eveningShift}
          </div>
          <div className="text-[11px] text-blue-600 mt-1">14:00 - 23:00 Shift</div>
        </div>

        <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/40 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-purple-700 font-medium">
            <span>Night Shift</span>
            <Moon className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-900 font-heading mt-2 font-mono">
            {summary.nightShift}
          </div>
          <div className="text-[11px] text-purple-600 mt-1">22:00 - 07:00 Shift</div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search staff name, ID, RFID, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          {!isClientUser && (
            <Select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Corporate Clients' },
                ...clients.map((c) => ({ value: c.id, label: c.companyName })),
              ]}
            />
          )}

          <Select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Work Shifts' },
              { value: 'MORNING', label: 'Morning Shift' },
              { value: 'EVENING', label: 'Evening Shift' },
              { value: 'NIGHT', label: 'Night Shift' },
              { value: 'CUSTOM', label: 'Custom Shift' },
            ]}
          />

          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Passenger Statuses' },
              { value: 'ACTIVE', label: 'Active Commuters' },
              { value: 'ON_LEAVE', label: 'On Leave' },
              { value: 'INACTIVE', label: 'Inactive / Offboarded' },
            ]}
          />

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'name', label: 'Sort by Staff Name' },
              { value: 'employeeId', label: 'Sort by Employee ID' },
              { value: 'shift', label: 'Sort by Shift' },
              { value: 'pickupTime', label: 'Sort by Pickup Time' },
            ]}
          />
        </div>
      </div>

      {/* 4. Table */}
      {loading ? (
        <LoadingSpinner message="Querying corporate passenger roster..." />
      ) : passengers.length === 0 ? (
        <EmptyState
          title="No Passengers Found"
          description="No employee records matched your filter criteria. Adjust search or enroll a new passenger."
          actionLabel={canManage ? 'Enroll Passenger' : undefined}
          onAction={canManage ? handleOpenAdd : undefined}
        />
      ) : (
        <div className="space-y-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff & Employee ID</TableHead>
                <TableHead>Employer & Department</TableHead>
                <TableHead>Pickup Community & Time</TableHead>
                <TableHead>Destination Facility & Time</TableHead>
                <TableHead>Shift & RFID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {passengers.map((p) => {
                const initials = p.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <TableRow key={p.id}>
                    {/* Staff & ID */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center border border-slate-200">
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                          <div className="font-mono text-[11px] text-slate-500 font-medium">
                            {p.employeeId}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Employer & Department */}
                    <TableCell>
                      <div className="text-xs">
                        <div className="font-semibold text-slate-900">{p.clientCompanyName || 'Corporate Account'}</div>
                        <div className="text-[11px] text-slate-500">{p.department || 'Staff'}</div>
                      </div>
                    </TableCell>

                    {/* Pickup */}
                    <TableCell>
                      <div className="text-xs">
                        <div className="font-medium text-slate-900 truncate max-w-[170px]" title={p.pickupPoint}>
                          {p.pickupPoint}
                        </div>
                        <div className="font-mono text-[11px] text-emerald-600 font-semibold mt-0.5">
                          {p.pickupTime}
                        </div>
                      </div>
                    </TableCell>

                    {/* Drop-off */}
                    <TableCell>
                      <div className="text-xs">
                        <div className="font-medium text-slate-900 truncate max-w-[170px]" title={p.dropPoint}>
                          {p.dropPoint}
                        </div>
                        <div className="font-mono text-[11px] text-orange-600 font-semibold mt-0.5">
                          {p.dropTime}
                        </div>
                      </div>
                    </TableCell>

                    {/* Shift & RFID */}
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <Badge
                          variant={
                            p.shift === 'MORNING'
                              ? 'orange'
                              : p.shift === 'EVENING'
                              ? 'info'
                              : 'navy'
                          }
                        >
                          {p.shift}
                        </Badge>
                        <div className="font-mono text-[10px] text-slate-500 flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-slate-400" />
                          {p.rfidCardNumber || 'Auto RFID'}
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(p)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Boarding Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {canManage && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Edit Passenger"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenDelete(p)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Deactivate Passenger"
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
              Showing <span className="font-semibold text-slate-900">{passengers.length}</span> staff passenger records
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>RFID Telematics Reader Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Passenger Modal */}
      {isModalOpen && (
        <PassengerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            showToast({
              type: 'success',
              title: 'Manifest Saved',
              message: selectedPassenger
                ? `Passenger ${selectedPassenger.name} updated successfully.`
                : 'New employee passenger enrolled successfully.',
            });
            loadPassengerData();
          }}
          passenger={selectedPassenger}
          availableClients={clients}
          availableRoutes={routes}
          apiFetch={apiFetch}
          userCompanyId={isClientUser ? user?.companyId : undefined}
        />
      )}

      {/* Detail Modal */}
      {isDetailOpen && (
        <PassengerDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          passenger={selectedPassenger}
          onEdit={(p) => handleOpenEdit(p)}
        />
      )}

      {/* Deactivate Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={`Deactivate Passenger: ${passengerToDelete?.name}?`}
        description="This will set the employee status to INACTIVE and remove them from active bus boarding lists."
        maxWidth="md"
      >
        <div className="space-y-4 pt-1">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
            <p className="font-semibold mb-1">Notice:</p>
            <p>
              The employee’s smart RFID card will be disabled for bus boarding readers.
              Client company active commuter counts will automatically update.
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
              Deactivate Passenger
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
