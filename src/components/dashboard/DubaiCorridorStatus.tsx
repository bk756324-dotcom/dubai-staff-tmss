import React from 'react';
import {
  Building2,
  Plane,
  Anchor,
  Cpu,
  Factory,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card.js';

export const DubaiCorridorStatus: React.FC = () => {
  const corridors = [
    {
      id: 'dip',
      name: 'Dubai Investment Park (DIP 1 & 2)',
      type: 'Industrial Logistics',
      icon: <Factory className="w-4 h-4 text-orange-500" />,
      activeBuses: 8,
      dailyPassengers: 420,
      trafficStatus: 'FLOWING',
      trafficColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      keyClients: ['Al Habtoor Logistics', 'Danube Warehousing'],
    },
    {
      id: 'jafza',
      name: 'Jebel Ali Free Zone (JAFZA South & North)',
      type: 'Maritime & Heavy Fabrication',
      icon: <Anchor className="w-4 h-4 text-blue-500" />,
      activeBuses: 6,
      dailyPassengers: 310,
      trafficStatus: 'MODERATE',
      trafficColor: 'text-blue-600 bg-blue-50 border-blue-200',
      keyClients: ['JAFZA Marine & Offshore', 'DP World Contractor Zone'],
    },
    {
      id: 'dxb',
      name: 'DXB Airport Freezone & Freight Gates',
      type: 'Aviation Ground Services',
      icon: <Plane className="w-4 h-4 text-indigo-500" />,
      activeBuses: 5,
      dailyPassengers: 280,
      trafficStatus: 'FLOWING',
      trafficColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      keyClients: ['Emirates Ground Handling', 'Dnata Cargo Logistics'],
    },
    {
      id: 'dso',
      name: 'Dubai Silicon Oasis & Academic City',
      type: 'Tech & University Staff',
      icon: <Cpu className="w-4 h-4 text-teal-500" />,
      activeBuses: 4,
      dailyPassengers: 190,
      trafficStatus: 'CLEAR',
      trafficColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      keyClients: ['DSO Tech Park', 'Curtin University Staff'],
    },
    {
      id: 'alquoz',
      name: 'Al Quoz Central Staff Hubs',
      type: 'Industrial Residential Zone',
      icon: <Building2 className="w-4 h-4 text-amber-500" />,
      activeBuses: 5,
      dailyPassengers: 220,
      trafficStatus: 'PEAK_COMMUTE',
      trafficColor: 'text-amber-600 bg-amber-50 border-amber-200',
      keyClients: ['Al Quoz Camp 4 Hub', 'Al Khail Gate Terminal'],
    },
  ];

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <CardTitle className="text-sm font-extrabold text-slate-900 font-heading uppercase tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-500" />
            <span>Dubai Strategic Corridor Matrix</span>
          </CardTitle>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Real-time passenger volume & shuttle density across Dubai trade zones
          </p>
        </div>
        <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
          Live Hub Feeds
        </span>
      </CardHeader>

      <CardContent className="pt-3 space-y-2.5">
        {corridors.map((c) => (
          <div
            key={c.id}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs mt-0.5 flex-shrink-0">
                {c.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900">{c.name}</h4>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${c.trafficColor}`}>
                    {c.trafficStatus.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{c.type}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                  <span>Major Accounts:</span>
                  <span className="font-semibold text-slate-600">{c.keyClients.join(' • ')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
              <div>
                <p className="text-xs font-extrabold text-slate-900 font-heading">
                  {c.activeBuses} <span className="text-[10px] font-normal text-slate-500">Shuttles</span>
                </p>
                <p className="text-[10px] text-slate-400">Active in transit</p>
              </div>

              <div className="border-l border-slate-200 pl-4">
                <p className="text-xs font-extrabold text-orange-600 font-heading">
                  {c.dailyPassengers} <span className="text-[10px] font-normal text-slate-500">Pax/day</span>
                </p>
                <p className="text-[10px] text-slate-400">Verified riders</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
