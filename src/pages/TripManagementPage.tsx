import React, { useState, useEffect, useCallback } from 'react';
import { Trip, Route, Vehicle, Driver, Client } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { Button } from '../components/ui/Button.js';
import { Badge, StatusBadge } from '../components/ui/Badge.js';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table.js';
import { LoadingSpinner, EmptyState } from '../components/ui/States.js';
import { Modal } from '../components/ui/Modal.js';
import { TripModal } from '../components/trips/TripModal.js';
import { TripDetailModal } from '../components/trips/TripDetailModal.js';
import { DelayTripModal, CancelTripModal } from '../components/trips/TripActionModal.js';
import {
  Clock,
  Plus,
  Search,
  Download,
  Eye,
  Edit2,
  Trash2,
  Bus,
  UserCheck,
  Building2,
  Calendar,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Navigation,
  CreditCard,
  Radio,
} from 'lucide-react';

interface TripManagementPageProps {
  navigate: (path: string) => void;
}

export const TripManagementPage: React.FC<TripManagementPageProps> = ({ navigate }) => {
  const { apiFetch, user } = useAuth();
  const { showToast } = useToast();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedShift, setSelectedShift] = useState<string>('ALL');
  const [selectedClientId, setSelectedClientId] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('scheduledStartTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [selectedTripForEdit, setSelectedTripForEdit] = useState<Trip | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailTripId, setDetailTripId] = useState<string | null>(null);

  const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);
  const [tripToDelay, setTripToDelay] = useState<Trip | null>(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [tripToCancel, setTripToCancel] = useState<Trip | null>(null);

  // Summary Metrics
  const [summary, setSummary] = useState({
    total: 0,
    todayTrips: 0,
    scheduled: 0,
    boarding: 0,
    inProgress: 0,
    delayed: 0,
    completed: 0,
    cancelled: 0,
  });

  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'DISPATCHER';

  const loadTripData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedDate && selectedDate !== 'ALL') params.append('date', selectedDate);
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      if (selectedShift !== 'ALL') params.append('shift', selectedShift);
      if (selectedClientId !== 'ALL') params.append('clientId', selectedClientId);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const [trRes, rtRes, vhRes, drRes, clRes] = await Promise.all([
        apiFetch(`/api/trips?${params.toString()}`),
        apiFetch('/api/routes'),
        apiFetch('/api/vehicles'),
        apiFetch('/api/drivers'),
        apiFetch('/api/clients'),
      ]);

      if (trRes && trRes.success) {
        setTrips(trRes.data);
        if (trRes.summary) setSummary(trRes.summary);
      }
      if (rtRes && rtRes.success) setRoutes(rtRes.data);
      if (vhRes && vhRes.success) setVehicles(vhRes.data);
      if (drRes && drRes.success) setDrivers(drRes.data);
      if (clRes && clRes.success) setClients(clRes.data);
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: err?.message || 'Failed to fetch trip telemetry.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiFetch, searchQuery, selectedDate, selectedStatus, selectedShift, selectedClientId, sortBy, sortOrder, showToast]);

  useEffect(() => {
    loadTripData();
  }, [loadTripData]);

  // Trip Lifecycle Action Handlers
  const handleStartTrip = async (trip: Trip) => {
    try {
      const res = await apiFetch(`/api/trips/${trip.id}/start`, { method: 'POST' });
      if (res && res.success) {
        showToast({
          type: 'success',
          title: 'Trip Started',
          message: `${trip.tripNumber} is now IN_PROGRESS. Bus ${trip.vehicleNumber} and crew locked.`,
        });
        loadTripData(true);
      } else {
        showToast({
          type: 'error',
          title: 'Dispatch Failed',
          message: res?.error || 'Could not start trip.',
        });
      }
    } catch (err: any) {
      showToast({ type: 'error', title: 'Error', message: err?.message || 'Network error.' });
    }
  };

  const handleCompleteTrip = async (trip: Trip) => {
    try {
      const res = await apiFetch(`/api/trips/${trip.id}/complete`, { method: 'POST' });
      if (res && res.success) {
        showToast({
          type: 'success',
          title: 'Trip Completed',
          message: `${trip.tripNumber} marked as COMPLETED. Bus ${trip.vehicleNumber} & captain released.`,
        });
        loadTripData(true);
      } else {
        showToast({
          type: 'error',
          title: 'Action Failed',
          message: res?.error || 'Could not complete trip.',
        });
      }
    } catch (err: any) {
      showToast({ type: 'error', title: 'Error', message: err?.message || 'Network error.' });
    }
  };

  const handleExportCSV = () => {
    if (trips.length === 0) return;
    const headers = ['Trip Number', 'Route Name', 'Client', 'Bus Number', 'Captain', 'Date', 'Start Time', 'End Time', 'Shift', 'Boarded Pax', 'Delay (Mins)', 'Status'];
    const rows = trips.map((t) => [
      t.tripNumber,
      `"${t.routeName}"`,
      `"${t.clientCompanyName || 'General'}"`,
      t.vehicleNumber,
      `"${t.driverName}"`,
      t.scheduledDate,
      t.scheduledStartTime,
      t.scheduledEndTime,
      t.shift,
      `${t.boardedPassengerCount || 0}/${t.passengerCount}`,
      t.delayMinutes || 0,
      t.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dubai_transport_dispatch_trips_${selectedDate || 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'info',
      title: 'Manifest Exported',
      message: `${trips.length} trip records downloaded.`,
    });
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Trips & Dispatch Operations</h1>
            <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-mono font-bold">
              DISPATCH ROOM
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time corporate shuttle dispatching, passenger RFID manifests, and live fleet lifecycle controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadTripData(true)}
            loading={refreshing}
            icon={<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-4 h-4" />}
          >
            Export Manifest
          </Button>

          {canManage && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedTripForEdit(null);
                setIsTripModalOpen(true);
              }}
              icon={<Plus className="w-4 h-4" />}
            >
              Dispatch New Trip
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Total Trips</div>
          <div className="text-2xl font-bold text-white mt-1">{summary.total}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Database records</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs text-cyan-400 font-medium">Scheduled / Boarding</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{summary.scheduled + summary.boarding}</div>
          <div className="text-[11px] text-cyan-500/70 mt-0.5">Ready on terminals</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            In Progress (Live)
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{summary.inProgress}</div>
          <div className="text-[11px] text-emerald-500/70 mt-0.5">Active on Dubai roads</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs text-amber-400 font-medium">Delayed Trips</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{summary.delayed}</div>
          <div className="text-[11px] text-amber-500/70 mt-0.5">Traffic / incident alert</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 col-span-2 md:col-span-1">
          <div className="text-xs text-slate-400 font-medium">Completed Safely</div>
          <div className="text-2xl font-bold text-slate-300 mt-1">{summary.completed}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Passengers delivered</div>
        </div>
      </div>

      {/* Filter Bar with Date Quick-Picker */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search trip #, route, captain, bus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Date Selector */}
          <div>
            <input
              type="date"
              value={selectedDate === 'ALL' ? '' : selectedDate}
              onChange={(e) => setSelectedDate(e.target.value || 'ALL')}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Shift Filter */}
          <div>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Shifts</option>
              <option value="MORNING">Morning Shift</option>
              <option value="AFTERNOON">Afternoon Shift</option>
              <option value="EVENING">Evening Shift</option>
              <option value="NIGHT">Night Shift</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Trip Statuses</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="BOARDING">BOARDING</option>
              <option value="IN_PROGRESS">IN_PROGRESS (Live)</option>
              <option value="DELAYED">DELAYED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* Client Filter */}
          <div>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Corporate Accounts</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Date Presets */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400 font-medium">Quick Date:</span>
          <button
            onClick={() => setSelectedDate(todayStr)}
            className={`text-xs px-2.5 py-0.5 rounded border transition-colors ${
              selectedDate === todayStr
                ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 font-semibold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => {
              const d = new Date();
              d.setDate(d.getDate() - 1);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="text-xs px-2.5 py-0.5 rounded border bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          >
            Yesterday
          </button>
          <button
            onClick={() => {
              const d = new Date();
              d.setDate(d.getDate() + 1);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="text-xs px-2.5 py-0.5 rounded border bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
          >
            Tomorrow
          </button>
          <button
            onClick={() => setSelectedDate('ALL')}
            className={`text-xs px-2.5 py-0.5 rounded border transition-colors ${
              selectedDate === 'ALL'
                ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 font-semibold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            View All Dates
          </button>
        </div>
      </div>

      {/* Trips Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <LoadingSpinner size="lg" />
          <p className="text-sm mt-3">Fetching dispatch telemetry & active shuttle routes...</p>
        </div>
      ) : trips.length === 0 ? (
        <EmptyState
          title="No Trips Found for Selected Filter"
          description="No dispatch trips found for the selected date or criteria. Dispatch a new trip or change date."
          action={
            canManage ? (
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedTripForEdit(null);
                  setIsTripModalOpen(true);
                }}
                icon={<Plus className="w-4 h-4" />}
              >
                Schedule New Trip
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-800 bg-slate-950/60">
                  <TableHead className="w-24">Trip #</TableHead>
                  <TableHead>Route & Trajectory</TableHead>
                  <TableHead>Vehicle & Captain</TableHead>
                  <TableHead>Schedule & Timing</TableHead>
                  <TableHead>Boarding Manifest</TableHead>
                  <TableHead>Shift / Delay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((t) => {
                  const boarded = t.boardedPassengerCount || 0;
                  const total = t.passengerCount || 24;
                  const boardingPercent = total > 0 ? Math.round((boarded / total) * 100) : 0;

                  return (
                    <TableRow
                      key={t.id}
                      className="border-b border-slate-800/80 hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Trip # */}
                      <TableCell>
                        <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded">
                          {t.tripNumber}
                        </span>
                      </TableCell>

                      {/* Route & Trajectory */}
                      <TableCell>
                        <div>
                          <div className="font-bold text-sm text-white">{t.routeName}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-blue-400" />
                            <span>{t.clientCompanyName || 'Corporate Shuttle'}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Vehicle & Captain */}
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-200">
                            <Bus className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="font-semibold">{t.vehicleNumber}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Capt. {t.driverName}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Schedule & Timing */}
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div className="font-mono font-medium text-slate-200">
                            {t.scheduledStartTime} - {t.scheduledEndTime}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {t.scheduledDate}
                          </div>
                        </div>
                      </TableCell>

                      {/* Boarding Manifest */}
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                            <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{boarded} / {total} Boarded</span>
                          </div>
                          <div className="w-24 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-emerald-500"
                              style={{ width: `${boardingPercent}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>

                      {/* Shift & Delay */}
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                            {t.shift}
                          </Badge>
                          {t.delayMinutes && t.delayMinutes > 0 ? (
                            <span className="text-[10px] text-amber-400 font-bold bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/60 block">
                              +{t.delayMinutes} min delay
                            </span>
                          ) : null}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={t.status} />
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Inspect Manifest & Telemetry */}
                          <button
                            onClick={() => {
                              setDetailTripId(t.id);
                              setIsDetailOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-md transition-colors"
                            title="Inspect Manifest & RFID"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Lifecycle: Start Trip */}
                          {canManage && t.status === 'SCHEDULED' && (
                            <button
                              onClick={() => handleStartTrip(t)}
                              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-md transition-colors"
                              title="Start Trip (Dispatched)"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}

                          {/* Lifecycle: Complete Trip */}
                          {canManage && (t.status === 'IN_PROGRESS' || t.status === 'BOARDING' || t.status === 'DELAYED') && (
                            <button
                              onClick={() => handleCompleteTrip(t)}
                              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-md transition-colors"
                              title="Complete Trip Safely"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            </button>
                          )}

                          {/* Lifecycle: Delay */}
                          {canManage && t.status !== 'COMPLETED' && t.status !== 'CANCELLED' && (
                            <button
                              onClick={() => {
                                setTripToDelay(t);
                                setIsDelayModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-md transition-colors"
                              title="Report Delay / Traffic"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}

                          {/* Lifecycle: Cancel */}
                          {canManage && t.status !== 'COMPLETED' && t.status !== 'CANCELLED' && (
                            <button
                              onClick={() => {
                                setTripToCancel(t);
                                setIsCancelModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors"
                              title="Cancel Trip"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit */}
                          {canManage && t.status === 'SCHEDULED' && (
                            <button
                              onClick={() => {
                                setSelectedTripForEdit(t);
                                setIsTripModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                              title="Edit Schedule"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Modal 1: Dispatch / Schedule Trip */}
      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        onSuccess={() => {
          showToast({
            type: 'success',
            title: 'Trip Dispatched',
            message: 'Trip dispatch schedule updated in control room.',
          });
          loadTripData(true);
        }}
        trip={selectedTripForEdit}
        availableRoutes={routes}
        availableVehicles={vehicles}
        availableDrivers={drivers}
        apiFetch={apiFetch}
      />

      {/* Modal 2: Trip Detail / RFID Manifest */}
      <TripDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailTripId(null);
        }}
        tripId={detailTripId}
        apiFetch={apiFetch}
        onStartTrip={handleStartTrip}
        onCompleteTrip={handleCompleteTrip}
        onDelayTrip={(t) => {
          setTripToDelay(t);
          setIsDelayModalOpen(true);
        }}
        onCancelTrip={(t) => {
          setTripToCancel(t);
          setIsCancelModalOpen(true);
        }}
        onRefreshParent={() => loadTripData(true)}
      />

      {/* Modal 3: Report Delay */}
      <DelayTripModal
        isOpen={isDelayModalOpen}
        onClose={() => {
          setIsDelayModalOpen(false);
          setTripToDelay(null);
        }}
        trip={tripToDelay}
        apiFetch={apiFetch}
        onSuccess={() => {
          showToast({
            type: 'info',
            title: 'Delay Alert Broadcast',
            message: 'Delay information recorded and alerted to control center.',
          });
          loadTripData(true);
        }}
      />

      {/* Modal 4: Cancel Trip */}
      <CancelTripModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setTripToCancel(null);
        }}
        trip={tripToCancel}
        apiFetch={apiFetch}
        onSuccess={() => {
          showToast({
            type: 'info',
            title: 'Trip Cancelled',
            message: 'Trip marked as cancelled and resources released.',
          });
          loadTripData(true);
        }}
      />
    </div>
  );
};
