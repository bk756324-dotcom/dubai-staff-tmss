import React, { useState, useEffect } from 'react';
import { Trip, Route, Vehicle, Driver } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { Input } from '../ui/Input.js';
import { Button } from '../ui/Button.js';
import { Alert } from '../ui/Alert.js';
import {
  Clock,
  Bus,
  UserCheck,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  ShieldAlert,
} from 'lucide-react';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (trip?: Trip) => void;
  trip?: Trip | null; // If editing
  preselectedRoute?: Route | null;
  availableRoutes: Route[];
  availableVehicles: Vehicle[];
  availableDrivers: Driver[];
  apiFetch: (url: string, options?: RequestInit) => Promise<any>;
}

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  trip,
  preselectedRoute,
  availableRoutes,
  availableVehicles,
  availableDrivers,
  apiFetch,
}) => {
  const isEdit = Boolean(trip);

  const [formData, setFormData] = useState({
    routeId: '',
    vehicleId: '',
    driverId: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledStartTime: '06:00',
    scheduledEndTime: '07:30',
    shift: 'MORNING' as 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT',
    passengerCount: 24,
    notes: 'Dispatched via Dubai Transport Management Control Room.',
  });

  const [loading, setLoading] = useState(false);
  const [conflictChecking, setConflictChecking] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (trip) {
      setFormData({
        routeId: trip.routeId || '',
        vehicleId: trip.vehicleId || '',
        driverId: trip.driverId || '',
        scheduledDate: trip.scheduledDate || new Date().toISOString().split('T')[0],
        scheduledStartTime: trip.scheduledStartTime || '06:00',
        scheduledEndTime: trip.scheduledEndTime || '07:30',
        shift: trip.shift || 'MORNING',
        passengerCount: trip.passengerCount || 24,
        notes: trip.notes || '',
      });
    } else if (preselectedRoute) {
      const defaultVeh = preselectedRoute.assignedVehicleId || (availableVehicles.find((v) => v.status === 'AVAILABLE')?.id || availableVehicles[0]?.id || '');
      const defaultDrv = preselectedRoute.assignedDriverId || (availableDrivers.find((d) => d.status === 'AVAILABLE')?.id || availableDrivers[0]?.id || '');

      setFormData({
        routeId: preselectedRoute.id,
        vehicleId: defaultVeh,
        driverId: defaultDrv,
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledStartTime: preselectedRoute.morningDepartureTime || '06:15',
        scheduledEndTime: '07:30',
        shift: (preselectedRoute.shift as any) || 'MORNING',
        passengerCount: preselectedRoute.assignedPassengerIds?.length || 24,
        notes: `Operational dispatch for corridor ${preselectedRoute.routeName}.`,
      });
    } else {
      const activeRoute = availableRoutes.find((r) => r.status === 'ACTIVE') || availableRoutes[0];
      const defaultVeh = activeRoute?.assignedVehicleId || (availableVehicles.find((v) => v.status === 'AVAILABLE')?.id || availableVehicles[0]?.id || '');
      const defaultDrv = activeRoute?.assignedDriverId || (availableDrivers.find((d) => d.status === 'AVAILABLE')?.id || availableDrivers[0]?.id || '');

      setFormData({
        routeId: activeRoute?.id || '',
        vehicleId: defaultVeh,
        driverId: defaultDrv,
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledStartTime: activeRoute?.morningDepartureTime || '06:15',
        scheduledEndTime: '07:30',
        shift: (activeRoute?.shift as any) || 'MORNING',
        passengerCount: activeRoute?.assignedPassengerIds?.length || 24,
        notes: 'Dispatched via Dubai Transport Management Control Room.',
      });
    }
    setConflictWarning(null);
    setErrorMessage(null);
  }, [trip, preselectedRoute, availableRoutes, availableVehicles, availableDrivers, isOpen]);

  // When selected route changes, auto-fill defaults
  const handleRouteChange = (newRouteId: string) => {
    const r = availableRoutes.find((route) => route.id === newRouteId);
    if (r) {
      setFormData((prev) => ({
        ...prev,
        routeId: newRouteId,
        vehicleId: r.assignedVehicleId || prev.vehicleId,
        driverId: r.assignedDriverId || prev.driverId,
        shift: (r.shift as any) || prev.shift,
        scheduledStartTime: r.morningDepartureTime || prev.scheduledStartTime,
        passengerCount: r.assignedPassengerIds?.length || prev.passengerCount,
      }));
    } else {
      setFormData((prev) => ({ ...prev, routeId: newRouteId }));
    }
  };

  // Live Conflict Check
  useEffect(() => {
    if (!formData.scheduledDate || !formData.scheduledStartTime || !formData.scheduledEndTime || !formData.vehicleId || !formData.driverId) {
      return;
    }

    const checkConflicts = async () => {
      try {
        setConflictChecking(true);
        const res = await apiFetch('/api/schedule/check-conflict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: formData.scheduledDate,
            startTime: formData.scheduledStartTime,
            endTime: formData.scheduledEndTime,
            vehicleId: formData.vehicleId,
            driverId: formData.driverId,
            excludeTripId: trip?.id,
          }),
        });

        if (res && res.hasConflict) {
          let warn = '';
          if (res.vehicleConflict) {
            warn += `⚠️ Vehicle Conflict: Bus is already booked on ${res.vehicleConflict.tripNumber} (${res.vehicleConflict.timeRange}) for "${res.vehicleConflict.routeName}". `;
          }
          if (res.driverConflict) {
            warn += `⚠️ Driver Captain Conflict: Driver is already assigned to ${res.driverConflict.tripNumber} (${res.driverConflict.timeRange}) for "${res.driverConflict.routeName}".`;
          }
          setConflictWarning(warn);
        } else {
          setConflictWarning(null);
        }
      } catch {
        // silent fail on conflict checker
      } finally {
        setConflictChecking(false);
      }
    };

    const timer = setTimeout(checkConflicts, 400);
    return () => clearTimeout(timer);
  }, [formData.scheduledDate, formData.scheduledStartTime, formData.scheduledEndTime, formData.vehicleId, formData.driverId, trip?.id, apiFetch]);

  const selectedVehicle = availableVehicles.find((v) => v.id === formData.vehicleId);
  const selectedDriver = availableDrivers.find((d) => d.id === formData.driverId);
  const selectedRoute = availableRoutes.find((r) => r.id === formData.routeId);

  const vehicleCapacity = selectedVehicle?.capacity || 0;
  const isOverCapacity = vehicleCapacity > 0 && formData.passengerCount > vehicleCapacity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.routeId || !formData.vehicleId || !formData.driverId) {
      setErrorMessage('Route corridor, assigned vehicle, and captain are required.');
      return;
    }

    if (isOverCapacity) {
      setErrorMessage(`Capacity exceeded: Passenger count (${formData.passengerCount}) exceeds vehicle capacity (${vehicleCapacity} seats).`);
      return;
    }

    try {
      setLoading(true);

      const url = isEdit ? `/api/trips/${trip!.id}` : '/api/trips';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res && res.success) {
        onSuccess(res.data);
        onClose();
      } else {
        setErrorMessage(res?.error || 'Failed to dispatch trip.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error occurred while communicating with dispatch server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Trip Schedule — ${trip?.tripNumber}` : 'Schedule & Dispatch New Trip'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && <Alert variant="danger" title="Dispatch Error" message={errorMessage} />}

        {conflictWarning && (
          <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-lg text-xs text-amber-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-200">Dispatch Warning Detected:</strong>
              {conflictWarning}
            </div>
          </div>
        )}

        {/* Route Corridor Selection */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            1. Select Route Corridor
          </label>
          <select
            value={formData.routeId}
            onChange={(e) => handleRouteChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
            required
          >
            <option value="">-- Choose Route Corridor --</option>
            {availableRoutes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.routeCode} — {r.routeName} ({r.origin} → {r.destination}) [{r.shift}]
              </option>
            ))}
          </select>

          {selectedRoute && (
            <div className="text-xs text-slate-400 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/60 flex items-center justify-between">
              <span>📍 {selectedRoute.origin} → {selectedRoute.destination}</span>
              <span className="text-orange-400 font-mono font-medium">{selectedRoute.distanceKm} km • {selectedRoute.stops?.length || 0} stops</span>
            </div>
          )}
        </div>

        {/* Fleet & Crew Assignment */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>2. Fleet & Captain Assignment</span>
            {selectedVehicle && (
              <span className="text-[11px] text-emerald-400 font-normal">
                Capacity: {selectedVehicle.capacity} seats ({selectedVehicle.vehicleType.replace('_', ' ')})
              </span>
            )}
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Assigned Vehicle</label>
              <select
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                required
              >
                <option value="">-- Select Bus --</option>
                {availableVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vehicleNumber} ({v.make} {v.model}) [{v.capacity} Seats] - {v.status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Driver Captain</label>
              <select
                value={formData.driverId}
                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                required
              >
                <option value="">-- Select Driver --</option>
                {availableDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.employeeId}) [{d.phone}] - {d.status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Timing & Shift Matrix */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            3. Scheduled Date & Operational Shift
          </label>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <Input
                label="Date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                label="Start Time"
                type="time"
                value={formData.scheduledStartTime}
                onChange={(e) => setFormData({ ...formData, scheduledStartTime: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                label="End Time"
                type="time"
                value={formData.scheduledEndTime}
                onChange={(e) => setFormData({ ...formData, scheduledEndTime: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Shift
              </label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
              >
                <option value="MORNING">Morning (05:00-11:00)</option>
                <option value="AFTERNOON">Afternoon (11:00-16:00)</option>
                <option value="EVENING">Evening (16:00-21:00)</option>
                <option value="NIGHT">Night (21:00-05:00)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div>
              <Input
                label="Planned Passenger Load"
                type="number"
                value={formData.passengerCount}
                onChange={(e) => setFormData({ ...formData, passengerCount: Number(e.target.value) })}
                required
              />
              {isOverCapacity && (
                <span className="text-xs text-red-400 mt-1 block">
                  Exceeds vehicle capacity of {vehicleCapacity} seats!
                </span>
              )}
            </div>
            <div>
              <Input
                label="Operational Dispatch Notes"
                placeholder="Optional control room instructions..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} disabled={isOverCapacity}>
            {isEdit ? 'Save Trip Changes' : 'Confirm Dispatch Schedule'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
