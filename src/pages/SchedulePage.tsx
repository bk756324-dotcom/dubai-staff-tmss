import React, { useState, useEffect, useCallback } from 'react';
import { Trip, Route, Vehicle, Driver, Client } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { Button } from '../components/ui/Button.js';
import { Badge, StatusBadge } from '../components/ui/Badge.js';
import { LoadingSpinner, EmptyState } from '../components/ui/States.js';
import { TripModal } from '../components/trips/TripModal.js';
import { TripDetailModal } from '../components/trips/TripDetailModal.js';
import { DelayTripModal, CancelTripModal } from '../components/trips/TripActionModal.js';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bus,
  UserCheck,
  Building2,
  AlertTriangle,
  Play,
  CheckCircle2,
  RefreshCw,
  Eye,
  ShieldCheck,
  Grid,
  List,
} from 'lucide-react';

interface SchedulePageProps {
  navigate: (path: string) => void;
}

export const SchedulePage: React.FC<SchedulePageProps> = ({ navigate }) => {
  const { apiFetch, user } = useAuth();
  const { showToast } = useToast();

  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedShift, setSelectedShift] = useState<string>('ALL');
  const [selectedClientId, setSelectedClientId] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'SHIFT_MATRIX' | 'FLEET_ROSTER'>('SHIFT_MATRIX');

  const [scheduleData, setScheduleData] = useState<any>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modals
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [selectedTripForEdit, setSelectedTripForEdit] = useState<Trip | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailTripId, setDetailTripId] = useState<string | null>(null);

  const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);
  const [tripToDelay, setTripToDelay] = useState<Trip | null>(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [tripToCancel, setTripToCancel] = useState<Trip | null>(null);

  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'DISPATCHER';

  const loadSchedule = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const params = new URLSearchParams();
      params.append('date', selectedDate);
      if (selectedShift !== 'ALL') params.append('shift', selectedShift);
      if (selectedClientId !== 'ALL') params.append('clientId', selectedClientId);

      const [scRes, rtRes, vhRes, drRes, clRes] = await Promise.all([
        apiFetch(`/api/schedule?${params.toString()}`),
        apiFetch('/api/routes'),
        apiFetch('/api/vehicles'),
        apiFetch('/api/drivers'),
        apiFetch('/api/clients'),
      ]);

      if (scRes && scRes.success) {
        setScheduleData(scRes.data);
      }
      if (rtRes && rtRes.success) setRoutes(rtRes.data);
      if (vhRes && vhRes.success) setVehicles(vhRes.data);
      if (drRes && drRes.success) setDrivers(drRes.data);
      if (clRes && clRes.success) setClients(clRes.data);
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Schedule Fetch Error',
        message: err?.message || 'Failed to load dispatch matrix.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiFetch, selectedDate, selectedShift, selectedClientId, showToast]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const handleDateChange = (delta: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + delta);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const handleStartTrip = async (trip: Trip) => {
    try {
      const res = await apiFetch(`/api/trips/${trip.id}/start`, { method: 'POST' });
      if (res && res.success) {
        showToast({
          type: 'success',
          title: 'Trip Dispatched',
          message: `${trip.tripNumber} marked as IN_PROGRESS.`,
        });
        loadSchedule(true);
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
          message: `${trip.tripNumber} successfully completed.`,
        });
        loadSchedule(true);
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

  const shiftsList = [
    { key: 'MORNING', label: 'Morning Shift', time: '05:00 - 11:00', icon: '🌅', color: 'border-amber-500/40 bg-amber-500/5' },
    { key: 'AFTERNOON', label: 'Afternoon Shift', time: '11:00 - 16:00', icon: '☀️', color: 'border-blue-500/40 bg-blue-500/5' },
    { key: 'EVENING', label: 'Evening Shift', time: '16:00 - 21:00', icon: '🌆', color: 'border-purple-500/40 bg-purple-500/5' },
    { key: 'NIGHT', label: 'Night Shift', time: '21:00 - 05:00', icon: '🌙', color: 'border-indigo-500/40 bg-indigo-500/5' },
  ];

  const shiftGroups = scheduleData?.shifts || {
    MORNING: [],
    AFTERNOON: [],
    EVENING: [],
    NIGHT: [],
  };

  const conflicts = scheduleData?.conflicts || [];
  const metrics = scheduleData?.metrics || {
    totalTrips: 0,
    activeTrips: 0,
    scheduledTrips: 0,
    completedTrips: 0,
    delayedTrips: 0,
    totalPlannedPassengers: 0,
  };

  const formattedDate = new Date(selectedDate).toLocaleDateString('en-AE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Header & Date Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Daily Schedule & Shift Matrix</h1>
            <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-mono font-bold">
              DISPATCH MATRIX
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Visual shift-based dispatch grid, driver & vehicle assignments, and real-time conflict prevention.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadSchedule(true)}
            loading={refreshing}
            icon={<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh
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
              Schedule Trip
            </Button>
          )}
        </div>
      </div>

      {/* Date Navigator Bar */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => handleDateChange(-1)}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="px-3 py-1 text-xs font-semibold text-slate-200 hover:text-orange-400 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => handleDateChange(1)}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-orange-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-orange-500 font-mono font-medium"
            />
            <span className="text-sm font-semibold text-white hidden sm:inline">
              — {formattedDate}
            </span>
          </div>
        </div>

        {/* Filters and View Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
          >
            <option value="ALL">All Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.companyName}
              </option>
            ))}
          </select>

          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('SHIFT_MATRIX')}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'SHIFT_MATRIX'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Shift Columns
            </button>
            <button
              onClick={() => setViewMode('FLEET_ROSTER')}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'FLEET_ROSTER'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Vehicle Roster
            </button>
          </div>
        </div>
      </div>

      {/* Conflicts Banner (If any detected) */}
      {conflicts.length > 0 && (
        <div className="p-4 bg-amber-950/40 border border-amber-800/80 rounded-xl text-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Scheduling Conflicts Detected ({conflicts.length} Overlaps)</span>
          </div>
          <div className="space-y-1 pl-6">
            {conflicts.map((c: any, idx: number) => (
              <div key={idx} className="text-slate-300">
                • <strong>{c.type === 'VEHICLE_OVERLAP' ? 'Vehicle Overlap' : 'Driver Captain Overlap'}:</strong> {c.description} (Trip {c.tripNumber} vs {c.conflictingTripNumber})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Daily Scheduled Trips</div>
          <div className="text-2xl font-bold text-white mt-1">{metrics.totalTrips}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{formattedDate}</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs text-cyan-400 font-medium">Scheduled / Standby</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{metrics.scheduledTrips}</div>
          <div className="text-[11px] text-cyan-500/70 mt-0.5">Ready for departure</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live In-Transit
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{metrics.activeTrips}</div>
          <div className="text-[11px] text-emerald-500/70 mt-0.5">Currently driving</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs text-blue-400 font-medium">Planned Passenger Load</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{metrics.totalPlannedPassengers}</div>
          <div className="text-[11px] text-blue-400/70 mt-0.5">Corporate passengers</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 col-span-2 md:col-span-1">
          <div className="text-xs text-amber-400 font-medium">Delayed / Alerts</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{metrics.delayedTrips}</div>
          <div className="text-[11px] text-amber-500/70 mt-0.5">Traffic exceptions</div>
        </div>
      </div>

      {/* Main Shift-Based Matrix View */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <LoadingSpinner size="lg" />
          <p className="text-sm mt-3">Rendering shift schedule matrix...</p>
        </div>
      ) : viewMode === 'SHIFT_MATRIX' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {shiftsList.map((shift) => {
            const shiftTrips: Trip[] = shiftGroups[shift.key] || [];

            return (
              <div
                key={shift.key}
                className="bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col min-h-[500px]"
              >
                {/* Shift Column Header */}
                <div className={`p-3.5 border-b border-slate-800 rounded-t-xl ${shift.color} flex items-center justify-between`}>
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-1.5">
                      <span>{shift.icon}</span>
                      <span>{shift.label}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {shift.time}
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-200">
                    {shiftTrips.length} Trips
                  </span>
                </div>

                {/* Shift Trip Cards List */}
                <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[600px]">
                  {shiftTrips.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      No trips scheduled for this shift.
                      {canManage && (
                        <div className="mt-2">
                          <button
                            onClick={() => {
                              setSelectedTripForEdit(null);
                              setIsTripModalOpen(true);
                            }}
                            className="text-[11px] text-orange-400 hover:underline"
                          >
                            + Dispatch a Trip
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    shiftTrips.map((t) => (
                      <div
                        key={t.id}
                        className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-all space-y-2 text-xs shadow-sm group"
                      >
                        {/* Top Bar: Trip # & Status */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20 text-[11px]">
                            {t.tripNumber}
                          </span>
                          <StatusBadge status={t.status} />
                        </div>

                        {/* Route Name */}
                        <div>
                          <div className="font-bold text-white text-xs line-clamp-1">
                            {t.routeName}
                          </div>
                          {t.clientCompanyName && (
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-blue-400 shrink-0" />
                              <span className="truncate">{t.clientCompanyName}</span>
                            </div>
                          )}
                        </div>

                        {/* Timing */}
                        <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px] bg-slate-900 p-1.5 rounded">
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{t.scheduledStartTime} - {t.scheduledEndTime}</span>
                        </div>

                        {/* Bus and Driver Info */}
                        <div className="space-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-slate-300">
                              <Bus className="w-3 h-3 text-emerald-400" />
                              {t.vehicleNumber}
                            </span>
                            <span>{t.passengerCount} Pax</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400 truncate">
                            <UserCheck className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="truncate">Capt. {t.driverName}</span>
                          </div>
                        </div>

                        {/* Delay Warning if active */}
                        {t.delayMinutes && t.delayMinutes > 0 ? (
                          <div className="text-[10px] bg-amber-950/40 text-amber-300 border border-amber-800/60 p-1 rounded font-medium">
                            +{t.delayMinutes} min delay
                          </div>
                        ) : null}

                        {/* Quick Card Controls */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                          <button
                            onClick={() => {
                              setDetailTripId(t.id);
                              setIsDetailOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded transition-colors text-[11px] flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Manifest
                          </button>

                          <div className="flex items-center gap-1">
                            {canManage && t.status === 'SCHEDULED' && (
                              <button
                                onClick={() => handleStartTrip(t)}
                                className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 rounded text-[11px] font-medium"
                              >
                                Start
                              </button>
                            )}

                            {canManage && (t.status === 'IN_PROGRESS' || t.status === 'BOARDING' || t.status === 'DELAYED') && (
                              <button
                                onClick={() => handleCompleteTrip(t)}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-medium"
                              >
                                Complete
                              </button>
                            )}

                            {canManage && t.status !== 'COMPLETED' && t.status !== 'CANCELLED' && (
                              <button
                                onClick={() => {
                                  setTripToDelay(t);
                                  setIsDelayModalOpen(true);
                                }}
                                className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded transition-colors"
                                title="Report Delay"
                              >
                                <Clock className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Vehicle Roster Matrix */
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Fleet Assignment Grid ({formattedDate})
            </span>
            <span className="text-xs text-slate-400">{vehicles.length} Vehicles Tracked</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Morning Shift</th>
                  <th className="px-4 py-3">Afternoon Shift</th>
                  <th className="px-4 py-3">Evening Shift</th>
                  <th className="px-4 py-3">Night Shift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/40 text-slate-200">
                {vehicles.map((v) => {
                  // Find trips for this vehicle on selected date
                  const allTripsForDay = [
                    ...shiftGroups.MORNING,
                    ...shiftGroups.AFTERNOON,
                    ...shiftGroups.EVENING,
                    ...shiftGroups.NIGHT,
                  ];
                  const vehTrips = allTripsForDay.filter((t) => t.vehicleId === v.id);

                  return (
                    <tr key={v.id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <Bus className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{v.vehicleNumber}</span>
                          <span className="text-slate-500 font-normal">({v.make})</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{v.capacity} Seats</td>

                      {['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'].map((shiftKey) => {
                        const trip = vehTrips.find((t) => t.shift === shiftKey);
                        return (
                          <td key={shiftKey} className="px-4 py-3">
                            {trip ? (
                              <div
                                onClick={() => {
                                  setDetailTripId(trip.id);
                                  setIsDetailOpen(true);
                                }}
                                className="bg-slate-950 p-2 rounded-lg border border-slate-800 cursor-pointer hover:border-orange-500/60 transition-colors"
                              >
                                <div className="font-mono text-[11px] text-orange-400 font-bold">
                                  {trip.tripNumber} ({trip.scheduledStartTime})
                                </div>
                                <div className="text-[11px] text-slate-300 truncate max-w-[130px]">
                                  {trip.routeName}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  Capt. {trip.driverName?.split(' ')[0]}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-600 font-mono text-[11px]">— Free —</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Schedule / Dispatch Trip */}
      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        onSuccess={() => {
          showToast({
            type: 'success',
            title: 'Schedule Updated',
            message: 'Trip added to the daily dispatch matrix.',
          });
          loadSchedule(true);
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
        onRefreshParent={() => loadSchedule(true)}
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
            message: 'Delay information recorded and alerted.',
          });
          loadSchedule(true);
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
            message: 'Trip removed from dispatch schedule.',
          });
          loadSchedule(true);
        }}
      />
    </div>
  );
};
