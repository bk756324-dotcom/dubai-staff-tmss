import React, { useState, useEffect } from 'react';
import {
  Activity,
  Radio,
  RefreshCw,
  Plus,
  Bus,
  Users,
  MapPin,
  Calendar,
  AlertTriangle,
  Clock,
  Shield,
  Layers,
  Phone,
  CheckCircle2,
  TrendingUp,
  FileCheck2,
  Building2,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { KpiMetricsGrid } from '../components/dashboard/KpiMetricsGrid.js';
import { LiveFleetMap } from '../components/dashboard/LiveFleetMap.js';
import { ActiveTripsTable } from '../components/dashboard/ActiveTripsTable.js';
import { DubaiCorridorStatus } from '../components/dashboard/DubaiCorridorStatus.js';
import { ComplianceWatchdog } from '../components/dashboard/ComplianceWatchdog.js';
import { LiveOperationsFeed } from '../components/dashboard/LiveOperationsFeed.js';
import { RoleSpecificViews } from '../components/dashboard/RoleSpecificViews.js';
import { QuickDispatchModal } from '../components/dashboard/QuickDispatchModal.js';
import { Button } from '../components/ui/Button.js';
import { Modal } from '../components/ui/Modal.js';
import { LoadingSpinner } from '../components/ui/States.js';
import { StatusBadge } from '../components/ui/Badge.js';
import {
  Vehicle,
  Driver,
  Trip,
  Route,
  VehicleLocation,
  DocumentRecord,
  NotificationRecord,
} from '../types/index.js';

interface OperationsDashboardProps {
  navigate: (path: string) => void;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({ navigate }) => {
  const { user, apiFetch } = useAuth();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  // Core Data States
  const [kpiData, setKpiData] = useState<any>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [locations, setLocations] = useState<VehicleLocation[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  // Modals
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedTripDetails, setSelectedTripDetails] = useState<Trip | null>(null);

  // Load all operational data
  const loadDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    try {
      const [
        kpisRes,
        vehiclesRes,
        driversRes,
        routesRes,
        tripsRes,
        locationsRes,
        documentsRes,
        notificationsRes,
      ] = await Promise.all([
        apiFetch('/api/reports/kpis'),
        apiFetch('/api/vehicles'),
        apiFetch('/api/drivers'),
        apiFetch('/api/routes'),
        apiFetch('/api/trips'),
        apiFetch('/api/tracking/live'),
        apiFetch('/api/documents'),
        apiFetch('/api/notifications'),
      ]);

      if (kpisRes.success) setKpiData(kpisRes.data);
      if (vehiclesRes.success) setVehicles(vehiclesRes.data || []);
      if (driversRes.success) setDrivers(driversRes.data || []);
      if (routesRes.success) setRoutes(routesRes.data || []);
      if (tripsRes.success) setTrips(tripsRes.data || []);
      if (locationsRes.success) setLocations(locationsRes.data || []);
      if (documentsRes.success) setDocuments(documentsRes.data || []);
      if (notificationsRes.success) setNotifications(notificationsRes.data || []);

      const now = new Date();
      setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      if (isManualRefresh) {
        toast.success('Operations Telemetry Synced', 'Live fleet & trip status updated.');
      }
    } catch (err: any) {
      toast.error('Sync Failed', err.message || 'Could not fetch live dashboard metrics.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Auto refresh every 20 seconds
    const interval = setInterval(() => {
      loadDashboardData(false);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const handleTripDispatched = (newTrip: Partial<Trip>) => {
    setTrips((prev) => [newTrip as Trip, ...prev]);
    // Also mark vehicle as ON_TRIP
    if (newTrip.vehicleId) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === newTrip.vehicleId ? { ...v, status: 'ON_TRIP' } : v))
      );
    }
  };

  const handleMarkAllRead = async () => {
    await apiFetch('/api/notifications/mark-all-read', { method: 'POST' });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('Alerts Updated', 'All operational alerts marked as read.');
  };

  if (isLoading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Initializing Dubai Staff Transport Control Center..." />
      </div>
    );
  }

  const activeRole = user?.role || 'ADMIN';

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Real-time Telematics Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-900 text-white uppercase tracking-wider">
              Dubai Control Room
            </span>
            <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Shift: Peak Corridor Transit (Active)</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
            Transport Operations Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Enterprise telematics, real-time GPS fleet radar, automated dispatch scheduling, and RTA compliance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="text-right hidden sm:block pr-2 border-r border-slate-200">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Telemetry Sync</p>
            <p className="text-xs font-bold text-slate-700 font-mono">{lastUpdated}</p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => loadDashboardData(true)}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync Radar
          </Button>

          {(activeRole === 'ADMIN' || activeRole === 'MANAGER' || activeRole === 'DISPATCHER') && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsDispatchModalOpen(true)}
              leftIcon={<Radio className="w-3.5 h-3.5" />}
            >
              Rapid Dispatch
            </Button>
          )}
        </div>
      </div>

      {/* 2. Role-Specific Tailored Views (Driver or Client Persona) */}
      <RoleSpecificViews
        role={activeRole}
        userName={user?.name}
        onNavigate={navigate}
      />

      {/* 3. Executive KPI Cards Bar */}
      <KpiMetricsGrid
        kpiData={kpiData}
        onNavigate={navigate}
      />

      {/* 4. Interactive Live Fleet Radar Map (Central Command View) */}
      <LiveFleetMap
        locations={locations}
        vehicles={vehicles}
        onSelectVehicle={(veh) => {
          // Can scroll or trigger details
        }}
      />

      {/* 5. Live Trips Dispatch Matrix Table */}
      <ActiveTripsTable
        trips={trips}
        onInspectTrip={(trip) => setSelectedTripDetails(trip)}
        onOpenDispatchModal={() => setIsDispatchModalOpen(true)}
      />

      {/* 6. Dual Column Operations Grid: Corridors & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dubai Transit Corridors Matrix */}
        <div className="lg:col-span-7">
          <DubaiCorridorStatus />
        </div>

        {/* Right: RTA & Permits Compliance Watchdog */}
        <div className="lg:col-span-5">
          <ComplianceWatchdog
            documents={documents}
            onNavigate={navigate}
          />
        </div>
      </div>

      {/* 7. Live Incident & Event Feed */}
      <LiveOperationsFeed
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />

      {/* Quick Dispatch Modal */}
      <QuickDispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        vehicles={vehicles}
        drivers={drivers}
        routes={routes}
        onTripDispatched={handleTripDispatched}
      />

      {/* Trip Details Inspector Modal */}
      {selectedTripDetails && (
        <Modal
          isOpen={!!selectedTripDetails}
          onClose={() => setSelectedTripDetails(null)}
          title={`Trip Details: ${selectedTripDetails.tripNumber}`}
          description={`Route: ${selectedTripDetails.routeName}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  alert(`Calling Captain ${selectedTripDetails.driverName}: ${selectedTripDetails.driverPhone}`);
                }}
                leftIcon={<Phone className="w-3.5 h-3.5 text-emerald-600" />}
              >
                Contact Captain
              </Button>
              <Button
                size="sm"
                variant="navy"
                onClick={() => setSelectedTripDetails(null)}
              >
                Close Inspector
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Assigned Bus</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {selectedTripDetails.vehicleNumber}
                </p>
                <p className="text-[11px] text-slate-500">Dubai Commercial Passenger</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Captain</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {selectedTripDetails.driverName}
                </p>
                <p className="text-[11px] text-slate-500">{selectedTripDetails.driverPhone}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Schedule & Timetable</span>
                <StatusBadge status={selectedTripDetails.status} />
              </div>
              <div className="flex items-center gap-4 text-slate-600 font-mono">
                <span>Start: {selectedTripDetails.scheduledStartTime}</span>
                <span>•</span>
                <span>ETA: {selectedTripDetails.scheduledEndTime}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {selectedTripDetails.notes || 'Normal transit condition along E311 corridor.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-700">Passenger Load Factor</span>
                <span className="font-bold text-orange-600">
                  {selectedTripDetails.boardedPassengerCount} / {selectedTripDetails.passengerCount} (
                  {Math.round(
                    (selectedTripDetails.boardedPassengerCount / (selectedTripDetails.passengerCount || 1)) * 100
                  )}
                  %)
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (selectedTripDetails.boardedPassengerCount /
                          (selectedTripDetails.passengerCount || 1)) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
