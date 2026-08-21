import React from 'react';
import {
  LayoutDashboard,
  Bus,
  Users,
  Building2,
  UserCheck,
  MapPin,
  CalendarDays,
  Radio,
  Clock,
  Wrench,
  FileCheck2,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { UserRole } from '../../types/index.js';

interface SidebarProps {
  currentPath: string;
  navigate: (path: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavSection {
  title: string;
  roles?: UserRole[];
  items: {
    path: string;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    roles?: UserRole[];
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  navigate,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { user } = useAuth();
  const currentRole = user?.role || 'ADMIN';

  const navSections: NavSection[] = [
    {
      title: 'OPERATIONS CONTROL',
      items: [
        {
          path: '/app/dashboard',
          label: 'Operations Center',
          icon: <LayoutDashboard className="w-5 h-5" />,
          roles: ['ADMIN', 'MANAGER', 'DISPATCHER', 'DRIVER', 'CLIENT'],
        },
        {
          path: '/app/tracking',
          label: currentRole === 'CLIENT' ? 'My Fleet GPS Tracking' : currentRole === 'DRIVER' ? 'Live Telematics (GPS)' : 'Live Telematics (GPS)',
          icon: <Radio className="w-5 h-5 text-orange-400" />,
          badge: 'LIVE',
          roles: ['ADMIN', 'MANAGER', 'DISPATCHER', 'DRIVER', 'CLIENT'],
        },
        {
          path: '/app/trips',
          label: currentRole === 'DRIVER' ? 'My Assigned Trips' : currentRole === 'CLIENT' ? 'Corporate Trips' : 'Trips & Dispatch',
          icon: <Clock className="w-5 h-5" />,
          roles: ['ADMIN', 'MANAGER', 'DISPATCHER', 'DRIVER', 'CLIENT'],
        },
        {
          path: '/app/schedule',
          label: currentRole === 'DRIVER' ? 'My Duty Shifts' : 'Shift Matrix',
          icon: <CalendarDays className="w-5 h-5" />,
          roles: ['ADMIN', 'MANAGER', 'DISPATCHER', 'DRIVER'],
        },
      ],
    },
    {
      title: 'FLEET & CREW',
      items: [
        {
          path: '/app/fleet',
          label: currentRole === 'CLIENT' ? 'Assigned Vehicles' : 'Fleet Management',
          icon: <Bus className="w-5 h-5" />,
          roles: ['ADMIN', 'MANAGER', 'DISPATCHER', 'CLIENT'],
        },
        {
          path: '/app/drivers',
          label: currentRole === 'CLIENT' ? 'Assigned Captains' : 'Driver Captains',
          icon: <UserCheck className="w-5 h-5" />,
          roles: ['ADMIN', 'MANAGER', 'DISPATCHER', 'CLIENT'],
        },
        {
          path: '/app/routes',
          label: currentRole === 'CLIENT' ? 'Corporate Routes' : 'Routes & Stops',
          icon: <MapPin className="w-5 h-5" />,
          roles: ['ADMIN', 'MANAGER', 'DISPATCHER', 'DRIVER', 'CLIENT'],
        },
      ],
    },
    {
      title: 'CORPORATE & PASSENGERS',
      items: [
        {
          path: '/app/clients',
          label: currentRole === 'CLIENT' ? 'Company Account' : 'Corporate Clients',
          icon: <Building2 className="w-5 h-5" />,
          roles: ['ADMIN', 'MANAGER', 'DISPATCHER', 'CLIENT'],
        },
        {
          path: '/app/passengers',
          label: currentRole === 'CLIENT' ? 'Staff Passengers' : 'Passenger Manifest',
          icon: <Users className="w-5 h-5" />,
          roles: ['ADMIN', 'MANAGER', 'DISPATCHER', 'DRIVER', 'CLIENT'],
        },
      ],
    },
    {
      title: 'SAFETY & COMPLIANCE',
      items: [
        {
          path: '/app/maintenance',
          label: 'Fleet Maintenance',
          icon: <Wrench className="w-5 h-5" />,
          roles: ['ADMIN', 'MANAGER', 'DISPATCHER'],
        },
        {
          path: '/app/documents',
          label: 'Document Repository',
          icon: <FileCheck2 className="w-5 h-5" />,
          roles: ['ADMIN', 'MANAGER', 'DISPATCHER', 'DRIVER', 'CLIENT'],
        },
        {
          path: '/app/compliance',
          label: 'Compliance Center',
          icon: <Shield className="w-5 h-5 text-emerald-400" />,
          badge: 'RTA',
          roles: ['ADMIN', 'MANAGER', 'DISPATCHER', 'DRIVER', 'CLIENT'],
        },
        {
          path: '/app/notifications',
          label: 'Notification Center',
          icon: <Bell className="w-5 h-5" />,
          roles: ['ADMIN', 'MANAGER', 'DISPATCHER', 'DRIVER', 'CLIENT'],
        },
      ],
    },
    {
      title: 'INTELLIGENCE & ADMIN',
      items: [
        {
          path: '/app/reports',
          label: currentRole === 'CLIENT' ? 'Corporate SLA & Reports' : 'Analytics & KPIs',
          icon: <BarChart3 className="w-5 h-5" />,
          roles: ['ADMIN', 'MANAGER', 'DISPATCHER', 'DRIVER', 'CLIENT'],
        },
        {
          path: '/app/foundation',
          label: 'Diagnostics & Seeds',
          icon: <Settings className="w-5 h-5" />,
          roles: ['ADMIN', 'MANAGER'],
        },
      ],
    },
  ];

  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.roles || item.roles.includes(currentRole)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-[#0A192F] text-slate-200 border-r border-slate-800 transition-all duration-200 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-[#060D17]">
        {!isCollapsed ? (
          <div
            onClick={() => navigate('/app/dashboard')}
            className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Bus className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="font-extrabold text-white text-sm tracking-tight font-heading block">
                DUBAI TMS
              </span>
              <span className="text-[10px] text-slate-400 font-medium block -mt-0.5">Control Platform</span>
            </div>
          </div>
        ) : (
          <div
            onClick={() => navigate('/app/dashboard')}
            className="w-9 h-9 mx-auto rounded-lg bg-orange-500 text-white flex items-center justify-center cursor-pointer shadow-md"
          >
            <Bus className="w-5 h-5" />
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors hidden lg:block"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {visibleSections.map((section, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <h4 className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-2 font-heading">
                {section.title}
              </h4>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigate(item.path)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                    {!isCollapsed && <span className="truncate flex-1">{item.label}</span>}
                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase ${
                          item.badge === 'LIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Operator Role Badge Footer */}
      <div className="p-3 border-t border-slate-800 bg-[#060D17]">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 bg-slate-900/90 rounded-lg p-2 border border-slate-800">
            <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center text-orange-400">
              <Shield className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Operations Lead'}</p>
              <p className="text-[10px] text-orange-400 font-semibold tracking-wide uppercase truncate">
                Role: {currentRole}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto rounded-md bg-slate-800 flex items-center justify-center text-orange-400">
            <Shield className="w-4 h-4" />
          </div>
        )}
      </div>
    </aside>
  );
};
