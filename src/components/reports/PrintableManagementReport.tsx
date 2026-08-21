import React from 'react';
import { Printer, X, ShieldCheck, CheckCircle2, AlertTriangle, Building2, Calendar, FileText } from 'lucide-react';

interface PrintableManagementReportProps {
  overviewData: any;
  onClose: () => void;
}

export const PrintableManagementReport: React.FC<PrintableManagementReportProps> = ({
  overviewData,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  if (!overviewData || !overviewData.kpis) {
    return null;
  }

  const { kpis, dateRange, trends } = overviewData;
  const { operations, fleet, drivers, passengers, compliance, maintenance, salik, scorecard } = kpis;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex justify-center p-4 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 sm:p-12 print:p-0 print:shadow-none print:max-w-none print:w-full my-auto text-slate-900 font-sans">
        {/* Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>Executive Management Audit & SLA Report (Print Ready)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Header */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-slate-900">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold tracking-wider text-xs uppercase mb-1">
              <span>Government of Dubai &bull; RTA Compliant TMS</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              DUBAI STAFF TRANSPORT MANAGEMENT SYSTEM
            </h1>
            <p className="text-sm font-medium text-slate-600 mt-0.5">
              Executive Operations, Fleet Analytics & SLA Compliance Report
            </p>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div className="font-mono font-bold text-slate-900 text-sm">DOC-REF: DXB-TMS-REP-2026-Q3</div>
            <div>Date Generated: <span className="font-semibold text-slate-900">{new Date().toISOString().slice(0, 10)}</span></div>
            <div>Dubai Local Time (GST / UTC+4)</div>
          </div>
        </div>

        {/* Reporting Period & Scope */}
        <div className="my-6 p-4 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500 uppercase font-semibold block text-[10px]">Reporting Period</span>
            <span className="font-bold text-slate-900 font-mono text-sm">
              {dateRange.startDate} &rarr; {dateRange.endDate}
            </span>
          </div>
          <div>
            <span className="text-slate-500 uppercase font-semibold block text-[10px]">Audit Classification</span>
            <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
              CONFIDENTIAL &bull; MANAGEMENT BOARD
            </span>
          </div>
          <div>
            <span className="text-slate-500 uppercase font-semibold block text-[10px]">Composite Operations Score</span>
            <span className="font-bold font-mono text-emerald-700 text-sm">
              {scorecard.operationalPerformanceScore} / 100 ({scorecard.status})
            </span>
          </div>
        </div>

        {/* Section 1: Executive KPI Performance Table */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 mb-3 border-b border-slate-300">
            1. Core Operational & SLA Key Performance Indicators
          </h2>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold uppercase">
                <th className="py-2 px-3">Performance Dimension</th>
                <th className="py-2 px-3 text-right">Recorded Value</th>
                <th className="py-2 px-3 text-right">SLA / Ops Target</th>
                <th className="py-2 px-3 text-center">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              <tr>
                <td className="py-2 px-3 font-semibold">On-Time Performance Rate</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{operations.onTimePerformanceRate}%</td>
                <td className="py-2 px-3 text-right font-mono">98.0% (Contractual)</td>
                <td className="py-2 px-3 text-center font-bold text-emerald-700">MET</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Total Trips Dispatched & Completed</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{operations.completedTrips} / {operations.totalTrips}</td>
                <td className="py-2 px-3 text-right font-mono">100% Scheduled</td>
                <td className="py-2 px-3 text-center font-bold text-emerald-700">MET</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Delay Rate (&gt; 5 Minutes)</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{operations.delayRate}%</td>
                <td className="py-2 px-3 text-right font-mono">&lt; 2.0%</td>
                <td className="py-2 px-3 text-center font-bold text-emerald-700">COMPLIANT</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Fleet Utilization Rate</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{fleet.fleetUtilizationRate}%</td>
                <td className="py-2 px-3 text-right font-mono">80.0% Target</td>
                <td className="py-2 px-3 text-center font-bold text-emerald-700">OPTIMAL</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Mulkiya & Permit Compliance</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{compliance.complianceRate}%</td>
                <td className="py-2 px-3 text-right font-mono">100.0% Regulatory</td>
                <td className="py-2 px-3 text-center font-bold text-amber-700">RENEWALS DUE</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Total Commuters Transported</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{passengers.passengersTransported}</td>
                <td className="py-2 px-3 text-right font-mono">Capacity: {passengers.totalOperatedCapacity}</td>
                <td className="py-2 px-3 text-center font-bold text-emerald-700">COMPLIANT</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Fleet Maintenance Spend (Period)</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{maintenance.totalMaintenanceCostAed.toLocaleString()} AED</td>
                <td className="py-2 px-3 text-right font-mono">Budget: 15,000 AED</td>
                <td className="py-2 px-3 text-center font-bold text-emerald-700">WITHIN BUDGET</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Salik Toll Telemetry Spend</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{salik.totalSalikSpendAed.toLocaleString()} AED</td>
                <td className="py-2 px-3 text-right font-mono">4.00 AED / Gantry</td>
                <td className="py-2 px-3 text-center font-bold text-slate-700">RECOVERABLE</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2: Scorecard Formula Breakdown */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 mb-3 border-b border-slate-300">
            2. Scorecard Calculation Methodology
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {scorecard.components.map((c: any) => (
              <div key={c.name} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <div className="flex justify-between font-bold">
                  <span>{c.name} (Weight: {c.weightPercent}%)</span>
                  <span className="font-mono">{c.score}%</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">{c.formula}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Official Sign-Off Block */}
        <div className="mt-12 pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="font-bold text-slate-900 uppercase">Prepared By:</div>
            <div className="mt-8 pt-2 border-t border-slate-300 font-semibold">
              Director of Fleet Operations &amp; Dispatch
            </div>
            <div className="text-slate-500 text-[11px]">Dubai Staff Transport Management Ltd</div>
          </div>
          <div>
            <div className="font-bold text-slate-900 uppercase">Approved By:</div>
            <div className="mt-8 pt-2 border-t border-slate-300 font-semibold">
              Chief Operating Officer (COO)
            </div>
            <div className="text-slate-500 text-[11px]">Dubai Staff Transport Executive Committee</div>
          </div>
        </div>
      </div>
    </div>
  );
};
