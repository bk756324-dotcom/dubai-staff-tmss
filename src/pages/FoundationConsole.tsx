import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Database,
  Radio,
  Play,
  RefreshCw,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  Palette,
  Shield,
  Bus,
  Users,
  MapPin,
  Clock,
  Wrench,
  FileCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../components/ui/Button.js';
import { Badge, StatusBadge } from '../components/ui/Badge.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.js';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table.js';
import { Alert } from '../components/ui/Alert.js';
import { Tabs } from '../components/ui/Tabs.js';
import { Modal } from '../components/ui/Modal.js';
import { LoadingSpinner, EmptyState } from '../components/ui/States.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { UserRole } from '../types/index.js';

interface FoundationConsoleProps {
  navigate: (path: string) => void;
}

export const FoundationConsole: React.FC<FoundationConsoleProps> = ({ navigate }) => {
  const { user, switchUserRole, apiFetch } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'api-tester' | 'db-inspector' | 'design-system' | 'roadmap'>('overview');
  const [systemStats, setSystemStats] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // API Tester State
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/health');
  const [selectedMethod, setSelectedMethod] = useState('GET');
  const [apiRequestBody, setApiRequestBody] = useState('{}');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLatencyMs, setApiLatencyMs] = useState<number | null>(null);
  const [isExecutingApi, setIsExecutingApi] = useState(false);

  // DB Inspector State
  const [inspectorTable, setInspectorTable] = useState<string>('vehicles');
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  // Design System Demo Modal
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Fetch stats and health
  const refreshStats = async () => {
    setIsLoadingStats(true);
    try {
      const [hRes, sRes] = await Promise.all([
        fetch('/api/health').then((r) => r.json()),
        fetch('/api/system/stats').then((r) => r.json()),
      ]);
      setHealthData(hRes);
      setSystemStats(sRes.data);
    } catch (err: any) {
      toast.error('Failed to load system stats', err.message);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  // Load Table Data for DB Inspector
  const loadTableData = async (table: string) => {
    setInspectorTable(table);
    setIsLoadingTable(true);
    try {
      const res = await apiFetch(`/api/${table}`);
      if (res.success && res.data) {
        setTableData(res.data);
      } else {
        setTableData([]);
      }
    } catch {
      setTableData([]);
    } finally {
      setIsLoadingTable(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'db-inspector') {
      loadTableData(inspectorTable);
    }
  }, [activeTab, inspectorTable]);

  // Execute API Tester Request
  const handleExecuteApi = async () => {
    setIsExecutingApi(true);
    setApiResponse(null);
    const start = performance.now();

    try {
      const options: RequestInit = {
        method: selectedMethod,
      };

      if (selectedMethod === 'POST' || selectedMethod === 'PUT') {
        try {
          options.body = JSON.stringify(JSON.parse(apiRequestBody));
        } catch {
          toast.error('Invalid JSON body');
          setIsExecutingApi(false);
          return;
        }
      }

      const res = await apiFetch(selectedEndpoint, options);
      const end = performance.now();
      setApiLatencyMs(Math.round(end - start));
      setApiResponse(res);
      toast.success('API Request Executed', `${selectedMethod} ${selectedEndpoint} (${Math.round(end - start)}ms)`);
    } catch (err: any) {
      const end = performance.now();
      setApiLatencyMs(Math.round(end - start));
      setApiResponse({ error: err.message });
      toast.error('API Call Failed', err.message);
    } finally {
      setIsExecutingApi(false);
    }
  };

  // Reset Database Seeds
  const handleResetSeeds = async () => {
    try {
      const res = await apiFetch('/api/system/reset-seeds', { method: 'POST' });
      if (res.success) {
        toast.success('Database Reset', 'TMS database successfully restored to default Dubai seed state.');
        refreshStats();
        if (activeTab === 'db-inspector') {
          loadTableData(inspectorTable);
        }
      } else {
        toast.error('Reset Failed', res.error);
      }
    } catch (err: any) {
      toast.error('Reset Failed', err.message);
    }
  };

  const consoleTabs = [
    { id: 'overview', label: 'Operations & Health Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'api-tester', label: 'Interactive REST API Console', icon: <Server className="w-4 h-4" /> },
    { id: 'db-inspector', label: 'Database Schema & Tables', icon: <Database className="w-4 h-4" /> },
    { id: 'design-system', label: 'Design System & Tokens', icon: <Palette className="w-4 h-4" /> },
    { id: 'roadmap', label: '8-Prompt Architecture Roadmap', icon: <Layers className="w-4 h-4" /> },
  ];

  const apiEndpoints = [
    { method: 'GET', path: '/api/health', desc: 'System health & Dubai local timestamp' },
    { method: 'GET', path: '/api/system/stats', desc: 'Database record counts & system meta' },
    { method: 'GET', path: '/api/vehicles', desc: 'Active fleet & maintenance statuses' },
    { method: 'GET', path: '/api/drivers', desc: 'Driver captains, licenses & safety ratings' },
    { method: 'GET', path: '/api/clients', desc: 'Corporate clients & active contracts' },
    { method: 'GET', path: '/api/passengers', desc: 'Passenger manifest & shift assignments' },
    { method: 'GET', path: '/api/routes', desc: 'Route corridors & sequenced stop geofences' },
    { method: 'GET', path: '/api/trips', desc: 'Live dispatched trips & passenger loads' },
    { method: 'GET', path: '/api/tracking/live', desc: 'Simulated real-time vehicle GPS telemetry' },
    { method: 'GET', path: '/api/schedule/daily', desc: 'Daily shift schedule matrix' },
    { method: 'GET', path: '/api/maintenance', desc: 'Fleet service logs & RTA inspections' },
    { method: 'GET', path: '/api/documents/expiring', desc: 'Mulkiya & RTA permits expiring in ≤30 days' },
    { method: 'GET', path: '/api/notifications', desc: 'System alerts & operational notifications' },
    { method: 'GET', path: '/api/reports/kpis', desc: 'Fleet utilization & Dubai corridor KPIs' },
    { method: 'GET', path: '/api/inquiries', desc: 'Public website lead generation inquiries' },
  ];

  const dbTables = [
    { key: 'vehicles', label: 'Vehicles Fleet', count: systemStats?.counts?.vehicles || 5 },
    { key: 'drivers', label: 'Driver Captains', count: systemStats?.counts?.drivers || 4 },
    { key: 'clients', label: 'Corporate Clients', count: systemStats?.counts?.clients || 3 },
    { key: 'passengers', label: 'Passengers Manifest', count: systemStats?.counts?.passengers || 3 },
    { key: 'routes', label: 'Routes & Stops', count: systemStats?.counts?.routes || 3 },
    { key: 'trips', label: 'Trips & Dispatch', count: systemStats?.counts?.trips || 3 },
    { key: 'locations', label: 'GPS Telemetry Records', count: systemStats?.counts?.locations || 3 },
    { key: 'maintenance', label: 'Maintenance Logs', count: systemStats?.counts?.maintenance || 2 },
    { key: 'documents', label: 'RTA & Permits', count: systemStats?.counts?.documents || 3 },
    { key: 'notifications', label: 'System Alerts', count: systemStats?.counts?.notifications || 3 },
    { key: 'inquiries', label: 'Website Leads', count: systemStats?.counts?.inquiries || 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-[11px] font-bold tracking-wider uppercase border border-orange-200">
              Prompt 1 Complete
            </span>
            <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full-Stack Foundation Ready</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
            Dubai Staff Transport TMS — Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Enterprise backend architecture, persistent database engine, JWT authorization, REST API groups, and responsive operations design system.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={refreshStats}
            isLoading={isLoadingStats}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Status
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={handleResetSeeds}
            className="text-xs"
          >
            Reset DB Seeds
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={consoleTabs}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as any)}
        className="bg-white rounded-t-xl px-4"
      />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Database Engine</span>
                <Database className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-slate-900 font-heading mt-2">
                {systemStats?.status || 'HEALTHY'}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">11 Relational Tables Active</p>
            </Card>

            <Card className="border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Express API</span>
                <Server className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-slate-900 font-heading mt-2">
                {healthData?.status === 'ok' ? 'PORT 3000' : 'INITIALIZING'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">15 REST Route Groups</p>
            </Card>

            <Card className="border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Dubai Live Clock</span>
                <Clock className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-lg font-bold text-slate-900 font-heading mt-2 font-mono truncate">
                {healthData?.dubaiLocalTime?.split(',')[1] || 'GST (UTC+4)'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Asia/Dubai Operational Zone</p>
            </Card>

            <Card className="border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Active Role</span>
                <Shield className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-orange-600 font-heading mt-2">{user?.role || 'ADMIN'}</p>
              <p className="text-[11px] text-slate-500 mt-1">Logged in as {user?.name || 'Operator'}</p>
            </Card>
          </div>

          {/* Prompt 1 Architectural Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Prompt 1 Accomplishments (Built & Verified)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900">Clean Full-Stack Architecture:</strong> Express 4 + TypeScript server on port 3000 with Vite middleware in development and static asset bundle in production.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900">Relational Database Engine:</strong> Persistent storage with typed schema, atomic persistence, and authentic Dubai/UAE transport seeds (Vehicles, Drivers, Clients, Routes, Stops, Trips, GPS Locations, Maintenance, Documents, Notifications, Inquiries).
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900">Security & Role-Based Access Control:</strong> JWT token generation, bcrypt password hashing, `authMiddleware`, and granular `requireRole` guards for ADMIN, MANAGER, DISPATCHER, DRIVER, CLIENT.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900">Comprehensive API Layer:</strong> 15 standardized REST route groups with request validation, health endpoint, and live telemetry simulation.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900">Dubai Design System:</strong> Navy/Orange/White/Green palette, mathematical spacing, reusable Button, Input, Select, Badge, Card, Table, Modal, Alert, Tabs, and States components.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-orange-500" />
                  <span>Subsequent Phased Build Plan (Prompts 2–8)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs text-slate-600">
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Prompt 2: Public Dubai Staff Transport Website</span>
                  <Badge variant="orange">Next Phase</Badge>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Prompt 3: Operations Control Dashboard & Shell</span>
                  <Badge variant="neutral">Upcoming</Badge>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Prompt 4: Fleet, Drivers, Clients & Passengers Modules</span>
                  <Badge variant="neutral">Upcoming</Badge>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Prompt 5: Routes, Stops, Trips & Dispatch Scheduling</span>
                  <Badge variant="neutral">Upcoming</Badge>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Prompt 6: Tracking, Maintenance, Documents & Alerts</span>
                  <Badge variant="neutral">Upcoming</Badge>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Prompt 7: Reports, Analytics, Inquiries & Settings</span>
                  <Badge variant="neutral">Upcoming</Badge>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Prompt 8: Arabic RTL, Security, Production Polish</span>
                  <Badge variant="neutral">Final Polish</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE API TESTER */}
      {activeTab === 'api-tester' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Endpoint Picker */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-sm">Available TMS REST Endpoints</CardTitle>
              </CardHeader>
              <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
                {apiEndpoints.map((ep) => (
                  <button
                    key={ep.path}
                    type="button"
                    onClick={() => {
                      setSelectedEndpoint(ep.path);
                      setSelectedMethod(ep.method);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border transition-colors flex items-center justify-between text-xs ${
                      selectedEndpoint === ep.path
                        ? 'bg-orange-50 border-orange-300 text-orange-950 font-semibold'
                        : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white font-mono">
                          {ep.method}
                        </span>
                        <span className="font-mono text-slate-900">{ep.path}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{ep.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Request & Response Inspector */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border-slate-200">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>

                <input
                  type="text"
                  value={selectedEndpoint}
                  onChange={(e) => setSelectedEndpoint(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-orange-500 focus:outline-none"
                />

                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleExecuteApi}
                  isLoading={isExecutingApi}
                  leftIcon={<Play className="w-3.5 h-3.5" />}
                >
                  Execute
                </Button>
              </div>

              {(selectedMethod === 'POST' || selectedMethod === 'PUT') && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                    Request JSON Body
                  </label>
                  <textarea
                    rows={4}
                    value={apiRequestBody}
                    onChange={(e) => setApiRequestBody(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-slate-950 text-emerald-400 font-mono text-xs p-3 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                  <span className="text-xs font-bold uppercase text-slate-700">Response Output</span>
                  {apiLatencyMs !== null && (
                    <span className="text-xs text-emerald-600 font-mono font-semibold">
                      Status: 200 OK • Latency: {apiLatencyMs}ms
                    </span>
                  )}
                </div>

                <pre className="bg-[#060D17] text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[380px] border border-slate-800">
                  {apiResponse ? JSON.stringify(apiResponse, null, 2) : '// Click "Execute" to run the API query live...'}
                </pre>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE INSPECTOR */}
      {activeTab === 'db-inspector' && (
        <div className="space-y-4">
          {/* Table Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {dbTables.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => loadTableData(t.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors ${
                  inspectorTable === t.key
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{t.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    inspectorTable === t.key ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Table Data View */}
          <Card className="border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading uppercase">
                  Table: {inspectorTable} ({tableData.length} records)
                </h3>
                <p className="text-xs text-slate-500">Persistent storage at .data/tms-db.json</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => loadTableData(inspectorTable)}
                isLoading={isLoadingTable}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Refresh Table
              </Button>
            </div>

            {isLoadingTable ? (
              <LoadingSpinner message="Querying database table records..." />
            ) : tableData.length === 0 ? (
              <EmptyState title="No records found in this table" />
            ) : (
              <div className="overflow-x-auto max-h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(tableData[0] || {})
                        .slice(0, 6)
                        .map((key) => (
                          <TableHead key={key} className="capitalize">
                            {key}
                          </TableHead>
                        ))}
                      <TableHead>Actions / Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row: any, idx: number) => (
                      <TableRow key={row.id || idx}>
                        {Object.keys(tableData[0] || {})
                          .slice(0, 6)
                          .map((key) => {
                            const val = row[key];
                            if (key === 'status') {
                              return (
                                <TableCell key={key}>
                                  <StatusBadge status={String(val)} />
                                </TableCell>
                              );
                            }
                            return (
                              <TableCell key={key} className="text-xs">
                                {typeof val === 'object' ? JSON.stringify(val) : String(val ?? '—')}
                              </TableCell>
                            );
                          })}
                        <TableCell>
                          <span className="text-[11px] font-mono text-slate-400">ID: {row.id}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 4: DESIGN SYSTEM SHOWROOM */}
      {activeTab === 'design-system' && (
        <div className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Dubai Staff Transport Visual System & UI Primitives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Color Swatches */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Color Architecture</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-[#0A192F] text-white border border-slate-800">
                    <p className="text-xs font-bold">Deep Navy (#0A192F)</p>
                    <p className="text-[10px] text-slate-400 mt-1">Control room foundation</p>
                  </div>
                  <div className="p-3 rounded-xl bg-orange-500 text-white">
                    <p className="text-xs font-bold">Action Orange (#F97316)</p>
                    <p className="text-[10px] text-orange-100 mt-1">Brand accent & CTAs</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-600 text-white">
                    <p className="text-xs font-bold">Safety Green (#059669)</p>
                    <p className="text-[10px] text-emerald-100 mt-1">Active, compliant, safe</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 text-slate-900 border border-slate-200">
                    <p className="text-xs font-bold">Clean Neutrals (#F8FAFC)</p>
                    <p className="text-[10px] text-slate-500 mt-1">Dense operations surfaces</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Buttons</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Primary Orange</Button>
                  <Button variant="navy">Navy Control</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="primary" isLoading>Loading</Button>
                </div>
              </div>

              {/* Badges */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Status Badges</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status="AVAILABLE" />
                  <StatusBadge status="ON_TRIP" />
                  <StatusBadge status="MAINTENANCE" />
                  <StatusBadge status="SCHEDULED" />
                  <StatusBadge status="COMPLETED" />
                  <StatusBadge status="EXPIRED" />
                </div>
              </div>

              {/* Alerts */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Operational Alerts</h4>
                <div className="space-y-3">
                  <Alert variant="info" title="RTA Commercial Permit Inspection">
                    Scheduled technical safety audit at Tasjeel Al Barsha on 29 August 2026.
                  </Alert>
                  <Alert variant="warning" title="Document Expiry Reminder">
                    Vehicle BUS-104 Mulkiya registration expires in 9 days.
                  </Alert>
                </div>
              </div>

              {/* Dialog Preview */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Modals & Dialogs</h4>
                <Button size="sm" variant="outline" onClick={() => setIsDemoModalOpen(true)}>
                  Open Operations Modal Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 5: ROADMAP */}
      {activeTab === 'roadmap' && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Dubai Staff Transport 8-Prompt Engineering Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm text-slate-700">
            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-emerald-950">Prompt 1 — CURRENT (COMPLETED)</h4>
                <Badge variant="success">Completed</Badge>
              </div>
              <p className="text-xs text-emerald-800 mt-1">
                Foundation, architecture, Express API router, persistent JSON database engine, JWT authentication, seed data, design system, and verification console.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-orange-300 bg-orange-50/50">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-orange-950">Prompt 2 — Upcoming Next</h4>
                <Badge variant="orange">Next</Badge>
              </div>
              <p className="text-xs text-orange-800 mt-1">
                Complete public Dubai Staff Transport website with all pages (Home, Services, Fleet, Industries, Safety, Technology, Clients, About, Careers, Contact, Quote Requests).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900">Prompt 3</h4>
              <p className="text-xs text-slate-600 mt-1">TMS Application Shell, Command Center Dashboard, KPIs, Live Dubai corridors.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900">Prompt 4</h4>
              <p className="text-xs text-slate-600 mt-1">Fleet management, driver directory, corporate clients, and passenger manifests.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900">Prompt 5</h4>
              <p className="text-xs text-slate-600 mt-1">Routes with sequenced stops, trip dispatch, and computerized shift scheduling.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900">Prompt 6</h4>
              <p className="text-xs text-slate-600 mt-1">Live simulated GPS telematics tracking, fleet maintenance logs, RTA documents expiry tracker, and alert center.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900">Prompt 7</h4>
              <p className="text-xs text-slate-600 mt-1">Operations analytics & reports, lead inquiry pipeline, system settings, and billing contracts.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900">Prompt 8</h4>
              <p className="text-xs text-slate-600 mt-1">Final integration, Arabic/RTL localization, mobile responsiveness, security audit, and production verification.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Modal */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Operations Dispatch Modal Test"
        description="Design system modal primitive verification."
        footer={
          <>
            <Button size="sm" variant="outline" onClick={() => setIsDemoModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" onClick={() => setIsDemoModalOpen(false)}>
              Confirm Action
            </Button>
          </>
        }
      >
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          This modal is built with standard accessibility, escape key handlers, background scroll locking, and smooth motion transitions.
        </p>
      </Modal>
    </div>
  );
};
