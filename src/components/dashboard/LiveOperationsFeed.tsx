import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Flame,
  CheckCheck,
  Radio,
} from 'lucide-react';
import { NotificationRecord } from '../../types/index.js';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card.js';

interface LiveOperationsFeedProps {
  notifications: NotificationRecord[];
  onMarkAllRead?: () => void;
}

export const LiveOperationsFeed: React.FC<LiveOperationsFeedProps> = ({
  notifications,
  onMarkAllRead,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'HIGH_PRIORITY'>('ALL');

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'HIGH_PRIORITY') return n.priority === 'HIGH' || n.priority === 'CRITICAL';
    return true;
  });

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <CardTitle className="text-sm font-extrabold text-slate-900 font-heading uppercase tracking-tight flex items-center gap-2">
            <Radio className="w-4 h-4 text-orange-500 animate-pulse" />
            <span>Live Operations Control Feed</span>
          </CardTitle>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Real-time automated telematics & dispatch telemetry alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onMarkAllRead && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-[11px] font-bold text-slate-500 hover:text-orange-600 flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark Read</span>
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-3 space-y-2.5">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 pb-1">
          {(['ALL', 'UNREAD', 'HIGH_PRIORITY'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                filter === f
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No notifications for this filter.
            </div>
          ) : (
            filtered.map((item) => {
              let icon = <Info className="w-4 h-4 text-blue-500" />;
              let borderColor = 'border-slate-200';
              let bgColor = item.read ? 'bg-white' : 'bg-orange-50/30';

              if (item.priority === 'HIGH' || item.priority === 'CRITICAL') {
                icon = <Flame className="w-4 h-4 text-orange-500" />;
                borderColor = 'border-orange-200';
              } else if (item.type === 'TRIP_UPDATE') {
                icon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
              }

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border ${borderColor} ${bgColor} hover:shadow-xs transition-all flex items-start gap-2.5 text-xs`}
                >
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs mt-0.5 flex-shrink-0">
                    {icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                        {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600">
                        {item.type.replace('_', ' ')}
                      </span>
                      {item.priority === 'HIGH' && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-wider bg-red-100 text-red-700">
                          Priority High
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
