import React, { useState, useEffect } from 'react';
import {
  Bell,
  Globe,
  LogOut,
  ExternalLink,
  Shield,
  Clock as ClockIcon,
  Radio,
  Menu,
  Search,
  Plus,
  Zap,
  Bus,
  UserCheck,
  Calendar,
  Wrench,
  FileCheck2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useI18n } from '../../context/I18nContext.js';
import { UserRole } from '../../types/index.js';
import { Button } from '../ui/Button.js';

interface TopBarProps {
  navigate: (path: string) => void;
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
  onOpenQuickAction?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  navigate,
  onOpenMobileSidebar,
  onOpenSearch,
  onOpenQuickAction,
}) => {
  const { user, signOut, switchUserRole } = useAuth();
  const { isArabic, toggleLanguage } = useI18n();
  const [dubaiTime, setDubaiTime] = useState<string>('');
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Dubai',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      });
      setDubaiTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const roles: UserRole[] = ['ADMIN', 'MANAGER', 'DISPATCHER', 'DRIVER', 'CLIENT'];
  const activeRole = user?.role || 'ADMIN';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left: Mobile Menu & Live Dubai Time Clock */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar Trigger */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-xs text-slate-500 font-medium transition-all group max-w-xs sm:w-64"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
          <span className="truncate hidden sm:inline">Search fleet, drivers, routes...</span>
          <span className="sm:hidden">Search...</span>
          <kbd className="hidden md:inline-flex ml-auto text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Live Dubai Time Clock */}
        <div className="hidden xl:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <ClockIcon className="w-3.5 h-3.5 text-orange-500" />
          <span className="font-mono">{dubaiTime || 'Dubai GST (UTC+4)'}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-1 border-l border-slate-300">
            GST (UTC+4)
          </span>
        </div>
      </div>

      {/* Right Controls: Quick Action, Role Selector, Notifications, Language, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Quick Action Button for Operator Roles */}
        {(activeRole === 'ADMIN' || activeRole === 'MANAGER' || activeRole === 'DISPATCHER') && (
          <div className="relative">
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsActionMenuOpen((prev) => !prev)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="hidden sm:inline-flex"
            >
              Action
            </Button>

            {isActionMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsActionMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-40 text-xs font-medium animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                    Quick Operational Actions
                  </div>
                  <button
                    onClick={() => {
                      setIsActionMenuOpen(false);
                      navigate('/app/trips');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <Radio className="w-3.5 h-3.5 text-orange-500" />
                    <span>Dispatch New Trip</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsActionMenuOpen(false);
                      navigate('/app/fleet');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Bus className="w-3.5 h-3.5 text-blue-500" />
                    <span>Add Fleet Vehicle</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsActionMenuOpen(false);
                      navigate('/app/drivers');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Add Driver Captain</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsActionMenuOpen(false);
                      navigate('/app/maintenance');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-500" />
                    <span>Schedule Maintenance</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Role Simulator Switcher */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs">
          <Shield className="w-3.5 h-3.5 text-slate-500 ml-1 hidden sm:inline" />
          <span className="text-[10px] font-bold uppercase text-slate-500 hidden sm:inline">Role:</span>
          <select
            value={user?.role || 'ADMIN'}
            onChange={(e) => switchUserRole(e.target.value as UserRole)}
            className="bg-transparent text-xs font-bold text-orange-600 focus:outline-none cursor-pointer pr-1"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Public Website Preview Link */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-orange-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
          title="Go to Public Website"
        >
          <span>Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Language Toggle */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          title="Toggle Arabic / English"
        >
          <Globe className="w-4 h-4 text-slate-600" />
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => navigate('/app/notifications')}
          className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="h-5 w-px bg-slate-200 mx-0.5 hidden sm:block" />

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={async () => {
            await signOut();
            navigate('/sign-in');
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          title="Sign out of TMS"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};
