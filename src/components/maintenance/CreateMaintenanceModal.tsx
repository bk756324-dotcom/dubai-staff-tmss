import React, { useState, useEffect } from 'react';
import { X, Wrench, Bus, Calendar, DollarSign, UserCheck, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext.js';
import { MaintenanceServiceType, MaintenancePriority, MaintenanceStatus } from '../../types/index.js';

interface CreateMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateMaintenanceModal: React.FC<CreateMaintenanceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceType: 'PREVENTIVE' as MaintenanceServiceType,
    description: '',
    priority: 'MEDIUM' as MaintenancePriority,
    scheduledDate: new Date().toISOString().split('T')[0],
    costAed: '',
    mileageKm: '',
    workshopName: 'Tasjeel Commercial Workshop, Al Quoz',
    technicianName: '',
    status: 'SCHEDULED' as MaintenanceStatus,
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetch('/api/vehicles')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setVehicles(data.data || []);
            if (data.data && data.data.length > 0 && !formData.vehicleId) {
              setFormData((prev) => ({ ...prev, vehicleId: data.data[0].id }));
            }
          }
        })
        .catch((err) => console.error('Error fetching vehicles for maintenance:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleId || !formData.description) {
      toast.error('Validation Error', 'Please select a vehicle and provide a description.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          costAed: Number(formData.costAed) || 0,
          mileageKm: Number(formData.mileageKm) || 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Record Created', data.message || 'Maintenance record created.');
        onSuccess();
        onClose();
      } else {
        toast.error('Creation Failed', data.error || 'Failed to create maintenance record.');
      }
    } catch (err) {
      toast.error('Network Error', 'Network error creating maintenance record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0A192F] text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Create Maintenance Work Order</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log scheduled service, preventive inspection, or workshop repair
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vehicle Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Vehicle *
              </label>
              <select
                value={formData.vehicleId}
                onChange={(e) => {
                  const sel = vehicles.find((v) => v.id === e.target.value);
                  setFormData({
                    ...formData,
                    vehicleId: e.target.value,
                    mileageKm: sel?.currentMileageKm?.toString() || '',
                  });
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vehicleNumber} ({v.make} {v.model} - {v.capacity} Seats) [{v.status}]
                  </option>
                ))}
              </select>
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Service Type *
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="PREVENTIVE">Preventive Maintenance (Periodic)</option>
                <option value="OIL_CHANGE">Engine Oil & Synthetic Filter Service</option>
                <option value="BRAKE_SERVICE">Brake Pads & Skimming Service</option>
                <option value="TIRE_SERVICE">Tire Replacement & Balancing</option>
                <option value="AC_OVERHAUL">AC Thermal Overhaul (UAE Summer Spec)</option>
                <option value="RTA_INSPECTION">RTA Annual Roadworthiness Testing</option>
                <option value="REPAIR">General Mechanical / Electrical Repair</option>
                <option value="EMERGENCY_REPAIR">Emergency Breakdown Repair</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Work Order Description *
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 40,000 km routine service, replace brake pads, AC dual-blower filter check."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical (Immediate Workshop)</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Initial Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In Progress (At Workshop)</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Scheduled Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Scheduled Date *
              </label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Cost AED */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Estimated Cost (AED)
              </label>
              <input
                type="number"
                placeholder="1500"
                value={formData.costAed}
                onChange={(e) => setFormData({ ...formData, costAed: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Odometer Mileage (km)
              </label>
              <input
                type="number"
                placeholder="45000"
                value={formData.mileageKm}
                onChange={(e) => setFormData({ ...formData, mileageKm: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Workshop / Vendor */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Workshop / Vendor Name
              </label>
              <input
                type="text"
                placeholder="e.g. Tasjeel Al Barsha / Al Habtoor"
                value={formData.workshopName}
                onChange={(e) => setFormData({ ...formData, workshopName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Technician & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Assigned Technician / Lead
              </label>
              <input
                type="text"
                placeholder="e.g. Kareem Mansoor / Master Tech"
                value={formData.technicianName}
                onChange={(e) => setFormData({ ...formData, technicianName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Notes & Inspection Findings
              </label>
              <input
                type="text"
                placeholder="e.g. Scheduled during night break to avoid morning shuttle delay."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Notice */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>
              Setting status to <strong>IN PROGRESS</strong> automatically marks the vehicle as in MAINTENANCE in the fleet dispatcher pool to prevent scheduling overlaps.
            </span>
          </div>

          {/* Action Buttons */}
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
              className="px-5 py-2 text-xs font-bold rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Work Order...' : 'Create Maintenance Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
