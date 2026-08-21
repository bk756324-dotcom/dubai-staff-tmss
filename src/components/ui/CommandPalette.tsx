import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bus,
  UserCheck,
  Building2,
  Users,
  MapPin,
  Clock,
  FileCheck2,
  Zap,
  ArrowRight,
  X,
  Radio,
  CornerDownLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { StatusBadge } from './Badge.js';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
  onOpenQuickDispatch?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  navigate,
  onOpenQuickDispatch,
}) => {
  const { apiFetch, user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    vehicles: any[];
    drivers: any[];
    clients: any[];
    passengers: any[];
    routes: any[];
    trips: any[];
  }>({
    vehicles: [],
    drivers: [],
    clients: [],
    passengers: [],
    routes: [],
    trips: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      fetchAllData();
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const [cachedData, setCachedData] = useState<{
    vehicles: any[];
    drivers: any[];
    clients: any[];
    passengers: any[];
    routes: any[];
    trips: any[];
  }>({
    vehicles: [],
    drivers: [],
    clients: [],
    passengers: [],
    routes: [],
    trips: [],
  });

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [vRes, dRes, cRes, pRes, rRes, tRes] = await Promise.all([
        apiFetch('/api/vehicles'),
        apiFetch('/api/drivers'),
        apiFetch('/api/clients'),
        apiFetch('/api/passengers'),
        apiFetch('/api/routes'),
        apiFetch('/api/trips'),
      ]);

      const data = {
        vehicles: vRes.success ? vRes.data || [] : [],
        drivers: dRes.success ? dRes.data || [] : [],
        clients: cRes.success ? cRes.data || [] : [],
        passengers: pRes.success ? pRes.data || [] : [],
        routes: rRes.success ? rRes.data || [] : [],
        trips: tRes.success ? tRes.data || [] : [],
      };
      setCachedData(data);
      filterResults('', data);
    } catch (e) {
      console.error('Command search data fetch error', e);
    } finally {
      setIsLoading(false);
    }
  };

  const filterResults = (q: string, source = cachedData) => {
    const term = q.trim().toLowerCase();
    if (!term) {
      setResults({
        vehicles: source.vehicles.slice(0, 3),
        drivers: source.drivers.slice(0, 3),
        clients: source.clients.slice(0, 2),
        passengers: source.passengers.slice(0, 3),
        routes: source.routes.slice(0, 3),
        trips: source.trips.slice(0, 3),
      });
      return;
    }

    setResults({
      vehicles: source.vehicles
        .filter(
          (v: any) =>
            v.vehicleNumber?.toLowerCase().includes(term) ||
            v.plateNumber?.toLowerCase().includes(term) ||
            v.model?.toLowerCase().includes(term) ||
            v.assignedDriverName?.toLowerCase().includes(term)
        )
        .slice(0, 4),
      drivers: source.drivers
        .filter(
          (d: any) =>
            d.name?.toLowerCase().includes(term) ||
            d.employeeId?.toLowerCase().includes(term) ||
            d.phone?.toLowerCase().includes(term)
        )
        .slice(0, 4),
      clients: source.clients
        .filter(
          (c: any) =>
            c.companyName?.toLowerCase().includes(term) ||
            c.contactPerson?.toLowerCase().includes(term) ||
            c.industry?.toLowerCase().includes(term)
        )
        .slice(0, 3),
      passengers: source.passengers
        .filter(
          (p: any) =>
            p.name?.toLowerCase().includes(term) ||
            p.employeeId?.toLowerCase().includes(term) ||
            p.companyName?.toLowerCase().includes(term) ||
            p.department?.toLowerCase().includes(term)
        )
        .slice(0, 4),
      routes: source.routes
        .filter(
          (r: any) =>
            r.name?.toLowerCase().includes(term) ||
            r.code?.toLowerCase().includes(term) ||
            r.corridor?.toLowerCase().includes(term) ||
            r.clientName?.toLowerCase().includes(term)
        )
        .slice(0, 4),
      trips: source.trips
        .filter(
          (t: any) =>
            t.tripNumber?.toLowerCase().includes(term) ||
            t.routeName?.toLowerCase().includes(term) ||
            t.driverName?.toLowerCase().includes(term) ||
            t.vehicleNumber?.toLowerCase().includes(term)
        )
        .slice(0, 4),
    });
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    filterResults(val);
  };

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  const totalResultsCount =
    results.vehicles.length +
    results.drivers.length +
    results.clients.length +
    results.passengers.length +
    results.routes.length +
    results.trips.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] text-slate-900 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Type a vehicle plate, driver name, route, client, employee ID..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold text-slate-500 bg-slate-200/80 border border-slate-300 rounded">
            ESC
          </kbd>
        </div>

        {/* Quick Actions Shortcuts Strip */}
        <div className="px-4 py-2 bg-slate-100/60 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 flex-shrink-0">
            Quick Actions:
          </span>
          <button
            onClick={() => {
              if (onOpenQuickDispatch) onOpenQuickDispatch();
              else navigate('/app/trips');
              onClose();
            }}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-orange-500 rounded-lg font-semibold text-slate-700 hover:text-orange-600 flex items-center gap-1.5 flex-shrink-0 transition-colors"
          >
            <Radio className="w-3 h-3 text-orange-500" />
            <span>Rapid Dispatch</span>
          </button>
          <button
            onClick={() => handleSelect('/app/tracking')}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-orange-500 rounded-lg font-semibold text-slate-700 hover:text-orange-600 flex items-center gap-1.5 flex-shrink-0 transition-colors"
          >
            <MapPin className="w-3 h-3 text-emerald-500" />
            <span>Live GPS Radar</span>
          </button>
          <button
            onClick={() => handleSelect('/app/compliance')}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-orange-500 rounded-lg font-semibold text-slate-700 hover:text-orange-600 flex items-center gap-1.5 flex-shrink-0 transition-colors"
          >
            <FileCheck2 className="w-3 h-3 text-blue-500" />
            <span>RTA Audit Matrix</span>
          </button>
          <button
            onClick={() => handleSelect('/app/reports')}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-orange-500 rounded-lg font-semibold text-slate-700 hover:text-orange-600 flex items-center gap-1.5 flex-shrink-0 transition-colors"
          >
            <Zap className="w-3 h-3 text-amber-500" />
            <span>Executive KPIs</span>
          </button>
        </div>

        {/* Scrollable Results Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {totalResultsCount === 0 && !isLoading && (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-500" />
              <p className="text-sm font-semibold text-slate-600">No matching operational records</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for Toyota Coaster, Muhammad Aslam, DIP, or trip numbers.
              </p>
            </div>
          )}

          {/* Trips Category */}
          {results.trips.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-2 py-1 mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5 text-orange-600">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Active & Scheduled Trips</span>
                </span>
                <span className="text-[10px]">{results.trips.length} found</span>
              </div>
              <div className="space-y-1">
                {results.trips.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleSelect(`/app/trips`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50/80 cursor-pointer border border-transparent hover:border-orange-200 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{t.tripNumber}</span>
                          <span className="text-slate-500">•</span>
                          <span className="font-semibold text-slate-700">{t.routeName}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Captain {t.driverName} • {t.vehicleNumber} • {t.scheduledStartTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={t.status} />
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicles Category */}
          {results.vehicles.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-2 py-1 mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <Bus className="w-3.5 h-3.5" />
                  <span>Fleet Vehicles</span>
                </span>
                <span className="text-[10px]">{results.vehicles.length} found</span>
              </div>
              <div className="space-y-1">
                {results.vehicles.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => handleSelect(`/app/fleet`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/80 cursor-pointer border border-transparent hover:border-blue-200 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <Bus className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{v.vehicleNumber}</span>
                          <span className="text-slate-500">•</span>
                          <span className="font-semibold text-slate-700">Plate: {v.plateNumber}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {v.make} {v.model} ({v.capacity} Seats) • Driver: {v.assignedDriverName || 'Unassigned'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={v.status} />
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drivers Category */}
          {results.drivers.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-2 py-1 mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Driver Captains</span>
                </span>
                <span className="text-[10px]">{results.drivers.length} found</span>
              </div>
              <div className="space-y-1">
                {results.drivers.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelect(`/app/drivers`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/80 cursor-pointer border border-transparent hover:border-emerald-200 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{d.name}</span>
                          <span className="text-slate-500">•</span>
                          <span className="font-semibold text-slate-700">{d.employeeId}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {d.phone} • Safety: {d.safetyRating || '5.0'} ★ • Bus: {d.assignedVehicleNumber || 'Standby'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={d.status} />
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Routes & Clients */}
          {results.routes.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-2 py-1 mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5 text-purple-600">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Transit Routes</span>
                </span>
                <span className="text-[10px]">{results.routes.length} found</span>
              </div>
              <div className="space-y-1">
                {results.routes.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => handleSelect(`/app/routes`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50/80 cursor-pointer border border-transparent hover:border-purple-200 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{r.name}</span>
                          <span className="text-slate-500">•</span>
                          <span className="font-mono text-purple-700">{r.code}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {r.corridor} • {r.clientName} • {r.stopsCount || (r.stops?.length || 4)} Stops
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Passengers */}
          {results.passengers.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-2 py-1 mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <Users className="w-3.5 h-3.5" />
                  <span>Staff Commuters</span>
                </span>
                <span className="text-[10px]">{results.passengers.length} found</span>
              </div>
              <div className="space-y-1">
                {results.passengers.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect(`/app/passengers`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/80 cursor-pointer border border-transparent hover:border-indigo-200 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{p.name}</span>
                          <span className="text-slate-500">•</span>
                          <span className="font-mono text-indigo-700">{p.employeeId}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {p.companyName} • {p.department} • Stop: {p.assignedPickupStopName || 'Assigned Stop'}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Command Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="text-orange-600 font-semibold">Dubai Transport Central Index</span>
        </div>
      </div>
    </div>
  );
};
