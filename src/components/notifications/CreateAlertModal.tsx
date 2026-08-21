import React, { useState } from 'react';
import { X, Bell, AlertTriangle, Radio, Shield, Wrench, Users, Send } from 'lucide-react';
import { useToast } from '../../context/ToastContext.js';
import { NotificationCategory, NotificationPriority } from '../../types/index.js';

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateAlertModal: React.FC<CreateAlertModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    category: 'OPERATIONAL' as NotificationCategory,
    priority: 'WARNING' as NotificationPriority,
    targetRole: 'ALL',
    actionUrl: '/app/tracking',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.error('Validation Error', 'Please fill in alert title and message.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Alert Broadcasted', data.message || 'Operational alert broadcasted successfully.');
        onSuccess();
        onClose();
      } else {
        toast.error('Broadcast Failed', data.error || 'Failed to broadcast alert.');
      }
    } catch (err) {
      toast.error('Network Error', 'Network error broadcasting alert.');
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
            <div className="w-10 h-10 rounded-lg bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Broadcast Operational Alert</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Send real-time alerts to dispatchers, captains, or corporate managers
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Alert Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Heavy Congestion on E11 Sheikh Zayed Road"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="OPERATIONAL">Operational / Traffic</option>
                <option value="MAINTENANCE">Fleet Maintenance</option>
                <option value="COMPLIANCE">RTA / Statutory Compliance</option>
                <option value="SCHEDULE">Scheduling / Shift</option>
                <option value="TRIP">Trip Checkpoints</option>
                <option value="SYSTEM">System Broadcast</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="INFO">Information (Standard)</option>
                <option value="WARNING">Warning (Attention Needed)</option>
                <option value="CRITICAL">Critical (Urgent Action)</option>
                <option value="EMERGENCY">Emergency (Immediate)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Alert Message & Guidance *
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Major bottleneck near Dubai Canal bridge. All captains on Route R-101 and R-102 advised to take Al Khail Road (E44) alternative."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Audience
              </label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="ALL">All Roles (Fleet-Wide)</option>
                <option value="DISPATCHER">Dispatchers & Operations</option>
                <option value="DRIVER">Driver Captains</option>
                <option value="CLIENT">Corporate Clients</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Action Quick Link
              </label>
              <select
                value={formData.actionUrl}
                onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="/app/tracking">Live Telematics Map</option>
                <option value="/app/trips">Trips & Dispatch</option>
                <option value="/app/maintenance">Maintenance Page</option>
                <option value="/app/compliance">Compliance Center</option>
              </select>
            </div>
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
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-md transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Broadcasting...' : 'Broadcast Alert'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
