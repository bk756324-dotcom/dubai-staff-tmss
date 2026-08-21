import React from 'react';
import { Passenger } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { Badge, StatusBadge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import {
  Users,
  Building2,
  MapPin,
  Clock,
  CreditCard,
  Phone,
  Mail,
  Route as RouteIcon,
  ShieldCheck,
  Edit,
  ArrowRight,
} from 'lucide-react';

interface PassengerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  passenger: Passenger | null;
  onEdit: (passenger: Passenger) => void;
}

export const PassengerDetailModal: React.FC<PassengerDetailModalProps> = ({
  isOpen,
  onClose,
  passenger,
  onEdit,
}) => {
  if (!passenger) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Passenger Manifest: ${passenger.name}`}
      description={`Employee ID: ${passenger.employeeId} • Company: ${passenger.clientCompanyName || 'Corporate Account'}`}
      maxWidth="lg"
    >
      <div className="space-y-5 pt-1">
        {/* Top Header Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg border border-slate-700">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg font-heading shadow-md">
              {passenger.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-heading tracking-tight">{passenger.name}</h3>
                <StatusBadge status={passenger.status} />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-1">
                <span className="font-mono text-orange-300">{passenger.employeeId}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {passenger.clientCompanyName || 'Corporate Partner'}
                </span>
                {passenger.department && (
                  <>
                    <span>•</span>
                    <span>{passenger.department}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-300">Shift Type</div>
            <div className="text-xs font-bold text-orange-400 font-mono">
              {passenger.shift} SHIFT
            </div>
          </div>
        </div>

        {/* Digital RFID Boarding Card Badge */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-orange-50/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-xs text-orange-500">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">RFID Smart Boarding Card</div>
              <div className="text-sm font-bold font-mono text-slate-900">
                {passenger.rfidCardNumber || 'Auto-Assigned on Boarding'}
              </div>
            </div>
          </div>
          <Badge variant="success">Tap & Ride Ready</Badge>
        </div>

        {/* Daily Commute Route Itinerary */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <RouteIcon className="w-3.5 h-3.5 text-orange-500" />
            <span>Scheduled Daily Commute Itinerary</span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-orange-300">
            {/* Pickup */}
            <div className="relative">
              <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
              <div className="text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>Pickup Location:</span>
                  <span className="text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {passenger.pickupTime}
                  </span>
                </div>
                <div className="text-slate-600 mt-0.5">{passenger.pickupPoint}</div>
              </div>
            </div>

            {/* Route */}
            <div className="py-1">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                <RouteIcon className="w-3.5 h-3.5 text-orange-500" />
                {passenger.routeName || 'Assigned Corporate Shift Route'}
              </span>
            </div>

            {/* Drop-off */}
            <div className="relative">
              <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white shadow-xs" />
              <div className="text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>Drop-off Destination:</span>
                  <span className="text-orange-700 font-mono bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {passenger.dropTime}
                  </span>
                </div>
                <div className="text-slate-600 mt-0.5">{passenger.dropPoint}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Contact Mobile:</span>
            <span className="font-mono font-medium text-slate-900">{passenger.phone}</span>
          </div>
          {passenger.email && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Email Address:</span>
              <span className="font-mono text-slate-900">{passenger.email}</span>
            </div>
          )}
          {passenger.emergencyContact && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500">Emergency Contact:</span>
              <span className="font-mono font-semibold text-slate-900">{passenger.emergencyContact}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div className="text-xs text-slate-400">
            Enrolled: {new Date(passenger.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onClose();
                onEdit(passenger);
              }}
            >
              <Edit className="w-3.5 h-3.5 mr-1" />
              Edit Itinerary
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
