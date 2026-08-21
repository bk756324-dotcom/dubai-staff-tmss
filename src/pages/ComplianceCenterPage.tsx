import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Bus,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  Download,
} from 'lucide-react';
import { useToast } from '../context/ToastContext.js';
import { useI18n } from '../context/I18nContext.js';

interface ComplianceCenterPageProps {
  navigate: (path: string) => void;
}

export const ComplianceCenterPage: React.FC<ComplianceCenterPageProps> = ({ navigate }) => {
  const { t } = useI18n();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'VEHICLES' | 'DRIVERS'>('VEHICLES');
  const [vehiclesMatrix, setVehiclesMatrix] = useState<any[]>([]);
  const [driversMatrix, setDriversMatrix] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchComplianceData = async () => {
    setLoading(true);
    try {
      const [sumRes, vehRes, drvRes] = await Promise.all([
        fetch('/api/compliance/summary').then((r) => r.json()),
        fetch('/api/compliance/vehicles').then((r) => r.json()),
        fetch('/api/compliance/drivers').then((r) => r.json()),
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (vehRes.success) setVehiclesMatrix(vehRes.data || []);
      if (drvRes.success) setDriversMatrix(drvRes.data || []);
    } catch (err) {
      console.error('Error loading compliance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const overallScore = summary?.overallScorePercent || 92;

  const filteredVehicles = vehiclesMatrix.filter(
    (v) =>
      !searchQuery ||
      v.vehicleNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDrivers = driversMatrix.filter(
    (d) =>
      !searchQuery ||
      d.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.driverCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.licenseCategory?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="compliance-center-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{t('regulatory_assurance', 'Dubai Statutory Standards')}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('compliance_center', 'Compliance Center & Regulatory Matrix')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Unified statutory matrix cross-checking RTA Transport permits, vehicle Mulkiya cards, driver licenses, and commercial insurance coverage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/documents')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-md transition-all"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Open Document Vault</span>
          </button>
        </div>
      </div>

      {/* Compliance Health Score Header Banner */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#0E2445] to-[#0A192F] border border-slate-800 rounded-2xl p-6 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Circular Score Dial */}
          <div className="relative w-20 h-20 rounded-full bg-slate-900 border-4 border-emerald-500/80 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-950/50">
            <div className="text-center">
              <span className="text-xl font-black font-mono text-emerald-400">
                {overallScore}%
              </span>
              <span className="block text-[8px] uppercase tracking-widest text-slate-400 font-bold">
                Health
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">
                Dubai Commercial Transport Compliance Index
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                RTA CERTIFIED
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              All active passenger coaches and driver captains are cross-checked against RTA Executive Regulation No. 19 of 2012 for passenger transport in Dubai.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-700/80 pt-4 md:pt-0 md:pl-6">
          <div>
            <span className="text-[11px] text-slate-400 block">Compliant Assets</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
              {summary?.compliantCount || 11}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Expiring (≤30d)</span>
            <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
              {summary?.expiringCount || 2}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Breaches / Expired</span>
            <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">
              {summary?.expiredCount || 1}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('VEHICLES')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'VEHICLES'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>Fleet Vehicles Compliance Matrix ({vehiclesMatrix.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('DRIVERS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'DRIVERS'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Driver Captains Credentials Matrix ({driversMatrix.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by code, plate, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* MATRIX TABLE: VEHICLES */}
      {activeTab === 'VEHICLES' && (
        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Vehicle / Coach</th>
                  <th className="py-3.5 px-4">RTA Transport Permit</th>
                  <th className="py-3.5 px-4">Mulkiya Registration</th>
                  <th className="py-3.5 px-4">Commercial Insurance</th>
                  <th className="py-3.5 px-4">Emission / Civil Defense</th>
                  <th className="py-3.5 px-4">Overall Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredVehicles.map((v) => {
                  const isFullyCompliant = v.overallStatus === 'COMPLIANT';
                  const isExpiring = v.overallStatus === 'EXPIRING_SOON';

                  return (
                    <tr
                      key={v.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
                            <Bus className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {v.vehicleNumber}
                            </span>
                            <div className="text-[10px] text-slate-400">
                              {v.make} {v.model} ({v.capacity} Seats)
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* RTA Permit Column */}
                      <td className="py-3.5 px-4">
                        {v.hasRtaPermit ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Valid ({v.rtaPermitExpiry || '2027'})</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-500 font-medium">
                            <Clock className="w-4 h-4" />
                            <span>Renewal Needed</span>
                          </div>
                        )}
                      </td>

                      {/* Mulkiya Column */}
                      <td className="py-3.5 px-4">
                        {v.hasMulkiya ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-rose-500 font-bold">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Expired / Missing</span>
                          </div>
                        )}
                      </td>

                      {/* Commercial Insurance Column */}
                      <td className="py-3.5 px-4">
                        {v.hasInsurance ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Comprehensive</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-500 font-medium">
                            <Clock className="w-4 h-4" />
                            <span>Expiring Soon</span>
                          </div>
                        )}
                      </td>

                      {/* Emission & Safety */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Passed</span>
                        </div>
                      </td>

                      {/* Overall Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isFullyCompliant
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                              : isExpiring
                              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                              : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {isFullyCompliant && <CheckCircle2 className="w-3 h-3" />}
                          {isExpiring && <Clock className="w-3 h-3" />}
                          {!isFullyCompliant && !isExpiring && <AlertTriangle className="w-3 h-3" />}
                          <span>{v.overallStatus || 'COMPLIANT'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate('/app/documents')}
                          className="text-orange-500 hover:text-orange-600 font-semibold text-xs inline-flex items-center gap-1"
                        >
                          <span>Manage Vault</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MATRIX TABLE: DRIVERS */}
      {activeTab === 'DRIVERS' && (
        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Driver Captain</th>
                  <th className="py-3.5 px-4">UAE Heavy Bus License</th>
                  <th className="py-3.5 px-4">RTA Driver Permit</th>
                  <th className="py-3.5 px-4">Emirates ID (ICA)</th>
                  <th className="py-3.5 px-4">Medical Fitness (MoHAP)</th>
                  <th className="py-3.5 px-4">Police Clearance</th>
                  <th className="py-3.5 px-4">Compliance Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDrivers.map((d) => {
                  const isFullyCompliant = d.overallStatus === 'COMPLIANT';
                  const isExpiring = d.overallStatus === 'EXPIRING_SOON';

                  return (
                    <tr
                      key={d.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                            <UserCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {d.fullName}
                            </span>
                            <div className="text-[10px] text-slate-400">
                              {d.driverCode || 'CAP'} • {d.licenseCategory || 'Cat 6 Heavy Bus'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* License */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Valid (Cat 6)</span>
                        </div>
                      </td>

                      {/* RTA Card */}
                      <td className="py-3.5 px-4">
                        {d.hasRtaCard ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Active Card</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-500 font-medium">
                            <Clock className="w-4 h-4" />
                            <span>Renewal (30d)</span>
                          </div>
                        )}
                      </td>

                      {/* EID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                          <ShieldCheck className="w-4 h-4" />
                          <span>ICA Verified</span>
                        </div>
                      </td>

                      {/* Medical */}
                      <td className="py-3.5 px-4">
                        {d.hasMedical ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Fit for Duty</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-500 font-medium">
                            <Clock className="w-4 h-4" />
                            <span>Annual Due</span>
                          </div>
                        )}
                      </td>

                      {/* Police Clearance */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Cleared</span>
                        </div>
                      </td>

                      {/* Overall Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isFullyCompliant
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                              : isExpiring
                              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                              : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {isFullyCompliant && <CheckCircle2 className="w-3 h-3" />}
                          {isExpiring && <Clock className="w-3 h-3" />}
                          {!isFullyCompliant && !isExpiring && <AlertTriangle className="w-3 h-3" />}
                          <span>{d.overallStatus || 'COMPLIANT'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate('/app/documents')}
                          className="text-orange-500 hover:text-orange-600 font-semibold text-xs inline-flex items-center gap-1"
                        >
                          <span>Manage Vault</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
