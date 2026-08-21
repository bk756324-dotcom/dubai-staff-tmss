import React, { useState, useEffect } from 'react';
import { Route, Passenger, Vehicle, Driver, Client } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { Button } from '../ui/Button.js';
import { Badge, StatusBadge } from '../ui/Badge.js';
import {
  MapPin,
  Bus,
  UserCheck,
  Building2,
  Clock,
  Navigation,
  Users,
  ShieldCheck,
  AlertTriangle,
  Play,
  Calendar,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface RouteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeId: string | null;
  apiFetch: (url: string, options?: RequestInit) => Promise<any>;
  onEditRoute: (route: Route) => void;
  onAssignPassengers: (route: Route) => void;
  onDispatchTrip: (route: Route) => void;
}

export const RouteDetailModal: React.FC<RouteDetailModalProps> = ({
  isOpen,
  onClose,
  routeId,
  apiFetch,
  onEditRoute,
  onAssignPassengers,
  onDispatchTrip,
}) => {
  const [routeData, setRouteData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'STOPS' | 'PASSENGERS' | 'RESOURCES'>('STOPS');

  useEffect(() => {
    if (isOpen && routeId) {
      fetchDetails(routeId);
    } else {
      setRouteData(null);
    }
  }, [isOpen, routeId]);

  const fetchDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch(`/api/routes/${id}`);
      if (res && res.success) {
        setRouteData(res.data);
      } else {
        setError(res?.error || 'Failed to load route details.');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error loading route profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const route: Route | null = routeData;
  const vehicle: Vehicle | undefined = routeData?.assignedVehicle;
  const driver: Driver | undefined = routeData?.assignedDriver;
  const client: Client | undefined = routeData?.client;
  const passengers: Passenger[] = routeData?.assignedPassengers || [];
  const stops = routeData?.stops || [];

  const vehicleCapacity = vehicle?.capacity || 0;
  const assignedCount = passengers.filter((p) => p.status === 'ACTIVE').length;
  const isOverCapacity = vehicleCapacity > 0 && assignedCount > vehicleCapacity;
  const capacityPercent = vehicleCapacity > 0 ? Math.min(Math.round((assignedCount / vehicleCapacity) * 100), 100) : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={route ? `Route Profile: ${route.routeName} (${route.routeCode})` : 'Route Corridor Profile'}
      size="xl"
    >
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Fetching route profile and checkpoint telemetry...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-950/40 border border-red-800 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      ) : route ? (
        <div className="space-y-6">
          {/* Header Summary Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded">
                  {route.routeCode}
                </span>
                <StatusBadge status={route.status} />
                <Badge variant="outline" className="text-xs">
                  {route.shift} SHIFT
                </Badge>
                {client && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    {client.companyName}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white">{route.routeName}</h3>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  {route.origin} → {route.destination}
                </span>
                <span>•</span>
                <span>{route.distanceKm} km</span>
                <span>•</span>
                <span>~{route.estimatedDurationMinutes} mins transit</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onAssignPassengers(route);
                }}
                icon={<Users className="w-4 h-4 text-blue-400" />}
              >
                Assign Pax ({assignedCount})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onEditRoute(route);
                }}
              >
                Edit
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  onDispatchTrip(route);
                }}
                icon={<Play className="w-4 h-4 text-white" />}
              >
                Dispatch Trip
              </Button>
            </div>
          </div>

          {/* Capacity Bar */}
          {vehicle && (
            <div className={`p-3 rounded-lg border text-xs ${isOverCapacity ? 'bg-red-950/30 border-red-800/80 text-red-300' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="flex items-center gap-1.5">
                  {isOverCapacity ? (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  )}
                  Vehicle Capacity Utilization: {assignedCount} / {vehicleCapacity} seats ({capacityPercent}%)
                </span>
                <span>Bus: {vehicle.vehicleNumber} ({vehicle.make} {vehicle.model})</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-300 ${isOverCapacity ? 'bg-red-500' : capacityPercent > 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                />
              </div>
              {isOverCapacity && (
                <p className="mt-1.5 text-xs text-red-400 font-semibold">
                  ⚠️ Capacity Exceeded: {assignedCount} passengers assigned exceeds {vehicleCapacity} available seats on {vehicle.vehicleNumber}. Please adjust passenger allocation or allocate a higher capacity bus.
                </p>
              )}
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-800 text-sm">
            <button
              onClick={() => setActiveTab('STOPS')}
              className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'STOPS'
                  ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Checkpoints & Stops ({stops.length})
            </button>
            <button
              onClick={() => setActiveTab('PASSENGERS')}
              className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'PASSENGERS'
                  ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Assigned Passengers ({passengers.length})
            </button>
            <button
              onClick={() => setActiveTab('RESOURCES')}
              className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'RESOURCES'
                  ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              Operational Resources
            </button>
          </div>

          {/* Tab 1: Stops Timeline */}
          {activeTab === 'STOPS' && (
            <div className="space-y-3">
              <div className="relative pl-6 border-l-2 border-slate-800 space-y-6 my-2">
                {stops.map((stop: any, idx: number) => (
                  <div key={stop.id || idx} className="relative">
                    {/* Timeline Node */}
                    <div
                      className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0
                          ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                          : idx === stops.length - 1
                          ? 'bg-orange-500 text-slate-950 ring-4 ring-orange-500/20'
                          : 'bg-slate-800 text-cyan-400 border border-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                        <span className="font-semibold text-white text-sm flex items-center gap-2">
                          {stop.stopName}
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                            {stop.stopType}
                          </Badge>
                        </span>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1 font-mono text-cyan-400">
                            <Clock className="w-3.5 h-3.5" />
                            ETA: {stop.scheduledTime} | Dep: {stop.departureTime}
                          </span>
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                            Geofence: {stop.geofenceRadiusMeters || 80}m
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400 flex items-center gap-4 flex-wrap">
                        {stop.address && <span>📍 {stop.address}</span>}
                        {stop.landmark && <span className="text-slate-400 italic">Landmark: {stop.landmark}</span>}
                        {stop.passengerCount > 0 && (
                          <span className="text-emerald-400 font-medium">👥 {stop.passengerCount} boarding</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Passengers Manifest */}
          {activeTab === 'PASSENGERS' && (
            <div className="space-y-3">
              {passengers.length === 0 ? (
                <div className="py-12 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
                  <Users className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                  <p className="text-sm font-medium text-slate-300">No passengers assigned to this route.</p>
                  <p className="text-xs text-slate-500 mt-1">Assign corporate staff to streamline manifest and RFID logging.</p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      onClose();
                      onAssignPassengers(route);
                    }}
                  >
                    Assign Passengers Now
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto max-h-80 overflow-y-auto rounded-lg border border-slate-800">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold sticky top-0">
                      <tr>
                        <th className="px-3 py-2">Emp ID</th>
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Pickup Point</th>
                        <th className="px-3 py-2">Drop Point</th>
                        <th className="px-3 py-2">Shift</th>
                        <th className="px-3 py-2">RFID Tag</th>
                        <th className="px-3 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/60 text-slate-200">
                      {passengers.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/40">
                          <td className="px-3 py-2 font-mono font-medium text-orange-400">{p.employeeId}</td>
                          <td className="px-3 py-2 font-medium text-white">{p.name}</td>
                          <td className="px-3 py-2 text-slate-300">{p.pickupPoint}</td>
                          <td className="px-3 py-2 text-slate-300">{p.dropPoint}</td>
                          <td className="px-3 py-2">{p.shift}</td>
                          <td className="px-3 py-2 font-mono text-slate-400">{p.rfidCardNumber || '—'}</td>
                          <td className="px-3 py-2">
                            <StatusBadge status={p.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Operational Resources */}
          {activeTab === 'RESOURCES' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dedicated Bus */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Bus className="w-4 h-4 text-emerald-400" />
                    Dedicated Vehicle
                  </span>
                  {vehicle && <StatusBadge status={vehicle.status} />}
                </div>

                {vehicle ? (
                  <div className="space-y-2 text-xs">
                    <div className="text-base font-bold text-white flex items-center gap-2">
                      {vehicle.vehicleNumber}
                      <span className="text-xs font-normal text-slate-400 font-mono">
                        Plate: {vehicle.registrationNumber}
                      </span>
                    </div>
                    <p className="text-slate-300">
                      {vehicle.make} {vehicle.model} ({vehicle.year}) — {vehicle.vehicleType.replace('_', ' ')}
                    </p>
                    <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-slate-400">
                      <div>Capacity: <strong className="text-white">{vehicle.capacity} Seats</strong></div>
                      <div>Fuel: <strong className="text-white">{vehicle.fuelType}</strong></div>
                      <div>RTA Permit: <strong className="text-emerald-400">Valid</strong></div>
                      <div>Odometer: <strong className="text-white">{vehicle.currentMileageKm?.toLocaleString()} km</strong></div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">No dedicated bus assigned. Will use dynamic dispatch pool.</p>
                )}
              </div>

              {/* Dedicated Captain */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    Assigned Captain
                  </span>
                  {driver && <StatusBadge status={driver.status} />}
                </div>

                {driver ? (
                  <div className="space-y-2 text-xs">
                    <div className="text-base font-bold text-white">
                      {driver.name}
                    </div>
                    <p className="text-slate-300">Emp ID: {driver.employeeId} | {driver.phone}</p>
                    <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-slate-400">
                      <div>RTA Permit: <strong className="text-emerald-400 font-mono">{driver.rtaCardNumber}</strong></div>
                      <div>Safety Score: <strong className="text-amber-400">{driver.safetyRating} ★</strong></div>
                      <div>Total Trips: <strong className="text-white">{driver.totalTripsCompleted || 0}</strong></div>
                      <div>License: <strong className="text-white">{driver.licenseCategory}</strong></div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">No primary captain assigned. Dispatched dynamically per shift.</p>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
