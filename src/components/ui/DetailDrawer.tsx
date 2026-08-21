import React from 'react';
import {
  X,
  Bus,
  UserCheck,
  Building2,
  Users,
  MapPin,
  Clock,
  Shield,
  FileCheck2,
  Wrench,
  Phone,
  Calendar,
  Radio,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from './Button.js';
import { StatusBadge } from './Badge.js';
import { Vehicle, Driver, Trip, Route, Client, Passenger } from '../../types/index.js';

export type DrawerEntityType = 'vehicle' | 'driver' | 'trip' | 'client' | 'passenger';

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: DrawerEntityType | null;
  data: any | null;
  navigate?: (path: string) => void;
  onAction?: (actionName: string, item: any) => void;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  isOpen,
  onClose,
  entityType,
  data,
  navigate,
  onAction,
}) => {
  if (!isOpen || !data || !entityType) return null;

  const renderVehicleContent = (vehicle: Vehicle) => {
    return (
      <div className="space-y-5">
        {/* Header Summary Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0A192F] text-white border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/30">
              Commercial Fleet Bus
            </span>
            <StatusBadge status={vehicle.status} />
          </div>
          <h3 className="text-xl font-extrabold font-heading text-white">{vehicle.vehicleNumber}</h3>
          <p className="text-xs text-slate-300">
            Plate: <span className="font-mono font-bold text-white">{vehicle.registrationNumber}</span> ({vehicle.plateCategory || 'Commercial Transport'})
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400">Make & Model</span>
              <p className="font-semibold text-slate-200">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Passenger Capacity</span>
              <p className="font-semibold text-slate-200">{vehicle.capacity} Luxury Seats</p>
            </div>
          </div>
        </div>

        {/* Assigned Captain */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Assigned Driver Captain</span>
            {vehicle.assignedDriverName ? (
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Assigned
              </span>
            ) : (
              <span className="text-[11px] font-bold text-amber-600">Unassigned</span>
            )}
          </div>
          {vehicle.assignedDriverName ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-extrabold text-slate-900">{vehicle.assignedDriverName}</p>
                <p className="text-xs text-slate-500 font-mono">DRV Captain ID</p>
              </div>
              {onAction && (
                <Button size="sm" variant="outline" onClick={() => onAction('call_driver', vehicle)}>
                  <Phone className="w-3.5 h-3.5 mr-1" /> Contact
                </Button>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No primary captain assigned. Vehicle is in pool.</p>
          )}
        </div>

        {/* Dubai Regulatory & Mulkiya Compliance */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-orange-500" />
            <span>RTA & Mulkiya Compliance</span>
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Mulkiya Expiry</span>
              <p className="font-mono font-bold text-slate-900">{vehicle.registrationExpiry || '2027-02-15'}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Insurance Policy</span>
              <p className="font-mono font-bold text-slate-900">{vehicle.insuranceExpiry || '2027-01-20'}</p>
            </div>
          </div>
        </div>

        {/* Telemetry & Mileage */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
            <span>Odometer & Fuel</span>
            <span className="font-mono font-bold text-orange-600">{(vehicle.currentMileageKm || 142500).toLocaleString()} KM</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400">Fuel Type</span>
              <p className="font-bold text-slate-800">{vehicle.fuelType || 'DIESEL'}</p>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400">Next Service In</span>
              <p className="font-bold text-slate-800">4,500 KM</p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onClose();
              if (navigate) navigate('/app/tracking');
            }}
            leftIcon={<Radio className="w-3.5 h-3.5 text-orange-500" />}
          >
            Live GPS Telemetry
          </Button>
          <Button
            size="sm"
            variant="navy"
            onClick={() => {
              onClose();
              if (navigate) navigate('/app/maintenance');
            }}
            leftIcon={<Wrench className="w-3.5 h-3.5" />}
          >
            Maintenance Log
          </Button>
        </div>
      </div>
    );
  };

  const renderDriverContent = (driver: Driver) => {
    return (
      <div className="space-y-5">
        {/* Header Summary */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0A192F] text-white border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              RTA Certified Captain
            </span>
            <StatusBadge status={driver.status} />
          </div>
          <h3 className="text-xl font-extrabold font-heading text-white">{driver.name}</h3>
          <p className="text-xs text-slate-300">
            Employee ID: <span className="font-mono font-bold text-orange-400">{driver.employeeId}</span>
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400">Safety Index Rating</span>
              <p className="font-bold text-amber-400">★ {driver.safetyRating || '4.95'} / 5.0</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Total Trips Completed</span>
              <p className="font-bold text-white">{driver.totalTripsCompleted || 148} Trips</p>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider">Contact & Credentials</span>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Phone Number:</span>
              <span className="font-mono font-bold text-slate-800">{driver.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Corporate Email:</span>
              <span className="font-medium text-slate-800">{driver.email || 'captain@dubaitransport.ae'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">License Category:</span>
              <span className="font-bold text-slate-800">{driver.licenseCategory || 'Heavy Bus (Category 6)'}</span>
            </div>
          </div>
        </div>

        {/* RTA Compliance & Permits */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>RTA Permit & Visa Expiry</span>
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase">RTA Driver Permit</span>
              <p className="font-mono font-bold text-slate-900">{driver.rtaCardExpiry || '2026-11-30'}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase">UAE Driving License</span>
              <p className="font-mono font-bold text-slate-900">{driver.licenseExpiry || '2027-06-15'}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onClose();
              if (navigate) navigate('/app/schedule');
            }}
            leftIcon={<Calendar className="w-3.5 h-3.5" />}
          >
            Duty Schedule
          </Button>
          <Button
            size="sm"
            variant="navy"
            onClick={() => {
              onClose();
              if (navigate) navigate('/app/documents');
            }}
            leftIcon={<FileCheck2 className="w-3.5 h-3.5" />}
          >
            Captain Documents
          </Button>
        </div>
      </div>
    );
  };

  const renderTripContent = (trip: Trip) => {
    return (
      <div className="space-y-5">
        {/* Header Summary */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0A192F] text-white border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/30">
              Scheduled Staff Dispatch
            </span>
            <StatusBadge status={trip.status} />
          </div>
          <h3 className="text-xl font-extrabold font-heading text-white">{trip.tripNumber}</h3>
          <p className="text-xs text-slate-300 font-semibold">{trip.routeName}</p>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400">Scheduled Timetable</span>
              <p className="font-mono font-bold text-slate-200">
                {trip.scheduledStartTime} → {trip.scheduledEndTime}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Passenger Load</span>
              <p className="font-bold text-orange-400">{trip.boardedPassengerCount || 0} / {trip.passengerCount || 28}</p>
            </div>
          </div>
        </div>

        {/* Resources Allocated */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Bus Assigned</span>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">{trip.vehicleNumber}</p>
            <p className="text-[11px] text-slate-500">Commercial Heavy Bus</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Captain Assigned</span>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">{trip.driverName}</p>
            <p className="text-[11px] text-slate-500">{trip.driverPhone}</p>
          </div>
        </div>

        {/* Trip Timeline & Manifest Progress */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>Dispatch Timeline & Stops</span>
          </span>
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold">Departure Terminal: Al Quoz Central</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span className="font-semibold">En Route Corridor: Sheikh Zayed Road (E11)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span>Arrival: Dubai Investment Park 2</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onClose();
              if (navigate) navigate('/app/tracking');
            }}
            leftIcon={<Radio className="w-3.5 h-3.5 text-orange-500" />}
          >
            Track on Map
          </Button>
          <Button
            size="sm"
            variant="navy"
            onClick={() => {
              onClose();
              if (navigate) navigate('/app/passengers');
            }}
            leftIcon={<Users className="w-3.5 h-3.5" />}
          >
            View Manifest
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-2xs transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2 text-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                Inspector • {entityType.toUpperCase()}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {entityType === 'vehicle' && renderVehicleContent(data)}
            {entityType === 'driver' && renderDriverContent(data)}
            {entityType === 'trip' && renderTripContent(data)}
            {entityType !== 'vehicle' && entityType !== 'driver' && entityType !== 'trip' && (
              <div className="text-xs text-slate-500">
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
