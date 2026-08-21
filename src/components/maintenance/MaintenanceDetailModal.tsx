import React from 'react';
import { X, Wrench, Bus, Calendar, DollarSign, UserCheck, ShieldCheck, Printer, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { MaintenanceRecord } from '../../types/index.js';

interface MaintenanceDetailModalProps {
  record: MaintenanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteOrder: (record: MaintenanceRecord) => void;
}

export const MaintenanceDetailModal: React.FC<MaintenanceDetailModalProps> = ({
  record,
  isOpen,
  onClose,
  onCompleteOrder,
}) => {
  if (!isOpen || !record) return null;

  const isCompleted = record.status === 'COMPLETED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0A192F] text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Work Order {record.id.toUpperCase()}</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    record.status === 'COMPLETED'
                      ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : record.status === 'IN_PROGRESS'
                      ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
                      : record.status === 'OVERDUE'
                      ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'
                      : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {record.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vehicle: {record.vehicleNumber} • Service: {record.serviceType.replace(/_/g, ' ')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400">Service Cost</span>
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {record.costAed ? `${record.costAed.toLocaleString()} AED` : 'Quote Pending'}
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Priority</span>
              <div className="text-sm font-bold text-orange-500">
                {record.priority || 'MEDIUM'}
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Scheduled Date</span>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {record.scheduledDate || record.date}
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Odometer</span>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono">
                {record.mileageKm ? `${record.mileageKm.toLocaleString()} km` : '—'}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Work Description
            </h4>
            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
              {record.description}
            </div>
          </div>

          {/* Workshop & Technician Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
              <span className="text-[11px] text-slate-400 block mb-1">Authorized Workshop / Facility</span>
              <div className="font-semibold text-xs text-slate-900 dark:text-white">
                {record.workshopName || record.vendor || 'Tasjeel Commercial Center'}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">RTA Certified Inspection Facility</div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
              <span className="text-[11px] text-slate-400 block mb-1">Technician / Lead Inspector</span>
              <div className="font-semibold text-xs text-slate-900 dark:text-white">
                {record.technicianName || 'Tasjeel Certified Technician'}
              </div>
              {record.invoiceNumber && (
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  Invoice #: {record.invoiceNumber}
                </div>
              )}
            </div>
          </div>

          {/* Inspection Notes */}
          {record.notes && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Technical Notes & Observations
              </h4>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-700 dark:text-slate-300">
                {record.notes}
              </div>
            </div>
          )}

          {/* RTA Safety Compliance Stamp */}
          <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <div>
              <span className="font-bold">Dubai RTA Safety Assurance</span> — All mechanical services, brake replacements, and AC overhauls comply with UAE heavy commercial transport safety standards.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Work Order</span>
          </button>

          <div className="flex items-center gap-2">
            {!isCompleted && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCompleteOrder(record);
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow transition-all"
              >
                Sign Off / Mark Completed
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
