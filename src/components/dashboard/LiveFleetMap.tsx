import React, { useState, useEffect } from 'react';
import {
  Radio,
  Navigation,
  Fuel,
  Thermometer,
  ShieldCheck,
  Phone,
  User,
  MapPin,
  Clock,
  Layers,
  Maximize2,
  Minimize2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Bus,
} from 'lucide-react';
import { VehicleLocation, Vehicle } from '../../types/index.js';
import { Badge, StatusBadge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';

interface LiveFleetMapProps {
  locations: VehicleLocation[];
  vehicles: Vehicle[];
  onSelectVehicle?: (vehicle: Vehicle) => void;
}

// Dubai Coordinates reference points for SVG Map Projection
const DUBAI_HUBS = [
  { id: 'dxb', name: 'DXB Airport & Cargo', x: 74, y: 24, type: 'airport', label: 'DXB Cargo' },
  { id: 'deira', name: 'Deira / Sabkha Terminal', x: 68, y: 18, type: 'city', label: 'Deira Hub' },
  { id: 'alquoz', name: 'Al Quoz Industrial Camps', x: 52, y: 44, type: 'industrial', label: 'Al Quoz' },
  { id: 'businessbay', name: 'Downtown & Business Bay', x: 58, y: 35, type: 'commercial', label: 'Downtown' },
  { id: 'dso', name: 'Dubai Silicon Oasis (DSO)', x: 78, y: 55, type: 'tech', label: 'DSO / Academic' },
  { id: 'dip', name: 'Dubai Investment Park (DIP 1 & 2)', x: 38, y: 72, type: 'logistics', label: 'DIP Logistics' },
  { id: 'jafza', name: 'JAFZA South & Port Terminal', x: 22, y: 80, type: 'port', label: 'JAFZA Freezone' },
  { id: 'muhaisnah', name: 'Muhaisnah / Sonapur', x: 80, y: 18, type: 'industrial', label: 'Sonapur' },
  { id: 'south', name: 'Dubai South / Expo City', x: 32, y: 88, type: 'aerotropolis', label: 'Expo City' },
];

export const LiveFleetMap: React.FC<LiveFleetMapProps> = ({
  locations,
  vehicles,
  onSelectVehicle,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('veh-001');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ON_TRIP' | 'AVAILABLE' | 'MAINTENANCE'>('ALL');
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [pulseTick, setPulseTick] = useState<number>(0);
  const [isSimulatingMove, setIsSimulatingMove] = useState<boolean>(true);

  // Live simulation tick for movement pulse
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTick((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Map coordinates projection from Lat/Long to % on SVG
  // Dubai bounds roughly: Lat 24.85 to 25.35, Long 55.0 to 55.45
  const getCoordinatesPercent = (lat: number, lng: number, vehicleIndex: number) => {
    // Standard projection helper with micro-jitter for live feel
    const jitter = isSimulatingMove ? Math.sin((pulseTick + vehicleIndex) * 0.7) * 0.8 : 0;
    const minLat = 24.90;
    const maxLat = 25.32;
    const minLng = 55.02;
    const maxLng = 55.42;

    const x = Math.max(10, Math.min(90, ((lng - minLng) / (maxLng - minLng)) * 100 + jitter));
    // Invert Y because latitude increases North
    const y = Math.max(10, Math.min(90, (1 - (lat - minLat) / (maxLat - minLat)) * 100 + (jitter * 0.5)));

    return { x, y };
  };

  const selectedLoc = locations.find((l) => l.vehicleId === selectedVehicleId) || locations[0];
  const selectedVeh = vehicles.find((v) => v.id === (selectedLoc?.vehicleId || selectedVehicleId)) || vehicles[0];

  const filteredVehicles = vehicles.filter((v) => {
    if (activeFilter === 'ALL') return true;
    return v.status === activeFilter;
  });

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-white">
      {/* Top Map Control Bar */}
      <div className="p-4 border-b border-slate-800/80 bg-[#060D17] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="font-extrabold text-sm tracking-tight font-heading text-white">
              LIVE DUBAI TRANSIT RADAR & GPS TELEMATICS
            </span>
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-orange-400 border border-slate-700">
            GPS / GLONASS Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter Pills */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs">
            {(['ALL', 'ON_TRIP', 'AVAILABLE', 'MAINTENANCE'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  activeFilter === filter
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter === 'ON_TRIP' ? 'IN TRANSIT' : filter}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMapZoom((prev) => (prev === 1 ? 1.2 : 1))}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Toggle Map Scale"
          >
            {mapZoom === 1 ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Grid: Vector Map Visualizer (Left) + Real-time Telemetry Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* SVG Dubai Transit Vector Canvas */}
        <div className="lg:col-span-8 relative bg-[#040810] p-4 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Background Grid Lines & Coastline Simulation */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* SVG Map Layer */}
          <div
            className="relative w-full h-[360px] sm:h-[420px] transition-transform duration-300"
            style={{ transform: `scale(${mapZoom})`, transformOrigin: 'center' }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Arabian Gulf Coastline Line */}
              <path
                d="M 10 95 Q 35 70 50 50 T 80 15"
                fill="none"
                stroke="#1E293B"
                strokeWidth="2"
                strokeDasharray="2 2"
              />

              {/* Major Dubai Transit Arteries (E11, E311, E44, E611) */}
              {/* Sheikh Zayed Road (E11) */}
              <path
                d="M 18 88 L 36 70 L 52 48 L 68 22 L 76 12"
                fill="none"
                stroke="#334155"
                strokeWidth="1.5"
              />
              <text x="38" y="66" fill="#475569" fontSize="2" fontWeight="bold">
                E11 Sheikh Zayed Rd
              </text>

              {/* Sheikh Mohammed Bin Zayed Road (E311) */}
              <path
                d="M 28 92 L 44 72 L 60 48 L 76 22 L 84 10"
                fill="none"
                stroke="#1E293B"
                strokeWidth="1.2"
                strokeDasharray="1 1"
              />
              <text x="56" y="44" fill="#334155" fontSize="2" fontWeight="bold">
                E311 MBZ Rd
              </text>

              {/* Al Khail Road (E44) */}
              <path
                d="M 38 78 L 52 56 L 68 36 L 76 22"
                fill="none"
                stroke="#1E293B"
                strokeWidth="1"
              />

              {/* Major Industrial & Corporate Transit Hub Nodes */}
              {DUBAI_HUBS.map((hub) => (
                <g key={hub.id} className="cursor-default">
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={hub.type === 'airport' || hub.type === 'logistics' ? '2.2' : '1.6'}
                    fill={hub.type === 'airport' ? '#0ea5e9' : hub.type === 'logistics' ? '#f97316' : '#64748b'}
                    opacity="0.6"
                  />
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r="4"
                    fill="none"
                    stroke={hub.type === 'airport' ? '#0ea5e9' : '#f97316'}
                    strokeWidth="0.2"
                    opacity="0.3"
                  />
                  <text
                    x={hub.x + 2.5}
                    y={hub.y + 0.8}
                    fill="#94a3b8"
                    fontSize="2.4"
                    fontWeight="600"
                  >
                    {hub.label}
                  </text>
                </g>
              ))}

              {/* Active Vehicles Markers */}
              {filteredVehicles.map((veh, idx) => {
                const loc = locations.find((l) => l.vehicleId === veh.id);
                const pos = loc
                  ? getCoordinatesPercent(loc.latitude, loc.longitude, idx)
                  : { x: 35 + idx * 8, y: 40 + idx * 7 };
                const isSelected = (selectedVehicleId === veh.id) || (!selectedVehicleId && idx === 0);

                let markerColor = '#10B981'; // Green for Available
                if (veh.status === 'ON_TRIP') markerColor = '#F97316'; // Orange for On Trip
                if (veh.status === 'MAINTENANCE') markerColor = '#EF4444'; // Red for Maintenance

                return (
                  <g
                    key={veh.id}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => {
                      setSelectedVehicleId(veh.id);
                      if (onSelectVehicle) onSelectVehicle(veh);
                    }}
                  >
                    {/* Animated Pulsing Ring for Moving Buses */}
                    {veh.status === 'ON_TRIP' && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="5"
                        fill="none"
                        stroke={markerColor}
                        strokeWidth="0.5"
                        opacity="0.8"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer Selection Highlight */}
                    {isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="4.2"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="0.8"
                      />
                    )}

                    {/* Core Vehicle Dot */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="2.6"
                      fill={markerColor}
                      stroke="#0F172A"
                      strokeWidth="0.6"
                    />

                    {/* Vehicle Plate Tag */}
                    <rect
                      x={pos.x - 6}
                      y={pos.y - 6.5}
                      width="12"
                      height="3.2"
                      rx="0.8"
                      fill="#060D17"
                      stroke={isSelected ? '#F97316' : '#334155'}
                      strokeWidth="0.3"
                      opacity="0.95"
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 4.3}
                      fill={isSelected ? '#FDBA74' : '#E2E8F0'}
                      fontSize="1.8"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {veh.vehicleNumber}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Footer Bar with Corridor Legend & Telematics Summary */}
          <div className="relative z-10 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
                <span>On-Trip ({vehicles.filter((v) => v.status === 'ON_TRIP').length})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Available ({vehicles.filter((v) => v.status === 'AVAILABLE').length})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span>Workshop ({vehicles.filter((v) => v.status === 'MAINTENANCE').length})</span>
              </span>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              <span>Telemetry Sync Rate: 1.0s (Live)</span>
            </div>
          </div>
        </div>

        {/* Selected Vehicle Telemetry Inspector Card (Right Pane) */}
        <div className="lg:col-span-4 p-5 bg-slate-900 flex flex-col justify-between">
          {selectedVeh ? (
            <div className="space-y-4">
              {/* Header with Plate & Status */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-lg text-white font-heading tracking-tight">
                      {selectedVeh.vehicleNumber}
                    </span>
                    <StatusBadge status={selectedVeh.status} />
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Plate: {selectedVeh.registrationNumber} • {selectedVeh.make} {selectedVeh.model}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800 text-orange-400">
                  <Bus className="w-5 h-5" />
                </div>
              </div>

              {/* Active Route Assignment */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Active Route Corridor</span>
                  <span className="text-orange-400 font-bold text-[11px]">
                    {selectedVeh.currentRouteName ? 'DISPATCHED' : 'STANDBY'}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-100 line-clamp-2">
                  {selectedVeh.currentRouteName || 'Available for On-Demand Dispatch / Charter'}
                </p>
              </div>

              {/* Live Telematics Readout Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                    <span>GPS Speed</span>
                    <Navigation className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <p className="text-lg font-bold text-white font-mono">
                    {selectedLoc?.speedKmh ?? 0} <span className="text-xs font-normal text-slate-400">km/h</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                    <span>Fuel Level</span>
                    <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-lg font-bold text-emerald-400 font-mono">
                    {selectedLoc?.fuelLevelPercent ?? 85}%
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                    <span>Cabin Climate</span>
                    <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <p className="text-sm font-bold text-cyan-300">
                    AC ON (21.5°C)
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                    <span>Passenger Load</span>
                    <User className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <p className="text-sm font-bold text-white">
                    {selectedVeh.status === 'ON_TRIP' ? '26 / 30' : `0 / ${selectedVeh.capacity}`} seats
                  </p>
                </div>
              </div>

              {/* Assigned Captain & Driver Contact */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      {selectedVeh.assignedDriverName || 'Unassigned / Shift Change'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      RTA Heavy Bus Licensed • 4.95 Rating
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Calling driver: ${selectedVeh.assignedDriverName || 'Operations Room'}`)}
                  className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white transition-colors"
                  title="Contact Captain"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* RTA & Mulkiya Quick Status */}
              <div className="text-[11px] text-slate-400 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                <div className="flex justify-between">
                  <span>Mulkiya Expiry:</span>
                  <span className="font-mono text-slate-300">{selectedVeh.registrationExpiry}</span>
                </div>
                <div className="flex justify-between">
                  <span>RTA Commercial Permit:</span>
                  <span className="font-mono text-emerald-400">Valid ({selectedVeh.rtaPermitExpiry})</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Bus className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-xs">Select any vehicle on the map to inspect live telemetry.</p>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-800 mt-4">
            <Button
              size="sm"
              variant="navy"
              className="w-full justify-center bg-slate-800 hover:bg-slate-700 text-white"
              onClick={() => alert(`Opening telematics log for ${selectedVeh?.vehicleNumber}`)}
            >
              Open Full Telematics & GPS Log
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
