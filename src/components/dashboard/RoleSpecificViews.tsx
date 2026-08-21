import React from 'react';
import {
  User,
  Bus,
  MapPin,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Users,
  Calendar,
  Phone,
  FileText,
  AlertCircle,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { UserRole } from '../../types/index.js';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card.js';
import { Button } from '../ui/Button.js';
import { Badge } from '../ui/Badge.js';

interface RoleSpecificViewsProps {
  role: UserRole;
  userName?: string;
  onNavigate?: (path: string) => void;
}

export const RoleSpecificViews: React.FC<RoleSpecificViewsProps> = ({
  role,
  userName = 'Operator',
  onNavigate,
}) => {
  // If Driver persona
  if (role === 'DRIVER') {
    return (
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50/50 via-white to-slate-50 shadow-xs mb-6">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-orange-500 text-white uppercase tracking-wider">
                  Driver Captain Console
                </span>
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>On Duty & Dispatched</span>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading">
                Captain {userName} (DRV-201)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => alert('Starting RFID passenger boarding checklist...')}
            >
              Start Stop Boarding
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => alert('Emergency SOS sent to Dubai Dispatch Control Room!')}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              SOS Alert
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Assigned Bus</span>
              <p className="text-base font-extrabold text-slate-900 mt-1">BUS-101 (DXB-K-49120)</p>
              <p className="text-[11px] text-slate-500">Toyota Coaster 30-Seater Deluxe</p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Active Shift Corridor</span>
              <p className="text-sm font-extrabold text-orange-600 mt-1 line-clamp-1">
                Al Quoz 3 → DIP 2 Logistics
              </p>
              <p className="text-[11px] text-slate-500">Next Stop: Al Khail Gate Phase 2</p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Passenger Load</span>
              <p className="text-base font-extrabold text-slate-900 mt-1">22 / 26 Boarded</p>
              <p className="text-[11px] text-emerald-600 font-semibold">4 remaining at Next Stop</p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 font-bold uppercase text-[10px]">RTA Card & License</span>
              <p className="text-sm font-extrabold text-emerald-700 mt-1">RTA-DP-99382 (Valid)</p>
              <p className="text-[11px] text-slate-500">Heavy Bus Category 6</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If Client persona (e.g. Al Habtoor Logistics)
  if (role === 'CLIENT') {
    return (
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50/50 via-white to-slate-50 shadow-xs mb-6">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-600 text-white uppercase tracking-wider">
                  Corporate Client Portal
                </span>
                <span className="text-xs text-blue-600 font-bold">
                  Contract: AED 480,000 / yr
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading">
                Al Habtoor Logistics & Warehousing LLC
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="navy"
              onClick={() => onNavigate && onNavigate('/app/passengers')}
            >
              Manage Employee Manifest
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => alert('Requesting additional 30-seater shuttle for evening shift...')}
            >
              Request Extra Shuttle
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Dedicated Shuttles</span>
              <p className="text-base font-extrabold text-slate-900 mt-1">3 Active Buses</p>
              <p className="text-[11px] text-emerald-600 font-semibold">100% GPS Monitored</p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Registered Employees</span>
              <p className="text-base font-extrabold text-slate-900 mt-1">84 Daily Commuters</p>
              <p className="text-[11px] text-slate-500">2 Morning & 2 Evening Shifts</p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Shift Arrival Punctuality</span>
              <p className="text-base font-extrabold text-blue-700 mt-1">99.1% On-Time</p>
              <p className="text-[11px] text-slate-500">DIP 2 Logistics Terminal</p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Account Representative</span>
              <p className="text-sm font-extrabold text-slate-900 mt-1">Farhan Siddiqui</p>
              <p className="text-[11px] text-slate-500">Dubai TMS Ops Manager</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default: Return null for Admin/Manager as they get the full dashboard
  return null;
};
