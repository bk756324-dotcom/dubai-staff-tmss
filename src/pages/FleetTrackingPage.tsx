import React, { useState, useEffect } from 'react';
import {
  Radio,
  Bus,
  Search,
  Filter,
  RefreshCw,
  Navigation,
  Gauge,
  Flame,
  Snowflake,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { FleetLiveMap } from '../components/tracking/FleetLiveMap.js';
import { VehicleTelematicsDrawer } from '../components/tracking/VehicleTelematicsDrawer.js';
import { useToast } from '../context/ToastContext.js';
import { useI18n } from '../context/I18nContext.js';

interface FleetTrackingPageProps {
  navigate: (path: string) => void;
}

export const FleetTrackingPage: React.FC<FleetTrackingPageProps> = ({ navigate }) => {
  const { t } = useI18n();
  const toast = useToast();

  const [locations, setLocations] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLiveTelemetry = async () => {
    try {
      const res = await fetch('/api/tracking/live');
      const data = await res.json();
      if (data.success) {
        setLocations(data.data || []);
        setSummary(data.summary || {});
        // Select first vehicle if none selected
        if (!selectedVehicleId && data.data && data.data.length > 0) {
          setSelectedVehicleId(data.data[0].vehicleId);
        }
      }
    } catch (err) {
      console.error('Error fetching live telematics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTelemetry();
  }, []);

  // Auto-refresh simulation loop
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLiveTelemetry();
    }, 6000);
    return () => clearInterval(interval);
  }, [autoRefresh, selectedVehicleId]);

  const handleSimulateTick = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/tracking/simulate-tick', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.info('GPS Telemetry Tick', 'Virtual GPS ping generated for all active corridors.');
        await fetchLiveTelemetry();
      }
    } catch (err) {
      toast.error('Simulation Failed', 'Error generating telemetry tick.');
    } finally {
      setIsSimulating(false);
    }
  };

  const selectedVehicle = locations.find((l) => l.vehicleId === selectedVehicleId) || null;

  const filteredList = locations.filter((loc) => {
    const matchesSearch =
      !searchQuery ||
      loc.vehicleNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.driverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.routeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.clientName?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'MOVING') return loc.speedKmh > 0 && loc.engineStatus === 'ON';
    if (filterStatus === 'IDLE') return loc.speedKmh === 0 && loc.engineStatus !== 'OFF';
    if (filterStatus === 'PARKED') return loc.engineStatus === 'OFF';
    if (filterStatus === 'DELAYED') return (loc.delayMinutes || 0) > 0 || loc.tripStatus === 'DELAYED';
    return true;
  });

  return (
    <div id="fleet-tracking-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-500 uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-orange-500 animate-pulse" />
            <span>{t('fleet_telematics', 'Operations Control Center')}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('live_fleet_tracking', 'Live Fleet Telematics & GPS')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Real-time GPS positioning, speed sensors, cabin AC diagnostics, and route checkpoint telemetry across Dubai.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
              autoRefresh
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></span>
            <span>{autoRefresh ? 'Live Streaming (6s)' : 'Stream Paused'}</span>
          </button>

          <button
            onClick={fetchLiveTelemetry}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            title="Refresh GPS Feed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Prominent Simulated Telematics Mode Notice */}
      <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">SIMULATED TELEMATICS MODE</span>
              <span className="text-[10px] bg-amber-500/30 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold">
                PROMPT 6 SPEC
              </span>
            </div>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
              Live coordinates, OBD-II vehicle speeds, and corridor waypoints are rendered via Dubai TMS Simulated Telematics Gateway.
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulateTick}
          disabled={isSimulating}
          className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition-all flex-shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simulate Highway Movement</span>
        </button>
      </div>

      {/* 6 High-Level Telematics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Online Fleet</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {summary?.totalActiveVehicles || locations.length}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-auto pt-1 font-medium">
            100% Telemetry Online
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Moving</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {summary?.movingVehicles || locations.filter((l) => l.speedKmh > 0).length}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1">
            Active on E11 / E311
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Idle (AC On)</span>
          <div className="text-2xl font-black text-amber-500 mt-1 font-mono">
            {summary?.idleVehicles || locations.filter((l) => l.speedKmh === 0 && l.engineStatus !== 'OFF').length}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1">
            Stationary at Gate
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Trips</span>
          <div className="text-2xl font-black text-sky-500 mt-1 font-mono">
            {summary?.activeTrips || 2}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1">
            En route to drop-off
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Delayed Trips</span>
          <div className="text-2xl font-black text-rose-500 mt-1 font-mono">
            {summary?.delayedTrips || 0}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1">
            Traffic threshold alert
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">In Maintenance</span>
          <div className="text-2xl font-black text-purple-500 mt-1 font-mono">
            {summary?.vehiclesInMaintenance || 1}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1">
            Workshop Bay
          </span>
        </div>
      </div>

      {/* Main Map View + Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center Map Section */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <FleetLiveMap
            locations={locations}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={(id) => setSelectedVehicleId(id)}
            onSimulateTick={handleSimulateTick}
            isSimulating={isSimulating}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        </div>

        {/* Right Telematics Detail Inspector */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {selectedVehicle ? (
            <VehicleTelematicsDrawer
              vehicle={selectedVehicle}
              onClose={() => setSelectedVehicleId(null)}
              onRefresh={fetchLiveTelemetry}
              navigate={navigate}
            />
          ) : (
            <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <Bus className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                Select a Vehicle on Map
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                Click any animated vehicle pin on the Dubai corridor map to inspect real-time speed, cabin AC, driver details, and stop checkpoints.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Telematics Fleet Table / Quick Selector */}
      <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Live Fleet Telemetry Stream
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live diagnostic readings from vehicle telematics modules
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search plate, driver, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">Vehicle</th>
                <th className="pb-3">Captain</th>
                <th className="pb-3">Active Route / Client</th>
                <th className="pb-3">Speed</th>
                <th className="pb-3">Fuel</th>
                <th className="pb-3">AC Status</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredList.map((loc) => {
                const isSelected = selectedVehicleId === loc.vehicleId;
                const isMoving = loc.speedKmh > 0 && loc.engineStatus === 'ON';
                const isIdle = loc.speedKmh === 0 && loc.engineStatus !== 'OFF';

                return (
                  <tr
                    key={loc.id}
                    onClick={() => setSelectedVehicleId(loc.vehicleId)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-orange-500/10 dark:bg-orange-500/15'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Bus className="w-4 h-4 text-orange-500" />
                        <div>
                          <span>{loc.vehicleNumber}</span>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {loc.vehicleMake} {loc.vehicleModel}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 text-slate-700 dark:text-slate-300">
                      <div>{loc.driverName || 'Unassigned'}</div>
                      <div className="text-[10px] text-slate-400">{loc.driverPhone || '—'}</div>
                    </td>

                    <td className="py-3 text-slate-700 dark:text-slate-300">
                      {loc.routeName ? (
                        <div>
                          <span className="font-medium text-sky-600 dark:text-sky-400">{loc.routeName}</span>
                          {loc.clientName && (
                            <div className="text-[10px] text-slate-400">{loc.clientName}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Depot Standby</span>
                      )}
                    </td>

                    <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                      {loc.speedKmh > 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">{loc.speedKmh} km/h</span>
                      ) : (
                        <span className="text-slate-400">0 km/h</span>
                      )}
                    </td>

                    <td className="py-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {loc.fuelLevelPercent || 80}%
                    </td>

                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          loc.acStatus === 'ON'
                            ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        <Snowflake className="w-3 h-3" />
                        {loc.acStatus === 'ON' ? '21°C' : 'OFF'}
                      </span>
                    </td>

                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isMoving
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : isIdle
                            ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {isMoving ? 'MOVING' : isIdle ? 'IDLE' : 'PARKED'}
                      </span>
                    </td>

                    <td className="py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVehicleId(loc.vehicleId);
                        }}
                        className="text-orange-500 hover:text-orange-600 font-semibold text-xs inline-flex items-center gap-1"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
