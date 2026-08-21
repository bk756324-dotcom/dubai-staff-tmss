import React, { useState } from 'react';
import {
  Clock,
  Bus,
  User,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { Trip, TripStatus } from '../../types/index.js';
import { Badge, StatusBadge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import { Input } from '../ui/Input.js';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card.js';

interface ActiveTripsTableProps {
  trips: Trip[];
  onInspectTrip?: (trip: Trip) => void;
  onOpenDispatchModal?: () => void;
}

export const ActiveTripsTable: React.FC<ActiveTripsTableProps> = ({
  trips,
  onInspectTrip,
  onOpenDispatchModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.tripNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.driverName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse" />
            <CardTitle className="text-base font-extrabold text-slate-900 font-heading uppercase tracking-tight">
              Live Dispatched Trips & Shift Matrix
            </CardTitle>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active passenger transfers across Dubai industrial & corporate corridors
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenDispatchModal && (
            <Button
              size="sm"
              variant="primary"
              onClick={onOpenDispatchModal}
              leftIcon={<Radio className="w-3.5 h-3.5" />}
            >
              Quick Dispatch
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-3 space-y-3">
        {/* Search and Filters Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1 max-w-sm">
            <Input
              type="text"
              placeholder="Search by trip, route, bus, or captain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              className="py-1.5 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'IN_PROGRESS', 'BOARDING', 'SCHEDULED', 'COMPLETED', 'DELAYED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Trips Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5">Trip Ref / Route</th>
                <th className="px-3.5 py-2.5">Vehicle & Captain</th>
                <th className="px-3.5 py-2.5">Schedule & Punctuality</th>
                <th className="px-3.5 py-2.5">Passenger Manifest</th>
                <th className="px-3.5 py-2.5">Status</th>
                <th className="px-3.5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No trips match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => {
                  const loadPercentage = Math.min(
                    100,
                    Math.round((trip.boardedPassengerCount / (trip.passengerCount || 30)) * 100)
                  );

                  return (
                    <tr
                      key={trip.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => onInspectTrip && onInspectTrip(trip)}
                    >
                      {/* Trip & Route */}
                      <td className="px-3.5 py-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="font-mono text-orange-600">{trip.tripNumber}</span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-600 truncate max-w-xs mt-0.5">
                          {trip.routeName}
                        </p>
                      </td>

                      {/* Bus & Driver */}
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-1.5">
                          <Bus className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-bold text-slate-900">{trip.vehicleNumber}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{trip.driverName}</span>
                        </div>
                      </td>

                      {/* Schedule & Delay */}
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-1.5 font-mono font-medium text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{trip.scheduledStartTime} - {trip.scheduledEndTime}</span>
                        </div>
                        <div className="mt-0.5">
                          {trip.delayMinutes > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              +{trip.delayMinutes}m delay
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              On Schedule
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Passenger Load */}
                      <td className="px-3.5 py-3 min-w-[140px]">
                        <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                          <span className="text-slate-800">
                            {trip.boardedPassengerCount} / {trip.passengerCount} Boarded
                          </span>
                          <span className="text-slate-500 font-mono">{loadPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              loadPercentage >= 90
                                ? 'bg-orange-500'
                                : loadPercentage >= 50
                                ? 'bg-emerald-500'
                                : 'bg-slate-400'
                            }`}
                            style={{ width: `${loadPercentage}%` }}
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3.5 py-3">
                        <StatusBadge status={trip.status} />
                      </td>

                      {/* Action */}
                      <td className="px-3.5 py-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onInspectTrip) onInspectTrip(trip);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                          title="View Trip Telemetry Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
