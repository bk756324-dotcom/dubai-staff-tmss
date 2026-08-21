import React, { useState, useEffect, useCallback } from 'react';
import { Route, Client, Vehicle, Driver, Passenger } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { Button } from '../components/ui/Button.js';
import { Badge, StatusBadge } from '../components/ui/Badge.js';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table.js';
import { LoadingSpinner, EmptyState } from '../components/ui/States.js';
import { Modal } from '../components/ui/Modal.js';
import { RouteModal } from '../components/routes/RouteModal.js';
import { RouteDetailModal } from '../components/routes/RouteDetailModal.js';
import { AssignPassengersModal } from '../components/routes/AssignPassengersModal.js';
import { TripModal } from '../components/trips/TripModal.js';
import {
  MapPin,
  Plus,
  Search,
  Download,
  Eye,
  Edit2,
  Trash2,
  Users,
  Bus,
  UserCheck,
  Building2,
  Clock,
  Navigation,
  RefreshCw,
  Play,
  Layers,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface RouteManagementPageProps {
  navigate: (path: string) => void;
}

export const RouteManagementPage: React.FC<RouteManagementPageProps> = ({ navigate }) => {
  const { apiFetch, user } = useAuth();
  const { showToast } = useToast();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('ALL');
  const [selectedShift, setSelectedShift] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('routeName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailRouteId, setDetailRouteId] = useState<string | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignRoute, setAssignRoute] = useState<Route | null>(null);

  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchRoute, setDispatchRoute] = useState<Route | null>(null);

  // Deactivate modal
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [routeToDeactivate, setRouteToDeactivate] = useState<Route | null>(null);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  // Summary
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    runningToday: 0,
    totalAssignedPassengers: 0,
  });

  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'DISPATCHER';

  const loadData = useCallback(async (isRefresh = false) => {
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

      const [rtRes, clRes, vhRes, drRes, psRes] = await Promise.all([
        apiFetch(`/api/routes?${params.toString()}`),
        apiFetch('/api/clients'),
        apiFetch('/api/vehicles'),
        apiFetch('/api/drivers'),
        apiFetch('/api/passengers'),
      ]);

      if (rtRes && rtRes.success) {
        setRoutes(rtRes.data);
        if (rtRes.summary) setSummary(rtRes.summary);
      }
      if (clRes && clRes.success) setClients(clRes.data);
      if (vhRes && vhRes.success) setVehicles(vhRes.data);
      if (drRes && drRes.success) setDrivers(drRes.data);
      if (psRes && psRes.success) setPassengers(psRes.data);
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Data Fetch Error',
        message: err?.message || 'Failed to load route telemetry from database.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiFetch, searchQuery, selectedClientId, selectedShift, selectedStatus, sortBy, sortOrder, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeactivate = async () => {
    if (!routeToDeactivate) return;
    try {
      setDeactivateLoading(true);
      const res = await apiFetch(`/api/routes/${routeToDeactivate.id}`, { method: 'DELETE' });
      if (res && res.success) {
        showToast({
          type: 'success',
          title: 'Route Deactivated',
          message: res.message || 'Route status updated to INACTIVE.',
        });
        setIsDeactivateModalOpen(false);
        setRouteToDeactivate(null);
        loadData(true);
      } else {
        showToast({
          type: 'error',
          title: 'Deactivation Blocked',
          message: res?.error || 'Could not deactivate route.',
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: err?.message || 'Error occurred while updating route.',
      });
    } finally {
      setDeactivateLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (routes.length === 0) return;
    const headers = ['Route Code', 'Route Name', 'Client', 'Origin', 'Destination', 'Distance (km)', 'Stops', 'Assigned Bus', 'Captain', 'Shift', 'Departure', 'Status'];
    const rows = routes.map((r) => [
      r.routeCode,
      `"${r.routeName}"`,
      `"${r.clientCompanyName || 'General'}"`,
      `"${r.origin}"`,
      `"${r.destination}"`,
      r.distanceKm,
      r.stops?.length || 0,
      r.assignedVehicleNumber || 'Standby',
      `"${r.assignedDriverName || 'Standby'}"`,
      r.shift,
      r.morningDepartureTime || '—',
      r.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dubai_transport_routes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'info',
      title: 'Export Generated',
      message: `${routes.length} route records downloaded to CSV.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Routes & Stops Management</h1>
            <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-mono font-bold">
              RTA CORRIDORS
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Design corporate transport trajectories, configure geofenced stops, and allocate dedicated fleet & crew.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(true)}
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
                setSelectedRoute(null);
                setIsRouteModalOpen(true);
              }}
              icon={<Plus className="w-4 h-4" />}
            >
              Add New Route
            </Button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Total Corridors</div>
          <div className="text-2xl font-bold text-white mt-1">{summary.total}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Configured in system</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs text-emerald-400 font-medium">Active & Operational</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{summary.active}</div>
          <div className="text-[11px] text-emerald-500/70 mt-0.5">Ready for dispatch</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs text-orange-400 font-medium">Running Today</div>
          <div className="text-2xl font-bold text-orange-400 mt-1">{summary.runningToday}</div>
          <div className="text-[11px] text-orange-400/70 mt-0.5">Live trips scheduled</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs text-blue-400 font-medium">Allocated Passengers</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{summary.totalAssignedPassengers}</div>
          <div className="text-[11px] text-blue-400/70 mt-0.5">Across active routes</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 col-span-2 md:col-span-1">
          <div className="text-xs text-slate-400 font-medium">Standby / Inactive</div>
          <div className="text-2xl font-bold text-slate-300 mt-1">{summary.inactive + summary.suspended}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Off-peak or suspended</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search corridor, code, stops, bus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Client Filter */}
          <div>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Corporate Clients</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Shift Filter */}
          <div>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Shift Timings</option>
              <option value="MORNING">Morning (05:00 - 11:00)</option>
              <option value="AFTERNOON">Afternoon (11:00 - 16:00)</option>
              <option value="EVENING">Evening (16:00 - 21:00)</option>
              <option value="NIGHT">Night (21:00 - 05:00)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE Only</option>
              <option value="INACTIVE">INACTIVE Only</option>
              <option value="SUSPENDED">SUSPENDED Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Routes Data Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <LoadingSpinner size="lg" />
          <p className="text-sm mt-3">Connecting to Dubai Transit Routing Engine...</p>
        </div>
      ) : routes.length === 0 ? (
        <EmptyState
          title="No Route Corridors Found"
          description="No routes match your current filter criteria. Create a new corridor or reset filters."
          action={
            canManage ? (
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedRoute(null);
                  setIsRouteModalOpen(true);
                }}
                icon={<Plus className="w-4 h-4" />}
              >
                Create First Route
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
                  <TableHead className="w-16">Code</TableHead>
                  <TableHead>Corridor Name & Trajectory</TableHead>
                  <TableHead>Client & Shift</TableHead>
                  <TableHead>Checkpoints</TableHead>
                  <TableHead>Allocated Bus & Crew</TableHead>
                  <TableHead>Pax / Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((rt) => {
                  const assignedVehicle = vehicles.find((v) => v.id === rt.assignedVehicleId);
                  const passengerCount = (rt as any).passengerCount || rt.assignedPassengerIds?.length || 0;
                  const capacity = assignedVehicle?.capacity || 0;
                  const isOverCapacity = capacity > 0 && passengerCount > capacity;

                  return (
                    <TableRow
                      key={rt.id}
                      className="border-b border-slate-800/80 hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Code */}
                      <TableCell>
                        <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded">
                          {rt.routeCode}
                        </span>
                      </TableCell>

                      {/* Corridor & Trajectory */}
                      <TableCell>
                        <div>
                          <div className="font-bold text-sm text-white flex items-center gap-1.5">
                            {rt.routeName}
                            {(rt as any).runningToday && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-medium">
                                Active Today
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Navigation className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>{rt.origin}</span>
                            <span className="text-slate-600">→</span>
                            <span>{rt.destination}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {rt.distanceKm} km • ~{rt.estimatedDurationMinutes} mins transit
                          </div>
                        </div>
                      </TableCell>

                      {/* Client & Shift */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-slate-200 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-blue-400" />
                            {rt.clientCompanyName || 'General (Multi-Client)'}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>{rt.shift} ({rt.morningDepartureTime || '06:00'})</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Checkpoints */}
                      <TableCell>
                        <div className="text-xs">
                          <span className="font-semibold text-slate-200">{rt.stops?.length || 0} Stops</span>
                          <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                            {rt.stops?.[0]?.stopName || rt.origin}
                          </div>
                        </div>
                      </TableCell>

                      {/* Allocated Bus & Crew */}
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1 text-slate-300">
                            <Bus className="w-3.5 h-3.5 text-emerald-400" />
                            {rt.assignedVehicleNumber ? (
                              <span className="font-semibold text-slate-100">{rt.assignedVehicleNumber}</span>
                            ) : (
                              <span className="text-slate-500 italic">Dynamic Pool</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-slate-400">
                            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                            {rt.assignedDriverName ? (
                              <span>Capt. {rt.assignedDriverName.split(' ')[0]}</span>
                            ) : (
                              <span className="text-slate-500 italic">Unassigned</span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Pax / Capacity */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-medium">
                            <Users className="w-3.5 h-3.5 text-blue-400" />
                            <span className={isOverCapacity ? 'text-red-400 font-bold' : 'text-slate-200'}>
                              {passengerCount}
                            </span>
                            <span className="text-slate-500">/</span>
                            <span className="text-slate-400">{capacity > 0 ? capacity : '—'}</span>
                          </div>
                          {isOverCapacity && (
                            <span className="text-[10px] text-red-400 font-semibold bg-red-950/40 px-1 py-0.5 rounded border border-red-800/60 block">
                              ⚠️ Exceeded
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={rt.status} />
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Inspect Profile */}
                          <button
                            onClick={() => {
                              setDetailRouteId(rt.id);
                              setIsDetailOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-md transition-colors"
                            title="Inspect Route & Stops"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Assign Passengers */}
                          {canManage && (
                            <button
                              onClick={() => {
                                setAssignRoute(rt);
                                setIsAssignModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-md transition-colors"
                              title="Assign Passengers"
                            >
                              <Users className="w-4 h-4" />
                            </button>
                          )}

                          {/* Quick Dispatch Trip */}
                          {canManage && (
                            <button
                              onClick={() => {
                                setDispatchRoute(rt);
                                setIsDispatchModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-md transition-colors"
                              title="Dispatch Instant Trip"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit Route */}
                          {canManage && (
                            <button
                              onClick={() => {
                                setSelectedRoute(rt);
                                setIsRouteModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-md transition-colors"
                              title="Edit Route"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Deactivate */}
                          {canManage && rt.status === 'ACTIVE' && (
                            <button
                              onClick={() => {
                                setRouteToDeactivate(rt);
                                setIsDeactivateModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors"
                              title="Deactivate Route"
                            >
                              <Trash2 className="w-4 h-4" />
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

      {/* Modal 1: Create / Edit Route */}
      <RouteModal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        onSuccess={() => {
          showToast({
            type: 'success',
            title: 'Route Saved',
            message: 'Route corridor configuration saved successfully.',
          });
          loadData(true);
        }}
        route={selectedRoute}
        availableClients={clients}
        availableVehicles={vehicles}
        availableDrivers={drivers}
        availablePassengers={passengers}
        apiFetch={apiFetch}
      />

      {/* Modal 2: Route Profile Details Drawer */}
      <RouteDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailRouteId(null);
        }}
        routeId={detailRouteId}
        apiFetch={apiFetch}
        onEditRoute={(rt) => {
          setSelectedRoute(rt);
          setIsRouteModalOpen(true);
        }}
        onAssignPassengers={(rt) => {
          setAssignRoute(rt);
          setIsAssignModalOpen(true);
        }}
        onDispatchTrip={(rt) => {
          setDispatchRoute(rt);
          setIsDispatchModalOpen(true);
        }}
      />

      {/* Modal 3: Assign Passengers */}
      <AssignPassengersModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setAssignRoute(null);
        }}
        route={assignRoute}
        allPassengers={passengers}
        assignedVehicle={vehicles.find((v) => v.id === assignRoute?.assignedVehicleId)}
        apiFetch={apiFetch}
        onSuccess={() => {
          showToast({
            type: 'success',
            title: 'Manifest Updated',
            message: 'Passenger assignments saved successfully.',
          });
          loadData(true);
        }}
      />

      {/* Modal 4: Dispatch Trip from Route */}
      <TripModal
        isOpen={isDispatchModalOpen}
        onClose={() => {
          setIsDispatchModalOpen(false);
          setDispatchRoute(null);
        }}
        onSuccess={() => {
          showToast({
            type: 'success',
            title: 'Trip Dispatched',
            message: 'New trip has been successfully scheduled and dispatched.',
          });
          loadData(true);
        }}
        preselectedRoute={dispatchRoute}
        availableRoutes={routes}
        availableVehicles={vehicles}
        availableDrivers={drivers}
        apiFetch={apiFetch}
      />

      {/* Modal 5: Deactivate Confirmation */}
      <Modal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        title="Deactivate Route Corridor"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to set route <strong className="text-white">{routeToDeactivate?.routeName}</strong> ({routeToDeactivate?.routeCode}) to <span className="text-red-400 font-semibold">INACTIVE</span>?
          </p>
          <p className="text-xs text-slate-400">
            This corridor will no longer appear in automatic dispatch rotations. Active trips will not be deleted.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="outline" onClick={() => setIsDeactivateModalOpen(false)} disabled={deactivateLoading}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeactivate} loading={deactivateLoading}>
              Deactivate Route
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
