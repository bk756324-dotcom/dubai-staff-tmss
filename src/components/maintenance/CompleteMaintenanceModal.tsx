import React, { useState } from 'react';
import { X, CheckCircle2, DollarSign, FileText, Wrench, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext.js';
import { MaintenanceRecord } from '../../types/index.js';

interface CompleteMaintenanceModalProps {
  record: MaintenanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CompleteMaintenanceModal: React.FC<CompleteMaintenanceModalProps> = ({
  record,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    completedDate: new Date().toISOString().split('T')[0],
    costAed: record?.costAed?.toString() || '1500',
    invoiceNumber: record?.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
    notes: 'Completed full multi-point vehicle inspection. RTA safety standards passed.',
    returnVehicleToService: true,
  });

  if (!isOpen || !record) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/maintenance/${record.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedDate: formData.completedDate,
          costAed: Number(formData.costAed) || 0,
          invoiceNumber: formData.invoiceNumber,
          notes: formData.notes,
          returnVehicleToService: formData.returnVehicleToService,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Maintenance Completed', data.message || 'Maintenance completed successfully.');
        onSuccess();
        onClose();
      } else {
        toast.error('Operation Failed', data.error || 'Failed to complete maintenance.');
      }
    } catch (err) {
      toast.error('Network Error', 'Network error completing maintenance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0A192F] text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Complete Maintenance Order</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {record.vehicleNumber} • {record.serviceType.replace(/_/g, ' ')}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs flex flex-col gap-1">
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              Work Order Summary:
            </div>
            <div className="text-slate-600 dark:text-slate-400">{record.description}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              Workshop: {record.workshopName}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Completion Date *
              </label>
              <input
                type="date"
                value={formData.completedDate}
                onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Final Total Cost (AED) *
              </label>
              <input
                type="number"
                value={formData.costAed}
                onChange={(e) => setFormData({ ...formData, costAed: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Invoice / Job Card Number
            </label>
            <input
              type="text"
              placeholder="e.g. INV-TASJEEL-2026-991"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Technician Notes / Inspection Remarks
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.returnVehicleToService}
              onChange={(e) => setFormData({ ...formData, returnVehicleToService: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Return vehicle to AVAILABLE status in Fleet Pool immediately</span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Sign Off & Complete Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
