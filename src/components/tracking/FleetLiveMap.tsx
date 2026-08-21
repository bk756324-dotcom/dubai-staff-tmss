import React, { useState } from 'react';
import {
  Navigation,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  RotateCw,
  Radio,
  MapPin,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Gauge,
  Zap,
} from 'lucide-react';
import { VehicleLocation } from '../../types/index.js';

interface EnrichedLocation extends VehicleLocation {
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleType?: string;
  registrationNumber?: string;
  capacity?: number;
  vehicleStatus?: string;
  driverName?: string;
  driverPhone?: string;
  driverRating?: number;
  activeTripId?: string;
  tripNumber?: string;
  tripStatus?: string;
  routeName?: string;
  routeOrigin?: string;
  routeDestination?: string;
  clientName?: string;
  progressPercent?: number;
  completedStopsCount?: number;
  totalStopsCount?: number;
  nextStopName?: string;
  estimatedArrivalMinutes?: number;
  delayMinutes?: number;
}

interface FleetLiveMapProps {
  locations: EnrichedLocation[];
  selectedVehicleId: string | null;
  onSelectVehicle: (vehicleId: string) => void;
  onSimulateTick: () => void;
  isSimulating: boolean;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

// Dubai Key Corridors & Landmarks for vector representation
const DUBAI_LANDMARKS = [
  { name: 'DXB Int Airport (T1/T3)', x: 74, y: 22, type: 'airport' },
  { name: 'Deira / Sonapur Hub', x: 76, y: 15, type: 'industrial' },
  { name: 'Al Quoz Industrial', x: 50, y: 44, type: 'industrial' },
  { name: 'Downtown / Business Bay', x: 58, y: 35, type: 'hub' },
  { name: 'Dubai Investment Park (DIP)', x: 30, y: 78, type: 'industrial' },
  { name: 'JAFZA / Jebel Ali Port', x: 18, y: 82, type: 'port' },
  { name: 'Dubai South / Expo City', x: 36, y: 88, type: 'hub' },
  { name: 'Silicon Oasis (DSO)', x: 70, y: 55, type: 'tech' },
];

export const FleetLiveMap: React.FC<FleetLiveMapProps> = ({
  locations,
  selectedVehicleId,
  onSelectVehicle,
  onSimulateTick,
  isSimulating,
  filterStatus,
  setFilterStatus,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapLayer, setMapLayer] = useState<'corridors' | 'satellite' | 'transit'>('corridors');

  // Convert lat/lng from Dubai bounding box to SVG percentage coordinates
  // Dubai bounds roughly: Lat 24.95 to 25.32, Lng 55.05 to 55.45
  const getMapCoordinates = (lat: number, lng: number) => {
    const minLat = 24.95;
    const maxLat = 25.32;
    const minLng = 55.05;
    const maxLng = 55.45;

    const xPercent = Math.max(10, Math.min(90, ((lng - minLng) / (maxLng - minLng)) * 80 + 10));
    // Invert Y because latitude goes north (up) while SVG Y goes down
    const yPercent = Math.max(10, Math.min(90, 90 - ((lat - minLat) / (maxLat - minLat)) * 80));

    return { x: xPercent, y: yPercent };
  };

  const filteredLocations = locations.filter((loc) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'MOVING') return loc.speedKmh > 0 && loc.engineStatus === 'ON';
    if (filterStatus === 'IDLE') return loc.speedKmh === 0 && loc.engineStatus !== 'OFF';
    if (filterStatus === 'PARKED') return loc.engineStatus === 'OFF';
    if (filterStatus === 'DELAYED') return (loc.delayMinutes || 0) > 0 || loc.tripStatus === 'DELAYED';
    return true;
  });

  const selectedLoc = locations.find((l) => l.vehicleId === selectedVehicleId);

  return (
    <div id="fleet-live-map-container" className="relative w-full h-[620px] bg-[#071322] rounded-xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col select-none">
      {/* Top Map HUD Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Status Badge */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#0B1A30]/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-700/80 shadow-lg text-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-bold text-white tracking-wide">
              <span>SIMULATED TELEMATICS MODE</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono">
                VIRTUAL GPS
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              Dubai Smart Telematics Gateway • 1.2s ping interval
            </span>
          </div>
        </div>

        {/* Center Filter Buttons */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1 bg-[#0B1A30]/90 backdrop-blur-md p-1 rounded-lg border border-slate-700/80 shadow-lg text-xs">
          {(['ALL', 'MOVING', 'IDLE', 'PARKED', 'DELAYED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterStatus(filter)}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                filterStatus === filter
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {filter === 'ALL' && `All (${locations.length})`}
              {filter === 'MOVING' && `Moving (${locations.filter((l) => l.speedKmh > 0 && l.engineStatus === 'ON').length})`}
              {filter === 'IDLE' && `Idle (${locations.filter((l) => l.speedKmh === 0 && l.engineStatus !== 'OFF').length})`}
              {filter === 'PARKED' && `Parked (${locations.filter((l) => l.engineStatus === 'OFF').length})`}
              {filter === 'DELAYED' && `Delayed (${locations.filter((l) => (l.delayMinutes || 0) > 0 || l.tripStatus === 'DELAYED').length})`}
            </button>
          ))}
        </div>

        {/* Right Quick Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={onSimulateTick}
            disabled={isSimulating}
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg border border-orange-400/40 transition-all"
            title="Advance simulated vehicle telemetry along highway corridors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>Simulate Telemetry Tick</span>
          </button>
        </div>
      </div>

      {/* Vector Interactive Map Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-[#071322] cursor-grab active:cursor-grabbing">
        {/* Grid and Highway Background */}
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
        >
          <defs>
            {/* Background Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0F243E" strokeWidth="0.8" />
            </pattern>

            {/* Glowing corridor filters */}
            <filter id="glow-e11" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <linearGradient id="e11-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="e311-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#C2410C" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="coast-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0B1A30" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#050B14" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Persian Gulf Coastline Arc */}
          <path
            d="M 50 100 Q 200 200 450 320 T 950 550"
            fill="none"
            stroke="#0E2F56"
            strokeWidth="38"
            strokeLinecap="round"
            opacity="0.4"
          />
          <text x="200" y="140" fill="#1E4E8C" fontSize="13" fontWeight="bold" letterSpacing="4" opacity="0.6">
            ARABIAN GULF / DUBAI COASTLINE
          </text>

          {/* Base Grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Major Dubai Transport Corridors */}
          {/* 1. Sheikh Zayed Road (E11) - Blue Arterial */}
          <path
            d="M 120 540 L 280 430 L 460 320 L 640 210 L 820 120 L 920 70"
            fill="none"
            stroke="#0284C7"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
          <path
            d="M 120 540 L 280 430 L 460 320 L 640 210 L 820 120 L 920 70"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeDasharray="8 6"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* 2. Sheikh Mohammed Bin Zayed Road (E311) - Orange Expressway */}
          <path
            d="M 220 570 L 360 470 L 540 370 L 710 260 L 870 170 L 960 110"
            fill="none"
            stroke="#EA580C"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
          <path
            d="M 220 570 L 360 470 L 540 370 L 710 260 L 870 170 L 960 110"
            fill="none"
            stroke="#FDBA74"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            opacity="0.8"
          />

          {/* 3. Al Khail Road (E44) - Mid Arterial */}
          <path
            d="M 170 550 L 320 450 L 500 345 L 680 235 L 850 145"
            fill="none"
            stroke="#10B981"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* 4. Emirates Road (E611) - Outer Logistics Bypass */}
          <path
            d="M 310 585 L 440 500 L 620 410 L 780 305 L 930 215"
            fill="none"
            stroke="#6366F1"
            strokeWidth="3"
            strokeDasharray="4 4"
            opacity="0.45"
          />

          {/* Connecting Cross Connectors: Al Yalayis, Hessa St, Umm Suqeim, Financial Centre Rd, Airport Rd */}
          <path d="M 280 430 L 440 500" stroke="#1E3A5F" strokeWidth="2.5" strokeDasharray="3 3" />
          <path d="M 460 320 L 620 410" stroke="#1E3A5F" strokeWidth="2.5" strokeDasharray="3 3" />
          <path d="M 640 210 L 780 305" stroke="#1E3A5F" strokeWidth="2.5" strokeDasharray="3 3" />
          <path d="M 820 120 L 740 220" stroke="#1E3A5F" strokeWidth="2.5" strokeDasharray="3 3" />

          {/* Corridor Labels */}
          <text x="320" y="380" fill="#38BDF8" fontSize="10" fontWeight="bold" opacity="0.8" transform="rotate(-31, 320, 380)">
            SHEIKH ZAYED ROAD (E11)
          </text>
          <text x="400" y="440" fill="#FB923C" fontSize="10" fontWeight="bold" opacity="0.8" transform="rotate(-31, 400, 440)">
            MOHAMMED BIN ZAYED RD (E311)
          </text>
          <text x="490" y="490" fill="#818CF8" fontSize="9" fontWeight="medium" opacity="0.7" transform="rotate(-31, 490, 490)">
            EMIRATES RD (E611 LOGISTICS)
          </text>

          {/* Key Dubai Industrial & Commercial Hubs */}
          {DUBAI_LANDMARKS.map((landmark, idx) => {
            const px = (landmark.x / 100) * 1000;
            const py = (landmark.y / 100) * 600;
            return (
              <g key={idx} className="cursor-default">
                <circle cx={px} cy={py} r="18" fill="#0B1E36" stroke="#1E4570" strokeWidth="1.5" opacity="0.7" />
                <circle cx={px} cy={py} r="4" fill="#38BDF8" opacity="0.9" />
                <rect
                  x={px - 60}
                  y={py + 10}
                  width="120"
                  height="18"
                  rx="4"
                  fill="#061220"
                  stroke="#1E3A5F"
                  strokeWidth="0.8"
                  opacity="0.85"
                />
                <text
                  x={px}
                  y={py + 22}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="9"
                  fontWeight="600"
                >
                  {landmark.name}
                </text>
              </g>
            );
          })}

          {/* Render Route Active Path if a vehicle is selected */}
          {selectedLoc && (
            <g>
              {/* Highlight vehicle route spline */}
              <circle
                cx={(getMapCoordinates(selectedLoc.latitude, selectedLoc.longitude).x / 100) * 1000}
                cy={(getMapCoordinates(selectedLoc.latitude, selectedLoc.longitude).y / 100) * 600}
                r="45"
                fill="#F97316"
                fillOpacity="0.12"
                className="animate-pulse"
              />
              <circle
                cx={(getMapCoordinates(selectedLoc.latitude, selectedLoc.longitude).x / 100) * 1000}
                cy={(getMapCoordinates(selectedLoc.latitude, selectedLoc.longitude).y / 100) * 600}
                r="30"
                fill="none"
                stroke="#F97316"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            </g>
          )}
        </svg>

        {/* HTML Vehicle Markers Placed over SVG (Precision Positioned) */}
        {filteredLocations.map((loc) => {
          const coords = getMapCoordinates(loc.latitude, loc.longitude);
          const isSelected = selectedVehicleId === loc.vehicleId;
          const isMoving = loc.speedKmh > 0 && loc.engineStatus === 'ON';
          const isIdle = loc.speedKmh === 0 && loc.engineStatus !== 'OFF';
          const isDelayed = (loc.delayMinutes || 0) > 0 || loc.tripStatus === 'DELAYED';

          let pinBg = 'bg-slate-700 border-slate-500';
          if (isDelayed) {
            pinBg = 'bg-rose-600 border-rose-400 shadow-rose-900/50';
          } else if (isMoving) {
            pinBg = 'bg-emerald-500 border-emerald-300 shadow-emerald-900/50';
          } else if (isIdle) {
            pinBg = 'bg-amber-500 border-amber-300 shadow-amber-900/50';
          }

          return (
            <div
              key={loc.id}
              onClick={() => onSelectVehicle(loc.vehicleId)}
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute cursor-pointer transition-all duration-300 z-10 ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-110 hover:z-20'
              }`}
            >
              {/* Pulse ripple for selected / moving vehicle */}
              {isMoving && (
                <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-40 animate-ping"></span>
              )}

              {/* Marker Pin */}
              <div
                className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 text-white shadow-xl ${pinBg} ${
                  isSelected ? 'ring-4 ring-orange-500/80 ring-offset-2 ring-offset-[#071322]' : ''
                }`}
              >
                <Navigation
                  className="w-4 h-4 transition-transform"
                  style={{ transform: `rotate(${loc.headingDegrees || 0}deg)` }}
                />
              </div>

              {/* Vehicle Label Pill */}
              <div
                className={`absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-bold border shadow-md flex items-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-400 shadow-orange-900/50'
                    : 'bg-[#0A1A30]/90 text-slate-200 border-slate-700/80 backdrop-blur-sm'
                }`}
              >
                <span>{loc.vehicleNumber}</span>
                {loc.speedKmh > 0 ? (
                  <span className="text-[9px] text-emerald-300 font-mono">{loc.speedKmh}kph</span>
                ) : (
                  <span className="text-[9px] text-slate-400 font-mono">0kph</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Map Floating HUD with Controls */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Telematics Legend */}
        <div className="pointer-events-auto flex items-center gap-3 bg-[#0B1A30]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-[11px] text-slate-300 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Moving</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Idle (AC On)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Delayed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
            <span>Parked</span>
          </div>
        </div>

        {/* Right Map Zoom & Reset Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#0B1A30]/90 backdrop-blur-md p-1 rounded-lg border border-slate-700/80 shadow-lg">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.0))}
            className="p-1.5 rounded bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
            className="p-1.5 rounded bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="px-2 py-1 text-[11px] font-medium rounded bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            title="Reset Map View"
          >
            Center Dubai
          </button>
        </div>
      </div>
    </div>
  );
};
