import React, { useState, useEffect } from 'react';
import { Route, RouteStop, Client, Vehicle, Driver, Passenger } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { Input } from '../ui/Input.js';
import { Select } from '../ui/Select.js';
import { Button } from '../ui/Button.js';
import { Alert } from '../ui/Alert.js';
import {
  MapPin,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Bus,
  UserCheck,
  Building2,
  Clock,
  Navigation,
  AlertTriangle,
  Layers,
} from 'lucide-react';

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedRoute?: Route) => void;
  route?: Route | null;
  availableClients: Client[];
  availableVehicles: Vehicle[];
  availableDrivers: Driver[];
  availablePassengers?: Passenger[];
  apiFetch: (url: string, options?: RequestInit) => Promise<any>;
}

export const RouteModal: React.FC<RouteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  route,
  availableClients,
  availableVehicles,
  availableDrivers,
  availablePassengers = [],
  apiFetch,
}) => {
  const isEdit = Boolean(route);

  const [formData, setFormData] = useState({
    routeName: '',
    routeCode: '',
    description: '',
    origin: '',
    destination: '',
    distanceKm: 28,
    estimatedDurationMinutes: 45,
    clientId: '',
    assignedVehicleId: '',
    assignedDriverId: '',
    shift: 'MORNING' as 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
    morningDepartureTime: '06:00',
    eveningReturnTime: '18:00',
    operatingDays: ['SUN', 'MON', 'TUE', 'WED', 'THU'] as string[],
  });

  const [stops, setStops] = useState<Partial<RouteStop>[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (route) {
      setFormData({
        routeName: route.routeName || '',
        routeCode: route.routeCode || '',
        description: route.description || '',
        origin: route.origin || '',
        destination: route.destination || '',
        distanceKm: route.distanceKm || 25,
        estimatedDurationMinutes: route.estimatedDurationMinutes || 40,
        clientId: route.clientId || '',
        assignedVehicleId: route.assignedVehicleId || '',
        assignedDriverId: route.assignedDriverId || '',
        shift: (route.shift as any) || 'MORNING',
        status: route.status || 'ACTIVE',
        morningDepartureTime: route.morningDepartureTime || '06:00',
        eveningReturnTime: route.eveningReturnTime || '18:00',
        operatingDays: route.operatingDays || ['SUN', 'MON', 'TUE', 'WED', 'THU'],
      });
      setStops(
        route.stops && route.stops.length > 0
          ? [...route.stops].sort((a, b) => a.sequence - b.sequence)
          : [
              {
                id: `stp-1`,
                sequence: 1,
                stopName: route.origin || 'Origin Terminal',
                landmark: 'Main Gate',
                address: route.origin || 'Dubai',
                scheduledTime: '06:00',
                departureTime: '06:05',
                stopType: 'PICKUP',
                geofenceRadiusMeters: 80,
                passengerCount: 0,
              },
              {
                id: `stp-2`,
                sequence: 2,
                stopName: route.destination || 'Destination Facility',
                landmark: 'Employee Entrance',
                address: route.destination || 'Dubai',
                scheduledTime: '06:45',
                departureTime: '06:50',
                stopType: 'DROP',
                geofenceRadiusMeters: 80,
                passengerCount: 0,
              },
            ]
      );
    } else {
      const defaultVehicle = availableVehicles.find((v) => v.status === 'AVAILABLE') || availableVehicles[0];
      const defaultDriver = availableDrivers.find((d) => d.status === 'AVAILABLE') || availableDrivers[0];

      setFormData({
        routeName: '',
        routeCode: `RT-${Math.floor(100 + Math.random() * 900)}`,
        description: 'Dedicated daily corporate staff shuttle line with geofenced checkpoints.',
        origin: 'Al Quoz Industrial Area 3',
        destination: 'Dubai International Airport (DXB) Terminal 3 Cargo',
        distanceKm: 32,
        estimatedDurationMinutes: 45,
        clientId: availableClients[0]?.id || '',
        assignedVehicleId: defaultVehicle?.id || '',
        assignedDriverId: defaultDriver?.id || '',
        shift: 'MORNING',
        status: 'ACTIVE',
        morningDepartureTime: '06:15',
        eveningReturnTime: '18:30',
        operatingDays: ['SUN', 'MON', 'TUE', 'WED', 'THU'],
      });

      setStops([
        {
          id: `stp-new-1`,
          sequence: 1,
          stopName: 'Al Quoz Staff Accommodations Gate 2',
          landmark: 'Near Central Mosque',
          address: 'Al Quoz Industrial Area 3, Dubai',
          scheduledTime: '06:15',
          departureTime: '06:20',
          stopType: 'PICKUP',
          geofenceRadiusMeters: 80,
          passengerCount: 14,
        },
        {
          id: `stp-new-2`,
          sequence: 2,
          stopName: 'Business Bay Metro Feeder Stop',
          landmark: 'Opposite Bay Square',
          address: 'Business Bay, Dubai',
          scheduledTime: '06:35',
          departureTime: '06:40',
          stopType: 'BOTH',
          geofenceRadiusMeters: 80,
          passengerCount: 10,
        },
        {
          id: `stp-new-3`,
          sequence: 3,
          stopName: 'DXB Cargo Gate 7 & Logistics Hub',
          landmark: 'Main Security Checkpoint',
          address: 'Dubai International Airport Cargo Terminal 3',
          scheduledTime: '07:00',
          departureTime: '07:05',
          stopType: 'DROP',
          geofenceRadiusMeters: 100,
          passengerCount: 0,
        },
      ]);
    }
    setErrorMessage(null);
  }, [route, isOpen, availableClients, availableVehicles, availableDrivers]);

  const toggleDay = (day: string) => {
    if (formData.operatingDays.includes(day)) {
      setFormData({ ...formData, operatingDays: formData.operatingDays.filter((d) => d !== day) });
    } else {
      setFormData({ ...formData, operatingDays: [...formData.operatingDays, day] });
    }
  };

  const handleAddStop = () => {
    const newSeq = stops.length + 1;
    const newStop: Partial<RouteStop> = {
      id: `stp-temp-${Date.now()}`,
      sequence: newSeq,
      stopName: `Transit Checkpoint ${newSeq}`,
      landmark: 'Main Roadside Shelter',
      address: 'Dubai Corridor',
      scheduledTime: '06:30',
      departureTime: '06:35',
      stopType: 'BOTH',
      geofenceRadiusMeters: 80,
      passengerCount: 0,
    };
    setStops([...stops, newStop]);
  };

  const handleRemoveStop = (index: number) => {
    if (stops.length <= 2) {
      setErrorMessage('A route must have at least 2 stops (Origin & Destination).');
      return;
    }
    const updated = stops.filter((_, idx) => idx !== index).map((s, idx) => ({ ...s, sequence: idx + 1 }));
    setStops(updated);
  };

  const handleMoveStop = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stops.length) return;

    const list = [...stops];
    const item = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = item;

    const reordered = list.map((s, idx) => ({ ...s, sequence: idx + 1 }));
    setStops(reordered);
  };

  const handleStopChange = (index: number, field: keyof RouteStop, value: any) => {
    const list = [...stops];
    list[index] = { ...list[index], [field]: value };
    setStops(list);
  };

  // Selected vehicle capacity check
  const selectedVehicle = availableVehicles.find((v) => v.id === formData.assignedVehicleId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.routeName.trim() || !formData.routeCode.trim() || !formData.origin.trim() || !formData.destination.trim()) {
      setErrorMessage('Please fill in Route Name, Code, Origin, and Destination.');
      return;
    }

    if (stops.length < 2) {
      setErrorMessage('At least two valid stops (Origin and Destination) are required.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        distanceKm: Number(formData.distanceKm) || 25,
        estimatedDurationMinutes: Number(formData.estimatedDurationMinutes) || 45,
        stops: stops.map((s, idx) => ({
          ...s,
          sequence: idx + 1,
          latitude: Number(s.latitude) || 25.15 + idx * 0.02,
          longitude: Number(s.longitude) || 55.25 + idx * 0.02,
          geofenceRadiusMeters: Number(s.geofenceRadiusMeters) || 80,
          passengerCount: Number(s.passengerCount) || 0,
        })),
      };

      const url = isEdit ? `/api/routes/${route!.id}` : '/api/routes';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res && res.success) {
        onSuccess(res.data);
        onClose();
      } else {
        setErrorMessage(res?.error || 'Failed to save route. Please check the inputs.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'A network error occurred while updating the route.');
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = [
    { key: 'SUN', label: 'Sun' },
    { key: 'MON', label: 'Mon' },
    { key: 'TUE', label: 'Tue' },
    { key: 'WED', label: 'Wed' },
    { key: 'THU', label: 'Thu' },
    { key: 'FRI', label: 'Fri' },
    { key: 'SAT', label: 'Sat' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Route Corridor — ${route?.routeName}` : 'Create New Transport Route'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <Alert variant="danger" title="Validation Error" message={errorMessage} />
        )}

        {/* Section 1: Route Identity */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-orange-400" />
              1. Route Identity & Corporate Client
            </h4>
            <span className="text-xs text-slate-400">RTA Corridor Spec</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Route Name / Title"
                placeholder="e.g. DIP 2 to JAFZA South Line 1"
                value={formData.routeName}
                onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                label="Route Code"
                placeholder="e.g. RT-DIP-01"
                value={formData.routeCode}
                onChange={(e) => setFormData({ ...formData, routeCode: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Corporate Client
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-orange-500"
              >
                <option value="">-- General / Multi-Client Shared --</option>
                {availableClients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName} ({client.industry})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Operational Shift
              </label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-orange-500"
              >
                <option value="MORNING">Morning Shift (05:00 - 11:00)</option>
                <option value="AFTERNOON">Afternoon Shift (11:00 - 16:00)</option>
                <option value="EVENING">Evening Shift (16:00 - 21:00)</option>
                <option value="NIGHT">Night Shift (21:00 - 05:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-orange-500"
              >
                <option value="ACTIVE">ACTIVE (Operational)</option>
                <option value="INACTIVE">INACTIVE (Standby)</option>
                <option value="SUSPENDED">SUSPENDED (Temporary)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Origin, Destination & Fleet Allocation */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bus className="w-4 h-4 text-emerald-400" />
              2. Trajectory & Dedicated Resource Allocation
            </h4>
            {selectedVehicle && (
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded">
                Vehicle Capacity: {selectedVehicle.capacity} seats ({selectedVehicle.vehicleType.replace('_', ' ')})
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Origin Terminal / Area"
              placeholder="e.g. Al Quoz Industrial Accommodation 3"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              required
            />
            <Input
              label="Destination Facility / HQ"
              placeholder="e.g. Dubai Airport Cargo Terminal 3"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                label="Distance (km)"
                type="number"
                value={formData.distanceKm}
                onChange={(e) => setFormData({ ...formData, distanceKm: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Input
                label="Est. Duration (mins)"
                type="number"
                value={formData.estimatedDurationMinutes}
                onChange={(e) => setFormData({ ...formData, estimatedDurationMinutes: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Assigned Vehicle
              </label>
              <select
                value={formData.assignedVehicleId}
                onChange={(e) => setFormData({ ...formData, assignedVehicleId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Standby / No Vehicle --</option>
                {availableVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vehicleNumber} — {v.make} {v.model} ({v.capacity} seats) [{v.status}]
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Assigned Captain
              </label>
              <select
                value={formData.assignedDriverId}
                onChange={(e) => setFormData({ ...formData, assignedDriverId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Standby / No Driver --</option>
                {availableDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.employeeId}) [{d.status}]
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Operating Days & Timing */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Operating Days
              </label>
              <div className="flex flex-wrap gap-1.5">
                {daysOfWeek.map((day) => {
                  const active = formData.operatingDays.includes(day.key);
                  return (
                    <button
                      type="button"
                      key={day.key}
                      onClick={() => toggleDay(day.key)}
                      className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                        active
                          ? 'bg-orange-500 text-white border-orange-400 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Input
                label="Morning Pickup Time"
                type="time"
                value={formData.morningDepartureTime}
                onChange={(e) => setFormData({ ...formData, morningDepartureTime: e.target.value })}
              />
            </div>

            <div>
              <Input
                label="Evening Return Time"
                type="time"
                value={formData.eveningReturnTime}
                onChange={(e) => setFormData({ ...formData, eveningReturnTime: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Interactive Stop Sequencer */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                3. Checkpoints & Stop Manifest ({stops.length} Stops)
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure pickup and dropoff coordinates, geofence radius, and scheduled times along the corridor.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddStop}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Checkpoint
            </Button>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {stops.map((stop, idx) => (
              <div
                key={stop.id || idx}
                className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-200">
                      {idx === 0 ? 'ORIGIN (START)' : idx === stops.length - 1 ? 'DESTINATION (END)' : `TRANSIT STOP ${idx + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveStop(idx, 'UP')}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === stops.length - 1}
                      onClick={() => handleMoveStop(idx, 'DOWN')}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(idx)}
                      className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-red-950/40"
                      title="Delete Stop"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Stop Name / Location Landmark"
                      value={stop.stopName || ''}
                      onChange={(e) => handleStopChange(idx, 'stopName', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Landmark / Notes"
                      value={stop.landmark || ''}
                      onChange={(e) => handleStopChange(idx, 'landmark', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <select
                      value={stop.stopType || 'BOTH'}
                      onChange={(e) => handleStopChange(idx, 'stopType', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="PICKUP">Pickup Only</option>
                      <option value="DROP">Dropoff Only</option>
                      <option value="BOTH">Pickup & Dropoff</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Scheduled Time (e.g. 06:15)"
                      value={stop.scheduledTime || '06:30'}
                      onChange={(e) => handleStopChange(idx, 'scheduledTime', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Departure Time (e.g. 06:20)"
                      value={stop.departureTime || '06:35'}
                      onChange={(e) => handleStopChange(idx, 'departureTime', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Geofence (m) e.g. 80"
                      value={stop.geofenceRadiusMeters || 80}
                      onChange={(e) => handleStopChange(idx, 'geofenceRadiusMeters', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Expected Pax"
                      value={stop.passengerCount || 0}
                      onChange={(e) => handleStopChange(idx, 'passengerCount', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEdit ? 'Save Route Changes' : 'Create Route Corridor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
