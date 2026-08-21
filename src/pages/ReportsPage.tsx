import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Bus,
  Users,
  Route as RouteIcon,
  ShieldCheck,
  Wrench,
  DollarSign,
  Printer,
  Calendar,
  Building2,
  RefreshCw,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { DateRangeFilter } from '../components/reports/DateRangeFilter.js';
import { ExecutiveOverviewTab } from '../components/reports/ExecutiveOverviewTab.js';
import { FleetAnalyticsTab } from '../components/reports/FleetAnalyticsTab.js';
import { DriverAnalyticsTab } from '../components/reports/DriverAnalyticsTab.js';
import { RouteAnalyticsTab } from '../components/reports/RouteAnalyticsTab.js';
import { PassengerAnalyticsTab } from '../components/reports/PassengerAnalyticsTab.js';
import { ClientSlaTab } from '../components/reports/ClientSlaTab.js';
import { MaintenanceAnalyticsTab } from '../components/reports/MaintenanceAnalyticsTab.js';
import { ComplianceReportTab } from '../components/reports/ComplianceReportTab.js';
import { SalikAnalyticsTab } from '../components/reports/SalikAnalyticsTab.js';
import { PrintableManagementReport } from '../components/reports/PrintableManagementReport.js';
import { DateRangeFilter as IDateRangeFilter, User } from '../types/index.js';

interface ReportsPageProps {
  currentUser?: User | null;
  onNavigate: (path: string) => void;
}

type TabType =
  | 'OVERVIEW'
  | 'FLEET'
  | 'DRIVERS'
  | 'ROUTES'
  | 'PASSENGERS'
  | 'CLIENTS'
  | 'MAINTENANCE'
  | 'COMPLIANCE'
  | 'SALIK';

export const ReportsPage: React.FC<ReportsPageProps> = ({ currentUser, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW');
  const [dateFilter, setDateFilter] = useState<IDateRangeFilter>({
    preset: 'LAST_30_DAYS',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Loaded tab datasets
  const [overviewData, setOverviewData] = useState<any>(null);
  const [fleetData, setFleetData] = useState<any>(null);
  const [driverData, setDriverData] = useState<any>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [passengerData, setPassengerData] = useState<any>(null);
  const [clientData, setClientData] = useState<any>(null);
  const [maintenanceData, setMaintenanceData] = useState<any>(null);
  const [complianceData, setComplianceData] = useState<any>(null);
  const [salikData, setSalikData] = useState<any>(null);

  const fetchReportsData = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (dateFilter.preset) queryParams.append('preset', dateFilter.preset);
      if (dateFilter.startDate) queryParams.append('startDate', dateFilter.startDate);
      if (dateFilter.endDate) queryParams.append('endDate', dateFilter.endDate);

      const qs = queryParams.toString() ? `?${queryParams.toString()}` : '';

      // Parallel fetch of reporting sub-endpoints
      const [
        resOverview,
        resFleet,
        resDrivers,
        resRoutes,
        resPassengers,
        resClients,
        resMnt,
        resCompliance,
        resSalik,
      ] = await Promise.all([
        fetch(`/api/reports/overview${qs}`).then((r) => r.json()),
        fetch(`/api/reports/fleet${qs}`).then((r) => r.json()),
        fetch(`/api/reports/drivers${qs}`).then((r) => r.json()),
        fetch(`/api/reports/routes${qs}`).then((r) => r.json()),
        fetch(`/api/reports/passengers${qs}`).then((r) => r.json()),
        fetch(`/api/reports/clients${qs}`).then((r) => r.json()),
        fetch(`/api/reports/maintenance${qs}`).then((r) => r.json()),
        fetch(`/api/reports/compliance${qs}`).then((r) => r.json()),
        fetch(`/api/reports/salik${qs}`).then((r) => r.json()),
      ]);

      if (resOverview.success) setOverviewData(resOverview.data);
      if (resFleet.success) setFleetData(resFleet.data);
      if (resDrivers.success) setDriverData(resDrivers.data);
      if (resRoutes.success) setRouteData(resRoutes.data);
      if (resPassengers.success) setPassengerData(resPassengers.data);
      if (resClients.success) setClientData(resClients.data);
      if (resMnt.success) setMaintenanceData(resMnt.data);
      if (resCompliance.success) setComplianceData(resCompliance.data);
      if (resSalik.success) setSalikData(resSalik.data);
    } catch (err) {
      console.error('Failed to load reports and analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, [dateFilter]);

  const isClientRole = currentUser?.role === 'CLIENT';

  const tabs: { id: TabType; labelEn: string; labelAr: string; icon: React.ComponentType<{ className?: string }>; clientAllowed: boolean }[] = [
    { id: 'OVERVIEW', labelEn: 'Executive Overview', labelAr: 'النظرة العامة التنفيذية', icon: BarChart3, clientAllowed: true },
    { id: 'FLEET', labelEn: 'Fleet Performance', labelAr: 'أداء الأسطول', icon: Bus, clientAllowed: false },
    { id: 'DRIVERS', labelEn: 'Driver & Captains', labelAr: 'السائقين والكباتن', icon: Users, clientAllowed: false },
    { id: 'ROUTES', labelEn: 'Routes & Corridors', labelAr: 'المسارات والمحاور', icon: RouteIcon, clientAllowed: true },
    { id: 'PASSENGERS', labelEn: 'Passengers & Flow', labelAr: 'الركاب والتدفق', icon: Users, clientAllowed: true },
    { id: 'CLIENTS', labelEn: 'Corporate SLA Control', labelAr: 'مراقبة مستوى الخدمة SLA', icon: Building2, clientAllowed: true },
    { id: 'MAINTENANCE', labelEn: 'Maintenance & Garage', labelAr: 'الصيانة والورشة', icon: Wrench, clientAllowed: false },
    { id: 'COMPLIANCE', labelEn: 'Regulatory & Permits', labelAr: 'الامتثال والتصاريح', icon: ShieldCheck, clientAllowed: false },
    { id: 'SALIK', labelEn: 'Salik & Tolls', labelAr: 'سالك والتعرفة', icon: DollarSign, clientAllowed: true },
  ];

  const visibleTabs = tabs.filter((t) => !isClientRole || t.clientAllowed);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Management Intelligence &amp; SLA Control Layer</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Reports &amp; Operational Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real database analytics, verified on-time dispatch rates, and Dubai regulatory compliance records.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Global Date Range Filter */}
          <DateRangeFilter
            currentFilter={dateFilter}
            onChange={(newFilter) => setDateFilter(newFilter)}
            isLoading={isLoading}
          />

          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchReportsData}
            disabled={isLoading}
            title="Refresh analytics from database"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          {/* Print Management Report Trigger */}
          <button
            type="button"
            onClick={() => setShowPrintModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Management Report</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              id={`tab-btn-${tab.id.toLowerCase()}`}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Loading verified database analytics...</p>
          <p className="text-xs text-slate-500 mt-1">Aggregating trips, Mulkiya records, and Salik transactions</p>
        </div>
      )}

      {/* Tab Content Views */}
      {!isLoading && (
        <>
          {activeTab === 'OVERVIEW' && (
            <ExecutiveOverviewTab data={overviewData} onNavigate={onNavigate} />
          )}

          {activeTab === 'FLEET' && <FleetAnalyticsTab data={fleetData} />}

          {activeTab === 'DRIVERS' && <DriverAnalyticsTab data={driverData} />}

          {activeTab === 'ROUTES' && <RouteAnalyticsTab data={routeData} />}

          {activeTab === 'PASSENGERS' && <PassengerAnalyticsTab data={passengerData} />}

          {activeTab === 'CLIENTS' && <ClientSlaTab data={clientData} />}

          {activeTab === 'MAINTENANCE' && <MaintenanceAnalyticsTab data={maintenanceData} />}

          {activeTab === 'COMPLIANCE' && <ComplianceReportTab data={complianceData} />}

          {activeTab === 'SALIK' && <SalikAnalyticsTab data={salikData} />}
        </>
      )}

      {/* Printable Management Report Modal */}
      {showPrintModal && overviewData && (
        <PrintableManagementReport
          overviewData={overviewData}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};
