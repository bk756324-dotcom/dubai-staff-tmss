import React from 'react';
import { Driver } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { Badge, StatusBadge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import {
  UserCheck,
  Phone,
  Mail,
  ShieldCheck,
  Bus,
  MapPin,
  Calendar,
  Star,
  Clock,
  HeartPulse,
  FileText,
  AlertTriangle,
  Edit,
} from 'lucide-react';

interface DriverDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: Driver | null;
  onEdit: (driver: Driver) => void;
}

export const DriverDetailModal: React.FC<DriverDetailModalProps> = ({
  isOpen,
  onClose,
  driver,
  onEdit,
}) => {
  if (!driver) return null;

  const getDaysRemaining = (dateStr?: string) => {
    if (!dateStr) return { days: 0, status: 'UNKNOWN' };
    const target = new Date(dateStr).getTime();
    const today = new Date().getTime();
    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { days: diffDays, status: 'EXPIRED' };
    if (diffDays <= 30) return { days: diffDays, status: 'EXPIRING_SOON' };
    return { days: diffDays, status: 'VALID' };
  };

  const licStatus = getDaysRemaining(driver.licenseExpiry);
  const rtaStatus = getDaysRemaining(driver.rtaCardExpiry);
  const visaStatus = getDaysRemaining(driver.visaExpiry);
  const medStatus = getDaysRemaining(driver.medicalFitnessExpiry);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Driver Captain Dossier: ${driver.name}`}
      description={`Employee ID: ${driver.employeeId} • Category: ${driver.licenseCategory}`}
      maxWidth="xl"
    >
      <div className="space-y-5 pt-1">
        {/* Top Header Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg border border-slate-700">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg font-heading shadow-md">
              {driver.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-heading tracking-tight">{driver.name}</h3>
                <StatusBadge status={driver.status} />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                <span className="font-mono text-orange-300">{driver.employeeId}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {driver.phone}
                </span>
                {driver.email && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {driver.email}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <div>
              <div className="text-xs font-bold leading-none">{driver.safetyRating || '5.0'} / 5.0</div>
              <div className="text-[10px] text-slate-300 leading-none mt-0.5">Safety Index</div>
            </div>
          </div>
        </div>

        {/* Operational Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
            <div className="text-xs text-slate-500">Completed Trips</div>
            <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
              {driver.totalTripsCompleted || 0}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">99.2% On-Time</div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
            <div className="text-xs text-slate-500">License Category</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5 truncate" title={driver.licenseCategory}>
              {driver.licenseCategory}
            </div>
            <div className="text-[11px] text-slate-500">UAE Traffic Dept</div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
            <div className="text-xs text-slate-500">RTA Permit Card</div>
            <div className="text-xs font-bold text-slate-900 font-mono mt-0.5">
              {driver.rtaCardNumber || 'N/A'}
            </div>
            <div className="text-[11px] text-orange-600 font-medium">RTA Dubai Approved</div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
            <div className="text-xs text-slate-500">Joining Date</div>
            <div className="text-xs font-semibold text-slate-900 mt-0.5">
              {driver.joiningDate || 'N/A'}
            </div>
            <div className="text-[11px] text-slate-500">Permanent Crew</div>
          </div>
        </div>

        {/* Assigned Vehicle & Route */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              <Bus className="w-4 h-4 text-orange-500" />
              <span>Assigned Fleet Bus</span>
            </div>
            {driver.assignedVehicleNumber ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{driver.assignedVehicleNumber}</div>
                  <div className="text-xs text-slate-500">Dedicated Fleet Asset</div>
                </div>
                <Badge variant="success">Assigned</Badge>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic py-1">
                Flexible dispatch / Ready in Captain pool.
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>Assigned Primary Route</span>
            </div>
            {driver.assignedRouteName ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{driver.assignedRouteName}</div>
                  <div className="text-xs text-slate-500">Scheduled Commute Shift</div>
                </div>
                <Badge variant="info">Active Route</Badge>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic py-1">
                Ad-hoc corporate roster dispatch.
              </div>
            )}
          </div>
        </div>

        {/* Regulatory & Compliance Matrix */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Driver Licensing, Visa & Medical Compliance Matrix</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* UAE License */}
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">UAE Driving License</span>
                <Badge
                  variant={
                    licStatus.status === 'EXPIRED'
                      ? 'danger'
                      : licStatus.status === 'EXPIRING_SOON'
                      ? 'warning'
                      : 'success'
                  }
                >
                  {licStatus.status === 'EXPIRED'
                    ? 'Expired'
                    : licStatus.status === 'EXPIRING_SOON'
                    ? `${licStatus.days}d to renew`
                    : 'Valid'}
                </Badge>
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-1">
                No: {driver.licenseNumber} • Expiry: {driver.licenseExpiry}
              </div>
            </div>

            {/* RTA Card */}
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">RTA Driver Permit Card</span>
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
              <div className="text-[11px] text-slate-500 font-mono mt-1">
                No: {driver.rtaCardNumber || 'N/A'} • Expiry: {driver.rtaCardExpiry || 'N/A'}
              </div>
            </div>

            {/* Visa */}
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">UAE Residence Visa</span>
                <Badge
                  variant={
                    visaStatus.status === 'EXPIRED'
                      ? 'danger'
                      : visaStatus.status === 'EXPIRING_SOON'
                      ? 'warning'
                      : 'success'
                  }
                >
                  {visaStatus.status === 'EXPIRED'
                    ? 'Expired'
                    : visaStatus.status === 'EXPIRING_SOON'
                    ? `${visaStatus.days}d to renew`
                    : 'Valid'}
                </Badge>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Expiry: {driver.visaExpiry || 'N/A'}
              </div>
            </div>

            {/* Medical */}
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Medical Fitness Certificate</span>
                <Badge
                  variant={
                    medStatus.status === 'EXPIRED'
                      ? 'danger'
                      : medStatus.status === 'EXPIRING_SOON'
                      ? 'warning'
                      : 'success'
                  }
                >
                  {medStatus.status === 'EXPIRED'
                    ? 'Expired'
                    : medStatus.status === 'EXPIRING_SOON'
                    ? `${medStatus.days}d to renew`
                    : 'Valid'}
                </Badge>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Expiry: {driver.medicalFitnessExpiry || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        {driver.emergencyContact?.name && (
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-500">Emergency Next of Kin: </span>
              <span className="font-semibold text-slate-800">
                {driver.emergencyContact.name} ({driver.emergencyContact.relationship})
              </span>
            </div>
            <div className="font-mono font-medium text-slate-900">{driver.emergencyContact.phone}</div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div className="text-xs text-slate-400">
            Registered in TMS: {new Date(driver.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onClose();
                onEdit(driver);
              }}
            >
              <Edit className="w-3.5 h-3.5 mr-1" />
              Edit Profile
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
