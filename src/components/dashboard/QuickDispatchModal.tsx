import React, { useState } from 'react';
import { Radio, Bus, User, MapPin, Clock, CheckCircle2, Shield } from 'lucide-react';
import { Modal } from '../ui/Modal.js';
import { Button } from '../ui/Button.js';
import { Input } from '../ui/Input.js';
import { Select } from '../ui/Select.js';
import { Vehicle, Driver, Route, Trip } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

interface QuickDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
  routes: Route[];
  onTripDispatched: (trip: any) => void;
}

export const QuickDispatchModal: React.FC<QuickDispatchModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  drivers,
  routes,
  onTripDispatched,
}) => {
  const toast = useToast();
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0]?.id || 'rt-001');
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    vehicles.find((v) => v.status === 'AVAILABLE')?.id || vehicles[0]?.id || 'veh-001'
  );
  const [selectedDriverId, setSelectedDriverId] = useState(
    drivers.find((d) => d.status === 'AVAILABLE')?.id || drivers[0]?.id || 'drv-001'
  );
  const [scheduledStartTime, setScheduledStartTime] = useState('06:30');
  const [scheduledEndTime, setScheduledEndTime] = useState('07:15');
  const [passengerCount, setPassengerCount] = useState<number>(24);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const route = routes.find((r) => r.id === selectedRouteId) || routes[0];
    const vehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
    const driver = drivers.find((d) => d.id === selectedDriverId) || drivers[0];

    const newTrip: Partial<Trip> = {
      tripNumber: `TRIP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      routeId: route?.id || 'rt-001',
      routeName: route?.routeName || 'Dubai Transit Corridor',
      vehicleId: vehicle?.id || 'veh-001',
      vehicleNumber: vehicle?.vehicleNumber || 'BUS-101',
      driverId: driver?.id || 'drv-001',
      driverName: driver?.name || 'Captain',
      driverPhone: driver?.phone || '+971 50 000 0000',
      scheduledDate: new Date().toISOString().slice(0, 10),
      scheduledStartTime,
      scheduledEndTime,
      status: 'IN_PROGRESS',
      passengerCount: Number(passengerCount) || 24,
      boardedPassengerCount: Number(passengerCount) || 24,
      currentStopIndex: 1,
      delayMinutes: 0,
      notes: 'Dispatched via Real-time Operations Control Room Console.',
    };

    setTimeout(() => {
      onTripDispatched(newTrip);
      setIsSubmitting(false);
      toast.success(
        'Trip Dispatched Successfully',
        `${newTrip.tripNumber} assigned to ${vehicle?.vehicleNumber} (${driver?.name})`
      );
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rapid Operations Dispatch & Shuttle Launch"
      description="Assign vehicle, driver captain, and route corridor for immediate or scheduled staff transfer."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Corridor Route
          </label>
          <Select
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            options={routes.map((r) => ({
              value: r.id,
              label: `${r.routeCode} — ${r.routeName}`,
            }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Assign Fleet Vehicle
            </label>
            <Select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              options={vehicles.map((v) => ({
                value: v.id,
                label: `${v.vehicleNumber} (${v.make} ${v.model} • ${v.capacity} Seats)`,
              }))}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Assign Captain
            </label>
            <Select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              options={drivers.map((d) => ({
                value: d.id,
                label: `${d.name} (${d.employeeId} • ${d.licenseCategory})`,
              }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Departure Time
            </label>
            <Input
              type="time"
              value={scheduledStartTime}
              onChange={(e) => setScheduledStartTime(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Est. Arrival Time
            </label>
            <Input
              type="time"
              value={scheduledEndTime}
              onChange={(e) => setScheduledEndTime(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Passengers
            </label>
            <Input
              type="number"
              min="1"
              max="60"
              value={passengerCount}
              onChange={(e) => setPassengerCount(Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
          <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>
            Automated telematics GPS tracking and RFID boarding logs will activate immediately upon dispatch authorization.
          </span>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<Radio className="w-3.5 h-3.5" />}
          >
            Authorize & Dispatch Shuttle
          </Button>
        </div>
      </form>
    </Modal>
  );
};
