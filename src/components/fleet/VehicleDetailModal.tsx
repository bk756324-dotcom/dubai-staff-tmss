import React from 'react';
import { Vehicle } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { Badge, StatusBadge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import {
  Bus,
  Calendar,
  ShieldCheck,
  Wrench,
  UserCheck,
  MapPin,
  Gauge,
  Fuel,
  FileText,
  AlertTriangle,
  Clock,
  Edit,
} from 'lucide-react';

interface VehicleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onEdit: (vehicle: Vehicle) => void;
  onStatusChange?: (vehicle: Vehicle, newStatus: string) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onEdit,
  onStatusChange,
}) => {
  if (!vehicle) return null;

  // Helper to calculate days remaining
  const getDaysRemaining = (dateStr: string) => {
    if (!dateStr) return { days: 0, status: 'UNKNOWN' };
    const target = new Date(dateStr).getTime();
    const today = new Date().getTime();
    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { days: diffDays, status: 'EXPIRED' };
    if (diffDays <= 30) return { days: diffDays, status: 'EXPIRING_SOON' };
    return { days: diffDays, status: 'VALID' };
  };

  const regStatus = getDaysRemaining(vehicle.registrationExpiry);
  const insStatus = getDaysRemaining(vehicle.insuranceExpiry);
  const rtaStatus = getDaysRemaining(vehicle.rtaPermitExpiry);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Vehicle Dossier: ${vehicle.vehicleNumber}`}
      description={`${vehicle.make} ${vehicle.model} (${vehicle.year}) — Plate: ${vehicle.registrationNumber}`}
      maxWidth="xl"
    >
      <div className="space-y-5 pt-1">
        {/* Top Header Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-heading tracking-tight">{vehicle.vehicleNumber}</h3>
                <StatusBadge status={vehicle.status} />
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {vehicle.make} {vehicle.model} • {vehicle.capacity} Passenger Seats • {vehicle.fuelType}
              </p>
            </div>
          </div>

          {/* Dubai Number Plate Display */}
          <div className="px-3.5 py-2 rounded-lg bg-white text-slate-900 border-2 border-slate-300 font-mono font-bold text-center tracking-wider shadow-inner self-stretch sm:self-auto">
            <div className="text-[9px] uppercase tracking-widest text-slate-500 font-sans border-b border-slate-200 pb-0.5 mb-0.5">
              DUBAI • {vehicle.plateCategory?.split(' ')[1] || 'TRANSPORT'}
            </div>
            <div className="text-sm text-slate-950">{vehicle.registrationNumber}</div>
          </div>
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span>Odometer</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-mono">
              {vehicle.currentMileageKm ? `${vehicle.currentMileageKm.toLocaleString()} km` : '0 km'}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              <span>Fuel / Power</span>
            </div>
            <div className="text-sm font-semibold text-slate-900">{vehicle.fuelType || 'DIESEL'}</div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Model Year</span>
            </div>
            <div className="text-sm font-semibold text-slate-900">{vehicle.year}</div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Wrench className="w-3.5 h-3.5 text-slate-400" />
              <span>Workshop Service</span>
            </div>
            <div className="text-xs font-semibold text-slate-900">
              {vehicle.nextMaintenanceDate || 'Not Scheduled'}
            </div>
          </div>
        </div>

        {/* Operational Assignments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Driver Card */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              <UserCheck className="w-4 h-4 text-orange-500" />
              <span>Assigned Driver Captain</span>
            </div>
            {vehicle.assignedDriverName ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{vehicle.assignedDriverName}</div>
                  <div className="text-xs text-slate-500">RTA Certified Captain</div>
                </div>
                <Badge variant="success">Assigned</Badge>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic py-1">
                No captain assigned. Vehicle available in yard pool.
              </div>
            )}
          </div>

          {/* Route Card */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>Assigned Primary Route</span>
            </div>
            {vehicle.currentRouteName ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{vehicle.currentRouteName}</div>
                  <div className="text-xs text-slate-500">Scheduled Daily Commute</div>
                </div>
                <Badge variant="info">Active Route</Badge>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic py-1">
                Flexible dispatch / Ad-hoc corporate fleet pool.
              </div>
            )}
          </div>
        </div>

        {/* Dubai Compliance & Expiry Badges */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dubai RTA Regulatory & Insurance Matrix</span>
          </div>

          <div className="space-y-2.5">
            {/* Mulkiya */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="font-semibold text-slate-800">Dubai Police Mulkiya (Registration)</div>
                  <div className="text-[11px] text-slate-500">Expires: {vehicle.registrationExpiry || 'N/A'}</div>
                </div>
              </div>
              <Badge
                variant={
                  regStatus.status === 'EXPIRED'
                    ? 'danger'
                    : regStatus.status === 'EXPIRING_SOON'
                    ? 'warning'
                    : 'success'
                }
              >
                {regStatus.status === 'EXPIRED'
                  ? 'Expired'
                  : regStatus.status === 'EXPIRING_SOON'
                  ? `${regStatus.days}d to renew`
                  : 'Valid'}
              </Badge>
            </div>

            {/* Insurance */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="font-semibold text-slate-800">Comprehensive Commercial Fleet Insurance</div>
                  <div className="text-[11px] text-slate-500">Expires: {vehicle.insuranceExpiry || 'N/A'}</div>
                </div>
              </div>
              <Badge
                variant={
                  insStatus.status === 'EXPIRED'
                    ? 'danger'
                    : insStatus.status === 'EXPIRING_SOON'
                    ? 'warning'
                    : 'success'
                }
              >
                {insStatus.status === 'EXPIRED'
                  ? 'Expired'
                  : insStatus.status === 'EXPIRING_SOON'
                  ? `${insStatus.days}d to renew`
                  : 'Valid'}
              </Badge>
            </div>

            {/* RTA Permit */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="font-semibold text-slate-800">RTA Passenger Transport Authority Permit</div>
                  <div className="text-[11px] text-slate-500">Expires: {vehicle.rtaPermitExpiry || 'N/A'}</div>
                </div>
              </div>
              <Badge
                variant={
                  rtaStatus.status === 'EXPIRED'
                    ? 'danger'
                    : rtaStatus.status === 'EXPIRING_SOON'
                    ? 'warning'
                    : 'success'
                }
              >
                {rtaStatus.status === 'EXPIRED'
                  ? 'Expired'
                  : rtaStatus.status === 'EXPIRING_SOON'
                  ? `${rtaStatus.days}d to renew`
                  : 'Valid'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div className="text-xs text-slate-400">
            Registered: {new Date(vehicle.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onClose();
                onEdit(vehicle);
              }}
            >
              <Edit className="w-3.5 h-3.5 mr-1" />
              Edit Specs
            </Button>
            <Button size="sm" variant="primary" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
