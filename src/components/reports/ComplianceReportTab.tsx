import React, { useState, useMemo } from 'react';
import { ShieldCheck, Search, Download, ArrowUpDown, AlertTriangle, XCircle, CheckCircle, FileText } from 'lucide-react';
import { exportToCsv } from '../../utils/exportCsv.js';

interface ComplianceReportTabProps {
  data: any;
}

export const ComplianceReportTab: React.FC<ComplianceReportTabProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [entityFilter, setEntityFilter] = useState('ALL');

  const summary = data?.summary || {};
  const documents = data?.documents || [];

  const filteredDocs = useMemo(() => {
    return documents.filter((d: any) => {
      const matchSearch =
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.relatedEntityName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchEntity = entityFilter === 'ALL' || d.entityType === entityFilter;

      let matchStatus = true;
      if (statusFilter === 'EXPIRED') matchStatus = d.daysRemaining < 0;
      else if (statusFilter === 'EXPIRING') matchStatus = d.daysRemaining >= 0 && d.daysRemaining <= 30;
      else if (statusFilter === 'VALID') matchStatus = d.daysRemaining > 30;

      return matchSearch && matchEntity && matchStatus;
    });
  }, [documents, searchTerm, statusFilter, entityFilter]);

  const handleExportCsv = () => {
    exportToCsv('Dubai_TMS_Compliance_Audit_Report', filteredDocs, [
      { key: 'documentType', header: 'Document Type' },
      { key: 'title', header: 'Description / Title' },
      { key: 'documentNumber', header: 'Permit / Document Number' },
      { key: 'entityType', header: 'Entity Category' },
      { key: 'relatedEntityName', header: 'Assigned Entity' },
      { key: 'expiryDate', header: 'Expiry Date' },
      { key: 'daysRemaining', header: 'Days Remaining' },
      { key: 'issuingAuthority', header: 'Issuing Regulatory Authority' },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Tracked Documents</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {summary.totalTrackedDocuments || 0} Records
          </div>
          <div className="text-xs text-slate-500 mt-1">Mulkiya, RTA Permits, Licenses</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Valid & Compliant</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {summary.valid || 0} Active
          </div>
          <div className="text-xs text-emerald-600 mt-1">{summary.overallCompliancePercent || 0}% Compliance Rate</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Expiring Soon (&le;30 Days)</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {summary.expiringSoon || 0} Permits
          </div>
          <div className="text-xs text-amber-600 mt-1">PRO Renewal in progress</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Expired / Critical</div>
          <div className="text-2xl font-bold font-mono text-rose-600 mt-1">
            {summary.expired || 0} Expired
          </div>
          <div className="text-xs text-rose-600 mt-1">Urgent: Fines & Vehicle grounding risk</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search document, permit, entity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-700 font-medium"
          >
            <option value="ALL">All Compliance Statuses</option>
            <option value="EXPIRED">Expired Only (Urgent)</option>
            <option value="EXPIRING">Expiring &le;30 Days</option>
            <option value="VALID">Valid & Compliant</option>
          </select>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-700 font-medium"
          >
            <option value="ALL">All Categories</option>
            <option value="VEHICLE">Vehicles (Mulkiya / Insurance)</option>
            <option value="DRIVER">Captains (RTA Permit / License)</option>
            <option value="COMPANY">Company / Corporate</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Compliance Audit (CSV)</span>
        </button>
      </div>

      {/* Compliance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Document Title</th>
                <th className="py-3.5 px-4">Entity Assigned</th>
                <th className="py-3.5 px-4">Permit / Number</th>
                <th className="py-3.5 px-4">Issuing Authority</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4 text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No regulatory documents found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc: any) => {
                  const isExpired = doc.daysRemaining < 0;
                  const isExpiring = doc.daysRemaining >= 0 && doc.daysRemaining <= 30;

                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{doc.title}</div>
                        <div className="text-[11px] text-slate-500">{doc.documentType.replace('_', ' ')}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{doc.relatedEntityName}</div>
                        <div className="text-[11px] text-slate-500">{doc.entityType}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-800">{doc.documentNumber}</td>
                      <td className="py-3 px-4 text-slate-600">{doc.issuingAuthority || 'RTA Dubai / DED'}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">{doc.expiryDate}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isExpired
                              ? 'bg-rose-100 text-rose-800'
                              : isExpiring
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isExpired && <XCircle className="w-3 h-3" />}
                          {isExpiring && <AlertTriangle className="w-3 h-3" />}
                          {!isExpired && !isExpiring && <CheckCircle className="w-3 h-3" />}
                          <span>
                            {isExpired
                              ? `EXPIRED (${Math.abs(doc.daysRemaining)}d ago)`
                              : isExpiring
                              ? `EXPIRING (${doc.daysRemaining}d left)`
                              : 'VALID & COMPLIANT'}
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
