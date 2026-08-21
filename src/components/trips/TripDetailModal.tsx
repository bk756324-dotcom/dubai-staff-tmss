import React, { useState, useEffect } from 'react';
import { Trip, Passenger } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { Button } from '../ui/Button.js';
import { Badge, StatusBadge } from '../ui/Badge.js';
import {
  Clock,
  Bus,
  UserCheck,
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Play,
  Check,
  Radio,
  CreditCard,
  XCircle,
  Users,
  Navigation,
} from 'lucide-react';

interface TripDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string | null;
  apiFetch: (url: string, options?: RequestInit) => Promise<any>;
  onStartTrip: (trip: Trip) => void;
  onCompleteTrip: (trip: Trip) => void;
  onDelayTrip: (trip: Trip) => void;
  onCancelTrip: (trip: Trip) => void;
  onRefreshParent: () => void;
}

export const TripDetailModal: React.FC<TripDetailModalProps> = ({
  isOpen,
  onClose,
  tripId,
  apiFetch,
  onStartTrip,
  onCompleteTrip,
  onDelayTrip,
  onCancelTrip,
  onRefreshParent,
}) => {
  const [tripData, setTripData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boardingLoadingId, setBoardingLoadingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'MANIFEST' | 'ROUTE_STOPS' | 'TELEMETRY'>('MANIFEST');

  useEffect(() => {
    if (isOpen && tripId) {
      fetchTripDetails(tripId);
    } else {
      setTripData(null);
    }
  }, [isOpen, tripId]);

  const fetchTripDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch(`/api/trips/${id}`);
      if (res && res.success) {
        setTripData(res.data);
      } else {
        setError(res?.error || 'Failed to load trip telemetry.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error communicating with dispatch server.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBoarding = async (passengerId: string, currentBoarded: boolean) => {
    if (!tripData) return;
    try {
      setBoardingLoadingId(passengerId);
      const res = await apiFetch(`/api/trips/${tripData.id}/passenger-board`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passengerId,
          boarded: !currentBoarded,
        }),
      });

      if (res && res.success) {
        // Refresh local details
        fetchTripDetails(tripData.id);
        onRefreshParent();
      }
    } catch (err) {
      // silent
    } finally {
      setBoardingLoadingId(null);
    }
  };

  if (!isOpen) return null;

  const trip: Trip | null = tripData;
  const route = tripData?.route;
  const vehicle = tripData?.vehicle;
  const driver = tripData?.driver;
  const manifest: any[] = tripData?.passengerManifest || [];
  const stops: any[] = route?.stops || [];
  const location = tripData?.location;

  const boardedCount = manifest.filter((p) => p.boarded).length;
  const totalManifest = manifest.length || trip?.passengerCount || 0;
  const boardingRate = totalManifest > 0 ? Math.round((boardedCount / totalManifest) * 100) : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={trip ? `Trip Manifest & Operations — ${trip.tripNumber}` : 'Trip Details'}
      size="xl"
    >
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Connecting to fleet telemetry & RFID card readers...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-950/40 border border-red-800 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      ) : trip ? (
        <div className="space-y-5">
          {/* Header Summary */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30 px-2 py-0.5 rounded">
                  {trip.tripNumber}
                </span>
                <StatusBadge status={trip.status} />
                <Badge variant="outline" className="text-xs">
                  {trip.shift} SHIFT
                </Badge>
                <span className="text-xs text-slate-400 font-mono">
                  {trip.scheduledDate} ({trip.scheduledStartTime} - {trip.scheduledEndTime})
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{trip.routeName}</h3>

              <div className="flex items-center gap-4 text-xs text-slate-400 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Bus className="w-3.5 h-3.5 text-emerald-400" />
                  {trip.vehicleNumber}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Capt. {trip.driverName} ({trip.driverPhone})
                </span>
                {trip.clientCompanyName && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" />
                      {trip.clientCompanyName}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {trip.status === 'SCHEDULED' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onStartTrip(trip);
                  }}
                  icon={<Play className="w-4 h-4 text-white" />}
                >
                  Start Trip
                </Button>
              )}

              {(trip.status === 'IN_PROGRESS' || trip.status === 'BOARDING' || trip.status === 'DELAYED') && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onCompleteTrip(trip);
                  }}
                  icon={<CheckCircle2 className="w-4 h-4 text-white" />}
                  className="bg-emerald-600 hover:bg-emerald-500"
                >
                  Complete Trip
                </Button>
              )}

              {trip.status !== 'COMPLETED' && trip.status !== 'CANCELLED' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onClose();
                      onDelayTrip(trip);
                    }}
                    icon={<Clock className="w-4 h-4 text-amber-400" />}
                  >
                    Delay
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onClose();
                      onCancelTrip(trip);
                    }}
                    icon={<XCircle className="w-4 h-4 text-red-400" />}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Delay / Incident Alert Banner if active */}
          {trip.status === 'DELAYED' && (
            <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-lg text-xs text-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>
                  <strong>TRIP DELAYED by +{trip.delayMinutes} mins.</strong> Reason: {trip.delayReason || 'Traffic congestion'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-amber-400">Control Room Alert Dispatched</span>
            </div>
          )}

          {/* Boarding Progress Bar */}
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium text-slate-300">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                Passenger Boarding Progress: {boardedCount} / {totalManifest} Boarded ({boardingRate}%)
              </span>
              <span className="text-slate-400">RFID Scanner: Active</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${boardingRate}%` }}
              />
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-800 text-sm">
            <button
              onClick={() => setActiveTab('MANIFEST')}
              className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'MANIFEST'
                  ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Passenger Boarding Manifest ({manifest.length})
            </button>
            <button
              onClick={() => setActiveTab('ROUTE_STOPS')}
              className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'ROUTE_STOPS'
                  ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Route Checkpoints ({stops.length})
            </button>
            <button
              onClick={() => setActiveTab('TELEMETRY')}
              className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'TELEMETRY'
                  ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-4 h-4 text-orange-400" />
              Vehicle Telemetry & GPS
            </button>
          </div>

          {/* Tab 1: Passenger Manifest with RFID Tap / Boarding Toggle */}
          {activeTab === 'MANIFEST' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Click "Board / Tap" to simulate passenger RFID card boarding check-in.</span>
                <span>{boardedCount} Checked In</span>
              </div>

              <div className="max-h-80 overflow-y-auto rounded-lg border border-slate-800 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold sticky top-0">
                    <tr>
                      <th className="px-3 py-2">Emp ID</th>
                      <th className="px-3 py-2">Passenger Name</th>
                      <th className="px-3 py-2">Pickup Point</th>
                      <th className="px-3 py-2">Dropoff Point</th>
                      <th className="px-3 py-2">RFID Badge</th>
                      <th className="px-3 py-2 text-center">Boarding Status</th>
                      <th className="px-3 py-2 text-right">RFID Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60 text-slate-200">
                    {manifest.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-slate-500">
                          No specific passenger roster assigned. General staff allocation ({trip.passengerCount} pax).
                        </td>
                      </tr>
                    ) : (
                      manifest.map((p) => {
                        const isBoardingThis = boardingLoadingId === p.id;
                        return (
                          <tr key={p.id} className="hover:bg-slate-800/40">
                            <td className="px-3 py-2 font-mono font-medium text-orange-400">{p.employeeId}</td>
                            <td className="px-3 py-2 font-medium text-white">{p.name}</td>
                            <td className="px-3 py-2 text-slate-300">{p.pickupPoint}</td>
                            <td className="px-3 py-2 text-slate-300">{p.dropPoint}</td>
                            <td className="px-3 py-2 font-mono text-[11px] text-slate-400">{p.rfidCardNumber || 'RFID-GEN'}</td>
                            <td className="px-3 py-2 text-center">
                              {p.boarded ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/60">
                                  <Check className="w-3 h-3" /> Boarded
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-500">Pending</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button
                                type="button"
                                disabled={isBoardingThis}
                                onClick={() => handleToggleBoarding(p.id, p.boarded)}
                                className={`text-[11px] px-2.5 py-1 rounded border font-medium transition-colors ${
                                  p.boarded
                                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                                }`}
                              >
                                {p.boarded ? 'Unboard' : 'Tap Card (Board)'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Route Checkpoints */}
          {activeTab === 'ROUTE_STOPS' && (
            <div className="space-y-3">
              <div className="relative pl-6 border-l-2 border-slate-800 space-y-4 my-2">
                {stops.length === 0 ? (
                  <p className="text-xs text-slate-500">Origin to Destination direct line.</p>
                ) : (
                  stops.map((stop: any, idx: number) => (
                    <div key={stop.id || idx} className="relative">
                      <div
                        className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 0
                            ? 'bg-emerald-500 text-slate-950'
                            : idx === stops.length - 1
                            ? 'bg-orange-500 text-slate-950'
                            : 'bg-slate-800 text-cyan-400 border border-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </div>

                      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{stop.stopName}</span>
                          <span className="text-cyan-400 font-mono">
                            {stop.scheduledTime} | {stop.stopType}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">{stop.address || stop.landmark || 'Dubai Checkpoint'}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Telemetry & Vehicle Details */}
          {activeTab === 'TELEMETRY' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Radio className="w-4 h-4 text-orange-400" />
                  Live GPS & Telemetry Engine
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-400 pt-2 border-t border-slate-800">
                  <div>Current Speed: <strong className="text-white">{location ? `${location.speed} km/h` : '62 km/h'}</strong></div>
                  <div>Fuel Level: <strong className="text-emerald-400">{location ? `${location.fuelLevel}%` : '84%'}</strong></div>
                  <div>Ignition: <strong className="text-emerald-400">{location?.ignition ? 'ON' : 'ON'}</strong></div>
                  <div>Heading: <strong className="text-white">{location ? `${location.heading}°` : '180° S'}</strong></div>
                  <div>Lat/Long: <strong className="text-slate-300 font-mono">{location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : '25.0450, 55.2010'}</strong></div>
                  <div>Provider: <strong className="text-orange-400">RTA Glonass/GPS</strong></div>
                </div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  Captain Credentials
                </span>
                <div className="space-y-1 text-slate-400">
                  <div>Captain: <strong className="text-white">{trip.driverName}</strong></div>
                  <div>Phone: <strong className="text-white">{trip.driverPhone}</strong></div>
                  <div>Vehicle: <strong className="text-white">{trip.vehicleNumber}</strong></div>
                  <div>Passenger Capacity: <strong className="text-white">{vehicle?.capacity || trip.passengerCount} seats</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end pt-3 border-t border-slate-800">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
