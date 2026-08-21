import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Wrench,
  Shield,
  Clock,
  Calendar,
  Layers,
  Trash2,
  Check,
  Search,
  Filter,
  Plus,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { NotificationRecord, NotificationCategory, NotificationPriority } from '../types/index.js';
import { CreateAlertModal } from '../components/notifications/CreateAlertModal.js';
import { useToast } from '../context/ToastContext.js';
import { useI18n } from '../context/I18nContext.js';

interface NotificationCenterPageProps {
  navigate: (path: string) => void;
}

export const NotificationCenterPage: React.FC<NotificationCenterPageProps> = ({ navigate }) => {
  const { t } = useI18n();
  const toast = useToast();

  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
      if (priorityFilter !== 'ALL') params.append('priority', priorityFilter);
      if (unreadOnly) params.append('unreadOnly', 'true');

      const res = await fetch(`/api/notifications?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data || []);
        setSummary(data.summary || {});
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [categoryFilter, priorityFilter, unreadOnly]);

  const handleMarkRead = async (id: string, isRead: boolean) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead }),
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead, read: isRead } : n))
        );
        if (summary) {
          setSummary({
            ...summary,
            unread: isRead ? Math.max(0, summary.unread - 1) : summary.unread + 1,
          });
        }
      }
    } catch (err) {
      toast.error('Update Failed', 'Error updating notification state.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success('Marked Read', 'All notifications marked as read.');
        fetchNotifications();
      }
    } catch (err) {
      toast.error('Operation Failed', 'Error marking all as read.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        toast.info('Notification Cleared', 'Notification cleared.');
      }
    } catch (err) {
      toast.error('Delete Failed', 'Error deleting notification.');
    }
  };

  const filteredNotifications = notifications.filter(
    (n) =>
      !searchQuery ||
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'OPERATIONAL':
      case 'TRIP':
        return <Radio className="w-4 h-4 text-orange-500" />;
      case 'MAINTENANCE':
        return <Wrench className="w-4 h-4 text-purple-500" />;
      case 'COMPLIANCE':
        return <Shield className="w-4 h-4 text-emerald-500" />;
      case 'SCHEDULE':
        return <Calendar className="w-4 h-4 text-sky-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div id="notification-center-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-500 uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4 text-orange-500" />
            <span>{t('alert_hub', 'Operations Watchdog')}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('notification_center', 'Alerts & Notification Center')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Operational breaches, telematics traffic delays, maintenance work orders, and RTA document expiry warnings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Mark All as Read</span>
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast Alert</span>
          </button>
        </div>
      </div>

      {/* 5 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Unread Alerts</span>
          <div className="text-2xl font-black text-orange-500 mt-1 font-mono">
            {summary?.unread || 0}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1">
            Total {summary?.total || notifications.length} in Log
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Critical & Emergency</span>
          <div className="text-2xl font-black text-rose-500 mt-1 font-mono">
            {summary?.critical || 0}
          </div>
          <span className="text-[11px] text-rose-500 dark:text-rose-400 mt-auto pt-1 font-semibold">
            Urgent Dispatch Action
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Maintenance Alerts</span>
          <div className="text-2xl font-black text-purple-500 mt-1 font-mono">
            {summary?.maintenance || 0}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1">
            Workshop & Safety
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Compliance & RTA</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {summary?.compliance || 0}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1">
            Permits & Licensing
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Operational & Trips</span>
          <div className="text-2xl font-black text-sky-500 mt-1 font-mono">
            {summary?.operational || 0}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1">
            Corridors & Delays
          </span>
        </div>
      </div>

      {/* Category Tabs & Filter Toolbar */}
      <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {(['ALL', 'OPERATIONAL', 'MAINTENANCE', 'COMPLIANCE', 'SCHEDULE', 'TRIP'] as const).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat === 'ALL' ? 'All Alerts' : cat.replace(/_/g, ' ')}
              </button>
            )
          )}
        </div>

        {/* Priority & Search Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="CRITICAL">Critical</option>
            <option value="EMERGENCY">Emergency</option>
          </select>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
              className="rounded text-orange-500 focus:ring-orange-500"
            />
            <span>Unread Only</span>
          </label>

          <button
            onClick={fetchNotifications}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notifications Feed List */}
      <div className="flex flex-col gap-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              No notifications found
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Operations system running smooth with no active alerts.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isUnread = !notif.isRead;
            const isEmergency = notif.priority === 'EMERGENCY' || notif.priority === 'CRITICAL';
            const isWarning = notif.priority === 'WARNING';

            let borderClass = 'border-slate-200 dark:border-slate-800';
            if (isEmergency) borderClass = 'border-rose-500/40 bg-rose-500/5';
            else if (isWarning) borderClass = 'border-amber-500/40 bg-amber-500/5';

            return (
              <div
                key={notif.id}
                className={`bg-white dark:bg-[#0A192F] border rounded-xl p-4 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${borderClass} ${
                  isUnread ? 'ring-1 ring-orange-500/30' : 'opacity-85'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isEmergency
                        ? 'bg-rose-500/15 text-rose-500'
                        : isWarning
                        ? 'bg-amber-500/15 text-amber-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isEmergency
                            ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'
                            : isWarning
                            ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                            : 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300'
                        }`}
                      >
                        {notif.priority}
                      </span>

                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {notif.category}
                      </span>

                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      )}

                      <span className="text-xs text-slate-400 font-mono">
                        {notif.timestamp ? new Date(notif.timestamp).toLocaleTimeString() : 'Just now'}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {notif.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed max-w-3xl">
                      {notif.message}
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  {notif.actionUrl && (
                    <button
                      onClick={() => navigate(notif.actionUrl!)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
                    >
                      <span>Take Action</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => handleMarkRead(notif.id, isUnread)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${isUnread ? 'text-slate-400' : 'text-emerald-500'}`}
                    />
                  </button>

                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Broadcast Modal */}
      <CreateAlertModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchNotifications}
      />
    </div>
  );
};
