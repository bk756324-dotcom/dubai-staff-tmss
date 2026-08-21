import React, { useState } from 'react';
import {
  X,
  Bus,
  UserCheck,
  MapPin,
  Clock,
  Gauge,
  Flame,
  Snowflake,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Phone,
  Radio,
  Building2,
  RotateCw,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext.js';

interface VehicleTelematicsDrawerProps {
  vehicle: any | null;
  onClose: () => void;
  onRefresh: () => void;
  navigate: (path: string) => void;
}

export const VehicleTelematicsDrawer: React.FC<VehicleTelematicsDrawerProps> = ({
  vehicle,
  onClose,
  onRefresh,
  navigate,
}) => {
  const toast = useToast();
  const [isUpdatingStop, setIsUpdatingStop] = useState(false);

  if (!vehicle) return null;

  const isMoving = vehicle.speedKmh > 0 && vehicle.engineStatus === 'ON';
  const isIdle = vehicle.speedKmh === 0 && vehicle.engineStatus !== 'OFF';
  const isDelayed = (vehicle.delayMinutes || 0) > 0 || vehicle.tripStatus === 'DELAYED';

  const handleProgressStop = async () => {
    if (!vehicle.activeTripId) {
      toast.info('No Active Trip', 'No active trip linked to this vehicle.');
      return;
    }

    setIsUpdatingStop(true);
    try {
      const nextIdx = (vehicle.completedStopsCount || 0) + 1;
      const res = await fetch(`/api/trips/${vehicle.activeTripId}/stop-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stopIndex: nextIdx,
          action: 'COMPLETED',
          notes: `Check-in recorded via Live Telematics Dispatch console.`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Stop Recorded', data.message || 'Stop checkpoint recorded successfully.');
        onRefresh();
      } else {
        toast.error('Update Failed', data.error || 'Failed to update stop checkpoint.');
      }
    } catch (err) {
      toast.error('Network Error', 'Network error updating stop progress.');
    } finally {
      setIsUpdatingStop(false);
    }
  };

  return (
    <div id="vehicle-telematics-drawer" className="bg-[#0A192F] text-slate-100 rounded-xl border border-slate-800 p-5 shadow-2xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-white">{vehicle.vehicleNumber}</h3>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  isDelayed
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : isMoving
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : isIdle
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-700/50 text-slate-300 border-slate-600'
                }`}
              >
                {isDelayed ? 'DELAYED' : isMoving ? 'IN TRANSIT' : isIdle ? 'IDLE / AC ON' : 'PARKED'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {vehicle.vehicleMake} {vehicle.vehicleModel} • {vehicle.registrationNumber || 'DXB-N-77341'} • {vehicle.capacity || 50} Seats
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Inspector"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Simulated Telematics Mode Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-2.5 text-xs text-amber-200">
        <Radio className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">SIMULATED TELEMATICS MODE</span> — Live coordinates, OBD-II speed, and fuel telemetry are powered by the Dubai Virtual Transport Simulator.
        </div>
      </div>

      {/* Telemetry Sensor Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex flex-col">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Speed</span>
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {vehicle.speedKmh || 0} <span className="text-xs text-slate-400 font-normal">km/h</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1">Heading: {vehicle.headingDegrees || 0}°</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex flex-col">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Fuel Level</span>
            <Flame className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {vehicle.fuelLevelPercent || 80}%
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full ${
                (vehicle.fuelLevelPercent || 80) < 25 ? 'bg-rose-500' : 'bg-orange-500'
              }`}
              style={{ width: `${vehicle.fuelLevelPercent || 80}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex flex-col">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Cabin AC</span>
            <Snowflake className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono flex items-center gap-1.5">
            <span>{vehicle.acStatus === 'ON' ? '21.5°C' : 'OFF'}</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">
            Dual Blower {vehicle.acStatus === 'ON' ? 'Active' : 'Standby'}
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex flex-col">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Engine</span>
            <Radio className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-white uppercase mt-1">
            {vehicle.engineStatus || 'ON'}
          </div>
          <span className="text-[10px] text-slate-400 mt-auto">
            {vehicle.lastUpdatedText || 'Live ping'}
          </span>
        </div>
      </div>

      {/* Driver Captain Profile Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold">
            <UserCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Assigned Captain</div>
            <div className="font-bold text-sm text-white">{vehicle.driverName || 'Captain Assigned'}</div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>★ {vehicle.driverRating || 4.9} RTA Rating</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> RTA Certified
              </span>
            </div>
          </div>
        </div>

        {vehicle.driverPhone && (
          <a
            href={`tel:${vehicle.driverPhone}`}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Call Driver</span>
          </a>
        )}
      </div>

      {/* Active Trip & Real-Time Progress Bar */}
      {vehicle.activeTripId ? (
        <div className="bg-[#071322] border border-slate-800 rounded-lg p-4 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-orange-400 font-semibold tracking-wider uppercase flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Active Trip: {vehicle.tripNumber || 'TRP-DISPATCH'}</span>
              </div>
              <div className="font-bold text-sm text-white mt-0.5">{vehicle.routeName || 'Dubai Transit Shuttle'}</div>
              {vehicle.clientName && (
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3 text-slate-500" />
                  <span>Corporate Client: {vehicle.clientName}</span>
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Estimated Arrival</div>
              <div className="text-base font-bold text-emerald-400 font-mono">
                {vehicle.estimatedArrivalMinutes || 12} mins
              </div>
              {vehicle.delayMinutes > 0 && (
                <span className="text-[10px] text-rose-400 font-medium">
                  +{vehicle.delayMinutes}m delay
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar & Checkpoints */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Trip Progress: {vehicle.progressPercent || 50}%</span>
              <span>
                Stop {vehicle.completedStopsCount || 0} of {vehicle.totalStopsCount || 4} Completed
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${vehicle.progressPercent || 50}%` }}
              ></div>
            </div>
          </div>

          {/* Next Stop Waypoint Indicator */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <div>
                <span className="text-slate-400">Next Scheduled Waypoint:</span>
                <div className="font-bold text-white">{vehicle.nextStopName || 'Al Quoz Staff Camp 3'}</div>
              </div>
            </div>

            <button
              onClick={handleProgressStop}
              disabled={isUpdatingStop || (vehicle.progressPercent || 0) >= 100}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingStop ? (
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Complete Next Stop</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
          <Clock className="w-6 h-6 text-slate-500" />
          <span>Vehicle is currently idle in depot pool. No active trip in progress.</span>
          <button
            onClick={() => navigate('/app/schedule')}
            className="text-orange-400 hover:underline font-semibold flex items-center gap-1 mt-1"
          >
            <span>Assign in Shift Matrix</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
        <button
          onClick={() => navigate(`/app/fleet`)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          View Full Vehicle Profile →
        </button>

        <button
          onClick={() => navigate(`/app/maintenance`)}
          className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
        >
          Schedule Maintenance →
        </button>
      </div>
    </div>
  );
};
